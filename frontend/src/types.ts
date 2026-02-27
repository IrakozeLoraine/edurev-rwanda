export interface Subject {
  _id: string;
  name: string;
  level: string;
}

export interface Topic {
  _id: string;
  title: string;
  notes?: string;
  references?: string[];
  subject: Subject;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}
