import React from 'react';
import { Target, ArrowRight, CheckCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuestLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLogin,
  onRegister,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-full shadow-lg animate-pulse">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Precrastine-se
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Transforme sua procrastinação em produtividade. Gerencie tarefas e equilibre sua vida.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais recursos:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Organize tarefas com drag & drop</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Avalie e equilibre áreas da vida</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Acompanhe seu progresso</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Interface intuitiva e responsiva</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <button
            onClick={onLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>Entrar na sua conta</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>Criar conta gratuita</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Comece sua jornada rumo à produtividade
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;