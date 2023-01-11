import type { UserModel } from "@songbird/precedent-iso";

export interface UserService {
  getById(id: string): Promise<UserModel>;
  get(email: string): Promise<UserModel | undefined>;
  upsert(args: UpsertUserArgs): Promise<UserModel>;
}

export interface UpsertUserArgs {
  sub: string;
  email: string;
  emailVerified: boolean;
  name?: string | undefined;
  familyName?: string | undefined;
  givenName?: string | undefined;
}
