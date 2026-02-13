
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Dumbbell, Plus, Trash2, Save, Calendar, Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { WorkoutRoutine, WorkoutSession, WeekDay, Exercise } from '../types';

const INITIAL_SESSION_TEMPLATE: WorkoutSession = {
    id: '',
    name: 'Novo Treino',
    type: 'strength',
    assignedDays: [],
    exercises: [],
    durationEstimate: '60 min'
};

const TrainerWorkoutBuilder: React.FC = () => {
    const { addWorkoutRoutine } = useData();
    
    // Form State
    const [title, setTitle] = useState('');
    const [goal, setGoal] = useState('Hipertrofia');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sessions, setSessions] = useState<WorkoutSession[]>([
        { ...INITIAL_SESSION_TEMPLATE, id: 's1', name: 'Treino A', exercises: [] }
    ]);

    // UI State
    const [activeSessionIdx, setActiveSessionIdx] = useState(0);

    const addSession = () => {
        const newId = `s${Date.now()}`;
        const nameChar = String.fromCharCode(65 + sessions.length); // A, B, C...
        setSessions([...sessions, { ...INITIAL_SESSION_TEMPLATE, id: newId, name: `Treino ${nameChar}` }]);
        setActiveSessionIdx(sessions.length);
    };

    const removeSession = (idx: number) => {
        const newSessions = [...sessions];
        newSessions.splice(idx, 1);
        setSessions(newSessions);
        setActiveSessionIdx(Math.max(0, idx - 1));
    };

    const updateSession = (idx: number, field: keyof WorkoutSession, value: any) => {
        const newSessions = [...sessions];
        newSessions[idx] = { ...newSessions[idx], [field]: value };
        setSessions(newSessions);
    };

    const toggleDay = (sessionIdx: number, day: WeekDay) => {
        const currentDays = sessions[sessionIdx].assignedDays;
        const newDays = currentDays.includes(day) 
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        updateSession(sessionIdx, 'assignedDays', newDays);
    };

    // Exercise Management inside a session
    const addExercise = (sessionIdx: number) => {
        const newEx: Exercise = {
            id: `ex${Date.now()}`,
            name: '',
            sets: 3,
            reps: '10-12',
            rest: '60s',
            method: 'Normal'
        };
        const newSessions = [...sessions];
        newSessions[sessionIdx].exercises.push(newEx);
        setSessions(newSessions);
    };

    const updateExercise = (sessionIdx: number, exIdx: number, field: keyof Exercise, value: any) => {
        const newSessions = [...sessions];
        newSessions[sessionIdx].exercises[exIdx] = { 
            ...newSessions[sessionIdx].exercises[exIdx], 
            [field]: value 
        };
        setSessions(newSessions);
    };

    const removeExercise = (sessionIdx: number, exIdx: number) => {
        const newSessions = [...sessions];
        newSessions[sessionIdx].exercises.splice(exIdx, 1);
        setSessions(newSessions);
    };

    const handleSave = () => {
        if (!title || !startDate) {
            alert("Preencha o título e a data de início.");
            return;
        }

        const newRoutine: WorkoutRoutine = {
            id: `wr${Date.now()}`,
            patientId: 'u1', // Hardcoded for demo, normally selected from props or context
            trainerName: 'Personal Logado',
            title,
            goal,
            startDate,
            endDate,
            sessions
        };

        addWorkoutRoutine(newRoutine);
        alert("Periodização salva com sucesso!");
        // Reset form or redirect
    };

    const weekDays: {key: WeekDay, label: string}[] = [
        {key: 'seg', label: 'SEG'}, {key: 'ter', label: 'TER'}, {key: 'qua', label: 'QUA'},
        {key: 'qui', label: 'QUI'}, {key: 'sex', label: 'SEX'}, {key: 'sab', label: 'SÁB'}, {key: 'dom', label: 'DOM'}
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-orange-900 flex items-center">
                        <Dumbbell className="h-6 w-6 mr-3 text-orange-600" />
                        Construtor de Treinos
                    </h2>
                    <p className="text-slate-500">Crie periodizações completas e distribua os treinos na semana.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center transition-all"
                >
                    <Save className="h-5 w-5 mr-2" /> Salvar Periodização
                </button>
            </div>

            {/* General Settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Título da Periodização</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ex: Hipertrofia - Mesociclo 1"
                        className="w-full border border-slate-400 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 placeholder-slate-500 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Objetivo</label>
                    <select 
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        className="w-full border border-slate-400 rounded-lg p-2.5 bg-white text-slate-900 font-medium"
                    >
                        <option>Hipertrofia</option>
                        <option>Emagrecimento</option>
                        <option>Força</option>
                        <option>Resistência</option>
                        <option>Mobilidade</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Início</label>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full border border-slate-400 rounded-lg p-2.5 text-slate-900 font-medium"
                    />
                </div>
            </div>

            {/* Session Builder */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Sidebar: Sessions List */}
                <div className="w-full lg:w-64 flex flex-col gap-3">
                    {sessions.map((session, idx) => (
                        <div 
                            key={session.id}
                            onClick={() => setActiveSessionIdx(idx)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                activeSessionIdx === idx 
                                ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-105' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold">{session.name}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeSession(idx); }}
                                    className={`p-1 rounded hover:bg-white/20 ${activeSessionIdx === idx ? 'text-white' : 'text-slate-400 hover:text-red-500'}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-xs opacity-80 flex flex-wrap gap-1">
                                {session.assignedDays.length > 0 ? session.assignedDays.join(', ').toUpperCase() : 'Sem dias'}
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={addSession}
                        className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Treino
                    </button>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
                    {sessions[activeSessionIdx] && (
                        <div className="space-y-6">
                            {/* Session Header Config */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome do Treino</label>
                                    <input 
                                        type="text" 
                                        value={sessions[activeSessionIdx].name}
                                        onChange={e => updateSession(activeSessionIdx, 'name', e.target.value)}
                                        className="w-full border border-slate-400 rounded-lg p-2 text-slate-900 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo</label>
                                    <select 
                                        value={sessions[activeSessionIdx].type}
                                        onChange={e => updateSession(activeSessionIdx, 'type', e.target.value)}
                                        className="w-full border border-slate-400 rounded-lg p-2 bg-white text-slate-900 font-medium"
                                    >
                                        <option value="strength">Musculação / Força</option>
                                        <option value="cardio">Cardio</option>
                                        <option value="mobility">Mobilidade / Alongamento</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Dias da Semana</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {weekDays.map(day => (
                                            <button
                                                key={day.key}
                                                onClick={() => toggleDay(activeSessionIdx, day.key)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                    sessions[activeSessionIdx].assignedDays.includes(day.key)
                                                    ? 'bg-orange-100 text-orange-700 border-orange-200'
                                                    : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-white'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Exercises List */}
                            <div>
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                    Exercícios ({sessions[activeSessionIdx].exercises.length})
                                </h3>
                                <div className="space-y-3">
                                    {sessions[activeSessionIdx].exercises.map((ex, exIdx) => (
                                        <div key={ex.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 group">
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-300 shrink-0">
                                                    {exIdx + 1}
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="Nome do Exercício (ex: Supino Reto)"
                                                    value={ex.name}
                                                    onChange={e => updateExercise(activeSessionIdx, exIdx, 'name', e.target.value)}
                                                    className="flex-1 border border-slate-400 rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 placeholder-slate-500"
                                                />
                                                <button 
                                                    onClick={() => removeExercise(activeSessionIdx, exIdx)}
                                                    className="text-slate-400 hover:text-red-500 p-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pl-11">
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Séries</label>
                                                    <input type="number" value={ex.sets} onChange={e => updateExercise(activeSessionIdx, exIdx, 'sets', parseInt(e.target.value))} className="w-full p-1.5 border border-slate-400 rounded text-sm text-center text-slate-900 font-medium" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Reps</label>
                                                    <input type="text" value={ex.reps} onChange={e => updateExercise(activeSessionIdx, exIdx, 'reps', e.target.value)} className="w-full p-1.5 border border-slate-400 rounded text-sm text-center text-slate-900 font-medium" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Intervalo</label>
                                                    <input type="text" value={ex.rest} onChange={e => updateExercise(activeSessionIdx, exIdx, 'rest', e.target.value)} className="w-full p-1.5 border border-slate-400 rounded text-sm text-center text-slate-900 font-medium" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Método / Obs</label>
                                                    <input type="text" value={ex.method} onChange={e => updateExercise(activeSessionIdx, exIdx, 'method', e.target.value)} className="w-full p-1.5 border border-slate-400 rounded text-sm text-slate-900 font-medium" placeholder="Normal, Drop-set..." />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => addExercise(activeSessionIdx)}
                                    className="mt-4 w-full py-3 border-2 border-dashed border-orange-200 bg-orange-50 text-orange-700 font-bold rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-center"
                                >
                                    <Plus className="h-5 w-5 mr-2" /> Adicionar Exercício
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerWorkoutBuilder;
