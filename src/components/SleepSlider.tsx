import React, { useState, useEffect } from 'react';
import { Moon, Sun, Star } from 'lucide-react';

interface SleepSliderProps {
  value: number;
  target: number;
  onChange: (value: number, percentage: number, points: number) => void;
  onComplete: () => void;
}

const SleepSlider: React.FC<SleepSliderProps> = ({
  value,
  target,
  onChange,
  onComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  // Calcular porcentagem e pontos
  const percentage = Math.min((currentValue / target) * 100, 100);
  const points = Math.floor((percentage / 100) * 35); // Máximo 35 XP para sono

  // Determinar qualidade do sono baseado nas horas
  const getSleepQuality = (hours: number) => {
    if (hours < 5) return { label: 'Insuficiente', color: 'text-red-500', emoji: '😴' };
    if (hours < 6) return { label: 'Regular', color: 'text-yellow-500', emoji: '😐' };
    if (hours < 7) return { label: 'Bom', color: 'text-blue-500', emoji: '🙂' };
    if (hours <= 9) return { label: 'Excelente', color: 'text-green-500', emoji: '😊' };
    return { label: 'Excessivo', color: 'text-purple-500', emoji: '😵' };
  };

  const quality = getSleepQuality(currentValue);

  useEffect(() => {
    onChange(currentValue, percentage, points);
  }, [currentValue]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setCurrentValue(newValue);
  };

  // Horas para exibição (formato 0.5 em 0.5)
  const hours = Array.from({ length: 25 }, (_, i) => i * 0.5).filter(h => h <= 12);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Moon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Registro de Sono</h3>
            <p className="text-sm text-gray-500">Quanto você dormiu esta noite?</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${quality.color}`}>
            {currentValue.toFixed(1)}h
          </span>
          <p className="text-sm text-gray-500">{quality.emoji} {quality.label}</p>
        </div>
      </div>

      {/* Slider customizado */}
      <div className="relative mb-6">
        <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
          {/* Barra de progresso */}
          <div
            className="absolute h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 transition-all duration-150"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          
          {/* Marcadores de horas */}
          <div className="absolute inset-0 flex justify-between px-4 items-center">
            {[0, 3, 6, 9, 12].map((hour) => (
              <div
                key={hour}
                className={`text-xs font-medium ${
                  currentValue >= hour ? 'text-white' : 'text-gray-400'
                }`}
              >
                {hour}h
              </div>
            ))}
          </div>

          {/* Input range invisível por cima */}
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={currentValue}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Indicador de meta */}
        <div
          className="absolute top-0 h-full w-0.5 bg-green-500"
          style={{ left: `${(target / 12) * 100}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Meta: {target}h
          </div>
        </div>
      </div>

      {/* Cards de informação */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <Sun className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Meta</p>
          <p className="font-bold text-indigo-700">{target}h</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <Moon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Você dormiu</p>
          <p className="font-bold text-blue-700">{currentValue.toFixed(1)}h</p>
        </div>
        <div className={`rounded-xl p-3 text-center ${
          percentage >= 100 ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          <Star className={`w-5 h-5 mx-auto mb-1 ${
            percentage >= 100 ? 'text-green-600' : 'text-amber-600'
          }`} />
          <p className="text-xs text-gray-600">XP Ganhos</p>
          <p className={`font-bold ${
            percentage >= 100 ? 'text-green-700' : 'text-amber-700'
          }`}>
            +{points} XP
          </p>
        </div>
      </div>

      {/* Barra de progresso da meta */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso da meta</span>
          <span className={`font-bold ${percentage >= 100 ? 'text-green-600' : 'text-indigo-600'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percentage >= 100
                ? 'bg-gradient-to-r from-green-400 to-green-600'
                : 'bg-gradient-to-r from-indigo-400 to-indigo-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Botão de completar */}
      <button
        onClick={onComplete}
        disabled={currentValue === 0}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          currentValue > 0
            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {percentage >= 100
          ? '🎉 Meta Atingida! Registrar Sono'
          : `Registrar ${currentValue.toFixed(1)}h de sono (+${points} XP)`}
      </button>

      {/* Dicas de sono */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">💡 Dica:</span>{' '}
          {currentValue < 6
            ? 'Tente dormir mais cedo hoje para recuperar o sono perdido.'
            : currentValue > 9
            ? 'Dormir demais também pode causar fadiga. Tente manter 7-8 horas.'
            : 'Você está no caminho certo! Mantenha essa rotina de sono.'}
        </p>
      </div>
    </div>
  );
};

export default SleepSlider;
