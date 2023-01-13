import type { CreateUserResponse, UserModel } from "@songbird/precedent-iso";

export interface UserService {
  create(args: CreateUserArgs): Promise<CreateUserResponse>;
  getById(id: string): Promise<UserModel>;
  getBySub(email: string): Promise<UserModel | undefined>;
  upsert(args: UpsertUserArgs): Promise<UserModel>;
}

export interface CreateUserArgs {
  email: string;
  password: string;
}

export interface UpsertUserArgs {
  sub: string;
  email: string;
  emailVerified: boolean;
  name?: string | undefined;
  familyName?: string | undefined;
  givenName?: string | undefined;
}
