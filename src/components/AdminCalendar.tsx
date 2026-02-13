
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  MoreVertical, 
  Plus, 
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Appointment } from '../types';

const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const AdminCalendar: React.FC = () => {
  const { appointments } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const isSameDay = (d1: Date, d2: Date) => {
      return d1.getDate() === d2.getDate() && 
             d1.getMonth() === d2.getMonth() && 
             d1.getFullYear() === d2.getFullYear();
  };

  // Helper to format date for comparison with mock data strings (DD/MM/YYYY)
  const formatDateStr = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getAppointmentsForDate = (date: Date) => {
      const dateStr = formatDateStr(date);
      // Logic handles "Hoje" for demo purposes if selected date is actual today
      const isToday = isSameDay(date, new Date());
      return appointments.filter(apt => 
          apt.date === dateStr || (isToday && apt.date === 'Hoje')
      );
  };

  const selectedAppointments = getAppointmentsForDate(selectedDate);

  // Render Calendar Grid
  const renderCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      // Empty slots for previous month
      for (let i = 0; i < firstDay; i++) {
          days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
      }

      // Days
      for (let i = 1; i <= daysInMonth; i++) {
          const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
          const isSelected = isSameDay(dayDate, selectedDate);
          const isToday = isSameDay(dayDate, new Date());
          const hasApts = getAppointmentsForDate(dayDate).length > 0;

          days.push(
              <button 
                key={i} 
                onClick={() => setSelectedDate(dayDate)}
                className={`h-10 w-10 rounded-full flex flex-col items-center justify-center text-sm font-medium relative transition-all ${
                    isSelected 
                    ? 'bg-primary-900 text-white shadow-md' 
                    : isToday 
                        ? 'bg-primary-100 text-primary-900 font-bold' 
                        : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                  {i}
                  {hasApts && !isSelected && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold-500"></span>
                  )}
              </button>
          );
      }
      return days;
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'confirmado': return 'bg-green-100 text-green-700 border-green-200';
          case 'pendente': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-900">Agenda Médica</h2>
            <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                    Sincronizar Google
                </button>
                <button className="px-4 py-2 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors shadow-sm flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Novo Agendamento
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
            
            {/* Left Panel: Calendar Picker */}
            <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="h-5 w-5 text-slate-500"/></button>
                    <span className="font-bold text-slate-900 uppercase text-sm tracking-wide">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="h-5 w-5 text-slate-500"/></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                        <div key={d} className="text-xs font-bold text-slate-400 h-8 flex items-center justify-center">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 flex-1 content-start">
                    {renderCalendarDays()}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Legenda</h4>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Confirmado
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span> Pendente
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-primary-900 mr-2"></span> Dia Selecionado
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Day Schedule */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-primary-900">
                            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                        </h3>
                        <p className="text-sm text-slate-500">{selectedAppointments.length} agendamentos</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded border border-slate-200 text-xs font-bold text-slate-500">
                        Dr. Edgar Sarmento
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {TIME_SLOTS.map((time) => {
                            // Find appointment for this slot
                            const apt = selectedAppointments.find(a => a.time === time);
                            
                            return (
                                <div key={time} className="flex gap-4 group">
                                    <div className="w-16 text-right pt-2">
                                        <span className="text-sm font-bold text-slate-400">{time}</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        {/* Timeline Line */}
                                        <div className="absolute left-[-21px] top-0 bottom-0 w-px bg-slate-100 group-last:bottom-auto group-last:h-4"></div>
                                        <div className="absolute left-[-24px] top-3 w-1.5 h-1.5 rounded-full bg-slate-300"></div>

                                        {apt ? (
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold border border-primary-100">
                                                            {apt.patientName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{apt.patientName}</h4>
                                                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                                <Clock className="h-3 w-3 mr-1" /> {apt.type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(apt.status)}`}>
                                                            {apt.status}
                                                        </span>
                                                        <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-4 w-4"/></button>
                                                    </div>
                                                </div>
                                                {apt.notes && (
                                                    <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        📝 {apt.notes}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-14 border-2 border-dashed border-slate-100 rounded-xl flex items-center px-4 hover:border-primary-200 hover:bg-primary-50/50 transition-colors cursor-pointer group/slot">
                                                <span className="text-sm font-medium text-slate-300 group-hover/slot:text-primary-400 flex items-center">
                                                    <Plus className="h-4 w-4 mr-2" /> Disponível
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminCalendar;
