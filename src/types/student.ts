export type Module = {
  id: string;
  name: string;
  classes: Class[];
  enrollments: ModuleEnrollment[];
};
export type Class = {
  id: string;
  order: number;
  moduleId: string;
  date: Date;
  records: ClassRecord[];
};
export type ClassRecord = {
  id: string;
  classId: string;
  studentId: string;

  attendance: boolean;
  participation: number; // o score
  details?: string;
};

export type ModuleEnrollment = {
  id: string;
  studentId: string;
  moduleId: string;
  // podrías agregar estado:
  status: "active" | "completed" | "dropped";
};

export type Course = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  modules: Module[];
};

export type Student = {
  id: string;
  name: string;
  country: string;
  last_name: string;
  email: string;
  created_at: string;
};