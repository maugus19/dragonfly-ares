import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/services/users.service";

export const useUsers = (params: any) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
  });
};