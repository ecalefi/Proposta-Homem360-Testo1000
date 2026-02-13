
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Dumbbell, 
  ChevronRight,
  TrendingUp,
  Activity,
  MessageSquare,
  Trophy
} from 'lucide-react';
import Workout from './Workout'; // Reusing Workout component for Trainer view
import { useData } from '../contexts/DataContext';

const TRAINER_PATIENTS_LIST = [
    { id: 'u1', name: 'Roberto Mendes', goal: 'Hipertrofia', frequency: '4x/sem', status: 'consistent', lastCheck: 'Ontem' },
    { id: 'u2', name: 'Carlos Andrade', goal: 'Mobilidade/Saúde', frequency: '2x/sem', status: 'warning', lastCheck: '3 dias atrás' },
    { id: 'u3', name: 'André Silva', goal: 'Recuperação', frequency: '3x/sem', status: 'consistent', lastCheck: 'Hoje' },
    { id: 'u4', name: 'Felipe Costa', goal: 'Emagrecimento', frequency: '5x/sem', status: 'consistent', lastCheck: 'Ontem' },
];

const TrainerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredPatients = TRAINER_PATIENTS_LIST.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
      if (status === 'consistent') return 'text-green-600 bg-green-50 border-green-200';
      if (status === 'warning') return 'text-orange-600 bg-orange-50 border-orange-200';
      return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  // If a patient is selected, show their workout plan (ReadOnly/Management Mode)
  if (selectedPatientId) {
      return (
          <div className="space-y-4">
              <button 
                onClick={() => setSelectedPatientId(null)}
                className="flex items-center text-slate-500 hover:text-orange-700 font-bold mb-4"
              >
                  <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Voltar para Lista de Alunos
              </button>
              
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-xl font-bold text-orange-900">
                          {TRAINER_PATIENTS_LIST.find(p => p.id === selectedPatientId)?.name}
                      </h2>
                      <p className="text-sm text-orange-700">Visualizando rotina de treinos.</p>
                  </div>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-orange-700 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" /> Enviar Mensagem
                  </button>
              </div>

              {/* Pass the selected patient ID to show their specific workout */}
              <Workout patientId={selectedPatientId} />
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
                        <p className="text-xs font-semibold text-slate-500 uppercase">Alunos Ativos</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">18</h3>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-orange-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Frequência Semanal</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">3.5<span className="text-sm text-slate-400 font-normal"> dias</span></h3>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
                <div className="mt-2 text-xs text-green-600 font-bold">Alta consistência</div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Evolução de Carga</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">+15%</h3>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Média do grupo no último mês</p>
            </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
                <h3 className="text-lg font-bold text-orange-900 flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2" /> Meus Alunos
                </h3>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar aluno..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 bg-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Objetivo</th>
                            <th className="px-6 py-4">Frequência</th>
                            <th className="px-6 py-4">Última Atividade</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-orange-50/30 transition-colors cursor-pointer" onClick={() => setSelectedPatientId(patient.id)}>
                                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {patient.name.charAt(0)}
                                    </div>
                                    {patient.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 flex items-center">
                                    <Trophy className="h-3 w-3 mr-1 text-orange-500" />
                                    {patient.goal}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getStatusColor(patient.status)}`}>
                                        {patient.frequency}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{patient.lastCheck}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-orange-600 p-2 rounded-full hover:bg-orange-50">
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
                    <Dumbbell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhum aluno encontrado.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default TrainerDashboard;
