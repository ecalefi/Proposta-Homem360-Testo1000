
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Utensils, Clock, Flame, PieChart, Apple, AlertCircle, ChefHat, CheckCircle2, Circle, MessageSquare, ChevronRight, Calendar, Edit2, Share2 } from 'lucide-react';

interface NutritionProps {
    patientId?: string; // Optional: If provided, shows that patient's diet. If not, shows logged user's diet.
}

const Nutrition: React.FC<NutritionProps> = ({ patientId }) => {
    const { user } = useAuth();
    const { getDietPlan, dietLogs, toggleMealCompletion, getDietLogsByDate } = useData();
    const [activeTab, setActiveTab] = useState<'plan' | 'log'>('plan');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

    // Determine which patient ID to use
    // If patientId prop is passed (e.g. from Nutri Dashboard), use it.
    // Otherwise, use the logged-in user's ID.
    const targetPatientId = patientId || user?.id;
    
    // Is the viewer a Professional (Doctor, Nutri, Trainer) looking at a patient?
    // If so, we disable the "check" functionality and enable "feedback" functionality.
    const isProfessionalView = user?.role === 'nutritionist' || user?.role === 'admin' || user?.role === 'trainer';

    if (!targetPatientId) return null;

    const dietPlan = getDietPlan(targetPatientId);

    if (!dietPlan) return <div className="p-6 text-center text-slate-500">Sem dieta cadastrada para este usuário.</div>;

    const todayLogs = getDietLogsByDate(selectedDate);

    // Calculate Progress for the selected date
    const totalMeals = dietPlan.meals.length;
    // We filter logs to ensure we only count logs relevant to this specific diet plan's meals
    // (In a real app, logs would be filtered by patient ID at API level)
    const completedMeals = todayLogs.filter(l => 
        l.completed && dietPlan.meals.some(m => m.id === l.mealId)
    ).length;
    
    const progressPercentage = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

    const renderPlan = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row gap-6 text-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex-1 flex flex-col justify-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Calorias Diárias</div>
                    <div className="text-3xl font-bold text-primary-900">{dietPlan.dailyCalories}</div>
                    <div className="text-xs text-slate-400">kcal/dia</div>
                 </div>
                 <div className="hidden md:block w-px bg-slate-100"></div>
                 <div className="flex items-center gap-4 justify-center flex-[2] py-4 md:py-0">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full border-[5px] border-blue-500 flex items-center justify-center text-sm font-bold text-slate-700 bg-blue-50 mx-auto">
                                {dietPlan.macros.protein}%
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 mt-2 block">Proteína</span>
                        </div>
                         <div className="text-center">
                            <div className="w-14 h-14 rounded-full border-[5px] border-amber-500 flex items-center justify-center text-sm font-bold text-slate-700 bg-amber-50 mx-auto">
                                {dietPlan.macros.carbs}%
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 mt-2 block">Carbo</span>
                        </div>
                         <div className="text-center">
                            <div className="w-14 h-14 rounded-full border-[5px] border-red-500 flex items-center justify-center text-sm font-bold text-slate-700 bg-red-50 mx-auto">
                                {dietPlan.macros.fat}%
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 mt-2 block">Gordura</span>
                        </div>
                    </div>
             </div>
             
             {isProfessionalView && (
                 <div className="flex justify-end gap-2">
                     <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 border border-emerald-200">
                         <Edit2 className="h-3 w-3" /> Editar Plano
                     </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white rounded-lg hover:bg-slate-50 border border-slate-200">
                         <Share2 className="h-3 w-3" /> Exportar PDF
                     </button>
                 </div>
             )}

             <div className="space-y-4">
                {dietPlan.meals.map((meal) => (
                    <div key={meal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-primary-300 transition-colors">
                        <div className="p-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                    <Clock className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{meal.name}</h3>
                                    <span className="text-xs font-bold text-slate-500">{meal.time}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-700 flex items-center justify-end">
                                    <Flame className="h-3 w-3 mr-1 text-orange-500" /> {meal.calories} kcal
                                </div>
                                <div className="text-xs text-slate-400">{meal.protein}g proteína</div>
                            </div>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-2">
                                {meal.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-slate-700 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                        <div className="h-1.5 w-1.5 bg-primary-400 rounded-full mr-3 shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLog = () => (
        <div className="space-y-6 animate-fade-in">
             {/* Date Selector & Progress */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-primary-900 flex items-center">
                         <Calendar className="h-5 w-5 mr-2 text-primary-600" /> Diário de Refeições
                     </h3>
                     <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{selectedDate.split('-').reverse().join('/')}</span>
                 </div>
                 
                 <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-slate-500">
                         <span>Progresso do Dia</span>
                         <span>{progressPercentage}%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                         <div 
                            className={`h-full transition-all duration-500 ${progressPercentage === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                            style={{width: `${progressPercentage}%`}}
                         ></div>
                     </div>
                 </div>
             </div>

             {/* Checklist */}
             <div className="space-y-3">
                 {dietPlan.meals.map(meal => {
                     const isDone = todayLogs.find(l => l.mealId === meal.id)?.completed;

                     return (
                         <div 
                            key={meal.id} 
                            // Only allow toggling if it's NOT a professional view
                            onClick={() => !isProfessionalView && toggleMealCompletion(meal.id, selectedDate)}
                            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                                isDone 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-slate-200'
                            } ${!isProfessionalView ? 'cursor-pointer hover:border-primary-300' : ''}`}
                         >
                             <div className="flex items-center gap-4">
                                 <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                                     isDone ? 'bg-green-500 border-green-500' : 'border-slate-300'
                                 }`}>
                                     {isDone && <CheckCircle2 className="h-4 w-4 text-white" />}
                                 </div>
                                 <div>
                                     <h4 className={`font-bold ${isDone ? 'text-green-900' : 'text-slate-900'}`}>{meal.name}</h4>
                                     <p className="text-xs text-slate-500">{meal.time} • {meal.calories} kcal</p>
                                 </div>
                             </div>
                             {isDone && (
                                 <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">Feito</span>
                             )}
                         </div>
                     );
                 })}
             </div>

             {/* Professional Feedback Area */}
             {!isProfessionalView ? (
                 <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mt-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Nutri" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900 text-sm">Feedback da Nutri</h4>
                            <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                                "Roberto, ótimo progresso essa semana! Notei que você pulou o lanche da tarde ontem. Tente levar as castanhas com você para não ficar com muita fome no jantar."
                            </p>
                            <button className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" /> Responder no Chat
                            </button>
                        </div>
                    </div>
                 </div>
             ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-6">
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Enviar Feedback sobre o Diário</label>
                    <textarea 
                        className="w-full border border-slate-400 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 placeholder-slate-500" 
                        placeholder="Escreva uma mensagem de incentivo ou correção..."
                        rows={3}
                    ></textarea>
                    <div className="text-right mt-2">
                         <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">Enviar Feedback</button>
                    </div>
                </div>
             )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header com Resumo */}
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 ${isProfessionalView ? 'border-emerald-100 bg-emerald-50/30' : ''}`}>
                <div>
                    <h2 className="text-2xl font-bold text-primary-900 flex items-center">
                        <Utensils className="h-6 w-6 mr-3 text-gold-500" />
                        Gestão Nutricional
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {isProfessionalView ? (
                            <>Visualizando plano de: <span className="font-bold text-emerald-700">{targetPatientId === 'u2' ? 'Carlos Andrade' : 'Roberto Mendes'}</span></>
                        ) : (
                            <>Acompanhamento com <span className="font-bold text-primary-700">{dietPlan.nutritionistName}</span></>
                        )}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                        Objetivo: {dietPlan.goal}
                    </p>
                </div>

                {!isProfessionalView && (
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-bold flex items-center border border-primary-100 hover:bg-primary-100 transition-colors">
                            <MessageSquare className="h-4 w-4 mr-2" /> Fale com a Nutri
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 pb-1">
                <button 
                    onClick={() => setActiveTab('plan')}
                    className={`px-6 py-2 text-sm font-bold rounded-t-lg transition-colors border-b-2 ${
                        activeTab === 'plan' 
                        ? 'border-primary-600 text-primary-800 bg-white' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    Plano Alimentar
                </button>
                <button 
                    onClick={() => setActiveTab('log')}
                    className={`px-6 py-2 text-sm font-bold rounded-t-lg transition-colors border-b-2 ${
                        activeTab === 'log' 
                        ? 'border-primary-600 text-primary-800 bg-white' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    Diário & Check-in
                </button>
            </div>

            {activeTab === 'plan' ? renderPlan() : renderLog()}
        </div>
    );
};

export default Nutrition;
