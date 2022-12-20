import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { UpsertUserArgs, User, UserService } from "./user-service";

export class PsqlUserService implements UserService {
  constructor(private readonly pool: DatabasePool) {}

  async get(email: string): Promise<User | undefined> {
    const user = await this.pool.connect(async (connection) =>
      connection.maybeOne(
        sql.type(UserModel)`
SELECT
    id,
    sub,
    email
FROM
    sb_user
WHERE
    email = ${email}
`
      )
    );

    return user ?? undefined;
  }

  async upsert({ sub, email }: UpsertUserArgs): Promise<User> {
    const user = await this.pool.connect(
      async (connection) =>
        await connection.transaction(async (trx) => {
          const user = await trx.maybeOne(sql.type(UserModel)`
SELECT
    id,
    sub,
    email
FROM
    sb_user
WHERE
    sub = ${sub}
`);
          if (user) {
            return user;
          }
          return trx.one(
            sql.type(UserModel)`
INSERT INTO sb_user (sub, email)
    VALUES (${sub}, ${email})
RETURNING (id, sub, email)
`
          );
        })
    );
    return user;
  }
}

const UserModel = z.object({
  id: z.string(),
  sub: z.string(),
  email: z.string(),
});
