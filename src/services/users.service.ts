import { createClient } from "@/utils/supabase/client";

type Params = {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: string;
};

export const fetchUsers = async ({
  page,
  pageSize,
  sortField,
  sortOrder,
  search,
  role,
}: Params) => {
  const supabase = createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("user_profiles")
    .select("*", { count: "exact" })
    .range(from, to);

  // sorting
  if (sortField) {
    query = query.order(sortField, {
      ascending: sortOrder === "asc",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // search
  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  // filter role
  if (role) {
    query = query.eq("role", role);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};