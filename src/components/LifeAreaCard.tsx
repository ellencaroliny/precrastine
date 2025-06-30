import React, { useState } from 'react';
import { Star, Heart, Briefcase, Users, DollarSign, BookOpen, Gamepad2, Home, Sun } from 'lucide-react';
import { LifeArea } from '../types';

interface LifeAreaCardProps {
  area: LifeArea;
  onScoreUpdate: (score: number) => void;
}

const iconMap = {
  Heart,
  Briefcase,
  Users,
  DollarSign,
  BookOpen,
  Gamepad2,
  Home,
  Sun,
};

const LifeAreaCard: React.FC<LifeAreaCardProps> = ({ area, onScoreUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempScore, setTempScore] = useState(area.score);

  const IconComponent = iconMap[area.icon as keyof typeof iconMap] || Star;

  const handleSave = () => {
    onScoreUpdate(tempScore);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempScore(area.score);
    setIsEditing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'border-green-500 bg-green-50';
    if (score >= 6) return 'border-yellow-500 bg-yellow-50';
    if (score >= 4) return 'border-orange-500 bg-orange-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-md ${getScoreColor(area.score)}`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-lg text-white flex-shrink-0"
              style={{ backgroundColor: area.color }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                {area.name}
              </h3>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{area.score}</div>
            <div className="text-xs text-gray-500">/10</div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Nova pontuação
                </label>
                <span className="text-lg font-bold text-gray-900">{tempScore}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={tempScore}
                onChange={(e) => setTempScore(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, ${area.color} 0%, ${area.color} ${tempScore * 10}%, #e5e7eb ${tempScore * 10}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(area.score / 10) * 100}%`,
                    backgroundColor: area.color,
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Atualizar Pontuação
            </button>
          </>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Última atualização: {new Date(area.lastUpdated).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  );
};

export default LifeAreaCard;