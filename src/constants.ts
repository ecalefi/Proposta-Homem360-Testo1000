import { DashboardMetrics, HabitLog, Appointment, User, Medication, Message, ContentItem, FAQItem } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Roberto Mendes',
  email: 'roberto.mendes@email.com',
  role: 'patient',
  avatarUrl: 'https://picsum.photos/200'
};

// Updated Metrics: Narrative of successful treatment over 6 months leading to Jan 2026
// Added secondaryValue for "Testosterona Livre"
export const MOCK_METRICS: DashboardMetrics = {
  testosterone: [
    { date: 'Ago/25', value: 320, secondaryValue: 6.5 },
    { date: 'Set/25', value: 450, secondaryValue: 9.8 },
    { date: 'Out/25', value: 580, secondaryValue: 12.4 },
    { date: 'Nov/25', value: 690, secondaryValue: 15.1 },
    { date: 'Dez/25', value: 750, secondaryValue: 17.5 },
    { date: 'Jan/26', value: 820, secondaryValue: 19.8 },
  ],
  psa: [
    { date: 'Jun/25', value: 1.1 },
    { date: 'Jan/26', value: 1.2 },
  ],
  weight: [
    { date: 'Ago/25', value: 94.0 },
    { date: 'Out/25', value: 91.5 },
    { date: 'Dez/25', value: 88.0 },
    { date: 'Jan/26', value: 86.0 },
  ],
  sleepScore: 88, // Improved
  erectileScore: 24, // Almost max (25)
};

export const INITIAL_HABITS: HabitLog = {
  waterIntake: 2250,
  waterTarget: 3000,
  workoutCompleted: true,
  sleepHours: 7.5,
  mood: 'good',
  familyTime: true,
  hobbyTime: false,
};

export const MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Testosterona Base Pentravan', dosage: '2 pumps (50mg)', time: '08:00', taken: true },
  { id: 'm2', name: 'Tadalafila (Uso Diário)', dosage: '5mg', time: '22:00', taken: false },
  { id: 'm3', name: 'Omega 3 + Vitamina D', dosage: '2 caps', time: '12:00', taken: true },
];

export const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    date: '18/01/2026', // HOJE
    time: '14:30',
    type: 'Consulta Presencial',
    status: 'confirmado',
    notes: 'Avaliação de exames trimestrais.'
  },
  {
    id: 'a2',
    date: '25/02/2026',
    time: '09:00',
    type: 'Retorno',
    status: 'pendente'
  }
];

export const QUOTES = [
  "A disciplina é a ponte entre metas e realizações.",
  "Cuide do seu corpo. É o único lugar que você tem para viver.",
  "A constância vence a intensidade.",
  "Homens fortes cuidam de si mesmos e de suas famílias.",
  "O que você faz todos os dias importa mais do que o que você faz de vez em quando."
];

export const MOCK_MESSAGES: Message[] = [
    { id: '1', senderId: 'u1', receiverId: 'admin-1', content: 'Bom dia, Dr. Edgar. Fiz o exame de sangue ontem.', timestamp: '17/01/2026 09:30', read: true, type: 'text' },
    { id: '2', senderId: 'admin-1', receiverId: 'u1', content: 'Ótimo, Roberto. Assim que o laboratório liberar, já aparecerá aqui no sistema. Como está se sentindo com a nova dose?', timestamp: '17/01/2026 09:45', read: true, type: 'text' },
    { id: '3', senderId: 'u1', receiverId: 'admin-1', content: 'Muito bem. Mais energia durante o treino.', timestamp: '17/01/2026 10:05', read: true, type: 'text' },
];

export const CONTENT_LIBRARY: ContentItem[] = [
    {
        id: 'c1',
        title: 'Mitos e Verdades sobre Reposição Hormonal',
        type: 'video',
        category: 'Hormônios',
        description: 'Dr. Edgar explica os principais erros que os homens cometem ao iniciar a TRT.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
        duration: '12:30'
    },
    {
        id: 'c2',
        title: 'Guia de Hipertrofia para Homens +40',
        type: 'article',
        category: 'Performance',
        description: 'Como adaptar o treino para ganhar massa muscular preservando as articulações.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
        duration: '8 min leitura'
    },
    {
        id: 'c3',
        title: 'Saúde da Próstata: O que o PSA diz sobre você',
        type: 'article',
        category: 'Prevenção',
        description: 'Entenda os níveis de referência e quando se preocupar.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=400',
        duration: '5 min leitura'
    },
     {
        id: 'c4',
        title: 'Disfunção Erétil Psicológica vs Orgânica',
        type: 'video',
        category: 'Sexualidade',
        description: 'Como diferenciar a causa e buscar o tratamento correto.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516575334481-f85287c2c81d?auto=format&fit=crop&q=80&w=400',
        duration: '15:45'
    }
];

export const MOCK_FAQ: FAQItem[] = [
    { id: '1', question: 'Como aplicar o gel de testosterona?', category: 'Tratamentos', answer: 'O gel deve ser aplicado pela manhã, após o banho, em uma área de pele limpa e seca (ombros, braços ou abdômen). Espere secar antes de vestir a roupa.' },
    { id: '2', question: 'Qual a frequência dos exames?', category: 'Consultas', answer: 'Geralmente a cada 3 meses no início do tratamento e a cada 6 meses na fase de manutenção.' },
    { id: '3', question: 'Posso beber álcool?', category: 'Estilo de Vida', answer: 'O consumo moderado é aceitável, mas o excesso pode prejudicar o fígado e a eficácia hormonal.' },
];