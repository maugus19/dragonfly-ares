export type UserRoleType = 'admin' | 'manager' | 'trainer' | 'admissions';

export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  role: UserRoleType
}