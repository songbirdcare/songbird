import type { UserModel } from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { UpsertUserArgs, UserService } from "./user-service";

export class PsqlUserService implements UserService {
  constructor(private readonly pool: DatabasePool) {}

  async get(sub: string): Promise<UserModel | undefined> {
    const user = await this.pool.connect(async (connection) =>
      connection.maybeOne(
        sql.type(ZUserFromSql)`
SELECT
    id,
    sub,
    email,
    email_verified,
    name,
    given_name,
    family_name
FROM
    sb_user
WHERE
    sub = ${sub}
`
      )
    );
    return user ? fromSQL(user) : undefined;
  }

  async upsert({
    sub,
    email,
    emailVerified,
    name,
    familyName,
    givenName,
  }: UpsertUserArgs): Promise<UserModel> {
    return this.pool.connect((connection) =>
      connection.transaction(async (trx) => {
        await trx.query(
          sql.unsafe`
INSERT INTO sb_user (sub, email, email_verified, name, family_name, given_name)
    VALUES (${sub}, ${email}, ${emailVerified}, ${name ?? null}, ${
            familyName ?? null
          }, ${givenName ?? null})
ON CONFLICT (sub)
    DO UPDATE SET
        email_verified = ${emailVerified}, name = COALESCE(${
            name ?? null
          }, sb_user.name), family_name = COALESCE(${
            familyName ?? null
          }, sb_user.family_name), given_name = COALESCE(${
            givenName ?? null
          }, sb_user.given_name)
`
        );

        const user = await trx.one(sql.type(ZUserFromSql)`
SELECT
    id,
    sub,
    email,
    email_verified,
    name,
    given_name,
    family_name
FROM
    sb_user
WHERE
    sub = ${sub}
`);

        return fromSQL(user);
      })
    );
  }
}

function fromSQL({
  email_verified,
  family_name,
  given_name,
  ...rest
}: UserFromSql): UserModel {
  return {
    ...rest,
    emailVerified: email_verified,
    familyName: family_name,
    givenName: given_name,
    name: rest.name,
  };
}

export type UserFromSql = z.infer<typeof ZUserFromSql>;

const ZUserFromSql = z.object({
  id: z.string(),
  sub: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  name: z.optional(z.string()),
  family_name: z.optional(z.string()),
  given_name: z.optional(z.string()),
});
