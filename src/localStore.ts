// src/localStore.ts
// Fully client-side LocalStorage Authentication & Task Database simulation
// Built in response to user requesting local signup/signin without external servers.

import { Task, UserProfile } from "./types";

const USERS_STORAGE_KEY = "taskflow_client_users";
const SESSION_STORAGE_KEY = "taskflow_client_session";
const TASKS_STORAGE_KEY_PREFIX = "taskflow_client_tasks_";

// Default preloaded users for instant access
const DEFAULT_USERS = [
  {
    uid: "demo-id-alpha",
    displayName: "John Doe",
    email: "demo@taskflow.com",
    password: "password123",
  }
];

// Default sample tasks to populate a brand-new user's workspace
const getSampleTasks = (userId: string): Task[] => [
  {
    id: "sample-task-1",
    title: "Explore the TaskFlow Kanban Board",
    description: "Try moving this task to another pipeline category using the arrow buttons or editing its metadata.",
    status: "in_progress",
    priority: "high",
    userId,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0], // 3 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["Onboarding", "Kanban"],
  },
  {
    id: "sample-task-2",
    title: "Configure custom tags and labels",
    description: "Edit this task to see how tags are styled dynamically to support high-contrast priority workflows.",
    status: "todo",
    priority: "medium",
    userId,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0], // 7 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["Design", "Workflow"],
  },
  {
    id: "sample-task-3",
    title: "Create your first custom item",
    description: "Click the 'Add Task' button in the toolbar to enter your description, priority, and target due date.",
    status: "backlog",
    priority: "low",
    userId,
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["Productivity"],
  }
];

// Helper to get raw users list
function getStoredUsers(): any[] {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_USERS;
  }
}

// 1. Get current active session user
export function getLocalSessionUser(): UserProfile | null {
  const data = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// 2. Clear current session
export function clearLocalSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// 3. User Register / Sign Up
export function localSignUp(email: string, password: string, displayName: string): { user: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password || !displayName.trim()) {
    return { user: (null as any), error: "All fields are required to register." };
  }

  const users = getStoredUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    return { user: (null as any), error: "An account with this email address already exists." };
  }

  const newUserProfile: UserProfile = {
    uid: "user_" + Math.random().toString(36).substring(2, 11),
    email: normalizedEmail,
    displayName: displayName.trim(),
    photoURL: null,
  };

  users.push({
    ...newUserProfile,
    password: password
  });

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUserProfile));

  // Initialize sample onboarding tasks for this new user
  const userTasksKey = `${TASKS_STORAGE_KEY_PREFIX}${newUserProfile.uid}`;
  localStorage.setItem(userTasksKey, JSON.stringify(getSampleTasks(newUserProfile.uid)));

  return { user: newUserProfile };
}

// 4. User Sign In / Login
export function localSignIn(email: string, password: string): { user: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { user: (null as any), error: "Please enter your email and password." };
  }

  const users = getStoredUsers();
  const matchedUser = users.find((u) => u.email === normalizedEmail && u.password === password);

  if (!matchedUser) {
    return { user: (null as any), error: "Invalid email or password combination." };
  }

  const profile: UserProfile = {
    uid: matchedUser.uid,
    email: matchedUser.email,
    displayName: matchedUser.displayName,
    photoURL: matchedUser.photoURL || null,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile));

  // If new user and has no tasks initialized, give them default onboarding tasks
  const userTasksKey = `${TASKS_STORAGE_KEY_PREFIX}${profile.uid}`;
  const existingTasks = localStorage.getItem(userTasksKey);
  if (!existingTasks) {
    localStorage.setItem(userTasksKey, JSON.stringify(getSampleTasks(profile.uid)));
  }

  return { user: profile };
}

// 5. Query Tasks belonging to specific user
export function getLocalTasks(userId: string): Task[] {
  const userTasksKey = `${TASKS_STORAGE_KEY_PREFIX}${userId}`;
  const data = localStorage.getItem(userTasksKey);
  if (!data) {
    const defaultTasks = getSampleTasks(userId);
    localStorage.setItem(userTasksKey, JSON.stringify(defaultTasks));
    return defaultTasks;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 6. Save or Update Task
export function saveLocalTask(userId: string, task: Task): Task[] {
  const tasks = getLocalTasks(userId);
  const existingIdx = tasks.findIndex((t) => t.id === task.id);

  if (existingIdx >= 0) {
    tasks[existingIdx] = {
      ...task,
      updatedAt: new Date().toISOString(),
    };
  } else {
    tasks.push({
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  const userTasksKey = `${TASKS_STORAGE_KEY_PREFIX}${userId}`;
  localStorage.setItem(userTasksKey, JSON.stringify(tasks));
  return tasks;
}

// 7. Delete Task
export function deleteLocalTask(userId: string, taskId: string): Task[] {
  const tasks = getLocalTasks(userId);
  const updatedTasks = tasks.filter((t) => t.id !== taskId);

  const userTasksKey = `${TASKS_STORAGE_KEY_PREFIX}${userId}`;
  localStorage.setItem(userTasksKey, JSON.stringify(updatedTasks));
  return updatedTasks;
}
