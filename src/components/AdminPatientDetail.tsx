
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Activity, 
  User, 
  Microscope, 
  Pill, 
  Save, 
  CheckCircle, 
  FileText, 
  Loader2, 
  Stethoscope, 
  ClipboardList, 
  FilePlus, 
  Utensils, 
  Dumbbell
} from 'lucide-react';
import { MOCK_METRICS, MEDICATIONS } from '../constants';
import { useData } from '../contexts/DataContext';
import { Exam, MedicalRecord } from '../types';
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
import { sendNotification } from '../lib/notifications';
import Nutrition from './Nutrition';
import Workout from './Workout';

interface AdminPatientDetailProps {
  patientId: string;
  onBack: () => void;
}

type TabType = 'overview' | 'records' | 'exams' | 'nutrition' | 'workout';

const AdminPatientDetail: React.FC<AdminPatientDetailProps> = ({ patientId, onBack }) => {
  const { getRecordsByPatient, addMedicalRecord, getExamsByPatient, addExam } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Form State for Medical Record
  const [newNote, setNewNote] = useState('');
  const [recordTitle, setRecordTitle] = useState('');
  const [recordType, setRecordType] = useState<'evolucao' | 'anamnese' | 'prescricao'>('evolucao');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const records = getRecordsByPatient(patientId);
  const exams = getExamsByPatient(patientId);

  // Mock patient info (normally fetched via ID)
  const isMainUser = patientId === 'u1';
  
  const patient = {
    name: isMainUser ? 'Roberto Mendes' : 'Paciente Teste',
    age: isMainUser ? 42 : 35,
    email: isMainUser ? 'roberto.mendes@email.com' : 'paciente@email.com',
    phone: '(61) 99999-8888',
    since: isMainUser ? 'Jun/2025' : 'Jan/2026'
  };

  const handleSaveRecord = () => {
    if (!newNote.trim() || !recordTitle.trim()) return;

    setIsSaving(true);

    // Simulate a brief network delay for better UX
    setTimeout(() => {
        const newRecord: MedicalRecord = {
            id: Date.now().toString(),
            patientId: patientId,
            date: new Date().toLocaleDateString('pt-BR'),
            type: recordType,
            title: recordTitle,
            content: newNote,
            doctorName: 'Dr. Edgar Sarmento'
        };

        addMedicalRecord(newRecord);
        
        sendNotification('Prontuário Atualizado', { 
            body: `Registro de ${recordType} adicionado para ${patient.name}.` 
        });

        // Reset Form
        setNewNote('');
        setRecordTitle('');
        setRecordType('evolucao');
        setIsSaving(false);
    }, 600);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
        fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simula o tempo de upload para o servidor (Storage)
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        const isImage = file.type.startsWith('image/');
        
        let examType: 'laboratorial' | 'imagem' | 'laudo' = 'laudo';
        if (isImage) examType = 'imagem';
        if (file.name.toLowerCase().includes('sangue') || file.name.toLowerCase().includes('hemograma')) examType = 'laboratorial';

        const newExam: Exam = {
            id: Date.now().toString(),
            patientId: patientId,
            date: new Date().toLocaleDateString('pt-BR'),
            title: file.name, 
            type: examType,
            fileUrl: URL.createObjectURL(file) 
        };
        
        addExam(newExam);
        sendNotification('Upload Concluído', { body: `Arquivo ${file.name} anexado ao prontuário.` });
        setActiveTab('exams');

    } catch (error) {
        console.error("Erro no upload", error);
        alert("Erro ao processar o arquivo.");
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getPlaceholderText = () => {
      switch(recordType) {
          case 'anamnese': return "Descreva a queixa principal, história da doença atual (HDA) e antecedentes...";
          case 'prescricao': return "Liste os medicamentos, posologia e orientações...";
          default: return "Descreva a evolução clínica, dados objetivos do exame físico e conduta...";
      }
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold">Última Testosterona</p>
                <div className="flex items-end space-x-2 mt-1">
                    <span className="text-2xl font-bold text-primary-900">{isMainUser ? 820 : 450}</span>
                    <span className="text-sm text-green-600 mb-1">▲ ideal</span>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <p className="text-xs text-slate-500 uppercase font-bold">Peso Atual</p>
                <div className="flex items-end space-x-2 mt-1">
                    <span className="text-2xl font-bold text-primary-900">{isMainUser ? 86.0 : 82.5}</span>
                    <span className="text-sm text-green-600 mb-1">▼ kg</span>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <p className="text-xs text-slate-500 uppercase font-bold">Aderência aos Hábitos</p>
                <div className="flex items-end space-x-2 mt-1">
                    <span className="text-2xl font-bold text-primary-900">High</span>
                    <span className="text-sm text-gold-600 mb-1">★★★★★</span>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-primary-900 mb-4">Evolução Hormonal</h4>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_METRICS.testosterone}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} domain={[300, 1000]} />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            axisLine={false} 
                            tickLine={false} 
                            domain={[0, 25]} 
                            tick={{fill: '#d97706', fontSize: 12}} 
                        />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" name="Testo Total" type="monotone" dataKey="value" stroke="#6f4333" strokeWidth={3} dot={{r:4}} />
                        <Line yAxisId="right" name="Testo Livre" type="monotone" dataKey="secondaryValue" stroke="#d97706" strokeWidth={3} dot={{r:4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Current Meds */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-primary-900 mb-4 flex items-center"><Pill className="h-4 w-4 mr-2"/> Medicação Atual</h4>
            <div className="space-y-3">
                {MEDICATIONS.map(med => (
                    <div key={med.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="font-medium text-slate-800">{med.name}</p>
                            <p className="text-xs text-slate-500">{med.dosage}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Form de Evolução */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-primary-900 font-bold flex items-center mb-4">
                <FilePlus className="h-5 w-5 mr-2 text-primary-600" />
                Novo Registro Clínico
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Tipo de Registro</label>
                    <div className="relative">
                        <select 
                            value={recordType}
                            onChange={(e) => setRecordType(e.target.value as any)}
                            className="w-full border border-slate-400 rounded-lg p-2.5 bg-white text-sm font-medium focus:ring-2 focus:ring-primary-500 appearance-none text-slate-900 shadow-sm"
                        >
                            <option value="evolucao">Evolução Clínica</option>
                            <option value="anamnese">Anamnese</option>
                            <option value="prescricao">Prescrição</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Título do Atendimento</label>
                    <input 
                        type="text" 
                        value={recordTitle}
                        onChange={(e) => setRecordTitle(e.target.value)}
                        placeholder="Ex: Retorno Trimestral, Queixa de Dor, Ajuste Hormonal..." 
                        className="w-full border border-slate-400 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder-slate-500 shadow-sm"
                    />
                </div>
            </div>

            <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Conteúdo / Descrição</label>
            <textarea 
                className="w-full border border-slate-400 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder-slate-500 min-h-[120px] shadow-sm"
                placeholder={getPlaceholderText()}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
            ></textarea>
            
            <div className="mt-4 text-right">
                <button 
                    onClick={handleSaveRecord}
                    disabled={isSaving || !newNote.trim() || !recordTitle.trim()}
                    className={`bg-primary-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-800 inline-flex items-center transition-colors shadow-lg ${isSaving || !newNote.trim() || !recordTitle.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" /> Salvar no Prontuário
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
            {records.map((rec) => (
                <div key={rec.id} className="relative pl-8 animate-fade-in group">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-2.5 top-0 h-5 w-5 rounded-full border-2 flex items-center justify-center bg-white ${
                        rec.type === 'prescricao' ? 'border-indigo-500' :
                        rec.type === 'anamnese' ? 'border-amber-500' :
                        'border-primary-600'
                    }`}>
                        <div className={`h-2 w-2 rounded-full ${
                             rec.type === 'prescricao' ? 'bg-indigo-500' :
                             rec.type === 'anamnese' ? 'bg-amber-500' :
                             'bg-primary-600'
                        }`}></div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h5 className="font-bold text-primary-900 text-lg">{rec.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                        rec.type === 'prescricao' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        rec.type === 'anamnese' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-primary-50 text-primary-700 border-primary-100'
                                    }`}>
                                        {rec.type === 'prescricao' ? <Pill className="h-3 w-3 mr-1"/> : 
                                         rec.type === 'anamnese' ? <ClipboardList className="h-3 w-3 mr-1"/> :
                                         <Stethoscope className="h-3 w-3 mr-1"/>}
                                        {rec.type}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{rec.date}</span>
                        </div>
                        <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-line font-medium border-l-2 border-slate-100 pl-3">
                            {rec.content}
                        </p>
                        <div className="flex items-center mt-4 pt-3 border-t border-slate-50 justify-end">
                             <div className="flex items-center bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                                <User className="h-3 w-3 text-stone-400 mr-2" />
                                <p className="text-xs text-stone-600 font-bold">{rec.doctorName}</p>
                             </div>
                        </div>
                    </div>
                </div>
            ))}
            {records.length === 0 && (
                <div className="pl-8 py-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-stone-50">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Nenhum registro encontrado.</p>
                    <p className="text-xs">Utilize o formulário acima para adicionar a primeira evolução.</p>
                </div>
            )}
        </div>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div>
                <h4 className="font-bold text-slate-900">Arquivos de Exames</h4>
                <p className="text-xs text-slate-500">PDFs, Imagens (JPG, PNG)</p>
             </div>
             
             <button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className={`bg-primary-50 text-primary-700 border border-primary-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-100 inline-flex items-center transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
             >
                {isUploading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...
                    </>
                ) : (
                    <>
                        <Upload className="h-4 w-4 mr-2" /> Upload de Exame
                    </>
                )}
            </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {exams.map((exam) => (
                <div key={exam.id} className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-primary-400 transition-colors group animate-fade-in">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4 border border-indigo-100">
                        {exam.type === 'imagem' ? <Activity className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 truncate">{exam.title}</h5>
                        <p className="text-xs text-slate-600 font-medium uppercase mt-0.5">{exam.type} • {exam.date}</p>
                    </div>
                    <div className="flex items-center">
                        {exam.fileUrl !== '#' && (
                             <span className="text-xs text-green-600 font-medium mr-3 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" /> Salvo
                             </span>
                        )}
                        <button 
                            onClick={() => window.open(exam.fileUrl, '_blank')}
                            className="px-3 py-1 text-primary-700 text-sm font-bold bg-primary-50 rounded hover:bg-primary-100 transition-colors"
                        >
                            Visualizar
                        </button>
                    </div>
                </div>
            ))}
            {exams.length === 0 && (
                <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                    Nenhum exame anexado.
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Hidden Global Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
        accept="image/*,.pdf"
      />

      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
            <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
            <h2 className="text-2xl font-bold text-primary-900">{patient.name}</h2>
            <div className="flex items-center text-sm text-slate-600 font-medium space-x-3">
                <span>{patient.age} anos</span>
                <span>•</span>
                <span>Paciente desde {patient.since}</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
        <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-primary-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
            Visão Geral
        </button>
        <button 
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'records' ? 'bg-white text-primary-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
            Prontuário
        </button>
        <button 
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'exams' ? 'bg-white text-primary-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
            Exames
        </button>
        <div className="w-px bg-slate-300 mx-2 my-1"></div>
        <button 
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'nutrition' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
            <Utensils className="h-4 w-4" /> Nutrição
        </button>
        <button 
            onClick={() => setActiveTab('workout')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'workout' ? 'bg-white text-orange-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
            <Dumbbell className="h-4 w-4" /> Treino
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'records' && renderRecords()}
        {activeTab === 'exams' && renderExams()}
        {activeTab === 'nutrition' && <Nutrition patientId={patientId} />}
        {activeTab === 'workout' && <Workout patientId={patientId} />}
      </div>
    </div>
  );
};

export default AdminPatientDetail;
