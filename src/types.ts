export type TaskStatus = "backlog" | "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  dueDate: string | null; // ISO Date String (YYYY-MM-DD)
  createdAt: any;       // Firestore timestamp or ISO string
  updatedAt: any;       // Firestore timestamp or ISO string
  tags: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
