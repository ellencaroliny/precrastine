import React, { useState } from 'react';
import { CheckSquare, Target, TrendingUp, Calendar, Plus, List } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useLifeAreas } from '../hooks/useLifeAreas';
import TaskCard from './TaskCard';
import QuickTaskInput from './QuickTaskInput';

interface UnifiedDashboardProps {
  globalSearch: string;
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ globalSearch }) => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { lifeAreas } = useLifeAreas();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const averageLifeScore = lifeAreas.length > 0 
    ? Math.round(lifeAreas.reduce((sum, area) => sum + area.score, 0) / lifeAreas.length)
    : 0;

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
    return taskDate.toDateString() === today.toDateString();
  });

  const filteredTasks = globalSearch 
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        task.description.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : tasks;

  const recentTasks = filteredTasks.filter(task => !task.completed).slice(0, 5);

  const stats = [
    {
      name: 'Tarefas Completadas',
      value: `${completedTasks}/${totalTasks}`,
      change: `${completionRate}%`,
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pontuação Média da Vida',
      value: `${averageLifeScore}/10`,
      change: 'Em desenvolvimento',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Tarefas de Hoje',
      value: todayTasks.length.toString(),
      change: `${todayTasks.filter(t => t.completed).length} concluídas`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Produtividade',
      value: `${completionRate}%`,
      change: 'Esta semana',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas tarefas e progresso</p>
        </div>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tarefa Rápida</span>
        </button>
      </div>

      {/* Quick Task Input */}
      {showQuickAdd && (
        <QuickTaskInput
          onAdd={addTask}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <List className="w-5 h-5" />
            <span>Tarefas Recentes</span>
          </h2>
        </div>
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onUpdate={(updates) => updateTask(task.id, updates)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa pendente</h3>
            <p className="text-gray-600">Crie sua primeira tarefa para começar</p>
          </div>
        )}
      </div>

      {/* Life Areas Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Roda da Vida - Resumo</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lifeAreas.slice(0, 8).map((area) => (
            <div key={area.id} className="text-center group cursor-pointer">
              <div className="mb-2">
                <div 
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white text-sm font-semibold group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: area.color }}
                >
                  {area.score}
                </div>
              </div>
              <p className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{area.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;