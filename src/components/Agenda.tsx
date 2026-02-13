
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { UPCOMING_APPOINTMENTS } from '../constants';

const Agenda: React.FC = () => {
    // Helper to get abbreviated month name
    const getMonthName = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        const monthNum = parseInt(month, 10);
        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        return months[monthNum - 1] || '';
    };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-900">Minha Agenda</h2>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 font-medium text-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary-900">
                + Novo Agendamento
            </button>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-bold text-primary-950">Próximos Compromissos</h3>
            </div>
            <div className="divide-y divide-slate-200">
                {UPCOMING_APPOINTMENTS.map((apt) => (
                    <div key={apt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-stone-50 transition-colors">
                        <div className="flex items-start space-x-4">
                            {/* High Contrast Date Box */}
                            <div className="bg-primary-50 text-primary-900 border-2 border-primary-200 p-3 rounded-xl flex flex-col items-center justify-center w-16 h-16 shadow-sm">
                                <span className="text-xs font-black uppercase tracking-wider">{getMonthName(apt.date)}</span>
                                <span className="text-2xl font-black">{apt.date.split('/')[0]}</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900">{apt.type}</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center text-slate-700 font-medium text-sm mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
                                    <span className="flex items-center"><Clock className="h-5 w-5 mr-1.5 text-primary-700"/> {apt.time}</span>
                                    <span className="flex items-center">
                                        <MapPin className="h-5 w-5 mr-1.5 text-primary-700"/>
                                        Clínica Dr. Edgar - Brasília
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-3">
                             {apt.status === 'confirmado' ? (
                                <span className="px-4 py-1.5 bg-green-100 text-green-900 rounded-full text-xs font-bold uppercase tracking-wide border-2 border-green-300 shadow-sm">Confirmado</span>
                             ) : (
                                <span className="px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wide border-2 border-amber-300 shadow-sm">Pendente</span>
                             )}
                             <button className="text-sm text-slate-600 hover:text-primary-800 font-bold px-3 py-1 underline decoration-2 decoration-transparent hover:decoration-primary-800 transition-all">Detalhes</button>
                        </div>
                    </div>
                ))}
            </div>
            {UPCOMING_APPOINTMENTS.length === 0 && (
                <div className="p-12 text-center text-slate-600">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                    <p className="font-medium text-lg">Nenhum agendamento futuro.</p>
                    <p className="text-sm mt-1">Utilize o botão acima para marcar uma nova consulta.</p>
                </div>
            )}
       </div>
    </div>
  );
};

export default Agenda;
