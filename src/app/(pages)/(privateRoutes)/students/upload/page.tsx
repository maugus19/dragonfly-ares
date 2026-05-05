"use client";

import * as React from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { createClient } from "@/utils/supabase/client";

type StudentRow = {
  id: number;
  name?: string;
  last_name?: string;
  email?: string;
  country?: string;
  errors?: string[];
};

const validCountries = ["Bolivia", "Argentina", "Mexico", "Colombia"];

const downloadTemplate = () => {
  const templateData = [
    {
      name: "Juan",
      last_name: "Perez",
      email: "juan@test.com",
      country: "Bolivia",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(workbook, "students_template.xlsx");
};

export default function UploadStudents() {
  const supabase = createClient();
  const [rows, setRows] = React.useState<StudentRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  // 🔹 Validación por fila
  const validateRow = (row: StudentRow): string[] => {
    const errors: string[] = [];

    if (!row.name) errors.push("Name required");
    if (!row.last_name) errors.push("Last name required");
    if (!row.email || !row.email.includes("@"))
      errors.push("Invalid email");
    if (!row.country || !validCountries.includes(row.country))
      errors.push("Invalid country");

    return errors;
  };

  // 🔹 Procesar archivo
  const handleFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const parsed: StudentRow[] = json.map((row: any, index) => {
      const student: StudentRow = {
        id: index,
        name: row.name || row.Name,
        last_name: row.last_name || row.lastName,
        email: row.email,
        country: row.country,
      };

      return {
        ...student,
        errors: validateRow(student),
      };
    });

    setRows(parsed);
  };

  // 🔹 Upload (solo válidos)
  const handleUpload = async () => {
    setLoading(true);

    const validRows = rows.filter((r) => !r.errors?.length);

    const payload = validRows.map(({ id, errors, ...rest }) => rest);

    const { error } = await supabase.from("students").insert(payload);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error uploading");
    } else {
      alert("Students uploaded!");
      setRows([]);
    }
  };

  const hasErrors = rows.some((r) => r.errors && r.errors.length > 0);

  // 🔹 Columnas
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "country", headerName: "Country", flex: 1 },

    {
      field: "errors",
      headerName: "Errors",
      flex: 2,
      renderCell: (params) =>
        params.value?.length ? (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {params.value.map((err: string, i: number) => (
              <Chip key={i} label={err} color="error" size="small" />
            ))}
          </Box>
        ) : (
          <Chip label="OK" color="success" size="small" />
        ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Upload Students
      </Typography>
      <Button variant="outlined" onClick={downloadTemplate} sx={{ mb: 2 }}>
        Download Template
      </Button>
      {/* 🔹 File input */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* 🔹 DataGrid preview */}
      {rows.length > 0 && (
        <Box sx={{ mt: 3, height: 500 }}>
          <Typography mb={1}>
            {rows.length} rows loaded —{" "}
            {hasErrors ? "Fix errors before upload" : "Ready to upload"}
          </Typography>

          <DataGrid
            rows={rows}
            columns={columns}
            getRowClassName={(params) =>
              params.row.errors?.length ? "row-error" : ""
            }
          />

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading || hasErrors}
            sx={{ mt: 2 }}
          >
            {loading ? "Uploading..." : "Upload Valid Rows"}
          </Button>
        </Box>
      )}

      {/* 🔹 estilos */}
      <style jsx global>{`
        .row-error {
          background-color: rgba(255, 0, 0, 0.08);
        }
      `}</style>
    </Box>
  );
}