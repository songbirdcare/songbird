import type { UserModel } from "@songbird/precedent-iso";
import * as React from "react";

import { UserList } from "./user-list";

export const AdminMain: React.FC<{ selfId: string; users: UserModel[] }> = ({
  selfId,
  users,
}) => {
  return <UserList selfId={selfId} users={users} />;
};
