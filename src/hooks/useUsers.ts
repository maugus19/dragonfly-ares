import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/services/users.service";
import { Params } from "./useStudents";

type userParams = Params & {
  role?: string;
}

export const useUsers = (params: userParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
  });
};