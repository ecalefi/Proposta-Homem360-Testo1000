
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, MedicalRecord, Exam, CustomHabit, DietPlan, WorkoutRoutine, MentorshipGoal, Medication, Appointment, DietLog, WorkoutLogEntry, Broadcast } from '../types';
import { MEDICATIONS, UPCOMING_APPOINTMENTS } from '../constants';

// --- DADOS MOCKADOS DE MENSAGENS ---
const EXISTING_RICH_MESSAGES: Message[] = [
    { id: '1', senderId: 'u1', receiverId: 'admin-1', content: 'Bom dia, Dr. Edgar. Fiz o exame de sangue ontem.', timestamp: '17/01/2026 09:30', read: true, type: 'text' },
    { id: '2', senderId: 'admin-1', receiverId: 'u1', content: 'Ótimo, Roberto. Assim que o laboratório liberar, já aparecerá aqui. Sentiu diferença na disposição?', timestamp: '17/01/2026 09:45', read: true, type: 'text' },
    { id: '3', senderId: 'u1', receiverId: 'admin-1', content: 'Muita diferença. Treino rendendo 100%.', timestamp: '17/01/2026 10:05', read: true, type: 'text' },
    { id: '4', senderId: 'u2', receiverId: 'admin-1', content: 'Dr, estou preocupado. O laboratório me ligou sobre o PSA.', timestamp: '18/01/2026 08:15', read: false, type: 'text' },
    { id: '5', senderId: 'admin-1', receiverId: 'u2', content: 'Carlos, fique tranquilo. O valor subiu um pouco (4.5), mas pode ser apenas uma inflamação. Vamos agendar um USG.', timestamp: '18/01/2026 08:30', read: true, type: 'text' },
    { id: '8', senderId: 'nutri-1', receiverId: 'u1', content: 'Olá Roberto! Vi que você marcou todas as refeições ontem. Parabéns! Como foi a digestão com o aumento de proteína?', timestamp: '18/01/2026 10:00', read: false, type: 'text' },
    { id: '8a', senderId: 'u1', receiverId: 'nutri-1', content: 'Oi Ana! Tudo ótimo, sem inchaço. A batata doce no pré-treino ajudou muito.', timestamp: '18/01/2026 10:15', read: true, type: 'text' },
    { id: '9', senderId: 'trainer-1', receiverId: 'u1', content: 'Fala Beto! Vi que aumentou a carga no Supino. Boa! Lembre de manter a cadência de 3 segundos na descida.', timestamp: '19/01/2026 08:00', read: false, type: 'text' },
    { id: '9a', senderId: 'u1', receiverId: 'trainer-1', content: 'Valeu mestre! Senti o tríceps falhar na última, mas segurei a descida.', timestamp: '19/01/2026 08:30', read: true, type: 'text' },
    { id: '10', senderId: 'admin-1', receiverId: 'nutri-1', content: 'Ana, o Roberto (u1) está com a testosterona em níveis ótimos (820). Podemos apertar um pouco mais o déficit calórico para secar, o que acha?', timestamp: '19/01/2026 11:00', read: false, type: 'text' },
    { id: '11', senderId: 'nutri-1', receiverId: 'admin-1', content: 'Dr., concordo. Vou reduzir o carbo do jantar e aumentar a gordura boa. Ele tem reclamado de fome à noite?', timestamp: '19/01/2026 11:15', read: true, type: 'text' },
    { id: '12', senderId: 'admin-1', receiverId: 'trainer-1', content: 'Beto, atenção com o aluno Carlos Andrade (u2). Ele está com uma inflamação pélvica. Evitar exercícios com pressão excessiva no períneo (ciclismo intenso, leg press muito pesado) por 15 dias.', timestamp: '18/01/2026 14:00', read: true, type: 'text' },
    { id: '13', senderId: 'trainer-1', receiverId: 'admin-1', content: 'Ciente, Dr! Vou adaptar para exercícios em pé e isolados de membros superiores. Corto o agachamento livre?', timestamp: '18/01/2026 14:30', read: true, type: 'text' },
];

const EXISTING_RICH_RECORDS: MedicalRecord[] = [
    { id: 'r1', patientId: 'u1', date: '18/01/2026', type: 'evolucao', title: 'Retorno Trimestral - TRT', content: 'Paciente relata excelente adaptação ao implante hormonal. Exames: T=820, E2=35. Mantida conduta.', doctorName: 'Dr. Edgar' },
    { id: 'r2', patientId: 'u1', date: '15/10/2025', type: 'prescricao', title: 'Ajuste Medicamentoso', content: '1. Espironolactona 50mg\n2. Tadalafila 5mg', doctorName: 'Dr. Edgar' },
];

