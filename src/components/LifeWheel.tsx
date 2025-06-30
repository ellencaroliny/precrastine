import React from 'react';
import { Target, TrendingUp, Info } from 'lucide-react';
import { useLifeAreas } from '../hooks/useLifeAreas';
import LifeAreaCard from './LifeAreaCard';

const LifeWheel: React.FC = () => {
  const { lifeAreas, updateAreaScore } = useLifeAreas();

  const averageScore = lifeAreas.length > 0 
    ? Math.round((lifeAreas.reduce((sum, area) => sum + area.score, 0) / lifeAreas.length) * 10) / 10
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return 'Excelente';
    if (score >= 6) return 'Bom';
    if (score >= 4) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Roda da Vida</h1>
        <p className="text-gray-600 mt-2">Avalie e equilibre as diferentes áreas da sua vida</p>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pontuação Geral</h2>
              <p className="text-sm sm:text-base text-gray-600">Média de todas as áreas</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}/10
            </div>
            <p className={`text-sm font-medium ${getScoreColor(averageScore)}`}>
              {getScoreText(averageScore)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-900">Progresso Visual</h3>
        </div>
        <div className="space-y-6">
          {lifeAreas.map((area) => (
            <div key={area.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                    {area.name}
                  </h4>
                </div>
                <div className="ml-4 text-right flex-shrink-0">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    {area.score}/10
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(area.score / 10) * 100}%`,
                    backgroundColor: area.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Life Areas Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Áreas da Vida</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {lifeAreas.map((area) => (
            <LifeAreaCard
              key={area.id}
              area={area}
              onScoreUpdate={(score) => updateAreaScore(area.id, score)}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Dicas para usar a Roda da Vida</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Avalie cada área honestamente, de 1 a 10</li>
              <li>• Foque nas áreas com pontuação mais baixa</li>
              <li>• Defina metas específicas para melhorar</li>
              <li>• Revise mensalmente para acompanhar o progresso</li>
              <li>• Lembre-se: equilíbrio é mais importante que perfeição</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeWheel;