
import React from 'react';
import { useData } from '../contexts/DataContext';
import { Crown, Target, CheckCircle, TrendingUp, Briefcase, Brain, Heart, ArrowRight } from 'lucide-react';

const Mentorship: React.FC = () => {
    const { mentorshipGoals } = useData();

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'achieved': return 'bg-green-100 text-green-700 border-green-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'achieved': return 'Concluído';
            case 'in_progress': return 'Em Andamento';
            default: return 'Pendente';
        }
    };

    const getIcon = (category: string) => {
        switch(category) {
            case 'career': return <Briefcase className="h-5 w-5" />;
            case 'mindset': return <Brain className="h-5 w-5" />;
            case 'health': return <Heart className="h-5 w-5" />;
            default: return <Target className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Crown className="h-6 w-6 text-gold-500" />
                            <span className="text-gold-500 font-bold uppercase tracking-widest text-xs">Mentoria High Performance</span>
                        </div>
                        <h2 className="text-3xl font-bold font-serif mb-2">Evolução do Mentorado</h2>
                        <p className="text-primary-200 max-w-lg">
                            Acompanhamento estratégico de metas profissionais, desenvolvimento pessoal e otimização biológica.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center">
                        <div className="text-xs text-primary-200 uppercase mb-1">Nível Atual</div>
                        <div className="text-2xl font-bold text-white">Diamond</div>
                    </div>
                </div>
             </div>

             {/* Evolution Timeline / Goals */}
             <div>
                <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-primary-600" />
                    Plano de Ação Estratégico
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {mentorshipGoals.map((goal) => (
                        <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                             {/* Status Bar */}
                             <div className={`absolute left-0 top-0 bottom-0 w-2 ${goal.status === 'achieved' ? 'bg-green-500' : 'bg-blue-500'}`}></div>

                             <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                {getIcon(goal.category)}
                             </div>

                             <div className="flex-1 w-full text-center md:text-left">
                                <h4 className="text-lg font-bold text-slate-900">{goal.title}</h4>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">Deadline: {goal.deadline}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{goal.category}</span>
                                </div>
                             </div>

                             <div>
                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(goal.status)}`}>
                                    {getStatusText(goal.status)}
                                </span>
                             </div>

                             {goal.status !== 'achieved' && (
                                 <button className="p-3 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors">
                                     <ArrowRight className="h-5 w-5" />
                                 </button>
                             )}
                        </div>
                    ))}
                </div>
             </div>

             {/* Feedback / Notes Section */}
             <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
                 <h4 className="font-bold text-primary-900 mb-3">Último Feedback do Mentor</h4>
                 <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                     <p className="text-slate-700 italic leading-relaxed">
                         "Roberto, sua evolução física está alinhada. Agora precisamos focar no pilar de carreira. Você atingiu os níveis hormonais ideais para suportar uma carga maior de trabalho. Use essa energia para delegar o setor financeiro até o fim do mês."
                     </p>
                     <div className="mt-3 text-right text-xs font-bold text-primary-600">- Dr. Edgar Sarmento</div>
                 </div>
             </div>
        </div>
    );
};

export default Mentorship;
