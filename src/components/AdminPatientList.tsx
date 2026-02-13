import React, { useState } from 'react';
import { Search, User, ChevronRight, Activity, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface AdminPatientListProps {
  onSelectPatient: (patientId: string) => void;
}

// Lista rica para o MVP - IDs devem bater com o DataContext
const PATIENTS_LIST = [
    { id: 'u1', name: 'Roberto Mendes', age: 42, condition: 'TRT + Performance', status: 'active', lastVisit: '18/01/2026', alert: false },
    { id: 'u2', name: 'Carlos Andrade', age: 55, condition: 'Investigação PSA (Suspeita CA)', status: 'warning', lastVisit: '15/01/2026', alert: true },
    { id: 'u3', name: 'André Silva', age: 38, condition: 'Pós-Op Vasectomia', status: 'surgery', lastVisit: '10/01/2026', alert: false },
    { id: 'u4', name: 'Felipe Costa', age: 29, condition: 'Disfunção Erétil / Libido', status: 'new', lastVisit: '08/01/2026', alert: false },
    { id: 'u5', name: 'Marcos Vinícius', age: 61, condition: 'Andropausa Tardia', status: 'late', lastVisit: '10/11/2025', alert: true },
    { id: 'u6', name: 'João Victor', age: 24, condition: 'Check-up Preventivo', status: 'active', lastVisit: '20/01/2026', alert: false },
    { id: 'u7', name: 'Ricardo Souza', age: 45, condition: 'Litíase Renal (Pedra)', status: 'warning', lastVisit: '05/01/2026', alert: false },
];

const AdminPatientList: React.FC<AdminPatientListProps> = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = PATIENTS_LIST.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (patient: any) => {
    if (patient.alert) {
        return (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" /> Crítico
            </span>
        );
    }
    if (patient.status === 'surgery') {
        return (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-blue-200">
                <Activity className="h-3 w-3 mr-1" /> Pós-Cirúrgico
            </span>
        );
    }
    if (patient.status === 'late') {
        return (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-amber-200">
                <Clock className="h-3 w-3 mr-1" /> Atrasado
            </span>
        );
    }
    return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Em dia
        </span>
    );
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-900">Gestão de Pacientes</h2>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium shadow-sm flex items-center">
                <User className="h-4 w-4 mr-2" /> Novo Paciente
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-stone-50 flex items-center justify-between">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, condição ou CPF..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    />
                </div>
                <div className="text-xs text-slate-500 hidden md:block">
                    Mostrando <strong>{filteredPatients.length}</strong> pacientes
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {filteredPatients.map(patient => (
                    <div 
                        key={patient.id} 
                        onClick={() => onSelectPatient(patient.id)}
                        className="p-4 hover:bg-primary-50 transition-colors cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm ${
                                patient.alert ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'
                            }`}>
                                {patient.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-primary-900 group-hover:text-primary-700 text-base">{patient.name}</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{patient.age} anos • {patient.condition}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Última Visita</span>
                                <span className="text-sm font-bold text-slate-700">{patient.lastVisit}</span>
                            </div>
                            
                            <div className="min-w-[100px] flex justify-end">
                                {getStatusBadge(patient)}
                            </div>

                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary-600 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredPatients.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <div className="bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="font-medium">Nenhum paciente encontrado.</p>
                    <p className="text-sm">Tente buscar por outro termo.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AdminPatientList;