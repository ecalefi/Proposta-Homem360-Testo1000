
export type UserRole = 'patient' | 'admin' | 'nutritionist' | 'trainer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName?: string;
  date: string;
  time: string;
  type: 'Consulta Presencial' | 'Retorno' | 'Procedimento';
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
  notes?: string;
}

export interface HealthMetric {
  date: string;
  value: number;
  secondaryValue?: number;
}

export interface DashboardMetrics {
  testosterone: HealthMetric[];
  psa: HealthMetric[];
  weight: HealthMetric[];
  sleepScore: number;
  erectileScore: number;
}

export interface HabitLog {
  id?: string;
  date?: string;
  waterIntake: number;
  waterTarget: number;
  workoutCompleted: boolean;
  sleepHours: number;
  mood: 'excellent' | 'good' | 'neutral' | 'bad';
  familyTime: boolean;
  hobbyTime: boolean;
}

export interface CustomHabit {
  id: string;
  patientId: string;
  title: string;
  category: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
  goalDescription: string;
  streak: number;
  completedToday: boolean;
  lastSevenDays: boolean[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  title: string;
  content: string;
  type: 'anamnese' | 'evolucao' | 'prescricao';
  doctorName: string;
}

export interface Exam {
  id: string;
  patientId: string;
  date: string;
  title: string;
  fileUrl: string;
  type: 'laboratorial' | 'imagem' | 'laudo';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

// NEW BROADCAST TYPE
export interface Broadcast {
    id: string;
    senderId: string;
    content: string;
    date: string;
    recipientCount: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'article';
  category: string;
  thumbnailUrl?: string;
  duration?: string;
  description: string;
}

export interface Meal {
    id: string;
    name: string;
    time: string;
    items: string[];
    calories: number;
    protein: number;
}

export interface DietPlan {
    id: string;
    patientId: string;
    nutritionistName: string;
    goal: string;
    dailyCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    meals: Meal[];
}

export interface DietLog {
    id: string;
    mealId: string;
    date: string;
    completed: boolean;
    notes?: string;
}

export type WeekDay = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string; // "12-15"
    rest: string; // "60s"
    method?: string; // "Bi-set", "Drop-set", "Normal"
    cadence?: string; // "3010"
    notes?: string;
    videoUrl?: string;
}

export interface WorkoutSession {
    id: string;
    name: string; // "Treino A - Peito", "Cardio"
    type: 'strength' | 'cardio' | 'mobility';
    assignedDays: WeekDay[];
    exercises: Exercise[];
    durationEstimate?: string; // "50 min"
}

export interface WorkoutRoutine {
    id: string;
    patientId: string;
    trainerName: string;
    title: string; // "Periodização Hipertrofia - FASE 1"
    startDate: string;
    endDate: string;
    goal: string;
    sessions: WorkoutSession[]; // List of splits (A, B, C, Cardio)
}

export interface WorkoutLogEntry {
    id: string;
    workoutSessionId: string; // Link to "Treino A"
    date: string; // YYYY-MM-DD
    duration: string; // "55 min"
    perceivedEffort: number; // 1-10 (RPE)
    notes?: string;
    exercises: {
        exerciseId: string;
        setsDone: {
            weight: number;
            reps: number;
        }[];
    }[];
}

export interface MentorshipGoal {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'achieved';
    deadline: string;
    category: 'career' | 'health' | 'mindset';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  AGENDA = 'AGENDA',
  RECORDS = 'RECORDS',
  SIX_PS = 'SIX_PS',
  CHAT = 'CHAT',
  CONTENT = 'CONTENT',
  
  NUTRITION = 'NUTRITION',
  WORKOUT = 'WORKOUT',
  MENTORSHIP = 'MENTORSHIP',

  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_PATIENTS = 'ADMIN_PATIENTS',
  ADMIN_PATIENT_DETAIL = 'ADMIN_PATIENT_DETAIL', 
  ADMIN_CALENDAR = 'ADMIN_CALENDAR',

  NUTRI_DASHBOARD = 'NUTRI_DASHBOARD',
  NUTRI_PATIENTS = 'NUTRI_PATIENTS',
  NUTRI_MEAL_PLANNER = 'NUTRI_MEAL_PLANNER',

  TRAINER_DASHBOARD = 'TRAINER_DASHBOARD',
  TRAINER_PATIENTS = 'TRAINER_PATIENTS',
  TRAINER_WORKOUT_BUILDER = 'TRAINER_WORKOUT_BUILDER'
}
