"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, TextField, MenuItem } from "@mui/material";
import { useStudents } from "@/hooks/useStudents";
import Link from "next/link";

export default function StudentsTable() {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<string>();
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">();
  const [country, setCountry] = React.useState("");
  const [search, setSearch] = React.useState("");

  // 🔥 defer en lugar de debounce
  const deferredSearch = React.useDeferredValue(search);

  const { data, isLoading } = useStudents({
    page,
    pageSize,
    sortField,
    sortOrder,
    country,
    search: deferredSearch || undefined,
  });

  const columns: GridColDef[] = [
    {
    field: "name",
    headerName: "Name",
    flex: 1,
    renderCell: (params) => (
      <Link
        href={`/students/${params.row.id}`}
        style={{ color: "#1976d2", textDecoration: "none" }}
      >
        {params.value}
      </Link>
    ),
  },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
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
          label="Country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setPage(0);
          }}
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Bolivia">Bolivia</MenuItem>
          <MenuItem value="Argentina">Argentina</MenuItem>
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