import React from 'react';
import { CheckSquare, Target, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useLifeAreas } from '../hooks/useLifeAreas';

const Overview: React.FC = () => {
  const { tasks } = useTasks();
  const { lifeAreas } = useLifeAreas();

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

  const upcomingTasks = tasks.filter(task => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate.toDateString() === tomorrow.toDateString();
  });

  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-600">Acompanhe seu progresso e desempenho</p>
      </div>

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

      {/* Priority Tasks Alert */}
      {highPriorityTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Target className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-900">Tarefas de Alta Prioridade</h3>
                <p className="text-sm text-red-700">
                  Você tem {highPriorityTasks.length} tarefa{highPriorityTasks.length > 1 ? 's' : ''} de alta prioridade pendente{highPriorityTasks.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm">
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tarefas de Hoje</h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm">
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    task.completed ? 'bg-green-500' : 
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                  {task.priority === 'high' && !task.completed && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Alta
                    </span>
                  )}
                </div>
              ))}
              {todayTasks.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">+{todayTasks.length - 5} mais tarefas...</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nenhuma tarefa para hoje</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Tarefas</h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm">
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-900 flex-1">{task.title}</span>
                  {task.priority === 'high' && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Alta
                    </span>
                  )}
                </div>
              ))}
              {upcomingTasks.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">+{upcomingTasks.length - 5} mais tarefas...</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nenhuma tarefa agendada para amanhã</p>
            </div>
          )}
        </div>
      </div>

      {/* Life Areas Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Roda da Vida - Resumo</h2>
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm">
            <span>Ver detalhes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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

export default Overview;