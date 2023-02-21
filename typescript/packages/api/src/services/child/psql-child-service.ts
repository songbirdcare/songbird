import {
  assertNever,
  Child,
  QualificationStatus,
  WorkflowSlug,
  ZWorkflowSlug,
} from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { ChildService } from "./child-service";
import { workflowOrder } from "./workflow-order";

const FIELDS = sql.fragment`id, qualification_status, workflow_slug`;

interface AdvanceWorkflowArguments {
  childId: string;
  from: WorkflowSlug;
  to: WorkflowSlug;
}

export class PsqlChildService implements ChildService {
  constructor(private readonly pool: DatabasePool) {}

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
      connection.transaction(async (trx) =>
        trx.query(
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
      )
    );
  }

  async get(userId: string): Promise<Child> {
    const child = await this.pool.connect(async (connection) =>
      connection.transaction(async (trx) =>
        trx.one(
          sql.type(ZChildFromSql)`
SELECT
    ${FIELDS}
FROM
    child
WHERE
    sb_user_id = ${userId}
`
        )
      )
    );
    return fromSql(child);
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

function fromSql({
  id,
  qualification_status,
  workflow_slug,
}: ChildFromSql): Child {
  return {
    id,
    qualified: QualifiedSqlConverter.from(qualification_status),
    workflowSlug: workflow_slug,
  };
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

const ZChildFromSql = z.object({
  id: z.string(),
  qualification_status: ZQualificationColumn,
  workflow_slug: ZWorkflowSlug,
});

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
