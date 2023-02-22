import {
  isEligibleForAdmin,
  UserModel,
  ZUserRole,
} from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { UpsertUserArgs, UserService } from "./user-service";

const FIELDS = sql.fragment`
id,
sub,
email,
email_verified,
name,
given_name,
family_name,
phone,
role,
created_at
`;

export class PsqlUserService implements UserService {
  constructor(private readonly pool: DatabasePool) {}

  async delete(id: string): Promise<void> {
    this.pool.connect((connection) =>
      connection.transaction(async (trx) => {
        await trx.query(
          sql.unsafe` DELETE FROM workflow WHERE sb_user_id = ${id}; `
        );
        await trx.query(
          sql.unsafe` DELETE FROM child WHERE sb_user_id = ${id}; `
        );
        await trx.query(sql.unsafe` DELETE FROM sb_user WHERE id = ${id}; `);
      })
    );
  }

  async changeRole(userId: string, role: "user" | "admin"): Promise<UserModel> {
    if (role === "admin") {
      const { email, emailVerified } = await this.getById(userId);
      if (!isEligibleForAdmin({ email, emailVerified })) {
        throw new Error(`${email} cannot be made into an admin`);
      }
    }

    return this.pool.connect(async (connection) =>
      connection.one(
        sql.type(ZUserFromSql)`
UPDATE
    sb_user
SET
    role = ${role}
WHERE
    id = ${userId}
RETURNING
    ${FIELDS}
`
      )
    );
  }

  async list(): Promise<UserModel[]> {
    const users = await this.pool.connect(async (connection) =>
      connection.many(
        sql.type(ZUserFromSql)`SELECT ${FIELDS} FROM sb_user LIMIT 10001`
      )
    );

    if (users.length > 10_000) {
      throw new Error("too many users being pulled. time to paginate");
    }
    return users as UserModel[];
  }

  async getById(id: string): Promise<UserModel> {
    return this.pool.connect(async (connection) =>
      connection.one(
        sql.type(ZUserFromSql)`SELECT ${FIELDS} FROM sb_user WHERE id= ${id}`
      )
    );
  }

  async getBySub(sub: string): Promise<UserModel | undefined> {
    const user = await this.pool.connect(async (connection) =>
      connection.maybeOne(
        sql.type(
          ZUserFromSql
        )`SELECT ${FIELDS} FROM sb_user WHERE sub = ${sub} LIMIT 1`
      )
    );
    return user ?? undefined;
  }

  async upsert({
    sub,
    email,
    emailVerified,
    name,
    familyName,
    givenName,
    phone,
  }: UpsertUserArgs): Promise<UserModel> {
    return this.pool.connect((connection) =>
      connection.transaction(async (trx) => {
        await trx.query(
          sql.unsafe`
INSERT INTO sb_user (sub, email, email_verified, name, family_name, given_name, phone)
    VALUES (${sub}, ${email}, ${emailVerified ?? null}, ${name ?? null}, ${
            familyName ?? null
          }, ${givenName ?? null}, ${phone ?? null})
ON CONFLICT (sub)
    DO UPDATE SET
        email_verified = COALESCE(${
          emailVerified ?? null
        }, sb_user.email_verified), name = COALESCE(${
            name ?? null
          }, sb_user.name), family_name = COALESCE(${
            familyName ?? null
          }, sb_user.family_name), given_name = COALESCE(${
            givenName ?? null
          }, sb_user.given_name), phone = COALESCE(${
            phone ?? null
          }, sb_user.phone)
`
        );

        const user = await trx.one(sql.type(ZUserFromSql)`
SELECT
    ${FIELDS}
FROM
    sb_user
WHERE
    sub = ${sub}
`);
        return user;
      })
    );
  }
}

export type UserFromSql = z.infer<typeof ZUserFromSql>;

const ZUserFromSql = z
  .object({
    id: z.string(),
    sub: z.string(),
    email: z.string(),
    email_verified: z.boolean().nullable(),
    name: z.string().nullable(),
    family_name: z.string().nullable(),
    given_name: z.string().nullable(),
    phone: z.string().nullable(),
    role: ZUserRole,
    created_at: z.number(),
  })
  .transform(function ({
    email_verified,
    family_name,
    given_name,
    phone,
    ...rest
  }): UserModel {
    return {
      ...rest,
      createdAt: new Date(rest.created_at),
      phone: phone ?? undefined,
      emailVerified: email_verified ?? false,
      familyName: family_name ?? undefined,
      givenName: given_name ?? undefined,
      name: rest.name ?? undefined,
    };
  });
