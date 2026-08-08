const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'BACKLOG' | 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
  priority: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  project?: string;
  members?: { name: string; avatar?: string; role?: string }[];
  dueDate?: string;
  labels?: string[];
  teams?: string[];
  reporter?: string;
  resources?: { title: string; url: string }[];
  subtasks?: {
    id: string;
    title: string;
    priority?: string;
    members?: { name: string; avatar?: string }[];
    dueDate?: string;
    completed: boolean;
  }[];
  comments?: {
    id: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    attachments?: string[];
    createdAt: string;
  }[];
  activityLogs?: {
    id: string;
    text: string;
    timestamp: string;
    type?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
  title: string;
  isGuest: boolean;
  theme: string;
  colorMode: string;
}

export async function continueAsGuest(): Promise<{ token: string; user: UserProfile | null }> {
  const res = await fetch(`${API_BASE_URL}/auth/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) {
    const data = await res.json();
    return { token: data.token, user: data.user || null };
  }
  throw new Error('Failed to initialize guest session');
}

export const fetchGuestLogin = continueAsGuest;

export async function loginWithEmail(email: string, password?: string): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) {
    const data = await res.json();
    return { token: data.token, user: data.user };
  }
  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.message || 'Login failed');
}

export async function registerWithEmail(name: string, email: string, password?: string): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (res.ok) {
    const data = await res.json();
    return { token: data.token, user: data.user };
  }
  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.message || 'Registration failed');
}

export async function loginWithGoogle(payload: {
  credential?: string;
  accessToken?: string;
  email?: string;
  name?: string;
  avatar?: string;
  googleId?: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const data = await res.json();
    return { token: data.token, user: data.user };
  }

  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.message || 'Google OAuth authentication failed.');
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const res = await fetch(`${API_BASE_URL}/users/profile`);
  if (res.ok) {
    return await res.json();
  }
  return null;
}

export const fetchUserProfile = getUserProfile;

export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    return await res.json();
  }
  return null;
}

export async function fetchTasks(query?: { search?: string; priority?: string; status?: string; project?: string }): Promise<Task[]> {
  const params = new URLSearchParams();
  if (query?.search) params.append('search', query.search);
  if (query?.priority) params.append('priority', query.priority);
  if (query?.status) params.append('status', query.status);
  if (query?.project) params.append('project', query.project);

  const res = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);
  if (res.ok) {
    return await res.json();
  }
  return [];
}

export async function createTask(taskData: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to create task');
}

export async function updateTask(id: string, updateData: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to update task');
}

export async function deleteTask(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function addSubtask(taskId: string, subtaskData: { title: string; priority?: string; dueDate?: string }): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subtaskData),
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to add subtask');
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to delete subtask');
}

export async function addComment(taskId: string, content: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to add comment');
}

export async function resetWorkspace(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/users/workspace`, {
    method: 'DELETE',
  });
  if (res.ok) {
    return await res.json();
  }
  return { success: false };
}

export async function fetchProjects(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/projects`);
  if (res.ok) {
    return await res.json();
  }
  return [];
}

export async function createProject(projectData: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Failed to create project');
}

export async function updateProject(id: string, projectData: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (res.ok) {
    return await res.json();
  }
  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.message || 'Failed to update project');
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

