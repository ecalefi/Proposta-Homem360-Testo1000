
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';
import NutritionistDashboard from './components/NutritionistDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import TrainerWorkoutBuilder from './components/TrainerWorkoutBuilder'; 
import AdminPatientList from './components/AdminPatientList';
import AdminPatientDetail from './components/AdminPatientDetail';
import AdminContent from './components/AdminContent';
import AdminCalendar from './components/AdminCalendar'; // New Import
import SixPs from './components/SixPs';
import Agenda from './components/Agenda';
import Chat from './components/Chat';
import PatientContent from './components/PatientContent';
import PatientRecords from './components/PatientRecords';
import Login from './components/Login';
import LandingPage from './components/LandingPage'; 
import NotificationManager from './components/NotificationManager'; 
import Nutrition from './components/Nutrition';
import Workout from './components/Workout';
import Mentorship from './components/Mentorship';

import { ViewState } from './types';
import { MOCK_METRICS, INITIAL_HABITS, UPCOMING_APPOINTMENTS } from './constants';
import { FileText, MessageSquare, BookOpen, ChefHat, Dumbbell } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

const PlaceholderView: React.FC<{title: string, icon: any, description: string}> = ({ title, icon: Icon, description }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
            <Icon className="h-16 w-16 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-2 max-w-md">{description}</p>
        <button className="mt-8 px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
            Voltar ao Início
        </button>
    </div>
);

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (user) {
        if (user.role === 'admin') {
            setCurrentView(ViewState.ADMIN_DASHBOARD);
        } else if (user.role === 'nutritionist') {
            setCurrentView(ViewState.NUTRI_DASHBOARD);
        } else if (user.role === 'trainer') {
            setCurrentView(ViewState.TRAINER_DASHBOARD);
        } else {
            setCurrentView(ViewState.DASHBOARD);
        }
    }
  }, [user]);

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-stone-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );
  }

  if (!user) {
    if (showLogin) {
        return <Login onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onEnter={() => setShowLogin(true)} />;
  }

  if (user.role === 'patient') {
    const renderPatientContent = () => {
        switch (currentView) {
          case ViewState.DASHBOARD:
            return (
              <Dashboard 
                metrics={MOCK_METRICS} 
                todayHabits={INITIAL_HABITS}
                nextAppointment={UPCOMING_APPOINTMENTS[0]}
                userName={user.name.split(' ')[0]}
              />
            );
          case ViewState.SIX_PS:
            return <SixPs initialHabits={INITIAL_HABITS} />;
          case ViewState.AGENDA:
            return <Agenda />;
          case ViewState.RECORDS:
            return <PatientRecords />;
          case ViewState.CHAT:
            return <Chat />;
          case ViewState.CONTENT:
            return <PatientContent />;
          case ViewState.NUTRITION:
            return <Nutrition />;
          case ViewState.WORKOUT:
            return <Workout />;
          case ViewState.MENTORSHIP:
            return <Mentorship />;
          default:
            return <Dashboard metrics={MOCK_METRICS} todayHabits={INITIAL_HABITS} nextAppointment={UPCOMING_APPOINTMENTS[0]} userName={user.name.split(' ')[0]} />;
        }
    };

    return (
        <Layout currentUser={user} currentView={currentView} onChangeView={setCurrentView}>
            <NotificationManager /> 
            {renderPatientContent()}
        </Layout>
    );
  }

  if (user.role === 'nutritionist') {
     const renderNutriContent = () => {
         switch (currentView) {
             case ViewState.NUTRI_DASHBOARD:
                 return <NutritionistDashboard />;
             case ViewState.NUTRI_PATIENTS:
                 return <NutritionistDashboard />; 
             case ViewState.NUTRI_MEAL_PLANNER:
                 return <PlaceholderView title="Editor de Planos" icon={ChefHat} description="Ferramenta para criar e editar dietas." />;
             case ViewState.CHAT:
                 return <Chat />;
             default:
                 return <NutritionistDashboard />;
         }
     };

     return (
        <Layout currentUser={user} currentView={currentView} onChangeView={setCurrentView}>
            {renderNutriContent()}
        </Layout>
     );
  }

  if (user.role === 'trainer') {
    const renderTrainerContent = () => {
        switch (currentView) {
            case ViewState.TRAINER_DASHBOARD:
                return <TrainerDashboard />;
            case ViewState.TRAINER_PATIENTS:
                return <TrainerDashboard />; 
            case ViewState.TRAINER_WORKOUT_BUILDER:
                return <TrainerWorkoutBuilder />; // Integrated
            case ViewState.CHAT:
                return <Chat />;
            default:
                return <TrainerDashboard />;
        }
    };

    return (
       <Layout currentUser={user} currentView={currentView} onChangeView={setCurrentView}>
           {renderTrainerContent()}
       </Layout>
    );
 }

  if (user.role === 'admin') {
     const renderAdminContent = () => {
        switch (currentView) {
            case ViewState.ADMIN_DASHBOARD:
                return <DoctorDashboard />;
            case ViewState.ADMIN_PATIENTS:
                return <AdminPatientList onSelectPatient={(id) => {
                    setSelectedPatientId(id);
                    setCurrentView(ViewState.ADMIN_PATIENT_DETAIL);
                }} />;
            case ViewState.ADMIN_PATIENT_DETAIL:
                if (!selectedPatientId) return <AdminPatientList onSelectPatient={() => {}} />;
                return <AdminPatientDetail patientId={selectedPatientId} onBack={() => setCurrentView(ViewState.ADMIN_PATIENTS)} />;
            case ViewState.CONTENT:
                return <AdminContent />;
            case ViewState.ADMIN_CALENDAR:
                 return <AdminCalendar />;
            case ViewState.CHAT:
                 return <Chat />;
            default:
                return <DoctorDashboard />;
        }
     };

     return (
        <Layout currentUser={user} currentView={currentView} onChangeView={setCurrentView}>
            {renderAdminContent()}
        </Layout>
     );
  }

  return <div>Role not recognized</div>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