const EXISTING_RICH_EXAMS: Exam[] = [
    { id: 'e1', patientId: 'u1', date: '15/01/2026', title: 'Painel Hormonal Completo', fileUrl: '#', type: 'laboratorial' },
    { id: 'e2', patientId: 'u1', date: '15/01/2026', title: 'Hemograma + Bioquímica', fileUrl: '#', type: 'laboratorial' },
];

const EXISTING_RICH_HABITS: CustomHabit[] = [
    { id: 'h1', patientId: 'u1', title: 'Sem Açúcar Refinado', category: 'P1', goalDescription: 'Evitar doces e refrigerantes', streak: 12, completedToday: true, lastSevenDays: [true, true, true, false, true, true, true] },
    { id: 'h2', patientId: 'u1', title: 'Jiu-Jitsu', category: 'P2', goalDescription: 'Treinar 3x na semana', streak: 4, completedToday: false, lastSevenDays: [false, true, false, true, false, true, false] },
    { id: 'h3', patientId: 'u1', title: 'Ler Estoicismo', category: 'P3', goalDescription: 'Ler 1 capítulo', streak: 21, completedToday: false, lastSevenDays: [true, true, true, true, true, true, true] },
];

const EXISTING_RICH_DIET: DietPlan = {
    id: 'd1',
    patientId: 'u1',
    nutritionistName: 'Nutri. Ana Clara',
    goal: 'Hipertrofia com Definição',
    dailyCalories: 2800,
    macros: { protein: 30, carbs: 40, fat: 30 },
    meals: [
        { id: 'm1', name: 'Café da Manhã', time: '07:00', calories: 600, protein: 40, items: ['3 Ovos Mexidos', '150g Fruta', '30g Aveia'] },
        { id: 'm2', name: 'Almoço', time: '12:30', calories: 800, protein: 50, items: ['150g Patinho', '200g Arroz Integral', 'Vegetais'] },
    ]
};

// --- UPDATED WORKOUT DATA STRUCTURE (ABC Split) ---
const EXISTING_RICH_WORKOUTS: WorkoutRoutine[] = [
    {
        id: 'wr1',
        patientId: 'u1',
        trainerName: 'Personal Beto',
        title: 'Periodização Hipertrofia - Mesociclo 1',
        goal: 'Ganho de Massa Muscular',
        startDate: '01/01/2026',
        endDate: '28/02/2026',
        sessions: [
            {
                id: 'ws1',
                name: 'Treino A - Peito, Ombro e Tríceps',
                type: 'strength',
                assignedDays: ['seg', 'qui'],
                durationEstimate: '60 min',
                exercises: [
                    { id: 'ex1', name: 'Supino Inclinado Halteres', sets: 4, reps: '8-12', rest: '90s', method: 'Normal', cadence: '2020', notes: 'Banco a 30 graus. Focar na contração.' },
                    { id: 'ex2', name: 'Desenvolvimento Militar', sets: 4, reps: '8-10', rest: '90s', method: 'Normal', notes: 'Barra livre. Cuidado com a lombar.' },
                    { id: 'ex3', name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: '60s', method: 'Drop-set (última)', notes: 'Cotovelos levemente flexionados.' },
                    { id: 'ex4', name: 'Tríceps Corda', sets: 4, reps: '10-12', rest: '60s', method: 'Normal', notes: 'Estender totalmente no final.' },
                ]
            },
            {
                id: 'ws2',
                name: 'Treino B - Costas, Bíceps e Trapézio',
                type: 'strength',
                assignedDays: ['ter', 'sex'],
                durationEstimate: '60 min',
                exercises: [
                    { id: 'ex5', name: 'Puxada Alta', sets: 4, reps: '10-12', rest: '90s', method: 'Normal' },
                    { id: 'ex6', name: 'Remada Curvada', sets: 4, reps: '8-10', rest: '90s', method: 'Normal', notes: 'Tronco paralelo ao chão.' },
                    { id: 'ex7', name: 'Rosca Direta Barra W', sets: 3, reps: '10-12', rest: '60s', method: 'Normal' },
                    { id: 'ex8', name: 'Encolhimento Halteres', sets: 4, reps: '15', rest: '60s', method: 'Pico de Contração 2s' },
                ]
            },
            {
                id: 'ws3',
                name: 'Treino C - Pernas Completo',
                type: 'strength',
                assignedDays: ['qua', 'sab'],
                durationEstimate: '70 min',
                exercises: [
                    { id: 'ex9', name: 'Agachamento Livre', sets: 4, reps: '6-8', rest: '120s', method: 'Normal', notes: 'Amplitude máxima.' },
                    { id: 'ex10', name: 'Leg Press 45', sets: 4, reps: '10-12', rest: '90s', method: 'Normal' },
                    { id: 'ex11', name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: '60s', method: 'Drop-set' },
                    { id: 'ex12', name: 'Stiff', sets: 4, reps: '10-12', rest: '90s', method: 'Normal' },
                    { id: 'ex13', name: 'Panturrilha em Pé', sets: 5, reps: '15-20', rest: '45s', method: 'Normal' },
                ]
            },
            {
                id: 'ws4',
                name: 'Cardio LISS',
                type: 'cardio',
                assignedDays: ['seg', 'qua', 'sex'],
                durationEstimate: '30 min',
                exercises: [
                    { id: 'ex14', name: 'Esteira Inclinada ou Bike', sets: 1, reps: '30 min', rest: '-', notes: 'Frequência cardíaca entre 120-140bpm (Zona 2).' }
                ]
            }
        ]
    }
];

