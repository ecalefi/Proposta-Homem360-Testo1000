
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Droplet, 
  Dumbbell, 
  Moon, 
  ArrowUpRight, 
  CalendarClock,
  TrendingUp,
  AlertCircle,
  Activity,
  Pill,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  X,
  Bell,
  Megaphone,
  ChevronRight
} from 'lucide-react';
import { DashboardMetrics, HabitLog, Appointment, Medication } from '../types';
import { QUOTES } from '../constants';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { requestNotificationPermission, getPermissionStatus } from '../lib/notifications';

interface DashboardProps {
  metrics: DashboardMetrics;
  todayHabits: HabitLog;
  nextAppointment?: Appointment;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, todayHabits, nextAppointment, userName }) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  
  const { user } = useAuth();
  const { medications, toggleMedication, addMedication, removeMedication, messages, markAsRead } = useData();
  
  // Modal State for New Medication
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('');

  // Find latest unread broadcast/admin message
  const adminAnnouncement = user ? messages.filter(m => 
    m.senderId === 'admin-1' && 
    m.receiverId === user.id && 
    !m.read
  ).pop() : undefined;

  const handleAddMedication = async () => {
    if (!newMedName || !newMedDosage || !newMedTime) return;

    // Create Medication Object
    const newMed: Medication = {
        id: Date.now().toString(),
        name: newMedName,
        dosage: newMedDosage,
        time: newMedTime,
        taken: false
    };

    addMedication(newMed);

    // UX: Check Notification Permissions
    const status = getPermissionStatus();
    if (status !== 'granted') {
        const granted = await requestNotificationPermission();
        if (granted) {
            new Notification("Lembretes Ativados", { 
                body: `Você será avisado às ${newMedTime} para tomar ${newMedName}.` 
            });
        }
    }

    // Reset Form
    setNewMedName('');
    setNewMedDosage('');
    setNewMedTime('');
    setIsMedModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ANNOUNCEMENT BANNER (Mensagens do Médico/Admin) */}
      {adminAnnouncement && (
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fade-in group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            
            <div className="relative z-10 flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm shrink-0 border border-white/10">
                    <Megaphone className="h-6 w-6 text-gold-500" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-1 flex items-center">
                            Comunicado Oficial <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        </h3>
                        <button 
                            onClick={() => user && markAsRead('admin-1', user.id)}
                            className="text-primary-300 hover:text-white transition-colors"
                            title="Marcar como lido"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-primary-50 text-base font-medium leading-relaxed mt-1">
                        "{adminAnnouncement.content}"
                    </p>
                    <div className="flex justify-between items-end mt-3">
                        <span className="text-[10px] text-primary-300">Enviado em: {adminAnnouncement.timestamp}</span>
                        <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center">
                            Responder <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-gold-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-primary-900">Bem-vindo, {userName}</h2>
                <p className="text-slate-600 mt-1 italic font-medium">"{quote}"</p>
            </div>
            {nextAppointment ? (
                <div className="bg-primary-50 rounded-xl p-4 flex items-start space-x-3 border border-primary-100">
                    <div className="bg-white p-2 rounded-lg border border-primary-100 shadow-sm">
                        <CalendarClock className="h-6 w-6 text-primary-700" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">Próxima Consulta</p>
                        <p className="text-sm font-bold text-primary-900">{nextAppointment.date} às {nextAppointment.time}</p>
                        <p className="text-xs text-slate-600 font-medium">{nextAppointment.type}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-xl p-4 flex items-center space-x-2 text-slate-500">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">Nenhuma consulta agendada.</span>
                </div>
            )}
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Testosterone */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Testosterona Total</p>
                    <h3 className="text-2xl font-bold text-primary-900 mt-1">750 <span className="text-sm font-normal text-slate-500">ng/dL</span></h3>
                </div>
                <div className="bg-green-50 p-2 rounded-full border border-green-100">
                    <TrendingUp className="h-5 w-5 text-green-700" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-700 font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12% vs. último exame</span>
            </div>
        </div>

         {/* Weight/IMC */}
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Peso Atual</p>
                    <h3 className="text-2xl font-bold text-primary-900 mt-1">86.0 <span className="text-sm font-normal text-slate-500">kg</span></h3>
                </div>
                <div className="bg-slate-50 p-2 rounded-full border border-slate-100">
                    <Activity className="h-5 w-5 text-slate-600" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-700 font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
                <span>-3kg esse mês</span>
            </div>
        </div>

        {/* Sleep Score */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Score de Sono</p>
                    <h3 className="text-2xl font-bold text-primary-900 mt-1">{metrics.sleepScore} <span className="text-sm font-normal text-slate-500">/ 100</span></h3>
                </div>
                <div className="bg-indigo-50 p-2 rounded-full border border-indigo-100">
                    <Moon className="h-5 w-5 text-indigo-700" />
                </div>
            </div>
            <div className="mt-4 w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${metrics.sleepScore}%` }}></div>
            </div>
        </div>

        {/* IIEF-5 Score (Simplified) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Score Função Erétil</p>
                    <h3 className="text-2xl font-bold text-primary-900 mt-1">{metrics.erectileScore} <span className="text-sm font-normal text-slate-500">/ 25</span></h3>
                </div>
                <div className="bg-gold-50 p-2 rounded-full border border-gold-100">
                    <Activity className="h-5 w-5 text-gold-600" />
                </div>
            </div>
            <div className="mt-4 text-xs font-medium text-slate-600">
                Nível: <span className="text-green-700 font-bold">Saudável</span>
            </div>
        </div>
      </div>

      {/* Charts & Habits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary-900">Evolução Hormonal</h3>
                <select className="text-sm border-slate-300 rounded-lg text-slate-600 bg-white py-1 px-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                    <option>Últimos 6 meses</option>
                    <option>Último Ano</option>
                </select>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.testosterone}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} 
                            dy={10}
                        />
                        <YAxis 
                            yAxisId="left"
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} 
                            domain={[300, 1000]}
                            label={{ value: 'Total (ng/dL)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
                        />
                         <YAxis 
                            yAxisId="right"
                            orientation="right"
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#d97706', fontSize: 12, fontWeight: 500}} 
                            domain={[0, 25]}
                            label={{ value: 'Livre (ng/dL)', angle: 90, position: 'insideRight', fill: '#d97706', fontSize: 10 }}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Line 
                            yAxisId="left"
                            name="Testo Total"
                            type="monotone" 
                            dataKey="value" 
                            stroke="#6f4333" 
                            strokeWidth={3} 
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6f4333' }}
                            activeDot={{ r: 6, fill: '#6f4333' }}
                        />
                        <Line 
                            yAxisId="right"
                            name="Testo Livre"
                            type="monotone" 
                            dataKey="secondaryValue" 
                            stroke="#d97706" 
                            strokeWidth={2} 
                            strokeDasharray="5 5"
                            dot={{ r: 3, strokeWidth: 2, fill: '#fff', stroke: '#d97706' }}
                            activeDot={{ r: 5, fill: '#d97706' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* Medications List */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary-900 flex items-center">
                        <Pill className="h-5 w-5 mr-2 text-primary-600" />
                        Medicações & Lembretes
                    </h3>
                    <button 
                        onClick={() => setIsMedModalOpen(true)}
                        className="p-2 bg-primary-50 rounded-lg text-primary-700 hover:bg-primary-100 transition-colors flex items-center text-xs font-bold"
                    >
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </button>
                 </div>

                 {medications.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Nenhum lembrete configurado.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {medications.map(med => (
                            <div key={med.id} className={`group relative p-4 rounded-xl border transition-all ${med.taken ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm'}`}>
                                {/* Delete Button */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeMedication(med.id);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remover medicação"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>

                                <div onClick={() => toggleMedication(med.id)} className="cursor-pointer flex items-center justify-between pr-6">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full mr-3 ${med.taken ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            <Pill className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${med.taken ? 'text-green-800' : 'text-slate-800'}`}>{med.name}</p>
                                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                <span>{med.dosage}</span>
                                                <span className="mx-1">•</span>
                                                <span className="flex items-center text-primary-600 font-medium bg-primary-50 px-1.5 py-0.5 rounded">
                                                    <Bell className="h-3 w-3 mr-1" /> {med.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {med.taken ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Circle className="h-6 w-6 text-slate-300" />}
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>

        {/* Daily Habits Quick View (The 6Ps Snapshot) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-primary-900 mb-4">Metas de Hoje (6 Ps)</h3>
            <div className="space-y-5">
                {/* Water */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="flex items-center text-sm font-bold text-slate-700">
                            <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                            Hidratação
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{todayHabits.waterIntake} / {todayHabits.waterTarget} ml</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((todayHabits.waterIntake / todayHabits.waterTarget) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Training */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center">
                        <div className={`p-2 rounded-full ${todayHabits.workoutCompleted ? 'bg-green-100' : 'bg-white border border-slate-200'}`}>
                            <Dumbbell className={`h-4 w-4 ${todayHabits.workoutCompleted ? 'text-green-700' : 'text-slate-500'}`} />
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-700">Treino do dia</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${todayHabits.workoutCompleted ? 'text-green-700 bg-green-100' : 'text-slate-500 bg-slate-200'}`}>
                        {todayHabits.workoutCompleted ? 'FEITO' : 'PENDENTE'}
                    </span>
                </div>

                {/* Sleep */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-indigo-50 border border-indigo-100">
                            <Moon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-700">Sono</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{todayHabits.sleepHours}h</span>
                </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-primary-900 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors shadow-sm">
                Registrar Diário Completo
            </button>
        </div>
      </div>

      {/* Medication Modal */}
      {isMedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/80 p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white shadow-sm text-primary-600">
                              <Bell className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">Novo Lembrete</h3>
                            <p className="text-xs text-slate-500">Adicione uma medicação à sua rotina</p>
                          </div>
                      </div>
                      <button onClick={() => setIsMedModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full hover:bg-slate-100 transition-colors">
                          <X className="h-5 w-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Medicação</label>
                          <input 
                              type="text" 
                              placeholder="Ex: Tadalafila, Vitamina D..." 
                              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              value={newMedName}
                              onChange={(e) => setNewMedName(e.target.value)}
                              autoFocus
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Dosagem</label>
                            <input 
                                type="text" 
                                placeholder="Ex: 5mg" 
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={newMedDosage}
                                onChange={(e) => setNewMedDosage(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Horário do Lembrete</label>
                            <input 
                                type="time" 
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900"
                                value={newMedTime}
                                onChange={(e) => setNewMedTime(e.target.value)}
                            />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2 mb-4">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800 leading-snug">
                                Ao salvar, você receberá uma notificação no dispositivo no horário programado.
                            </p>
                        </div>
                        <button 
                            onClick={handleAddMedication}
                            disabled={!newMedName || !newMedTime}
                            className="w-full bg-primary-900 text-white font-bold py-3 rounded-xl hover:bg-primary-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Bell className="h-4 w-4 mr-2" /> Salvar e Ativar Alerta
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
