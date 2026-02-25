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
