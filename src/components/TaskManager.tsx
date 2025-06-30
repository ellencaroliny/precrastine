import React, { useState } from 'react';
import { Plus, Calendar, Flag, Search, Filter, List } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import QuickTaskInput from './QuickTaskInput';

interface TaskManagerProps {
  globalSearch?: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ globalSearch = '' }) => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply global search first
    const searchQuery = globalSearch || searchTerm;
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date/status filter
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case 'today':
        return filtered.filter(task => {
          const taskDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
          return taskDate.toDateString() === today.toDateString() && !task.completed;
        });
      case 'tomorrow':
        return filtered.filter(task => {
          const taskDate = task.dueDate ? new Date(task.dueDate) : null;
          return taskDate && taskDate.toDateString() === tomorrow.toDateString() && !task.completed;
        });
      case 'completed':
        return filtered.filter(task => task.completed);
      default:
        return filtered;
    }
  };

  const filteredTasks = getFilteredTasks();

  const groupTasksByStatus = () => {
    const pending = filteredTasks.filter(task => !task.completed);
    const completed = filteredTasks.filter(task => task.completed);
    return { pending, completed };
  };

  const { pending, completed } = groupTasksByStatus();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gerenciador de Tarefas</h1>
          <p className="text-gray-600 mt-1">Organize suas atividades de forma simples e eficiente</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Tarefa Rápida</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tarefa Completa</span>
            <span className="sm:hidden">Completa</span>
          </button>
        </div>
      </div>

      {/* Quick Task Input */}
      {showQuickAdd && (
        <QuickTaskInput
          onAdd={addTask}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            {!globalSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}
            {globalSearch && (
              <div className="text-sm text-gray-600 p-2">
                Mostrando resultados para: <span className="font-medium">"{globalSearch}"</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Todas</option>
              <option value="today">Hoje</option>
              <option value="tomorrow">Amanhã</option>
              <option value="completed">Concluídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{pending.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Flag className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{completed.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Concluídas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 font-semibold text-sm">!</span>
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {pending.filter(t => t.priority === 'high').length}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Alta Prioridade</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">%</span>
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0}%
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Conclusão</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Display - Simple List View */}
      <div className="space-y-6">
        {filter !== 'completed' && pending.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <List className="w-5 h-5" />
              <span>Tarefas Pendentes ({pending.length})</span>
            </h2>
            <div className="space-y-3">
              {pending.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onUpdate={(updates) => updateTask(task.id, updates)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {(filter === 'completed' || filter === 'all') && completed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <List className="w-5 h-5" />
              <span>Tarefas Concluídas ({completed.length})</span>
            </h2>
            <div className="space-y-3">
              {completed.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onUpdate={(updates) => updateTask(task.id, updates)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
          <p className="text-gray-600">
            {globalSearch || searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira tarefa'}
          </p>
        </div>
      )}

      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={addTask}
        />
      )}
    </div>
  );
};

export default TaskManager;