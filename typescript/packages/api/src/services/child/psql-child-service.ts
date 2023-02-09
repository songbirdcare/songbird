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

  async getOrCreate(userId: string): Promise<Child> {
    const child = await this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => {
        const children = await trx.query(
          sql.type(ZChildFromSql)`
SELECT
    ${FIELDS}
FROM
    child
WHERE
    sb_user_id = ${userId}
LIMIT 2
`
        );

        const [user] = children.rows;

        if (user === undefined) {
          return trx.one(
            sql.type(ZChildFromSql)`
INSERT INTO child (sb_user_id)
    VALUES (${userId})
RETURNING
    ${FIELDS}
`
          );
        } else if (children.rows.length > 1) {
          throw new Error(`Multiple children found for user=${userId}`);
        }

        return user;
      })
    );
    return fromSql(child);
  }
}

function fromSql({ id, qualification_status }: ChildFromSql): Child {
  return { id, qualified: fromStatus(qualification_status) };
}

function fromStatus(status: SqlQualificationStatus): QualificationStatus {
  switch (status) {
    case "qualified":
    case undefined:
    case null:
      return { type: status === undefined ? "unknown" : "qualified" };
    case "location":
    case "age":
    case "insurance":
    case "other":
      return { type: "disqualified", reason: status };
    default:
      assertNever(status);
  }
}

export type ChildFromSql = z.infer<typeof ZChildFromSql>;

const ZSqlQualificationStatus = z
  .enum(["qualified", "location", "age", "insurance", "other"])
  .optional();

type SqlQualificationStatus = z.infer<typeof ZSqlQualificationStatus>;

const ZChildFromSql = z.object({
  id: z.string(),
  qualification_status: ZSqlQualificationStatus,
});
