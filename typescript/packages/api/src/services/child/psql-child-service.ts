import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { Child, ChildService } from "./child-service";

export class PsqlChildService implements ChildService {
  constructor(private readonly pool: DatabasePool) {}

  async getOrCreate(userId: string): Promise<Child> {
    return this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => {
        const users = await trx.many(
          sql.type(ZChildFromSql)`
SELECT
    id
FROM
    child
WHERE
    sb_user_id = ${userId}
LIMIT 2
`
        );

        const [user] = users;

        if (user === undefined) {
          return trx.one(
            sql.type(ZChildFromSql)`
INSERT INTO child (sb_user_id)
    VALUES (${userId})
RETURNING
    id
`
          );
        } else if (users.length > 1) {
          throw new Error(`Multiple children found for user=${userId}`);
        }

        return user;
      })
    );
  }
}

export type ChildFromSql = z.infer<typeof ZChildFromSql>;

const ZChildFromSql = z.object({
  id: z.string(),
});
