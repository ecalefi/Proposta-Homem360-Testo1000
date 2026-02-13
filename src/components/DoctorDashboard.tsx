
import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  Search, 
  Clock,
  MoreVertical,
  FileText,
  Megaphone,
  X,
  Send
} from 'lucide-react';
import { Appointment } from '../types';
import { useData } from '../contexts/DataContext';

const RECENT_PATIENTS = [
    { id: '1', name: 'Roberto Mendes', status: 'Em Tratamento', alert: false, lastVisit: '18/01/2026', condition: 'TRT + Acompanhamento' },
    { id: '2', name: 'Carlos Andrade', status: 'Risco Elevado', alert: true, lastVisit: '15/01/2026', condition: 'PSA Elevado (4.5)' },
    { id: '3', name: 'André Silva', status: 'Alta Recente', alert: false, lastVisit: '10/01/2026', condition: 'Pós-Vasectomia' },
    { id: '4', name: 'Felipe Costa', status: 'Investigação', alert: false, lastVisit: '08/01/2026', condition: 'Baixa Libido' },
    { id: '5', name: 'Marcos Vinícius', status: 'Em Atraso', alert: true, lastVisit: '10/11/2025', condition: 'Reposição Hormonal' },
];

const TODAY_APPOINTMENTS: Appointment[] = [
    { id: 'a1', patientName: 'João Victor', date: 'Hoje', time: '09:00', type: 'Consulta Presencial', status: 'confirmado' },
    { id: 'a2', patientName: 'Ricardo Souza', date: 'Hoje', time: '10:30', type: 'Retorno', status: 'confirmado' },
    { id: 'a0', patientName: 'Roberto Mendes', date: 'Hoje', time: '14:30', type: 'Consulta Presencial', status: 'confirmado' }, // Match patient data
    { id: 'a3', patientName: 'Matheus Oliveira', date: 'Hoje', time: '16:00', type: 'Retorno', status: 'pendente' },
];

const DoctorDashboard: React.FC = () => {
  const { sendBroadcast } = useData();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    setSending(true);
    // Simulate API delay
    setTimeout(() => {
        sendBroadcast(broadcastMessage);
        setSending(false);
        setIsBroadcastOpen(false);
        setBroadcastMessage('');
        alert('Mensagem enviada para todos os pacientes com sucesso!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end">
          <button 
            onClick={() => setIsBroadcastOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg shadow-sm font-bold transition-colors"
          >
              <Megaphone className="h-4 w-4" />
              Novo Comunicado Geral
          </button>
      </div>

      {/* Admin Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-primary-900 text-white p-5 rounded-2xl shadow-lg border border-primary-800">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-primary-200 uppercase">Total Pacientes</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">1,248</h3>
                </div>
                <div className="bg-primary-800 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-gold-500" />
                </div>
            </div>
            <p className="text-xs text-primary-300 mt-4">+12 novos este mês (Jan/26)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Consultas Hoje</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{TODAY_APPOINTMENTS.length}</h3>
                </div>
                <div className="bg-primary-50 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-700" />
                </div>
            </div>
            <p className="text-xs text-primary-700 mt-4 font-medium">Próxima em 30 min</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Alertas Médicos</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">5</h3>
                </div>
                <div className="bg-red-50 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
            </div>
            <p className="text-xs text-red-600 mt-4 font-medium">3 PSA Elevado, 2 Aderência Baixa</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Receita (Jan)</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">R$ 52k</h3>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                </div>
            </div>
            <p className="text-xs text-green-600 mt-4 font-medium">105% da meta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Section: Patient List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-primary-900">Pacientes Recentes</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar paciente..." 
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 text-slate-700 bg-white"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Paciente</th>
                            <th className="px-6 py-4">Condição</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Última Visita</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {RECENT_PATIENTS.map((patient) => (
                            <tr key={patient.id} className="hover:bg-primary-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                        {patient.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {patient.name}
                                </td>
                                <td className="px-6 py-4">{patient.condition}</td>
                                <td className="px-6 py-4">
                                    {patient.alert ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex w-fit items-center border border-red-200">
                                            <AlertTriangle className="h-3 w-3 mr-1" /> Alerta
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                            Normal
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">{patient.lastVisit}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-primary-600">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100 text-center bg-slate-50">
                <button className="text-sm font-bold text-primary-700 hover:text-primary-800 uppercase tracking-wide">Ver lista completa</button>
            </div>
        </div>

        {/* Sidebar: Agenda do Dia */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                <h3 className="text-lg font-bold text-primary-900">Agenda de Hoje <span className="text-sm font-normal text-slate-500 ml-1">(18/01)</span></h3>
            </div>
            <div className="flex-1 p-4 space-y-4">
                {TODAY_APPOINTMENTS.map((apt) => (
                    <div key={apt.id} className="flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-primary-400 hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex-shrink-0 w-14 text-center">
                            <span className="block text-sm font-bold text-primary-900 group-hover:text-primary-700">{apt.time}</span>
                            <span className="block text-xs text-slate-500">AM</span>
                        </div>
                        <div className="ml-3 flex-1 border-l-2 border-primary-200 pl-3 group-hover:border-primary-500">
                            <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                            <p className="text-xs text-slate-500 mt-1">{apt.type}</p>
                            <div className="flex gap-2 mt-2">
                                <button className="p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-500 hover:text-primary-700 hover:border-primary-300 hover:bg-white" title="Ver Prontuário">
                                    <FileText className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-500 hover:text-green-700 hover:border-green-300 hover:bg-white" title="Confirmar">
                                    <Clock className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="p-4 border-t border-slate-100">
                <button className="w-full py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors shadow-sm">
                    Gerenciar Agenda Completa
                </button>
            </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/80 p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                              <Megaphone className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">Comunicado Geral</h3>
                            <p className="text-xs text-slate-500">Enviar mensagem para todos os pacientes</p>
                          </div>
                      </div>
                      <button onClick={() => setIsBroadcastOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full hover:bg-slate-100 transition-colors">
                          <X className="h-5 w-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-sm text-amber-800">
                         <AlertTriangle className="h-5 w-5 shrink-0" />
                         <p>Esta ação enviará uma notificação push e uma mensagem no chat para <strong>todos</strong> os 1.248 pacientes cadastrados.</p>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem do Comunicado</label>
                          <textarea 
                              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px]"
                              placeholder="Digite aqui o aviso sobre horários, feriados ou informações importantes..."
                              value={broadcastMessage}
                              onChange={(e) => setBroadcastMessage(e.target.value)}
                          ></textarea>
                      </div>
                      
                      <div className="pt-2 flex gap-3">
                        <button 
                            onClick={() => setIsBroadcastOpen(false)}
                            className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSendBroadcast}
                            disabled={!broadcastMessage.trim() || sending}
                            className="flex-1 bg-primary-900 text-white font-bold py-3 rounded-xl hover:bg-primary-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {sending ? 'Enviando...' : <><Send className="h-4 w-4 mr-2" /> Enviar Agora</>}
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
