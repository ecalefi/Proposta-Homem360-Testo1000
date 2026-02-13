import React from 'react';
import { Check, Circle, Dumbbell, Droplets, Apple, Moon, Target, Flame, Star } from 'lucide-react';
import { Mission } from '../hooks/useGamification';

interface MissionsPanelProps {
  missions: Mission[];
  onComplete: (missionId: string) => void;
  onUpdateProgress: (missionId: string, progress: number) => void;
}

const CATEGORY_ICONS = {
  workout: Dumbbell,
  nutrition: Apple,
  habits: Target,
  health: Star,
};

const CATEGORY_COLORS = {
  workout: 'bg-blue-100 text-blue-600 border-blue-200',
  nutrition: 'bg-green-100 text-green-600 border-green-200',
  habits: 'bg-purple-100 text-purple-600 border-purple-200',
  health: 'bg-amber-100 text-amber-600 border-amber-200',
};

const MissionsPanel: React.FC<MissionsPanelProps> = ({
  missions,
  onComplete,
  onUpdateProgress,
}) => {
  const dailyMissions = missions.filter((m) => m.type === 'daily');
  const weeklyMissions = missions.filter((m) => m.type === 'weekly');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Apple':
        return <Apple className="w-5 h-5" />;
      case 'Moon':
        return <Moon className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const renderMissionCard = (mission: Mission) => {
    const progress = Math.min((mission.current / mission.target) * 100, 100);
    const Icon = CATEGORY_ICONS[mission.category];

    return (
      <div
        key={mission.id}
        className={`p-4 rounded-xl border-2 transition-all ${
          mission.completed
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${CATEGORY_COLORS[mission.category]}`}>
            {getIcon(mission.icon)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`font-bold ${mission.completed ? 'text-green-700' : 'text-gray-800'}`}>
                {mission.title}
              </h4>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                mission.completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                +{mission.points} XP
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
            
            {!mission.completed && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progresso</span>
                  <span className="font-medium">
                    {mission.current}/{mission.target}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* Botões de ação rápida */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onUpdateProgress(mission.id, mission.current + 1)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    +1
                  </button>
                  {mission.target <= 10 && (
                    <>
                      <button
                        onClick={() => onUpdateProgress(mission.id, mission.current + 5)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => onComplete(mission.id)}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Completar
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {mission.completed && (
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <Check className="w-5 h-5" />
                <span className="font-medium">Concluído!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Missões Diárias */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Missões Diárias</h3>
              <p className="text-sm text-gray-500">Complete para ganhar XP e manter seu streak</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">
              {dailyMissions.filter((m) => m.completed).length}/{dailyMissions.length}
            </p>
            <p className="text-xs text-gray-500">concluídas</p>
          </div>
        </div>

        <div className="space-y-3">
          {dailyMissions.map(renderMissionCard)}
        </div>

        {dailyMissions.every((m) => m.completed) && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white text-center">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">Parabéns! Você completou todas as missões de hoje!</p>
            <p className="text-sm text-amber-100">Continue assim para manter seu streak!</p>
          </div>
        )}
      </div>

      {/* Missões Semanais */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Missões Semanais</h3>
              <p className="text-sm text-gray-500">Desafios maiores com recompensas épicas</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">
              {weeklyMissions.filter((m) => m.completed).length}/{weeklyMissions.length}
            </p>
            <p className="text-xs text-gray-500">concluídas</p>
          </div>
        </div>

        <div className="space-y-3">
          {weeklyMissions.map(renderMissionCard)}
        </div>
      </div>
    </div>
  );
};

export default MissionsPanel;
