export interface Subject {
  _id: string;
  name: string;
  level: string;
}

export interface TopicExample {
  label: string;
  content: string;
}

export interface TopicSection {
  heading: string;
  body: string;
  examples?: TopicExample[];
}

export interface Topic {
  _id: string;
  title: string;
  chapter: number;
  chapterTitle?: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  notes?: string;
  summary?: string[];
  content?: TopicSection[];
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
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ForumPost {
  _id: string;
  topic: string;
  user: { _id: string; name: string };
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
