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
