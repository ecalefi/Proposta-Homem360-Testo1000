import React, { useEffect, useState } from 'react';
import { Trophy, X, Sparkles, Award, Star } from 'lucide-react';

interface AchievementNotification {
  id: string;
  type: 'levelup' | 'badge' | 'mission' | 'streak';
  title: string;
  message: string;
  points?: number;
  icon?: string;
}

interface AchievementPopupProps {
  notifications: AchievementNotification[];
  onClose: (id: string) => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ notifications, onClose }) => {
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!visible.includes(notification.id)) {
        setVisible((prev) => [...prev, notification.id]);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
          onClose(notification.id);
          setVisible((prev) => prev.filter((id) => id !== notification.id));
        }, 5000);
      }
    });
  }, [notifications, visible, onClose]);

  const getIcon = (type: string, iconName?: string) => {
    switch (type) {
      case 'levelup':
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'badge':
        return <Award className="w-8 h-8 text-purple-500" />;
      case 'streak':
        return <Sparkles className="w-8 h-8 text-orange-500" />;
      case 'mission':
        return <Star className="w-8 h-8 text-green-500" />;
      default:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getBackground = (type: string) => {
    switch (type) {
      case 'levelup':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'badge':
        return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'streak':
        return 'bg-gradient-to-r from-orange-500 to-red-600';
      case 'mission':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackground(notification.type)} rounded-xl shadow-lg p-4 text-white transform transition-all duration-300 animate-slide-in`}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-white/20 rounded-full p-2">
              {getIcon(notification.type, notification.icon)}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-lg">{notification.title}</h4>
              <p className="text-sm text-white/90">{notification.message}</p>
              
              {notification.points && (
                <p className="text-sm font-bold mt-1 text-yellow-200">
                  +{notification.points} XP
                </p>
              )}
            </div>
            
            <button
              onClick={() => {
                onClose(notification.id);
                setVisible((prev) => prev.filter((id) => id !== notification.id));
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para mostrar o streak em destaque
interface StreakCelebrationProps {
  streakDays: number;
  onClose: () => void;
}

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  streakDays,
  onClose,
}) => {
  if (streakDays === 0) return null;

  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
  const isMilestone = milestones.includes(streakDays);

  if (!isMilestone) return null;

  const messages: Record<number, string> = {
    3: 'Você está pegando o ritmo!',
    7: 'Uma semana completa! Impressionante!',
    14: 'Duas semanas! Você é uma máquina!',
    30: 'Um mês! Hábitos estão sendo formados!',
    60: 'Dois meses! Você é um campeão!',
    90: 'Trimestre completo! Lendário!',
    180: 'Seis meses! Você é um titã!',
    365: 'UM ANO INTEIRO! VOCÊ É IMORTAL!',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 max-w-md mx-4 text-white text-center animate-bounce-in">
        <div className="text-6xl mb-4">🔥</div>
        
        <h2 className="text-4xl font-bold mb-2">
          {streakDays} DIAS!
        </h2>
        
        <p className="text-xl font-medium mb-4">
          {messages[streakDays]}
        </p>
        
        <div className="bg-white/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-white/80">Streak atual</p>
          <p className="text-5xl font-bold">{streakDays}</p>
          <p className="text-lg">dias consecutivos</p>
        </div>
        
        <button
          onClick={onClose}
          className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition-colors"
        >
          Continuar! 🚀
        </button>
      </div>
    </div>
  );
};

// Hook para gerenciar notificações
export const useAchievementNotifications = () => {
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);

  const addNotification = (notification: Omit<AchievementNotification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const notifyLevelUp = (level: number, levelName: string) => {
    addNotification({
      type: 'levelup',
      title: 'Nível Alcançado!',
      message: `Parabéns! Você alcançou o nível ${level}: ${levelName}`,
      points: 100,
    });
  };

  const notifyBadgeUnlocked = (badgeName: string) => {
    addNotification({
      type: 'badge',
      title: 'Conquista Desbloqueada!',
      message: `Você desbloqueou: ${badgeName}`,
      points: 50,
    });
  };

  const notifyMissionComplete = (missionTitle: string, points: number) => {
    addNotification({
      type: 'mission',
      title: 'Missão Completa!',
      message: `Você completou: ${missionTitle}`,
      points,
    });
  };

  const notifyStreak = (days: number) => {
    addNotification({
      type: 'streak',
      title: `${days} Dias de Streak!`,
      message: 'Você está imparável! Continue assim!',
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    notifyLevelUp,
    notifyBadgeUnlocked,
    notifyMissionComplete,
    notifyStreak,
  };
};

export default AchievementPopup;