// --- WORKOUT LOGS MOCK ---
const INITIAL_WORKOUT_LOGS: WorkoutLogEntry[] = [
    {
        id: 'log1',
        workoutSessionId: 'ws1',
        date: '2026-01-15', // Quinta-feira passada
        duration: '58 min',
        perceivedEffort: 8,
        exercises: [
            { exerciseId: 'ex1', setsDone: [{weight: 24, reps: 12}, {weight: 26, reps: 10}, {weight: 28, reps: 8}, {weight: 28, reps: 7}] },
            { exerciseId: 'ex2', setsDone: [{weight: 15, reps: 10}, {weight: 15, reps: 10}, {weight: 15, reps: 9}, {weight: 15, reps: 8}] }
        ]
    }
];

const EXISTING_RICH_MENTORSHIP: MentorshipGoal[] = [
    { id: 'mg1', title: 'Ler 1 livro técnico por mês', status: 'in_progress', deadline: '30/06/2026', category: 'career' },
    { id: 'mg2', title: 'Reduzir % de gordura para 12%', status: 'in_progress', deadline: '30/03/2026', category: 'health' },
];

const INITIAL_BROADCASTS: Broadcast[] = [
    { id: 'b1', senderId: 'admin-1', content: 'Aviso: Devido ao feriado, a clínica estará fechada na próxima terça-feira.', date: '10/01/2026 14:00', recipientCount: 1248 }
];

interface DataContextType {
  messages: Message[];
  medicalRecords: MedicalRecord[];
  exams: Exam[];
  customHabits: CustomHabit[];
  dietPlan: DietPlan;
  workoutRoutines: WorkoutRoutine[];
  workoutLogs: WorkoutLogEntry[]; // New
  mentorshipGoals: MentorshipGoal[];
  medications: Medication[]; 
  appointments: Appointment[];
  dietLogs: DietLog[];
  broadcasts: Broadcast[]; // New
  
  sendMessage: (msg: Message) => void;
  sendBroadcast: (content: string) => void;
  markAsRead: (senderId: string, receiverId: string) => void; 
  addMedicalRecord: (record: MedicalRecord) => void;
  getRecordsByPatient: (patientId: string) => MedicalRecord[];
  addExam: (exam: Exam) => void;
  getExamsByPatient: (patientId: string) => Exam[];
  addCustomHabit: (habit: CustomHabit) => void;
  removeCustomHabit: (habitId: string) => void;
  toggleCustomHabit: (habitId: string) => void;
  toggleMedication: (medicationId: string) => void;
  addMedication: (medication: Medication) => void;
  removeMedication: (medicationId: string) => void;
  toggleMealCompletion: (mealId: string, date: string) => void;
  getDietLogsByDate: (date: string) => DietLog[];
  getDietPlan: (patientId: string) => DietPlan; 
  getWorkoutsByPatient: (patientId: string) => WorkoutRoutine[];
  addWorkoutRoutine: (routine: WorkoutRoutine) => void; // New for Trainer
  logWorkoutSession: (log: WorkoutLogEntry) => void; // New for Patient
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(EXISTING_RICH_MESSAGES);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(EXISTING_RICH_RECORDS);
  const [exams, setExams] = useState<Exam[]>(EXISTING_RICH_EXAMS);
  const [customHabits, setCustomHabits] = useState<CustomHabit[]>(EXISTING_RICH_HABITS);
  
