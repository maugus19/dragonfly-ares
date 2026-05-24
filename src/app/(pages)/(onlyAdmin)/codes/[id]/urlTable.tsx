import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
type RowType = {
  server: string;
  url: string;
};

export default function EditableTable({ initialData, handleOnChange }: { initialData: RowType[], handleOnChange: (data: RowType[]) => void }) {
  const [rows, setRows] = useState<RowType[]>(initialData);

  const handleChange = (
    index: number,
    field: keyof RowType,
    value: string
  ) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
    handleOnChange(updated);
  };

  const addRow = () => {
    const newData = [...rows, { server: "", url: "" }];
    setRows(newData);
    handleOnChange(newData);  
  };

  const deleteRow = (index: number) => {
    const newData = rows.filter((_, i) => i !== index);
    handleOnChange(newData);
    setRows(newData);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Server</TableCell>
            <TableCell>URL</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={row.server}
                  onChange={(e) =>
                    handleChange(index, "server", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
              </TableCell>

              <TableCell>
                <TextField
                  value={row.url}
                  onChange={(e) =>
                    handleChange(index, "url", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
              </TableCell>

              <TableCell>
                <IconButton onClick={() => deleteRow(index)}>
                  <DeleteIcon />
                </IconButton>

                <IconButton onClick={() => window.open(row.url, '_blank')}>
                  <RemoveRedEyeIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="contained"
        onClick={addRow}
        sx={{ mt: 2 }}
      >
        Agregar fila
      </Button>
    </>
  );
}