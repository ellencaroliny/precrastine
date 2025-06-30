import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Flag, GripVertical, Clock } from 'lucide-react';
import { Task } from '../types';

interface DraggableTaskCardProps {
  task: Task;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'low':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-xl scale-105 rotate-2 z-50' : ''
      } ${task.completed ? 'opacity-75 bg-gray-50' : ''} ${
        isOverdue ? 'border-red-300 bg-red-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start space-x-3">
        <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0 hover:text-gray-600" />
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm leading-tight ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className={`text-xs mt-2 leading-relaxed ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                <Flag className="w-3 h-3 mr-1" />
                {getPriorityText(task.priority)}
              </span>
              
              {task.dueDate && (
                <div className={`flex items-center text-xs ${
                  isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  {isOverdue ? <Clock className="w-3 h-3 mr-1" /> : <Calendar className="w-3 h-3 mr-1" />}
                  {new Date(task.dueDate).toLocaleDateString('pt-BR', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  {isOverdue && <span className="ml-1">(Atrasada)</span>}
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {task.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableTaskCard;