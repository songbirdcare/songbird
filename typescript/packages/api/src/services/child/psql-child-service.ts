import {
  assertNever,
  Child,
  QualificationStatus,
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

  async createIfNeeded(
    userId: string,
    qualified: QualificationStatus
  ): Promise<Child> {
    const qualifiedForSql = QualifiedSqlConverter.to(qualified);
    const child = await this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => {
        const child = await trx.maybeOne(
          sql.type(ZChildFromSql)`
SELECT
    ${FIELDS}
FROM
    child
WHERE
    sb_user_id = ${userId}
`
        );

        if (child) {
          return child;
        }

        return (
          child ??
          trx.one(
            sql.type(ZChildFromSql)`
INSERT INTO child (sb_user_id, qualification_status)
    VALUES (${userId}, ${qualifiedForSql})
RETURNING
    ${FIELDS}
`
          )
        );
      })
    );
    return fromSql(child);
  }
}

function fromSql({ id, qualification_status }: ChildFromSql): Child {
  return { id, qualified: QualifiedSqlConverter.from(qualification_status) };
}

export type ChildFromSql = z.infer<typeof ZChildFromSql>;

const ZQualificationColumn = z.enum([
  "qualified",
  "location",
  "age",
  "insurance",
  "other",
]);

type QualificationColumn = z.infer<typeof ZQualificationColumn>;

const ZChildFromSql = z.object({
  id: z.string(),
  qualification_status: ZQualificationColumn,
});

class QualifiedSqlConverter {
  static to = (qualified: QualificationStatus): QualificationColumn | null => {
    switch (qualified.type) {
      case "qualified":
        return "qualified";
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
        return { type: "qualified" };
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
