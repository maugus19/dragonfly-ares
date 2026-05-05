"use client";

import { useState } from "react";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Student = {
  id: string;
  name: string;
  last_name: string;
  country: string;
  email: string;
};

const countries = ["Bolivia", "Argentina", "Mexico", "Colombia"];

export default function StudentForm({ student }: { student: Student }) {
  const supabase = createClient();
  const [form, setForm] = useState(student);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("students")
      .update({
        name: form.name,
        last_name: form.last_name,
        country: form.country,
        email: form.email,
      })
      .eq("id", form.id);

    setLoading(false);

    if (!error) {
      router.push("/students"); // 👈 volver a la lista
    } else {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <TextField
        label="Last Name"
        value={form.last_name}
        onChange={(e) => handleChange("last_name", e.target.value)}
      />

      <TextField
        label="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      {/* 🔹 Select */}
      <TextField
        select
        label="Country"
        value={form.country}
        onChange={(e) => handleChange("country", e.target.value)}
      >
        {countries.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}