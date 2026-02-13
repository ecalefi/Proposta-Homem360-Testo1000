
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MoreVertical,
  Utensils,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  ChefHat,
  MessageSquare
} from 'lucide-react';
import Nutrition from './Nutrition'; // Reusing the Nutrition View for viewing patient's plan
import { useData } from '../contexts/DataContext';

const NUTRI_PATIENTS_LIST = [
    { id: 'u1', name: 'Roberto Mendes', plan: 'Hipertrofia com Definição', adherence: 92, status: 'excellent', lastLog: 'Hoje' },
    { id: 'u2', name: 'Carlos Andrade', plan: 'Controle Inflamatório', adherence: 45, status: 'warning', lastLog: '2 dias atrás' },
    { id: 'u3', name: 'André Silva', plan: 'Manutenção', adherence: 78, status: 'good', lastLog: 'Hoje' },
    { id: 'u4', name: 'Felipe Costa', plan: 'Ganho de Peso', adherence: 85, status: 'good', lastLog: 'Ontem' },
];

const NutritionistDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = NUTRI_PATIENTS_LIST.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdherenceColor = (value: number) => {
      if (value >= 90) return 'text-green-600 bg-green-50 border-green-200';
      if (value >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
      return 'text-red-600 bg-red-50 border-red-200';
  };

  // If a patient is selected, show their nutrition plan (ReadOnly/Management Mode)
  if (selectedPatientId) {
      return (
          <div className="space-y-4">
              <button 
                onClick={() => setSelectedPatientId(null)}
                className="flex items-center text-slate-500 hover:text-emerald-700 font-bold mb-4"
              >
                  <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Voltar para Lista de Pacientes
              </button>
              
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-xl font-bold text-emerald-900">
                          {NUTRI_PATIENTS_LIST.find(p => p.id === selectedPatientId)?.name}
                      </h2>
                      <p className="text-sm text-emerald-700">Visualizando plano alimentar e diário.</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-emerald-700 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" /> Enviar Mensagem
                  </button>
              </div>

              {/* Pass the selected patient ID to show their specific plan */}
              <Nutrition patientId={selectedPatientId} />
          </div>
      );
  }

  return (
    <div className="space-y-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Pacientes Ativos</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">24</h3>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Aderência Média</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">78%</h3>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
                <div className="mt-2 text-xs text-green-600 font-bold">+5% essa semana</div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Alertas</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">3</h3>
                    </div>
                    <div className="bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Pacientes sem registro há 3 dias</p>
            </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" /> Meus Pacientes
                </h3>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar paciente..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 bg-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Plano Atual</th>
                            <th className="px-6 py-4">Aderência (7 dias)</th>
                            <th className="px-6 py-4">Último Registro</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-emerald-50/30 transition-colors cursor-pointer" onClick={() => setSelectedPatientId(patient.id)}>
                                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {patient.name.charAt(0)}
                                    </div>
                                    {patient.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{patient.plan}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getAdherenceColor(patient.adherence)}`}>
                                        {patient.adherence}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{patient.lastLog}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredPatients.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <Utensils className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhum paciente encontrado.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default NutritionistDashboard;
