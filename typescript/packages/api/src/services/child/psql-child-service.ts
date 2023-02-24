import {
  assertNever,
  Child,
  CreateEmpty,
  QualificationStatus,
  Schedule,
  UpdateArguments,
  WorkflowSlug,
  ZSchedule,
  ZWorkflowSlug,
} from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { ChildService } from "./child-service";
import { workflowOrder } from "./workflow-order";

const FIELDS = sql.fragment`id, qualification_status, workflow_slug, assessor`;

interface AdvanceWorkflowArguments {
  childId: string;
  from: WorkflowSlug;
  to: WorkflowSlug;
}

export class PsqlChildService implements ChildService {
  constructor(private readonly pool: DatabasePool) {}

  async getSchedule(childId: string): Promise<Schedule> {
    const schedule = await this.pool.connect(async (connection) =>
      connection.maybeOne(
        sql.type(ZFetchSchedule)`
SELECT
    schedule
FROM
    child
WHERE
    id = ${childId}
`
      )
    );

    return schedule ?? CreateEmpty.schedule();
  }
  async update(
    childId: string,
    { schedule, assessorId, firstName, lastName }: UpdateArguments
  ): Promise<void> {
    await this.pool.connect(async (connection) =>
      connection.query(
        sql.unsafe`
UPDATE
    child
SET
    schedule = COALESCE(${
      schedule ? JSON.stringify(schedule) : null
    }, child.schedule),
    assessor = COALESCE(${assessorId ?? null}, child.assessor),
    first_name = COALESCE(${firstName ?? null}, child.first_name),
    last_name = COALESCE(${lastName ?? null}, child.last_name)
WHERE
    id = ${childId}
`
      )
    );
  }

  async advanceWorkflow(childId: string, from: WorkflowSlug) {
    const to = workflowOrder(from);
    if (to) {
      await this.#advanceWorkflow({ childId, from, to });
    }
  }

  async #advanceWorkflow({
    childId,
    from,
    to,
  }: AdvanceWorkflowArguments): Promise<void> {
    await this.pool.connect(async (connection) =>
      connection.query(
        sql.type(ZChildFromSql)`
UPDATE
    child
SET
    workflow_slug = ${to}
WHERE
    id = ${childId}
    AND workflow_slug = ${from}
`
      )
    );
  }

  async get(userId: string): Promise<Child> {
    const child = await this.pool.connect(async (connection) =>
      connection.one(
        sql.type(ZChildFromSql)`
SELECT
    ${FIELDS}
FROM
    child
WHERE
    sb_user_id = ${userId}
`
      )
    );
    return child;
  }

  async createIfNotExists(
    userId: string,
    qualified: QualificationStatus
  ): Promise<void> {
    await this.pool.connect(async (connection) =>
      connection.query(
        sql.type(ZChildFromSql)`
INSERT INTO child (sb_user_id, qualification_status)
    VALUES (${userId}, ${QualifiedSqlConverter.to(qualified)})
ON CONFLICT (sb_user_id)
    DO NOTHING
`
      )
    );
  }
}

export type ChildFromSql = z.infer<typeof ZChildFromSql>;

const ZQualificationColumn = z.enum([
  "qualified",
  "grandfathered-qualified",
  "location",
  "age",
  "insurance",
  "other",
  "qualified-without-diagnosis",
]);

type QualificationColumn = z.infer<typeof ZQualificationColumn>;

const ZChildFromSql = z
  .object({
    id: z.string(),
    qualification_status: ZQualificationColumn.nullable(),
    workflow_slug: ZWorkflowSlug,
    assessor: z.string().nullable(),
  })
  .transform((val) => ({
    id: val.id,
    qualified: val.qualification_status
      ? QualifiedSqlConverter.from(val.qualification_status)
      : ({ type: "unknown" } as const),
    workflowSlug: val.workflow_slug,
    assessorId: val.assessor ?? undefined,
  }));

class QualifiedSqlConverter {
  static to = (qualified: QualificationStatus): QualificationColumn | null => {
    switch (qualified.type) {
      case "qualified":
        return "qualified";
      case "qualified-without-diagnosis":
        return "qualified-without-diagnosis";
      case "unknown":
        return null;
      case "disqualified":
        return qualified.reason;
      default:
        assertNever(qualified);
    }
  };

  static from = (qualified: QualificationColumn): QualificationStatus => {
    switch (qualified) {
      case "qualified":
      case "grandfathered-qualified":
        return { type: "qualified" };
      case "qualified-without-diagnosis":
        return { type: "qualified-without-diagnosis" };
      case undefined:
      case null:
        return { type: "unknown" };
      case "location":
      case "age":
      case "insurance":
      case "other":
        return { type: "disqualified", reason: qualified };
      default:
        assertNever(qualified);
    }
  };
}

const ZFetchSchedule = z
  .object({
    schedule: ZSchedule.nullable(),
  })
  .transform((val) => val?.schedule ?? undefined);
