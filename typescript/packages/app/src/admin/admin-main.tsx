import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { isEligibleForAdmin, UserModel } from "@songbird/precedent-iso";
import { useRouter } from "next/router";
import * as React from "react";

import { useImpersonateContext } from "../impersonate/impersonate-context";
import { ImpersonateService } from "../impersonate/impersonate-service";
import { ChangeRole } from "./change-role";
import { DeleteUser } from "./delete-user";

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 150 },
  {
    field: "email",
    headerName: "Email",
    width: 350,
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
        <ChangeRole
          id={params.row.id}
          role={params.row.role}
          isEligibleForAdmin={isEligibleForAdmin(params.row)}
        />
      );
    },
    sortable: false,
  },
  {
    field: "impersonate",
    headerName: "Impersonate",
    width: 300,
    renderCell: (params) => {
      return params.row.selfId === params.row.id ? null : (
        <Impersonate id={params.row.id} />
      );
    },
    sortable: false,
  },
  {
    field: "delete",
    headerName: "Delete",
    flex: 1,
    renderCell: (params) => {
      return params.row.selfId === params.row.id ? null : (
        <DeleteUser id={params.row.id} email={params.row.email} />
      );
    },
    sortable: false,
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
  const rows: GridRowsProp = users.map(({ id, email, role, emailVerified }) => {
    return {
      id,
      selfId,
      email,
      role,
      emailVerified,
    };
  });

  return <DataGrid rows={rows} columns={columns} />;
};
