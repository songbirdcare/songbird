export interface User {
  id: string;
  sub: string;
  email: string;
  emailVerified: boolean;
  familyName: string | undefined;
  givenName: string | undefined;
  name: string | undefined;
}

export interface UserService {
  get(email: string): Promise<User | undefined>;
  upsert(args: UpsertUserArgs): Promise<User>;
}

export interface UpsertUserArgs {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | undefined;
  familyName: string | undefined;
  givenName: string | undefined;
}
