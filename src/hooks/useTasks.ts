import { useState, useEffect } from 'react';
import { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`precrastine_tasks_${user.id}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
  }, [user]);

  const saveTasks = (newTasks: Task[]) => {
    if (user) {
      setTasks(newTasks);
      localStorage.setItem(`precrastine_tasks_${user.id}`, JSON.stringify(newTasks));
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (user) {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        userId: user.id,
      };
      saveTasks([...tasks, newTask]);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
  };

  const toggleTask = (id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};