import {
  assertNever,
  Child,
  QualificationStatus,
  ZWorkflowSlug,
} from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { ChildService } from "./child-service";

const FIELDS = sql.fragment`id, qualification_status`;

export class PsqlChildService implements ChildService {
  constructor(private readonly pool: DatabasePool) {}

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

  async createOnlyIfNeeded(
    userId: string,
    qualified: QualificationStatus
  ): Promise<"created" | "not_created"> {
    return this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => {
        const exists = await trx.exists(
          sql.unsafe` SELECT 1 FROM child WHERE sb_user_id = ${userId} `
        );

        if (exists) {
          return "not_created";
        }

        await trx.query(
          sql.type(ZChildFromSql)`
INSERT INTO child (sb_user_id, qualification_status)
    VALUES (${userId}, ${QualifiedSqlConverter.to(qualified)})
`
        );
        return "created";
      })
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
