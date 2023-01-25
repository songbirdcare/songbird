import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import type { UserModel } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";

import { useImpersonateContext } from "../impersonate/impersonate-context";
import { ImpersonateService } from "../impersonate/impersonate-service";
import { ChangeRole } from "./change-role";

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 150 },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
  },
  {
    field: "change_role",
    headerName: "Change Role",
    flex: 1,
    renderCell: (params) => {
      return params.row.selfId === params.row.id ? null : (
        <ChangeRole id={params.row.id} role={params.row.role} />
      );
    },
  },
  {
    field: "impersonate",
    headerName: "Impersonate",
    flex: 1,
    renderCell: (params) => {
      return params.row.selfId === params.row.id ? null : (
        <Impersonate id={params.row.id} />
      );
    },
  },
];

const Impersonate: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { setId } = useImpersonateContext();
  return (
    <Button
      onClick={() => {
        ImpersonateService.set(id);
        setId(id);
        router.push("/");
      }}
    >
      Impersonate
    </Button>
  );
};

export const AdminMain: React.FC<{ selfId: string; users: UserModel[] }> = ({
  selfId,
  users,
}) => {
  const rows: GridRowsProp = users.map((user) => {
    return {
      id: user.id,
      selfId,
      email: user.email,
      role: user.role,
    };
  });

  return <DataGrid rows={rows} columns={columns} />;
};
