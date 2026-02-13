
import React, { useState } from 'react';
import { FileText, User, Activity, Download, Calendar, Pill, FileCheck, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

type TabType = 'records' | 'exams';

const PatientRecords: React.FC = () => {
  const { user } = useAuth();
  const { getRecordsByPatient, getExamsByPatient } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('records');

  if (!user) return null;

  const records = getRecordsByPatient(user.id);
  const exams = getExamsByPatient(user.id);

  const renderRecords = () => (
    <div className="space-y-6">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
            {records.map((rec) => (
                <div key={rec.id} className="relative pl-8 animate-fade-in">
                    <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-primary-100 border-2 border-primary-600"></div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                            <div>
                                <h5 className="font-bold text-primary-950 text-lg">{rec.title}</h5>
                                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1.5 uppercase tracking-wide border ${
                                    rec.type === 'prescricao' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                    rec.type === 'anamnese' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                    {rec.type}
                                </span>
                            </div>
                            <span className="text-sm text-slate-700 font-bold flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                                {rec.date}
                            </span>
                        </div>
                        
                        {/* Content Area - Improved Typography & Contrast */}
                        <div className="py-2">
                            <p className="text-slate-900 text-base leading-7 whitespace-pre-line font-normal tracking-normal">
                                {rec.content}
                            </p>
                        </div>

                        <div className="flex items-center mt-5 pt-4 border-t border-slate-100">
                             <div className="bg-primary-50 p-1.5 rounded-full mr-3">
                                <User className="h-4 w-4 text-primary-700" />
                             </div>
                             <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Responsável</p>
                                <p className="text-sm text-primary-900 font-bold">{rec.doctorName}</p>
                             </div>
                        </div>
                    </div>
                </div>
            ))}
            {records.length === 0 && (
                <div className="pl-8 text-slate-500 text-sm italic py-8">
                    Nenhum registro médico encontrado. Suas consultas e evoluções aparecerão aqui.
                </div>
            )}
        </div>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-4">
        {exams.map((exam) => (
            <div key={exam.id} className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-primary-400 transition-colors group animate-fade-in">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4 border border-indigo-100">
                    {exam.type === 'imagem' ? <Activity className="h-6 w-6" /> : 
                     exam.type === 'laudo' ? <FileCheck className="h-6 w-6" /> :
                     <FileText className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-900 truncate">{exam.title}</h5>
                    <p className="text-xs text-slate-600 font-medium uppercase mt-0.5">{exam.type} • {exam.date}</p>
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={() => window.open(exam.fileUrl, '_blank')}
                        className="px-3 py-1 text-primary-700 text-sm font-bold bg-primary-50 rounded hover:bg-primary-100 transition-colors flex items-center"
                    >
                        <Eye className="h-4 w-4 mr-2" /> Visualizar
                    </button>
                </div>
            </div>
        ))}
        {exams.length === 0 && (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p>Nenhum exame ou documento disponível.</p>
            </div>
        )}
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-primary-900">Prontuário Eletrônico</h2>
                <p className="text-slate-500">Histórico completo de consultas, evoluções e documentos.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('records')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'records' ? 'bg-white text-primary-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Histórico Clínico
                </button>
                <button 
                    onClick={() => setActiveTab('exams')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'exams' ? 'bg-white text-primary-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Exames e Arquivos
                </button>
            </div>
       </div>

       <div className="min-h-[400px]">
        {activeTab === 'records' && renderRecords()}
        {activeTab === 'exams' && renderExams()}
       </div>
    </div>
  );
};

export default PatientRecords;
