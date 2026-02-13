import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Target, Star, Zap, Award, TrendingUp, Calendar, Dumbbell, Apple, Droplets, Moon } from 'lucide-react';

export interface GamificationData {
  totalPoints: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  badges: Badge[];
  missions: Mission[];
  weeklyProgress: WeeklyProgress;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  category: 'workout' | 'nutrition' | 'habits' | 'health';
  target: number;
  current: number;
  points: number;
  completed: boolean;
  icon: string;
}

export interface WeeklyProgress {
  workouts: number;
  mealsLogged: number;
  waterIntake: number;
  sleepHours: number;
  habitsCompleted: number;
}

// Sistema de níveis
export const LEVELS = [
  { level: 1, name: 'Iniciante', xpRequired: 0, color: '#8B4513' },
  { level: 2, name: 'Aprendiz', xpRequired: 100, color: '#CD853F' },
  { level: 3, name: 'Disciplinado', xpRequired: 300, color: '#2E8B57' },
  { level: 4, name: 'Atleta', xpRequired: 600, color: '#4682B4' },
  { level: 5, name: 'Guerreiro', xpRequired: 1000, color: '#9370DB' },
  { level: 6, name: 'Campeão', xpRequired: 1500, color: '#FFD700' },
  { level: 7, name: 'Lenda', xpRequired: 2200, color: '#FF6347' },
  { level: 8, name: 'Mestre', xpRequired: 3000, color: '#DC143C' },
  { level: 9, name: 'Elite', xpRequired: 4000, color: '#4169E1' },
  { level: 10, name: 'Titã', xpRequired: 5500, color: '#9932CC' },
];

// Badges/Conquistas
export const BADGES: Badge[] = [
  {
    id: 'first_workout',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro treino',
    icon: 'Dumbbell',
    rarity: 'common',
  },
  {
    id: 'week_warrior',
    name: 'Guerreiro da Semana',
    description: 'Treine 7 dias consecutivos',
    icon: 'Flame',
    rarity: 'rare',
  },
  {
    id: 'hydration_master',
    name: 'Mestre da Hidratação',
    description: 'Atinga meta de água por 7 dias',
    icon: 'Droplets',
    rarity: 'common',
  },
  {
    id: 'sleep_guru',
    name: 'Guru do Sono',
    description: 'Durma 8 horas por 5 dias seguidos',
    icon: 'Moon',
    rarity: 'rare',
  },
  {
    id: 'nutrition_expert',
    name: 'Expert em Nutrição',
    description: 'Registre todas as refeições por 1 semana',
    icon: 'Apple',
    rarity: 'epic',
  },
  {
    id: 'habit_master',
    name: 'Mestre dos Hábitos',
    description: 'Complete todos os hábitos por 30 dias',
    icon: 'Target',
    rarity: 'legendary',
  },
  {
    id: 'streak_30',
    name: 'Imparável',
    description: 'Mantenha streak de 30 dias',
    icon: 'Zap',
    rarity: 'epic',
  },
  {
    id: 'health_champion',
    name: 'Campeão da Saúde',
    description: 'Alcance nível 5',
    icon: 'Trophy',
    rarity: 'legendary',
  },
];

// Missões diárias
export const DAILY_MISSIONS: Mission[] = [
  {
    id: 'daily_workout',
    title: 'Treino Diário',
    description: 'Complete 1 treino hoje',
    type: 'daily',
    category: 'workout',
    target: 1,
    current: 0,
    points: 50,
    completed: false,
    icon: 'Dumbbell',
  },
  {
    id: 'daily_water',
    title: 'Hidratação Perfeita',
    description: 'Beba 3 litros de água',
    type: 'daily',
    category: 'habits',
    target: 3000,
    current: 0,
    points: 30,
    completed: false,
    icon: 'Droplets',
  },
  {
    id: 'daily_meals',
    title: 'Refeições no Horário',
    description: 'Registre todas as refeições',
    type: 'daily',
    category: 'nutrition',
    target: 3,
    current: 0,
    points: 40,
    completed: false,
    icon: 'Apple',
  },
  {
    id: 'daily_sleep',
    title: 'Sono de Qualidade',
    description: 'Durma pelo menos 7 horas',
    type: 'daily',
    category: 'habits',
    target: 7,
    current: 0,
    points: 35,
    completed: false,
    icon: 'Moon',
  },
  {
    id: 'daily_habits',
    title: 'Checklist Completo',
    description: 'Complete todos os hábitos do dia',
    type: 'daily',
    category: 'habits',
    target: 6,
    current: 0,
    points: 60,
    completed: false,
    icon: 'Target',
  },
];

