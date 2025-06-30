export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  userId: string;
}

export interface LifeArea {
  id: string;
  name: string;
  score: number;
  color: string;
  icon: string;
  userId: string;
  lastUpdated: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}