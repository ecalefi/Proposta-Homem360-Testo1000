
import React, { useState } from 'react';
import { 
  Droplet, 
  Dumbbell, 
  Moon, 
  ShieldCheck, 
  Users, 
  Gamepad2, 
  CheckCircle2, 
  Circle,
  Plus,
  Trash2,
  X,
  Target,
  Flame,
  LayoutGrid,
  Sun,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { HabitLog, CustomHabit } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface SixPsProps {
  initialHabits: HabitLog;
}

// Configuração dos 7 Pilares
type PillarType = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';

const PILLAR_CONFIG: Record<PillarType, { 
    label: string; 
    short: string;
    description: string;
    color: string; 
    bg: string; 
    border: string;
    icon: any; 
    templates: { title: string; goal: string }[] 
}> = {
    'P1': { 
        label: 'P1 - Alimentação', 
        short: 'Nutrição',
        description: 'Combustível de qualidade para seu corpo.',
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200',
        icon: Droplet,
        templates: [
            { title: 'Beber 3L de Água', goal: 'Garrafa na mesa o dia todo' },
            { title: 'Jejum Intermitente', goal: '14h de janela' },
            { title: 'Zero Açúcar', goal: 'Evitar doces e refri' },
            { title: 'Comer 3 Frutas', goal: 'Distribuir nas refeições' },
            { title: 'Suplementação', goal: 'Whey + Creatina pós-treino' }
        ]
    },
    'P2': { 
        label: 'P2 - Atividade Física', 
        short: 'Físico',
        description: 'Movimento é vida. Construa sua força.',
        color: 'text-orange-600', 
        bg: 'bg-orange-50', 
        border: 'border-orange-200',
        icon: Dumbbell,
        templates: [
            { title: 'Musculação', goal: '45 min intenso' },
            { title: 'Cardio', goal: '30 min caminhada/corrida' },
            { title: 'Alongamento', goal: 'Ao acordar' },
            { title: 'Jiu-Jitsu / Luta', goal: 'Treino técnico' },
            { title: 'Esporte Coletivo', goal: 'Futebol/Tênis' }
        ]
    },
    'P3': { 
        label: 'P3 - Sono & Mente', 
        short: 'Mente',
        description: 'Recuperação cognitiva e equilíbrio emocional.',
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-200',
        icon: Moon,
        templates: [
            { title: 'Dormir 7h+', goal: 'Ir para cama às 22h' },
            { title: 'Leitura', goal: '10 páginas de um livro' },
            { title: 'Meditação', goal: '5 min de mindfulness' },
            { title: 'Sem telas', goal: '1h antes de dormir' },
            { title: 'Estudo', goal: '30 min de curso/idioma' }
        ]
    },
    'P4': { 
        label: 'P4 - Prevenção', 
        short: 'Prevenção',
        description: 'Hábitos que evitam problemas futuros.',
        color: 'text-blue-600', 
        bg: 'bg-blue-50', 
        border: 'border-blue-200',
        icon: ShieldCheck,
        templates: [
            { title: 'Medicação em dia', goal: 'Tomar remédios no horário' },
            { title: 'Protetor Solar', goal: 'Aplicar no rosto' },
            { title: 'Postura', goal: 'Alongar a cada 1h sentado' },
            { title: 'Higiene do Sono', goal: 'Quarto escuro e frio' }
        ]
    },
    'P5': { 
        label: 'P5 - Família', 
        short: 'Família',
        description: 'Conexão real com quem importa.',
        color: 'text-rose-600', 
        bg: 'bg-rose-50', 
        border: 'border-rose-200',
        icon: Users,
        templates: [
            { title: 'Tempo de Qualidade', goal: '1h sem celular com filhos/esposa' },
            { title: 'Jantar em Família', goal: 'Todos à mesa' },
            { title: 'Ligar para os Pais', goal: 'Conversa rápida' },
            { title: 'Elogiar Alguém', goal: 'Validar esposa/filhos' }
        ]
    },
    'P6': { 
        label: 'P6 - Hobbies', 
        short: 'Lazer',
        description: 'Válvula de escape e criatividade.',
        color: 'text-purple-600', 
        bg: 'bg-purple-50', 
        border: 'border-purple-200',
        icon: Gamepad2,
        templates: [
            { title: 'Tocar Instrumento', goal: '15 min prática' },
            { title: 'Ouvir Música/Podcast', goal: 'No trânsito' },
            { title: 'Gaming', goal: 'Sessão controlada' },
            { title: 'Cozinhar', goal: 'Prato especial' }
        ]
    },
    'P7': { 
        label: 'P7 - Fé / Deus', 
        short: 'Espiritual',
        description: 'Conexão espiritual e propósito.',
        color: 'text-sky-600', 
        bg: 'bg-sky-50', 
        border: 'border-sky-200',
        icon: Sun,
        templates: [
            { title: 'Oração Matinal', goal: 'Agradecer ao acordar' },
            { title: 'Leitura Bíblica', goal: '1 capítulo de Provérbios' },
            { title: 'Devocional', goal: 'Tempo com Deus' },
            { title: 'Ir à Igreja/Culto', goal: 'Comunhão' },
            { title: 'Jejum Espiritual', goal: 'Abstinência com propósito' }
        ]
    }
};

const SixPs: React.FC<SixPsProps> = ({ initialHabits }) => {
  const { user } = useAuth();
  const { customHabits, addCustomHabit, removeCustomHabit, toggleCustomHabit } = useData();
  
  // State
  const [activePillar, setActivePillar] = useState<PillarType>('P1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitGoal, setNewHabitGoal] = useState('');

  // Filtering
  const activeHabits = customHabits.filter(h => h.category === activePillar);
  const activeConfig = PILLAR_CONFIG[activePillar];

  const handleAddHabit = () => {
    if (!newHabitTitle.trim() || !user) return;
    
    const habit: CustomHabit = {
        id: Date.now().toString(),
        patientId: user.id,
        title: newHabitTitle,
        category: activePillar,
        goalDescription: newHabitGoal || 'Constância diária',
        streak: 0,
        completedToday: false,
        lastSevenDays: [false, false, false, false, false, false, false]
    };

    addCustomHabit(habit);
    setNewHabitTitle('');
    setNewHabitGoal('');
    setIsModalOpen(false);
  };

  const loadTemplate = (template: {title: string, goal: string}) => {
      setNewHabitTitle(template.title);
      setNewHabitGoal(template.goal);
  };

  const calculateCompletion = () => {
      if (activeHabits.length === 0) return 0;
      const completed = activeHabits.filter(h => h.completedToday).length;
      return Math.round((completed / activeHabits.length) * 100);
  };

  return (
    <div className="space-y-6">
      
      {/* Header com Resumo Geral */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h2 className="text-2xl font-bold text-primary-900 flex items-center">
                <LayoutGrid className="h-6 w-6 mr-2 text-gold-500" />
                Construtor de Hábitos 7Ps
            </h2>
            <p className="text-slate-500 mt-1">Desenvolva uma rotina de alta performance em todas as áreas.</p>
        </div>
        <div className="w-full md:w-auto text-right">
             <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total do Dia</div>
             <div className="flex items-center justify-end gap-3">
                 <div className="flex-1 md:w-48 bg-slate-100 rounded-full h-3 overflow-hidden">
                     <div 
                        className="bg-gold-500 h-full transition-all duration-500"
                        style={{ width: `${Math.round((customHabits.filter(h => h.completedToday).length / (customHabits.length || 1)) * 100)}%` }}
                     ></div>
                 </div>
                 <span className="font-bold text-slate-900">{Math.round((customHabits.filter(h => h.completedToday).length / (customHabits.length || 1)) * 100)}%</span>
             </div>
        </div>
      </div>

      {/* Navegação dos Pilares */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(PILLAR_CONFIG).map(([key, config]) => {
              const isActive = activePillar === key;
              const Icon = config.icon;
              return (
                  <button
                    key={key}
                    onClick={() => setActivePillar(key as PillarType)}
                    className={`flex flex-col items-center justify-center min-w-[5rem] p-3 rounded-2xl transition-all duration-300 border ${
                        isActive 
                        ? `${config.bg} ${config.border} ring-2 ring-offset-2 ring-primary-100 transform scale-105` 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                      <div className={`p-2 rounded-full mb-2 ${isActive ? 'bg-white shadow-sm' : 'bg-slate-100'} ${config.color}`}>
                          <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                          {config.short}
                      </span>
                  </button>
              );
          })}
      </div>

      {/* Conteúdo do Pilar Ativo */}
      <div className="animate-fade-in">
          <div className={`p-6 rounded-t-3xl border-x border-t ${activeConfig.border} ${activeConfig.bg} bg-opacity-50`}>
              <div className="flex justify-between items-start">
                  <div>
                      <h3 className={`text-xl font-bold ${activeConfig.color} flex items-center`}>
                          <activeConfig.icon className="h-6 w-6 mr-2" />
                          {activeConfig.label}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">{activeConfig.description}</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-primary-800 transition-colors shadow-lg"
                  >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                  </button>
              </div>
          </div>

          <div className="bg-white rounded-b-3xl border-x border-b border-slate-200 p-6 min-h-[300px]">
              
              {/* Barra de Progresso do Pilar */}
              <div className="mb-6 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">Conclusão do Pilar</span>
                  <div className="flex items-center gap-3 w-1/2 md:w-2/3">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                             <div 
                                className={`h-full rounded-full transition-all duration-500 ${activeConfig.color.replace('text-', 'bg-')}`}
                                style={{ width: `${calculateCompletion()}%` }}
                             ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{calculateCompletion()}%</span>
                  </div>
              </div>

              {/* Lista de Hábitos */}
              {activeHabits.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${activeConfig.bg} ${activeConfig.color}`}>
                          <activeConfig.icon className="h-6 w-6" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhum hábito configurado para {activeConfig.short}.</p>
                      <button onClick={() => setIsModalOpen(true)} className="text-primary-600 font-bold text-sm mt-2 hover:underline">
                          Começar agora
                      </button>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeHabits.map((habit) => (
                          <div 
                            key={habit.id} 
                            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 group hover:shadow-md ${
                                habit.completedToday 
                                ? `bg-white ${activeConfig.border} border-opacity-60` 
                                : 'bg-white border-slate-100'
                            }`}
                          >
                                <button 
                                    onClick={() => removeCustomHabit(habit.id)}
                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>

                                <h4 className="font-bold text-slate-900 pr-6">{habit.title}</h4>
                                <p className="text-xs text-slate-500 flex items-center mt-1">
                                    <Target className="h-3 w-3 mr-1" />
                                    {habit.goalDescription}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                                        <Flame className="h-3 w-3 mr-1" /> {habit.streak} dias
                                    </div>
                                    <button 
                                        onClick={() => toggleCustomHabit(habit.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors ${
                                            habit.completedToday
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {habit.completedToday ? 'Feito!' : 'Marcar'}
                                    </button>
                                </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* Modal de Criação / Construtor */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/80 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                  <div className={`p-6 border-b flex justify-between items-center ${activeConfig.bg}`}>
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white ${activeConfig.color}`}>
                              <activeConfig.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">Novo Hábito: {activeConfig.short}</h3>
                            <p className="text-xs text-slate-500">Adicione à sua rotina</p>
                          </div>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full">
                          <X className="h-5 w-5" />
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Left: Input Form */}
                      <div className="p-6 space-y-5 border-r border-slate-100">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">O que você vai fazer?</label>
                              <input 
                                  type="text" 
                                  placeholder="Ex: Ler a Bíblia, Treinar..." 
                                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  value={newHabitTitle}
                                  onChange={(e) => setNewHabitTitle(e.target.value)}
                                  autoFocus
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Qual a meta?</label>
                              <input 
                                  type="text" 
                                  placeholder="Ex: 1 capítulo, 30 min..." 
                                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  value={newHabitGoal}
                                  onChange={(e) => setNewHabitGoal(e.target.value)}
                              />
                          </div>
                          <button 
                              onClick={handleAddHabit}
                              disabled={!newHabitTitle.trim()}
                              className="w-full bg-primary-900 text-white font-bold py-3 rounded-xl hover:bg-primary-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                          >
                              Confirmar Hábito
                          </button>
                      </div>

                      {/* Right: Templates / Suggestions */}
                      <div className="p-6 bg-slate-50">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                              <BookOpen className="h-3 w-3 mr-2" />
                              Sugestões para {activeConfig.short}
                          </h4>
                          <div className="space-y-2">
                              {activeConfig.templates.map((template, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => loadTemplate(template)}
                                    className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all group"
                                  >
                                      <div className="flex justify-between items-center">
                                          <span className="text-sm font-bold text-slate-800 group-hover:text-primary-700">{template.title}</span>
                                          <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-primary-500" />
                                      </div>
                                      <span className="text-xs text-slate-500">{template.goal}</span>
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default SixPs;
