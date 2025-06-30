import { useState, useEffect } from 'react';
import { LifeArea } from '../types';
import { useAuth } from '../contexts/AuthContext';

const defaultLifeAreas: Omit<LifeArea, 'userId' | 'lastUpdated'>[] = [
  { id: 'health', name: 'Saúde', score: 5, color: '#10B981', icon: 'Heart' },
  { id: 'career', name: 'Carreira', score: 5, color: '#3B82F6', icon: 'Briefcase' },
  { id: 'relationships', name: 'Relacionamentos', score: 5, color: '#EC4899', icon: 'Users' },
  { id: 'finances', name: 'Finanças', score: 5, color: '#F59E0B', icon: 'DollarSign' },
  { id: 'personal', name: 'Desenvolvimento Pessoal', score: 5, color: '#8B5CF6', icon: 'BookOpen' },
  { id: 'leisure', name: 'Lazer', score: 5, color: '#06B6D4', icon: 'Gamepad2' },
  { id: 'family', name: 'Família', score: 5, color: '#EF4444', icon: 'Home' },
  { id: 'spirituality', name: 'Espiritualidade', score: 5, color: '#84CC16', icon: 'Sun' },
];

export const useLifeAreas = () => {
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedAreas = localStorage.getItem(`precrastine_life_areas_${user.id}`);
      if (savedAreas) {
        setLifeAreas(JSON.parse(savedAreas));
      } else {
        // Initialize with default areas
        const initialAreas = defaultLifeAreas.map(area => ({
          ...area,
          userId: user.id,
          lastUpdated: new Date(),
        }));
        setLifeAreas(initialAreas);
        localStorage.setItem(`precrastine_life_areas_${user.id}`, JSON.stringify(initialAreas));
      }
    }
  }, [user]);

  const updateAreaScore = (areaId: string, score: number) => {
    if (user) {
      const updatedAreas = lifeAreas.map(area =>
        area.id === areaId
          ? { ...area, score, lastUpdated: new Date() }
          : area
      );
      setLifeAreas(updatedAreas);
      localStorage.setItem(`precrastine_life_areas_${user.id}`, JSON.stringify(updatedAreas));
    }
  };

  return {
    lifeAreas,
    updateAreaScore,
  };
};