  // Data for Features
  const [workoutRoutines, setWorkoutRoutines] = useState<WorkoutRoutine[]>(EXISTING_RICH_WORKOUTS);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>(INITIAL_WORKOUT_LOGS);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : MEDICATIONS;
  });

  const [dietLogs, setDietLogs] = useState<DietLog[]>(() => {
      const saved = localStorage.getItem('dietLogs');
      return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(UPCOMING_APPOINTMENTS);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('dietLogs', JSON.stringify(dietLogs));
  }, [dietLogs]);

  const dietPlan = EXISTING_RICH_DIET;
  const mentorshipGoals = EXISTING_RICH_MENTORSHIP;

  const sendMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const sendBroadcast = (content: string) => {
      const allPatientIds = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7']; 
      const timestamp = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      
      // 1. Send individual messages to everyone (Fan-out)
      const newMessages: Message[] = allPatientIds.map(patientId => ({
          id: Date.now().toString() + Math.random().toString(),
          senderId: 'admin-1',
          receiverId: patientId,
          content: content,
          timestamp: timestamp,
          read: false,
          type: 'text'
      }));
      setMessages(prev => [...prev, ...newMessages]);

      // 2. Add to Broadcast History
      const newBroadcast: Broadcast = {
          id: `b${Date.now()}`,
          senderId: 'admin-1',
          content,
          date: timestamp,
          recipientCount: 1248 // Mock total number
      };
      setBroadcasts(prev => [newBroadcast, ...prev]);
  };

  const markAsRead = (senderId: string, receiverId: string) => {
    setMessages(prev => prev.map(msg => 
        (msg.senderId === senderId && msg.receiverId === receiverId && !msg.read) 
        ? { ...msg, read: true } 
        : msg
    ));
  };

  const addMedicalRecord = (record: MedicalRecord) => {
    setMedicalRecords(prev => [record, ...prev]);
  };

  const getRecordsByPatient = (patientId: string) => {
    return medicalRecords.filter(r => r.patientId === patientId);
  };

  const addExam = (exam: Exam) => {
    setExams(prev => [exam, ...prev]);
  };

  const getExamsByPatient = (patientId: string) => {
    return exams.filter(e => e.patientId === patientId);
  };

  const addCustomHabit = (habit: CustomHabit) => {
    setCustomHabits(prev => [...prev, habit]);
  };

  const removeCustomHabit = (habitId: string) => {
    setCustomHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const toggleCustomHabit = (habitId: string) => {
    setCustomHabits(prev => prev.map(h => {
        if (h.id === habitId) {
            const newStatus = !h.completedToday;
            const newHistory = [...h.lastSevenDays];
            newHistory.shift();
            newHistory.push(newStatus);
            return {
                ...h,
                completedToday: newStatus,
                streak: newStatus ? h.streak + 1 : h.streak,
                lastSevenDays: newHistory
            };
        }
        return h;
    }));
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const addMedication = (med: Medication) => {
    setMedications(prev => [...prev, med]);
  };

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const toggleMealCompletion = (mealId: string, date: string) => {
      setDietLogs(prev => {
          const existing = prev.find(log => log.mealId === mealId && log.date === date);
          if (existing) {
              return prev.map(log => 
                (log.mealId === mealId && log.date === date) 
                ? { ...log, completed: !log.completed }
                : log
              );
          } else {
              const newLog: DietLog = {
                  id: Date.now().toString(),
                  mealId,
                  date,
                  completed: true
              };
              return [...prev, newLog];
          }
      });
  };

  const getDietLogsByDate = (date: string) => {
      return dietLogs.filter(log => log.date === date);
  };

  const getDietPlan = (patientId: string) => {
      return EXISTING_RICH_DIET; 
  };

  const getWorkoutsByPatient = (patientId: string) => {
      return workoutRoutines.filter(w => w.patientId === patientId);
  };

  const addWorkoutRoutine = (routine: WorkoutRoutine) => {
      setWorkoutRoutines(prev => [routine, ...prev]);
  };

  const logWorkoutSession = (log: WorkoutLogEntry) => {
      setWorkoutLogs(prev => [log, ...prev]);
  };

  return (
    <DataContext.Provider value={{ 
        messages, 
        medicalRecords, 
        exams, 
        customHabits,
        dietPlan,
        workoutRoutines,
        workoutLogs,
        mentorshipGoals,
        medications,
        appointments,
        dietLogs,
        broadcasts,
        sendMessage, 
        sendBroadcast,
        markAsRead,
        addMedicalRecord, 
        getRecordsByPatient,
        addExam,
        getExamsByPatient,
        addCustomHabit,
        removeCustomHabit,
        toggleCustomHabit,
        toggleMedication,
        addMedication,
        removeMedication,
        toggleMealCompletion,
        getDietLogsByDate,
        getDietPlan,
        getWorkoutsByPatient,
        addWorkoutRoutine,
        logWorkoutSession
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
