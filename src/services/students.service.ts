import { createClient } from "@/utils/supabase/client";

type Params = {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  country?: string;
  search?: string;
};

export const fetchStudents = async ({
  page,
  pageSize,
  sortField,
  sortOrder,
  country,
  search,
}: Params) => {
  const supabase = createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("students")
    .select("*", { count: "exact" })
    .range(from, to);

  // 🔹 sorting
  if (sortField) {
    query = query.order(sortField, {
      ascending: sortOrder === "asc",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // 🔹 filter
  if (country) {
    query = query.eq("country", country);
  }

  // 🔹 search (name + last_name)
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,last_name.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};