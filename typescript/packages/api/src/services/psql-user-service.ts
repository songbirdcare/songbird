import {
  CreateUserResponse,
  isValidEmail,
  PasswordValidationService,
  UserModel,
  ZUserRole,
} from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type { Auth0Service } from "./auth0/auth0-service";
import type {
  CreateUserArgs,
  UpsertUserArgs,
  UserService,
} from "./user-service";

const FIELDS = sql.fragment`
id,
sub,
email,
email_verified,
name,
given_name,
family_name,
phone,
role
`;

export class PsqlUserService implements UserService {
  constructor(
    private readonly pool: DatabasePool,
    private readonly auth0: Auth0Service
  ) {}

  async changeRole(userId: string, role: "user" | "admin"): Promise<UserModel> {
    const user = await this.pool.connect(async (connection) =>
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
    return fromSQL(user);
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

    return users.map(fromSQL);
  }

  async create({
    email,
    password,
  }: CreateUserArgs): Promise<CreateUserResponse> {
    if (!isValidEmail(email)) {
      return { type: "invalid_email" };
    }
    const passwordValidation = PasswordValidationService.validate(password);
    if (passwordValidation.type === "error") {
      return { type: "password", error: passwordValidation.code };
    }

    const auth0 = await this.auth0.createUser({ email, password });
    if (auth0.status === "already_exists") {
      return { type: "exists_in_auth0" };
    }
    await this.upsert({
      sub: auth0.user.sub,
      email,
      emailVerified: false,
    });

    return { type: "ok" };
  }

  async getById(id: string): Promise<UserModel> {
    const user = await this.pool.connect(async (connection) =>
      connection.one(
        sql.type(ZUserFromSql)`SELECT ${FIELDS} FROM sb_user WHERE id= ${id}`
      )
    );
    return fromSQL(user);
  }

  async getBySub(sub: string): Promise<UserModel | undefined> {
    const user = await this.pool.connect(async (connection) =>
      connection.maybeOne(
        sql.type(
          ZUserFromSql
        )`SELECT ${FIELDS} FROM sb_user WHERE sub = ${sub} LIMIT 1`
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
  phone: z.optional(z.string()),
  role: ZUserRole,
});
