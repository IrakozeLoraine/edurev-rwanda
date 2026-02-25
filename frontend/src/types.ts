export interface Subject {
  _id: string;
  name: string;
  level: string;
}

export interface Topic {
  _id: string;
  title: string;
  chapter: number;
  chapterTitle?: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  notes?: string;
  references?: string[];
  subject: Subject;
}
