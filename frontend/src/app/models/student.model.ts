export interface Mark {
  subject: string;
  internal: number;
  external: number;
  total?: number;
  grade?: string;
}

export interface Student {
  _id?: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  department: string;
  semester: number;
  section?: string;
  address?: string;
  enrollmentDate?: string;
  marks?: Mark[];
  cgpa?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
