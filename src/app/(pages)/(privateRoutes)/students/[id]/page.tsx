import { Box } from "@mui/material";
import StudentForm from "./StudentForm";
import { createClient } from "@/utils/supabase/client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <Box>
      <h1>Edit Student</h1>
      <StudentForm student={data} />
    </Box>
  );
}