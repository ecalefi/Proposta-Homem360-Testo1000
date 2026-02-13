import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import { Moon, TrendingUp, Calendar } from 'lucide-react';

interface SleepData {
  day: string;
  date: string;
  hours: number;
  quality: 'bad' | 'fair' | 'good' | 'excellent';
  score: number;
}

interface SleepChartProps {
  data?: SleepData[];
  targetHours?: number;
}

// Dados mockados para exemplo
const defaultData: SleepData[] = [
  { day: 'Seg', date: '10/02', hours: 6.5, quality: 'fair', score: 70 },
  { day: 'Ter', date: '11/02', hours: 7.0, quality: 'good', score: 85 },
  { day: 'Qua', date: '12/02', hours: 5.5, quality: 'bad', score: 55 },
  { day: 'Qui', date: '13/02', hours: 7.5, quality: 'excellent', score: 95 },
  { day: 'Sex', date: '14/02', hours: 6.0, quality: 'fair', score: 65 },
  { day: 'Sáb', date: '15/02', hours: 8.0, quality: 'excellent', score: 100 },
  { day: 'Dom', date: '16/02', hours: 7.0, quality: 'good', score: 85 },
];

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'bad':
      return '#EF4444';
    case 'fair':
      return '#F59E0B';
    case 'good':
      return '#3B82F6';
    case 'excellent':
      return '#10B981';
    default:
      return '#6B7280';
  }
};

const getQualityLabel = (quality: string) => {
  switch (quality) {
    case 'bad':
      return 'Ruim';
    case 'fair':
      return 'Regular';
    case 'good':
      return 'Bom';
    case 'excellent':
      return 'Excelente';
    default:
      return 'Desconhecido';
  }
};

const SleepChart: React.FC<SleepChartProps> = ({
  data = defaultData,
  targetHours = 7,
}) => {
  // Calcular estatísticas
  const avgHours = data.reduce((acc, d) => acc + d.hours, 0) / data.length;
  const avgScore = data.reduce((acc, d) => acc + d.score, 0) / data.length;
  const bestDay = data.reduce((acc, d) => (d.hours > acc.hours ? d : acc), data[0]);
  const daysOnTarget = data.filter((d) => d.hours >= targetHours).length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">
            {label}, {data.date}
          </p>
          <p className="text-indigo-600 font-semibold">
            {data.hours} horas dormidas
          </p>
          <p className="text-sm" style={{ color: getQualityColor(data.quality) }}>
            Qualidade: {getQualityLabel(data.quality)}
          </p>
          <p className="text-sm text-gray-500">Score: {data.score}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Moon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Análise do Sono</h3>
            <p className="text-sm text-gray-500">Últimos 7 dias</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-indigo-600">{avgHours.toFixed(1)}h</p>
          <p className="text-sm text-gray-500">média diária</p>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Score Médio</p>
          <p className="font-bold text-indigo-700">{avgScore.toFixed(0)}/100</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Dias na Meta</p>
          <p className="font-bold text-green-700">{daysOnTarget}/7</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <Moon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Melhor Noite</p>
          <p className="font-bold text-amber-700">{bestDay.hours}h</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <Moon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Meta</p>
          <p className="font-bold text-purple-700">{targetHours}h</p>
        </div>
      </div>

      {/* Gráfico de Área */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={targetHours}
              stroke="#10B981"
              strokeDasharray="5 5"
              label={{
                value: 'Meta',
                position: 'right',
                fill: '#10B981',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorHours)"
              dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda de qualidade */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { quality: 'excellent', label: 'Excelente (7-9h)', color: '#10B981' },
          { quality: 'good', label: 'Bom (6-7h)', color: '#3B82F6' },
          { quality: 'fair', label: 'Regular (5-6h)', color: '#F59E0B' },
          { quality: 'bad', label: 'Ruim (<5h)', color: '#EF4444' },
        ].map((item) => (
          <div key={item.quality} className="flex items-center gap-1 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Resumo semanal */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">Resumo da Semana</h4>
        <div className="space-y-2">
          {data.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">
                  {day.day}
                </span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getQualityColor(day.quality) }}
                />
                <span className="text-sm text-gray-700">
                  {day.hours.toFixed(1)}h
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${getQualityColor(day.quality)}20`,
                    color: getQualityColor(day.quality),
                  }}
                >
                  {getQualityLabel(day.quality)}
                </span>
                <span className="text-xs text-gray-500">{day.score} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepChart;
