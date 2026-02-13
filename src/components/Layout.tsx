
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Activity, 
  MessageSquare, 
  BookOpen, 
  Menu, 
  X, 
  Bell, 
  LogOut,
  Settings,
  Users,
  BellOff,
  Utensils,
  Dumbbell,
  Crown,
  ChefHat,
  BicepsFlexed
} from 'lucide-react';
import { ViewState, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { requestNotificationPermission, getPermissionStatus } from '../lib/notifications';

interface LayoutProps {
  currentUser: User;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentUser, currentView, onChangeView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(getPermissionStatus());
  const { signOut } = useAuth();
  const { messages } = useData();

  useEffect(() => {
    // Poll permission status in case it changes outside the app
    const interval = setInterval(() => {
        setNotificationStatus(getPermissionStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async () => {
    if (notificationStatus !== 'granted') {
        const granted = await requestNotificationPermission();
        if (granted) {
            setNotificationStatus('granted');
            // Show test notification
            new Notification("Notificações Ativadas", { body: "Você receberá lembretes de consultas e medicações." });
        }
    }
  };

  // Calculate total unread messages for badge
  const unreadMessagesCount = messages.filter(m => m.receiverId === currentUser.id && !m.read).length;

  // Define navigation items based on Role
  let navItems;

  if (currentUser.role === 'admin') {
     navItems = [
        { id: ViewState.ADMIN_DASHBOARD, label: 'Visão Geral', icon: LayoutDashboard },
        { id: ViewState.ADMIN_CALENDAR, label: 'Agenda Médica', icon: Calendar },
        { id: ViewState.ADMIN_PATIENTS, label: 'Pacientes', icon: Users },
        { id: ViewState.CHAT, label: 'Mensagens', icon: MessageSquare, badge: unreadMessagesCount },
        { id: ViewState.CONTENT, label: 'Gestão de Conteúdo', icon: BookOpen },
     ];
  } else if (currentUser.role === 'nutritionist') {
      navItems = [
        { id: ViewState.NUTRI_DASHBOARD, label: 'Painel Nutricional', icon: LayoutDashboard },
        { id: ViewState.NUTRI_PATIENTS, label: 'Meus Pacientes', icon: Users },
        { id: ViewState.CHAT, label: 'Chat com Pacientes', icon: MessageSquare, badge: unreadMessagesCount },
        { id: ViewState.NUTRI_MEAL_PLANNER, label: 'Planos Alimentares', icon: ChefHat },
      ];
  } else if (currentUser.role === 'trainer') {
      navItems = [
        { id: ViewState.TRAINER_DASHBOARD, label: 'Painel do Treinador', icon: LayoutDashboard },
        { id: ViewState.TRAINER_PATIENTS, label: 'Meus Alunos', icon: Users },
        { id: ViewState.CHAT, label: 'Chat com Alunos', icon: MessageSquare, badge: unreadMessagesCount },
        { id: ViewState.TRAINER_WORKOUT_BUILDER, label: 'Montar Treinos', icon: Dumbbell },
      ];
  } else {
     navItems = [
        { id: ViewState.DASHBOARD, label: 'Painel Geral', icon: LayoutDashboard },
        { id: ViewState.AGENDA, label: 'Minha Agenda', icon: Calendar },
        { id: ViewState.RECORDS, label: 'Prontuário', icon: FileText },
        { id: ViewState.SIX_PS, label: 'Hábitos 7 Ps', icon: Activity },
        { id: ViewState.NUTRITION, label: 'Dieta e Nutrição', icon: Utensils },
        { id: ViewState.WORKOUT, label: 'Treino e Físico', icon: Dumbbell },
        { id: ViewState.MENTORSHIP, label: 'Mentoria & Evolução', icon: Crown },
        { id: ViewState.CHAT, label: 'Fale com o Dr.', icon: MessageSquare, badge: unreadMessagesCount },
        { id: ViewState.CONTENT, label: 'Conteúdo', icon: BookOpen },
     ];
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Sidebar - Desktop - Updated to Brown Theme */}
      <aside className="hidden md:flex md:flex-col w-64 bg-primary-950 text-white shadow-xl z-20 border-r border-primary-900">
        <div className="p-6 border-b border-primary-900 flex items-center justify-center bg-primary-950">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-white font-serif tracking-wider">DR. EDGAR</h1>
            <p className="text-xs text-gold-500 uppercase tracking-widest mt-1 font-medium">Urologia & Performance</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-primary-800 text-white shadow-md border border-primary-700'
                  : 'text-primary-200 hover:bg-primary-900 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                  <item.icon className={`mr-3 h-5 w-5 ${
                    currentView === item.id ? 'text-gold-500' : 'text-primary-400 group-hover:text-gold-500'
                  }`} />
                  {item.label}
              </div>
              {item.badge && item.badge > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                  </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-900 bg-primary-950">
            <div className="flex items-center">
                <div className="relative">
                    <img 
                        src={currentUser.avatarUrl || 'https://via.placeholder.com/150'} 
                        alt="User" 
                        className="h-9 w-9 rounded-full ring-2 ring-primary-700 object-cover"
                    />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-primary-950"></div>
                </div>
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                    <button 
                        onClick={() => signOut()}
                        className="text-xs text-primary-300 hover:text-white flex items-center mt-0.5"
                    >
                        <LogOut className="h-3 w-3 mr-1" /> Sair
                    </button>
                </div>
            </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-primary-950 bg-opacity-90" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-950">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="pt-5 pb-4 px-4">
                <h1 className="text-xl font-bold text-white font-serif">DR. EDGAR</h1>
            </div>
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-md ${
                    currentView === item.id
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-200 hover:bg-primary-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                      <item.icon className="mr-4 h-6 w-6 text-primary-400" />
                      {item.label}
                  </div>
                   {item.badge && item.badge > 0 ? (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                      </span>
                  ) : null}
                </button>
              ))}
            </nav>
             <div className="p-4 border-t border-primary-900">
                <button 
                    onClick={() => signOut()}
                    className="flex w-full items-center text-primary-300 hover:text-white"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sair
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 border-b border-slate-200">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="ml-4 md:ml-0 text-xl font-bold text-primary-900 truncate">
                {navItems.find(i => i.id === currentView)?.label}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             {currentUser.role === 'admin' && (
                <span className="px-3 py-1 bg-gold-50 text-gold-700 text-xs font-bold rounded-full border border-gold-200">
                    MODO MÉDICO
                </span>
             )}
             {currentUser.role === 'nutritionist' && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    NUTRICIONISTA
                </span>
             )}
             {currentUser.role === 'trainer' && (
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
                    PERSONAL TRAINER
                </span>
             )}
            <button 
                onClick={handleNotificationClick}
                className={`p-2 rounded-full transition-colors relative ${
                    notificationStatus === 'granted' 
                    ? 'text-primary-700 hover:bg-primary-50' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={notificationStatus === 'granted' ? 'Notificações Ativas' : 'Ativar Notificações'}
            >
              {notificationStatus === 'granted' ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
              {notificationStatus === 'granted' && <span className="absolute top-2 right-2 h-2 w-2 bg-green-500 rounded-full border border-white"></span>}
              {notificationStatus !== 'granted' && <span className="absolute top-2 right-2 h-2 w-2 bg-slate-300 rounded-full border border-white"></span>}
              
              {/* Global Alert Badge if there are unread messages */}
              {unreadMessagesCount > 0 && (
                   <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-bounce">
                      {unreadMessagesCount}
                   </span>
              )}
            </button>
            <button className="hidden sm:block p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-stone-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
