export interface User {
  id: string;
  sub: string;
  email: string;
}

export interface UserService {
  get(email: string): Promise<User | undefined>;
  upsert(args: UpsertUserArgs): Promise<User>;
}

export interface UpsertUserArgs {
  sub: string;
  email: string;
}
