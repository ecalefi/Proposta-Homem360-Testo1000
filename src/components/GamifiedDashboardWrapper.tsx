import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Trophy, Target, Zap, TrendingUp, Calendar, ChevronRight, Gamepad2 } from 'lucide-react';
import Dashboard from './Dashboard';
import GamificationDashboard from './GamificationDashboard';
import MissionsPanel from './MissionsPanel';
import SleepChart from './SleepChart';
import AchievementPopup, { StreakCelebration, useAchievementNotifications } from './AchievementPopup';
import { useGamification } from '../hooks/useGamification';
import { DashboardMetrics, HabitLog, Appointment } from '../types';

interface GamifiedDashboardWrapperProps {
  metrics: DashboardMetrics;
  todayHabits: HabitLog;
  nextAppointment?: Appointment;
  userName: string;
}

const GamifiedDashboardWrapper: React.FC<GamifiedDashboardWrapperProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gamification' | 'missions'>('dashboard');
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  
  const {
    gamificationData,
    addXP,
    completeMission,
    updateMissionProgress,
    unlockBadge,
    updateStreak,
    updateWeeklyProgress,
  } = useGamification();

  const {
    notifications,
    removeNotification,
    notifyLevelUp,
    notifyBadgeUnlocked,
    notifyMissionComplete,
    notifyStreak,
  } = useAchievementNotifications();

  // Handlers para gamificação
  const handleCompleteMission = (missionId: string, customPoints?: number) => {
    const mission = gamificationData.missions.find((m) => m.id === missionId);
    if (mission && !mission.completed) {
      const points = customPoints !== undefined ? customPoints : mission.points;
      completeMission(missionId, points);
      notifyMissionComplete(mission.title, points);
      
      // Verificar conquistas
      checkAchievements();
    }
  };

  const handleUpdateMissionProgress = (missionId: string, progress: number) => {
    updateMissionProgress(missionId, progress);
    
    const mission = gamificationData.missions.find((m) => m.id === missionId);
    if (mission && progress >= mission.target && !mission.completed) {
      notifyMissionComplete(mission.title, mission.points);
      checkAchievements();
    }
  };

  const checkAchievements = () => {
    const completedMissions = gamificationData.missions.filter((m) => m.completed).length;
    const totalMissions = gamificationData.missions.length;
    
    // Badge: Primeira missão
    if (completedMissions >= 1) {
      unlockBadge('first_workout');
      notifyBadgeUnlocked('Primeiro Passo');
    }
    
    // Badge: Semana de treinos
    if (gamificationData.weeklyProgress.workouts >= 7) {
      unlockBadge('week_warrior');
      notifyBadgeUnlocked('Guerreiro da Semana');
    }
    
    // Badge: Hidratação
    if (gamificationData.weeklyProgress.waterIntake >= 21) {
      unlockBadge('hydration_master');
      notifyBadgeUnlocked('Mestre da Hidratação');
    }
    
    // Badge: Sono
    if (gamificationData.weeklyProgress.sleepHours >= 40) {
      unlockBadge('sleep_guru');
      notifyBadgeUnlocked('Guru do Sono');
    }
    
    // Badge: Nutrição
    if (gamificationData.weeklyProgress.mealsLogged >= 21) {
      unlockBadge('nutrition_expert');
      notifyBadgeUnlocked('Expert em Nutrição');
    }
    
    // Badge: Streak 30 dias
    if (gamificationData.streakDays >= 30) {
      unlockBadge('streak_30');
      notifyBadgeUnlocked('Imparável');
    }
    
    // Badge: Hábitos
    if (gamificationData.weeklyProgress.habitsCompleted >= 42) {
      unlockBadge('habit_master');
      notifyBadgeUnlocked('Mestre dos Hábitos');
    }
    
    // Badge: Campeão (nível 5)
    if (gamificationData.level >= 5) {
      unlockBadge('health_champion');
      notifyBadgeUnlocked('Campeão da Saúde');
    }
    
    // Verificar streak
    if (gamificationData.streakDays > 0 && gamificationData.streakDays % 7 === 0) {
      notifyStreak(gamificationData.streakDays);
      setShowStreakCelebration(true);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Painel', icon: TrendingUp },
    { id: 'gamification', label: 'Conquistas', icon: Trophy },
    { id: 'missions', label: 'Missões', icon: Target },
  ];

  return (
    <div className="relative">
      {/* Notificações de conquistas */}
      <AchievementPopup
        notifications={notifications}
        onClose={removeNotification}
      />

      {/* Celebração de Streak */}
      <StreakCelebration
        streakDays={gamificationData.streakDays}
        onClose={() => setShowStreakCelebration(false)}
      />

      {/* Header com nível e pontos */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nível {gamificationData.level}</h2>
              <p className="text-sm text-amber-100">{gamificationData.totalPoints} XP • {gamificationData.streakDays} dias de streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Zap className="w-4 h-4" />
            <span className="font-bold">+{gamificationData.missions.filter(m => m.type === 'daily' && m.completed).length} hoje</span>
          </div>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'dashboard' && (
        <Dashboard {...props} />
      )}

      {activeTab === 'gamification' && (
        <>
          <GamificationDashboard data={gamificationData} />
          <div className="mt-6">
            <SleepChart />
          </div>
        </>
      )}

      {activeTab === 'missions' && (
        <MissionsPanel
          missions={gamificationData.missions}
          onComplete={handleCompleteMission}
          onUpdateProgress={handleUpdateMissionProgress}
        />
      )}

      {/* Quick Actions - sempre visível */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setActiveTab('missions')}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Target className="w-6 h-6" />
          {gamificationData.missions.filter((m) => !m.completed).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {gamificationData.missions.filter((m) => !m.completed).length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default GamifiedDashboardWrapper;
