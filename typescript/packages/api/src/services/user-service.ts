import type { UserModel, UserRole } from "@songbird/precedent-iso";

export interface UserService {
  delete(id: string): Promise<void>;
  getById(id: string): Promise<UserModel>;
  getBySub(email: string): Promise<UserModel | undefined>;
  upsert(args: UpsertUserArgs): Promise<UserModel>;
  list(): Promise<UserModel[]>;
  changeRole(userId: string, role: UserRole): Promise<UserModel>;
}

export interface CreateUserArgs {
  email: string;
  password: string;
}

export interface UpsertUserArgs {
  sub: string;
  email: string;
  emailVerified?: boolean;
  name?: string | undefined;
  familyName?: string | undefined;
  givenName?: string | undefined;
  phone?: string | undefined;
}
