import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/services/students.service";

export type Params = {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  country?: string;
  search?: string;
};

export const useStudents = (params: Params) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => fetchStudents(params),
  });
};