import { Box, Button, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { isEligibleForAdmin, UserModel } from "@songbird/precedent-iso";
import { useFlagsmith } from "flagsmith/react";
import { useRouter } from "next/router";
import React from "react";

import { useFetchMe } from "../hooks/use-fetch-user";
import { useImpersonateContext } from "../impersonate/impersonate-context";
import { ImpersonateService } from "../impersonate/impersonate-service";
import { ChangeRole } from "./change-role";
import { DeleteUser } from "./delete-user";

export const UserList: React.FC<{ selfId: string; users: UserModel[] }> = ({
  selfId,
  users,
}) => {
  const rows: GridRowsProp = users
    .map(({ id, email, role, emailVerified, createdAt, lastLogin }) => {
      return {
        id,
        selfId,
        email,
        role,
        emailVerified,
        createdAt: new Date(createdAt),
        lastLogin: lastLogin ? new Date(lastLogin) : undefined,
      };
    })
    .sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  return (
    <Box width="100%" padding={2} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={3} alignItems="center">
        <Typography variant="h4" color="primary">
          User List
        </Typography>
        <Link href="/dashboard">
          <Typography>View parent dashboard</Typography>
        </Link>
      </Box>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

const GoToDetailPage: React.FC<{ id: string; showCopy: boolean }> = ({
  id,
  showCopy,
}) => {
  return (
    <Link href={`/admin-for-user/${id}`} color="inherit">
      {showCopy ? "Profile page" : id}
    </Link>
  );
};

const Impersonate: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { setId } = useImpersonateContext();
  const flagsmith = useFlagsmith();
  const { mutate } = useFetchMe();
  return (
    <Button
      onClick={() => {
        ImpersonateService.set(id);
        flagsmith.logout();
        setId(id);
        router.push("/");
        mutate();
      }}
    >
      Impersonate
    </Button>
  );
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Id",
    width: 300,
    renderCell: (params) => {
      return <GoToDetailPage id={params.row.id} showCopy={false} />;
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 350,
  },
  {
    field: "role",
    headerName: "Role",
    width: 75,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    width: 150,
    valueFormatter: (params) => params.value.toISOString().split("T")[0],
  },
  {
    field: "lastLogin",
    headerName: "Last Login at",
    width: 150,
    valueFormatter: ({ value }) => {
      return value ? value.toISOString().split("T")[0] : undefined;
    },
  },
  {
    field: "detailPage",
    headerName: "Profile Page",
    width: 150,
    renderCell: (params) => {
      return <GoToDetailPage id={params.row.id} showCopy={true} />;
    },
  },
  {
    field: "change_role",
    headerName: "Change Role",
    flex: 1,
    renderCell: (params) => {
      const isEligibleForAdmin_ = isEligibleForAdmin(params.row);
      if (params.row.selfId === params.row.id) {
        return null;
      }
      if (params.row.role !== "admin" && !isEligibleForAdmin_) {
        return null;
      }

      return (
        <ChangeRole
          id={params.row.id}
          role={params.row.role}
          isEligibleForAdmin={isEligibleForAdmin_}
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
