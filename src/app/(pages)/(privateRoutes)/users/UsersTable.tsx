"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, TextField, MenuItem, Chip } from "@mui/material";
import { useUsers } from "@/hooks/useUsers";

export default function UsersTable() {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<string>();
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">();
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState("");

  const deferredSearch = React.useDeferredValue(search);

  const { data, isLoading } = useUsers({
    page,
    pageSize,
    sortField,
    sortOrder,
    search: deferredSearch,
    role,
  });

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "admin" ? "error" : "default"}
          size="small"
        />
      ),
    },
    { field: "created_at", headerName: "Created At", flex: 1 },
  ];

  return (
    <Box sx={{ height: 600 }}>
      {/* 🔹 filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(0);
          }}
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
      </Box>

      <DataGrid
        rows={data?.data ?? []}
        columns={columns}
        rowCount={data?.count ?? 0}
        loading={isLoading}
        paginationMode="server"
        sortingMode="server"
        pageSizeOptions={[10, 20, 50, 100]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        onSortModelChange={(model) => {
          if (model[0]) {
            setSortField(model[0].field);
            setSortOrder(model[0].sort!);
          }
        }}
      />
    </Box>
  );
}