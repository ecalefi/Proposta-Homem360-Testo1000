import React from 'react';
import { Trophy, Flame, Target, Star, Zap, Award, TrendingUp, Lock } from 'lucide-react';
import { GamificationData, Badge, LEVELS } from '../hooks/useGamification';

interface GamificationDashboardProps {
  data: GamificationData;
}

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-600 border-gray-200',
  rare: 'bg-blue-100 text-blue-600 border-blue-200',
  epic: 'bg-purple-100 text-purple-600 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-600 border-yellow-200',
};

const RARITY_LABELS = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ data }) => {
  const currentLevel = LEVELS[data.level - 1];
  const nextLevel = LEVELS[data.level];
  const progressPercent = nextLevel
    ? ((data.totalPoints - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Header com nível e pontos */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Nível {data.level}: {currentLevel.name}</h2>
            <p className="text-amber-100">{data.totalPoints} XP total</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <Trophy className="w-8 h-8" />
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso para próximo nível</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="bg-black/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white rounded-full h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-amber-100">
            {data.xpToNextLevel} XP para nível {data.level + 1}
          </p>
        </div>
      </div>

      {/* Streak e estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-medium">Streak Atual</span>
          </div>
          <p className="text-3xl font-bold">{data.streakDays}</p>
          <p className="text-sm text-orange-100">dias consecutivos</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-medium">Recorde</span>
          </div>
          <p className="text-3xl font-bold">{data.longestStreak}</p>
          <p className="text-sm text-blue-100">maior streak</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Conquistas</span>
          </div>
          <p className="text-3xl font-bold">{data.badges.length}</p>
          <p className="text-sm text-purple-100">badges desbloqueados</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Missões</span>
          </div>
          <p className="text-3xl font-bold">
            {data.missions.filter(m => m.completed).length}/{data.missions.length}
          </p>
          <p className="text-sm text-green-100">completadas hoje</p>
        </div>
      </div>

      {/* Badges/Conquistas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-bold text-gray-800">Suas Conquistas</h3>
        </div>
        
        {data.badges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma conquista desbloqueada ainda</p>
            <p className="text-sm">Complete missões para ganhar badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border-2 ${RARITY_COLORS[badge.rarity]} text-center`}
              >
                <div className="text-3xl mb-2">
                  {badge.icon === 'Dumbbell' && '💪'}
                  {badge.icon === 'Flame' && '🔥'}
                  {badge.icon === 'Droplets' && '💧'}
                  {badge.icon === 'Moon' && '🌙'}
                  {badge.icon === 'Apple' && '🍎'}
                  {badge.icon === 'Target' && '🎯'}
                  {badge.icon === 'Zap' && '⚡'}
                  {badge.icon === 'Trophy' && '🏆'}
                </div>
                <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs opacity-75 mb-2">{badge.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${RARITY_COLORS[badge.rarity]}`}>
                  {RARITY_LABELS[badge.rarity]}
                </span>
                {badge.unlockedAt && (
                  <p className="text-xs mt-2 opacity-50">
                    {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progresso semanal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-bold text-gray-800">Progresso Semanal</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Treinos</span>
              <span className="text-sm text-gray-500">{data.weeklyProgress.workouts}/5</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all"
                style={{ width: `${Math.min((data.weeklyProgress.workouts / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Refeições Registradas</span>
              <span className="text-sm text-gray-500">{data.weeklyProgress.mealsLogged}/21</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2 transition-all"
                style={{ width: `${Math.min((data.weeklyProgress.mealsLogged / 21) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Água (litros)</span>
              <span className="text-sm text-gray-500">{data.weeklyProgress.waterIntake}/21</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-cyan-500 rounded-full h-2 transition-all"
                style={{ width: `${Math.min((data.weeklyProgress.waterIntake / 21) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Hábitos Completados</span>
              <span className="text-sm text-gray-500">{data.weeklyProgress.habitsCompleted}/42</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 rounded-full h-2 transition-all"
                style={{ width: `${Math.min((data.weeklyProgress.habitsCompleted / 42) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;