// Missões semanais
export const WEEKLY_MISSIONS: Mission[] = [
  {
    id: 'weekly_workouts',
    title: 'Semana de Ferro',
    description: 'Complete 5 treinos esta semana',
    type: 'weekly',
    category: 'workout',
    target: 5,
    current: 0,
    points: 200,
    completed: false,
    icon: 'Dumbbell',
  },
  {
    id: 'weekly_streak',
    title: 'Consistência Total',
    description: 'Complete todas as missões diárias por 5 dias',
    type: 'weekly',
    category: 'habits',
    target: 5,
    current: 0,
    points: 300,
    completed: false,
    icon: 'Flame',
  },
  {
    id: 'weekly_perfect',
    title: 'Semana Perfeita',
    description: '100% de aderência em todos os hábitos',
    type: 'weekly',
    category: 'health',
    target: 100,
    current: 0,
    points: 500,
    completed: false,
    icon: 'Star',
  },
];

// Hook de gamificação
export const useGamification = () => {
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    totalPoints: 0,
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    streakDays: 0,
    longestStreak: 0,
    badges: [],
    missions: [...DAILY_MISSIONS, ...WEEKLY_MISSIONS],
    weeklyProgress: {
      workouts: 0,
      mealsLogged: 0,
      waterIntake: 0,
      sleepHours: 0,
      habitsCompleted: 0,
    },
  });

  // Calcular nível baseado no XP
  const calculateLevel = (xp: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpRequired) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  };

  // Adicionar XP
  const addXP = (amount: number) => {
    setGamificationData((prev) => {
      const newXP = prev.currentXP + amount;
      const newTotalXP = prev.totalPoints + amount;
      const currentLevel = calculateLevel(newTotalXP);
      const nextLevel = LEVELS[currentLevel.level] || currentLevel;
      
      return {
        ...prev,
        totalPoints: newTotalXP,
        currentXP: newXP,
        level: currentLevel.level,
        xpToNextLevel: nextLevel.xpRequired - newTotalXP,
      };
    });
  };

  // Completar missão
  const completeMission = (missionId: string) => {
    setGamificationData((prev) => {
      const mission = prev.missions.find((m) => m.id === missionId);
      if (!mission || mission.completed) return prev;

      addXP(mission.points);

      return {
        ...prev,
        missions: prev.missions.map((m) =>
          m.id === missionId ? { ...m, completed: true, current: m.target } : m
        ),
      };
    });
  };

  // Atualizar progresso de missão
  const updateMissionProgress = (missionId: string, progress: number) => {
    setGamificationData((prev) => {
      const mission = prev.missions.find((m) => m.id === missionId);
      if (!mission || mission.completed) return prev;

      const newProgress = Math.min(progress, mission.target);
      const completed = newProgress >= mission.target;

      if (completed) {
        addXP(mission.points);
      }

      return {
        ...prev,
        missions: prev.missions.map((m) =>
          m.id === missionId ? { ...m, current: newProgress, completed } : m
        ),
      };
    });
  };

  // Desbloquear badge
  const unlockBadge = (badgeId: string) => {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return;

    setGamificationData((prev) => {
      if (prev.badges.some((b) => b.id === badgeId)) return prev;

      return {
        ...prev,
        badges: [...prev.badges, { ...badge, unlockedAt: new Date() }],
      };
    });
  };

  // Atualizar streak
  const updateStreak = (increment: boolean) => {
    setGamificationData((prev) => {
      const newStreak = increment ? prev.streakDays + 1 : 0;
      return {
        ...prev,
        streakDays: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
      };
    });
  };

  // Atualizar progresso semanal
  const updateWeeklyProgress = (category: keyof WeeklyProgress, value: number) => {
    setGamificationData((prev) => ({
      ...prev,
      weeklyProgress: {
        ...prev.weeklyProgress,
        [category]: prev.weeklyProgress[category] + value,
      },
    }));
  };

  // Resetar missões diárias
  const resetDailyMissions = () => {
    setGamificationData((prev) => ({
      ...prev,
      missions: prev.missions.map((m) =>
        m.type === 'daily'
          ? { ...m, completed: false, current: 0 }
          : m
      ),
    }));
  };

  return {
    gamificationData,
    LEVELS,
    BADGES,
    addXP,
    completeMission,
    updateMissionProgress,
    unlockBadge,
    updateStreak,
    updateWeeklyProgress,
    resetDailyMissions,
  };
};

export default useGamification;
