
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, PlayCircle, Timer, Repeat, Trophy, Edit2, Share2, MessageSquare, CalendarCheck, CheckCircle2, ChevronRight, History, Activity, Save } from 'lucide-react';
import { Exercise, WorkoutSession, WorkoutLogEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkoutProps {
    patientId?: string; // Optional: for Trainer view
}

const Workout: React.FC<WorkoutProps> = ({ patientId }) => {
    const { user } = useAuth();
    const { getWorkoutsByPatient, workoutLogs, logWorkoutSession } = useData();
    
    // Determine which patient ID to use
    const targetPatientId = patientId || user?.id;
    
    // Check if the viewer is a professional (Admin, Trainer)
    const isProfessionalView = user?.role === 'trainer' || user?.role === 'admin';

    const workoutRoutines = getWorkoutsByPatient(targetPatientId || '');
    const [activeRoutineId, setActiveRoutineId] = useState<string>(workoutRoutines[0]?.id || '');
    const [activeSessionId, setActiveSessionId] = useState<string>('');
    
    // Logging Mode State
    const [isLoggingMode, setIsLoggingMode] = useState(false);
    const [currentLog, setCurrentLog] = useState<Record<string, { weight: number, reps: number }[]>>({});
    const [workoutRPE, setWorkoutRPE] = useState(8);

    // Evolution View State
    const [viewMode, setViewMode] = useState<'plan' | 'evolution'>('plan');

    // Reset active routine if workouts change
    React.useEffect(() => {
        if (workoutRoutines.length > 0) {
            setActiveRoutineId(workoutRoutines[0].id);
            if(workoutRoutines[0].sessions.length > 0) {
                setActiveSessionId(workoutRoutines[0].sessions[0].id);
            }
        }
    }, [workoutRoutines]);

    if (!targetPatientId || !workoutRoutines.length) return <div className="p-6 text-center text-slate-500">Sem treino cadastrado para este usuário.</div>;

    const activeRoutine = workoutRoutines.find(w => w.id === activeRoutineId) || workoutRoutines[0];
    const activeSession = activeRoutine.sessions.find(s => s.id === activeSessionId) || activeRoutine.sessions[0];

    // Helper: Initialize Log for a session
    const startLogging = () => {
        const initialLog: Record<string, { weight: number, reps: number }[]> = {};
        activeSession.exercises.forEach(ex => {
            // Default 3 sets
            initialLog[ex.id] = Array(ex.sets).fill({ weight: 0, reps: 0 });
        });
        setCurrentLog(initialLog);
        setIsLoggingMode(true);
    };

    const updateLog = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: number) => {
        setCurrentLog(prev => {
            const exerciseLogs = [...(prev[exerciseId] || [])];
            exerciseLogs[setIndex] = { ...exerciseLogs[setIndex], [field]: value };
            return { ...prev, [exerciseId]: exerciseLogs };
        });
    };

    const finishWorkout = () => {
        // Transform currentLog into WorkoutLogEntry
        const exercisesLog = Object.entries(currentLog).map(([exId, sets]) => ({
            exerciseId: exId,
            setsDone: (sets as { weight: number, reps: number }[]).filter(s => s.reps > 0) // Only save sets with data
        }));

        const newLog: WorkoutLogEntry = {
            id: Date.now().toString(),
            workoutSessionId: activeSession.id,
            date: new Date().toISOString().split('T')[0],
            duration: activeSession.durationEstimate || '60 min',
            perceivedEffort: workoutRPE,
            exercises: exercisesLog
        };

        logWorkoutSession(newLog);
        setIsLoggingMode(false);
        alert("Treino registrado com sucesso! Ótimo trabalho.");
    };

    // Calculate Evolution Data (Mock logic - getting volume for 1 exercise over time)
    const getEvolutionData = () => {
        // Filter logs for this routine
        // Flatten logs to get dates and total volume of first exercise in session
        return workoutLogs
            .filter(l => activeRoutine.sessions.some(s => s.id === l.workoutSessionId))
            .map(log => {
                 // Calculate Total Volume of the workout (simplified)
                 const volume = log.exercises.reduce((acc, ex) => {
                     return acc + ex.setsDone.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
                 }, 0);
                 return { date: log.date.substring(5), volume };
            })
            .reverse(); // Show chronological
    };

    const evolutionData = getEvolutionData();

    return (
        <div className="space-y-6 animate-fade-in">
             {/* Header */}
             <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 ${isProfessionalView ? 'border-orange-100 bg-orange-50/30' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-900 flex items-center">
                            <Dumbbell className="h-6 w-6 mr-3 text-gold-500" />
                            {activeRoutine.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{activeRoutine.goal}</span>
                            <span className="text-slate-400 text-xs">|</span>
                            <span className="text-slate-500 text-sm">Responsável: <strong>{activeRoutine.trainerName}</strong></span>
                        </div>
                    </div>
                    
                    {/* View Switcher (Patient Only - Professionals can toggle too to check stats) */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('plan')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'plan' ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500'}`}
                        >
                            Ficha
                        </button>
                        <button 
                            onClick={() => setViewMode('evolution')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'evolution' ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500'}`}
                        >
                            Evolução
                        </button>
                    </div>
                </div>

                {/* Session Selector (Tabs) */}
                <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                    {activeRoutine.sessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => { setActiveSessionId(session.id); setIsLoggingMode(false); }}
                            className={`flex flex-col items-start px-5 py-3 rounded-xl min-w-[140px] text-sm font-bold transition-all border ${
                                activeSessionId === session.id 
                                ? 'bg-primary-900 text-white border-primary-900 shadow-md' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-primary-300'
                            }`}
                        >
                            <span className="text-xs opacity-70 mb-1 uppercase tracking-wide">{session.type === 'cardio' ? 'Cardio' : 'Musculação'}</span>
                            <span className="truncate w-full text-left">{session.name.split('-')[0]}</span>
                            <div className="mt-2 flex gap-1">
                                {session.assignedDays.map(d => (
                                    <span key={d} className="text-[10px] uppercase bg-white/20 px-1 rounded">{d}</span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
             </div>

            {/* EVOLUTION VIEW */}
            {viewMode === 'evolution' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-green-600" /> Volume de Treino Total (kg)
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolutionData}>
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                <Line type="monotone" dataKey="volume" stroke="#d97706" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="text-xs text-slate-500 uppercase font-bold">Treinos Realizados</div>
                            <div className="text-2xl font-bold text-slate-900">{workoutLogs.length}</div>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="text-xs text-slate-500 uppercase font-bold">Maior Carga (Supino)</div>
                            <div className="text-2xl font-bold text-slate-900">32kg</div>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAN VIEW */}
            {viewMode === 'plan' && (
                <>
                {/* Actions Bar */}
                {!isProfessionalView && !isLoggingMode && (
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center text-slate-600 text-sm font-medium">
                            <Timer className="h-4 w-4 mr-2" /> Duração Est.: <span className="text-slate-900 font-bold ml-1">{activeSession.durationEstimate}</span>
                        </div>
                        <button 
                            onClick={startLogging}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary-900/20 flex items-center transition-all hover:scale-105"
                        >
                            <PlayCircle className="h-5 w-5 mr-2" /> Iniciar Treino
                        </button>
                    </div>
                )}

                {/* LOGGING HEADER */}
                {isLoggingMode && (
                     <div className="sticky top-0 z-20 bg-primary-950 text-white p-4 rounded-xl shadow-lg flex justify-between items-center mb-6">
                        <div>
                            <span className="text-xs text-primary-300 uppercase font-bold animate-pulse">Treino em Andamento</span>
                            <h3 className="font-bold text-lg">{activeSession.name}</h3>
                        </div>
                        <button 
                            onClick={finishWorkout}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center"
                        >
                            <Save className="h-4 w-4 mr-2" /> Finalizar
                        </button>
                     </div>
                )}

                {/* Exercise List */}
                 <div className="grid grid-cols-1 gap-4">
                    {activeSession.exercises.map((exercise, index) => (
                        <div key={exercise.id} className={`bg-white rounded-xl shadow-sm border p-5 transition-colors ${isLoggingMode ? 'border-primary-200 ring-1 ring-primary-50' : 'border-slate-200 group hover:border-primary-400'}`}>
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Header Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">{exercise.name}</h3>
                                        {exercise.method && exercise.method !== 'Normal' && (
                                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{exercise.method}</span>
                                        )}
                                    </div>
                                    
                                    {/* Technical Details Grid */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Séries</div>
                                            <div className="font-bold text-slate-800">{exercise.sets}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Reps</div>
                                            <div className="font-bold text-slate-800">{exercise.reps}</div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Descanso</div>
                                            <div className="font-bold text-slate-800">{exercise.rest}</div>
                                        </div>
                                    </div>
                                    {exercise.notes && <p className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-2">{exercise.notes}</p>}
                                </div>

                                {/* LOGGING INPUTS */}
                                {isLoggingMode && (
                                    <div className="w-full md:w-64 bg-stone-50 p-3 rounded-lg border border-stone-200">
                                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2 px-1">
                                            <span>Série</span>
                                            <span>kg</span>
                                            <span>Reps</span>
                                            <span>Feito</span>
                                        </div>
                                        <div className="space-y-2">
                                            {Array.from({length: exercise.sets}).map((_, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-400 w-4">{i+1}</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="kg"
                                                        className="w-16 p-1.5 text-sm border border-slate-300 rounded text-center focus:ring-1 focus:ring-primary-500"
                                                        onChange={(e) => updateLog(exercise.id, i, 'weight', parseInt(e.target.value))}
                                                    />
                                                    <input 
                                                        type="number" 
                                                        placeholder="reps"
                                                        className="w-16 p-1.5 text-sm border border-slate-300 rounded text-center focus:ring-1 focus:ring-primary-500"
                                                        onChange={(e) => updateLog(exercise.id, i, 'reps', parseInt(e.target.value))}
                                                    />
                                                    <input type="checkbox" className="h-5 w-5 text-green-600 rounded focus:ring-green-500 border-gray-300" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Footer (Non-Logging) */}
                            {!isLoggingMode && !isProfessionalView && (
                                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <button className="text-xs font-bold text-slate-400 hover:text-primary-600 flex items-center gap-1">
                                        <History className="h-3 w-3" /> Ver Histórico
                                    </button>
                                    <button className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1">
                                        <PlayCircle className="h-4 w-4" /> Ver Execução
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
                
                 {/* RPE Selector at bottom of log */}
                 {isLoggingMode && (
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mt-8">
                         <h4 className="font-bold text-slate-900 mb-4">Percepção de Esforço (RPE)</h4>
                         <div className="flex justify-between gap-1">
                             {[1,2,3,4,5,6,7,8,9,10].map(val => (
                                 <button 
                                    key={val}
                                    onClick={() => setWorkoutRPE(val)}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                                        workoutRPE === val 
                                        ? 'bg-primary-600 text-white transform scale-110 shadow-md' 
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                 >
                                     {val}
                                 </button>
                             ))}
                         </div>
                         <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 uppercase">
                             <span>Muito Leve</span>
                             <span>Exaustão</span>
                         </div>
                     </div>
                 )}
                </>
            )}
        </div>
    );
};

export default Workout;
