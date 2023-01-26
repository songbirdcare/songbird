import type { UserModel } from "./user";

export interface MeResponse {
  user: UserModel;
  impersonatingUser: UserModel | null;
}
