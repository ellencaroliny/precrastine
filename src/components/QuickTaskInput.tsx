import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, Flag, X } from 'lucide-react';
import { Task } from '../types';

interface QuickTaskInputProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  onClose: () => void;
}

const QuickTaskInput: React.FC<QuickTaskInputProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: '',
      priority,
      category: 'pessoal',
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    setTitle('');
    setDueDate('');
    setPriority('medium');
    setShowDetails(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-3">
          <Plus className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma nova tarefa e pressione Enter..."
            className="flex-1 text-base sm:text-lg font-medium border-none outline-none placeholder-gray-400 py-2"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showDetails && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 space-y-3 sm:space-y-0">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showDetails ? 'Menos opções' : 'Mais opções'}
          </button>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
            >
              Adicionar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuickTaskInput;