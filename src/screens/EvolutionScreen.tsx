import React, { useState } from 'react';
import { BodyComposition, AppImageLinks } from '../types';
import { OCT_CALENDAR_DAYS } from '../data/mockData';

interface EvolutionScreenProps {
  bodyComposition: BodyComposition;
  imageLinks: AppImageLinks;
  onOpenImageManager: () => void;
  onSaveNewEntry: (data: { weight: number; bodyFat?: number; notes?: string; photoUrl?: string }) => void;
}

export const EvolutionScreen: React.FC<EvolutionScreenProps> = ({
  bodyComposition,
  imageLinks,
  onOpenImageManager,
  onSaveNewEntry,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Modal Inputs State
  const [inputWeight, setInputWeight] = useState(bodyComposition.weight.toString());
  const [inputFat, setInputFat] = useState(bodyComposition.bodyFat.toString());
  const [inputNotes, setInputNotes] = useState('');
  const [inputPhotoUrl, setInputPhotoUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Period change metrics adjustment for realism
  const getPeriodStats = () => {
    switch (selectedPeriod) {
      case '3m':
        return {
          conquest: '+28% de força geral',
          doneSessions: 64,
          targetSessions: 72,
          consistency: '89%',
          benchMax: '72 kg',
          benchGain: '+28 kg (+63%)',
          pts: [
            { label: 'Jul (44kg)', x: 10, y: 120 },
            { label: 'Ago (54kg)', x: 110, y: 85 },
            { label: 'Set (64kg)', x: 210, y: 50 },
            { label: 'Hoje (72kg)', x: 310, y: 20 },
          ],
        };
      case '6m':
        return {
          conquest: '+42% de hipertrofia',
          doneSessions: 128,
          targetSessions: 144,
          consistency: '92%',
          benchMax: '72 kg',
          benchGain: '+32 kg (+80%)',
          pts: [
            { label: 'Abr (40kg)', x: 10, y: 125 },
            { label: 'Jun (52kg)', x: 110, y: 90 },
            { label: 'Ago (62kg)', x: 210, y: 55 },
            { label: 'Hoje (72kg)', x: 310, y: 20 },
          ],
        };
      case '1y':
        return {
          conquest: '+54% de força e massa',
          doneSessions: 246,
          targetSessions: 260,
          consistency: '94%',
          benchMax: '72 kg',
          benchGain: '+37 kg (+105%)',
          pts: [
            { label: 'Nov 23 (35kg)', x: 10, y: 128 },
            { label: 'Mar 24 (50kg)', x: 110, y: 90 },
            { label: 'Jul 24 (62kg)', x: 210, y: 55 },
            { label: 'Hoje (72kg)', x: 310, y: 20 },
          ],
        };
      case '1m':
      default:
        return {
          conquest: '+18% de força geral',
          doneSessions: 22,
          targetSessions: 24,
          consistency: '91%',
          benchMax: '72 kg',
          benchGain: '+22 kg (+44%)',
          pts: [
            { label: 'Sem 1 (50kg)', x: 10, y: 110 },
            { label: 'Sem 2 (58kg)', x: 110, y: 85 },
            { label: 'Sem 3 (64kg)', x: 210, y: 55 },
            { label: 'Hoje (72kg)', x: 310, y: 20 },
          ],
        };
    }
  };

  const periodStats = getPeriodStats();

  const handleSaveModal = () => {
    const w = parseFloat(inputWeight) || bodyComposition.weight;
    const f = inputFat ? parseFloat(inputFat) : undefined;
    onSaveNewEntry({
      weight: w,
      bodyFat: f,
      notes: inputNotes,
      photoUrl: inputPhotoUrl.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsModalOpen(false);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-5 max-w-md mx-auto space-y-5 animate-fadeIn">
      {/* Subheader with Action and Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-label-caps text-[11px] text-[#006398] uppercase tracking-wider font-bold">
            Métricas &amp; Desempenho
          </span>
          <h2 className="font-headline-md text-[22px] text-[#0b1c30] font-bold tracking-tight">
            Evolução Geral
          </h2>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Minha Evolução no Pulse',
                text: 'Confira minha evolução recente de força e composição corporal!',
                url: window.location.href,
              }).catch(() => {});
            } else {
              alert('Link do relatório copiado!');
            }
          }}
          aria-label="Exportar relatório"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">ios_share</span>
        </button>
      </div>

      {/* Time Horizon Filter Bar */}
      <div className="flex items-center justify-between p-1 bg-[#e5eeff] rounded-full shadow-xs">
        {(['1m', '3m', '6m', '1y'] as const).map((period) => {
          const labelMap = { '1m': '1 Mês', '3m': '3 Meses', '6m': '6 Meses', '1y': '1 Ano' };
          const isActive = selectedPeriod === period;
          return (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 text-center rounded-full font-label-md text-[13px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              {labelMap[period]}
            </button>
          );
        })}
      </div>

      {/* Primary Achievement Milestone Highlight */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-[#eff4ff]">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d3e4fe]/40 pointer-events-none blur-xl"></div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#cce5ff] text-[#001d31] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <div>
              <span className="font-label-caps text-[11px] text-[#45464d] font-bold">
                Conquista do Mês
              </span>
              <p className="font-headline-sm text-[17px] text-[#0b1c30] font-bold leading-tight">
                {periodStats.conquest}
              </p>
            </div>
          </div>
          <span className="font-label-caps text-[11px] bg-[#6ffbbe] text-[#002113] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="material-symbols-outlined text-[13px]">
              trending_up
            </span>
            Top 5%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
          <div className="bg-[#eff4ff] rounded-xl p-3 border border-[#dce9ff]/50">
            <span className="font-label-caps text-[11px] text-[#45464d] font-bold">
              Treinos Feitos
            </span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="font-headline-md text-[22px] text-[#0b1c30] font-bold">
                {periodStats.doneSessions}
              </span>
              <span className="font-body-sm text-[12px] text-[#45464d]">
                / {periodStats.targetSessions} metas
              </span>
            </div>
          </div>

          <div className="bg-[#eff4ff] rounded-xl p-3 border border-[#dce9ff]/50">
            <span className="font-label-caps text-[11px] text-[#45464d] font-bold">
              Consistência
            </span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="font-headline-md text-[22px] text-[#009668] font-bold">
                {periodStats.consistency}
              </span>
              <span className="font-label-caps text-[11px] text-[#009668] font-bold">
                +4.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Overload Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eff4ff]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-label-caps text-[11px] text-[#45464d] font-bold">
              Carga Máxima Estimada
            </span>
            <h3 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
              Supino Reto com Barra
            </h3>
          </div>
          <div className="text-right">
            <div className="font-headline-sm text-[18px] text-[#006398] font-bold">
              {periodStats.benchMax}
            </div>
            <span className="font-label-caps text-[11px] text-[#009668] font-bold">
              {periodStats.benchGain}
            </span>
          </div>
        </div>

        {/* Chart Frame */}
        <div className="relative w-full h-44 pt-2">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 320 140"
          >
            <defs>
              <linearGradient id="loadCurveGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#006398" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#006398" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Guide Lines */}
            <line
              stroke="#eff4ff"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              x1="0"
              x2="320"
              y1="20"
              y2="20"
            />
            <line
              stroke="#eff4ff"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              x1="0"
              x2="320"
              y1="65"
              y2="65"
            />
            <line
              stroke="#eff4ff"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              x1="0"
              x2="320"
              y1="110"
              y2="110"
            />

            {/* Gradient fill beneath curve */}
            <path
              d="M 10 110 C 60 105, 100 85, 160 70 C 220 55, 270 35, 310 20 L 310 130 L 10 130 Z"
              fill="url(#loadCurveGrad)"
            />

            {/* Progression Line */}
            <path
              d="M 10 110 C 60 105, 100 85, 160 70 C 220 55, 270 35, 310 20"
              fill="none"
              stroke="#006398"
              strokeLinecap="round"
              strokeWidth="3"
            />

            {/* Milestone Markers */}
            <circle
              cx="10"
              cy="110"
              fill="#f8f9ff"
              r="4.5"
              stroke="#006398"
              strokeWidth="2.5"
            />
            <circle
              cx="160"
              cy="70"
              fill="#f8f9ff"
              r="4.5"
              stroke="#006398"
              strokeWidth="2.5"
            />
            <circle
              cx="310"
              cy="20"
              fill="#006398"
              r="6"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Timeline Labels */}
        <div className="flex items-center justify-between text-[#45464d] font-label-caps text-[11px] pt-1">
          {periodStats.pts.map((pt, i) => (
            <span
              key={i}
              className={i === periodStats.pts.length - 1 ? 'text-[#0b1c30] font-bold' : ''}
            >
              {pt.label}
            </span>
          ))}
        </div>
      </div>

      {/* Body Metrics Triad Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
            Composição Corporal
          </h3>
          <span className="font-label-caps text-[11px] text-[#45464d] font-medium">
            Bioimpedância
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Weight Metric Card */}
          <div className="bg-white rounded-xl p-3 flex flex-col justify-between shadow-xs border border-[#eff4ff]">
            <span className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold truncate">
              Peso Total
            </span>
            <div className="my-2">
              <div className="font-headline-md text-[24px] text-[#0b1c30] font-extrabold tracking-tight leading-none">
                {bodyComposition.weight.toFixed(1)}
              </div>
              <span className="font-body-sm text-[12px] text-[#45464d]">kg</span>
            </div>
            <div className="inline-flex items-center text-[#009668] font-label-caps text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px] mr-0.5">
                arrow_downward
              </span>
              {bodyComposition.weightChange} kg
            </div>
          </div>

          {/* Body Fat Metric Card */}
          <div className="bg-white rounded-xl p-3 flex flex-col justify-between shadow-xs border border-[#eff4ff]">
            <span className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold truncate">
              % Gordura
            </span>
            <div className="my-2">
              <div className="font-headline-md text-[24px] text-[#0b1c30] font-extrabold tracking-tight leading-none">
                {bodyComposition.bodyFat.toFixed(1)}
              </div>
              <span className="font-body-sm text-[12px] text-[#45464d]">%</span>
            </div>
            <div className="inline-flex items-center text-[#009668] font-label-caps text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px] mr-0.5">
                arrow_downward
              </span>
              {bodyComposition.bodyFatChange}%
            </div>
          </div>

          {/* Lean Mass Metric Card */}
          <div className="bg-white rounded-xl p-3 flex flex-col justify-between shadow-xs border border-[#eff4ff]">
            <span className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold truncate">
              Massa Magra
            </span>
            <div className="my-2">
              <div className="font-headline-md text-[24px] text-[#0b1c30] font-extrabold tracking-tight leading-none">
                {bodyComposition.leanMass.toFixed(1)}
              </div>
              <span className="font-body-sm text-[12px] text-[#45464d]">kg</span>
            </div>
            <div className="inline-flex items-center text-[#006398] font-label-caps text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px] mr-0.5">
                arrow_upward
              </span>
              +{bodyComposition.leanMassChange} kg
            </div>
          </div>
        </div>
      </div>

      {/* Visual Before & After Comparative Gallery */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eff4ff]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
              Registro Visual
            </h3>
            <p className="font-body-sm text-[12px] text-[#45464d]">
              Comparativo de silhueta e postura
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick button to edit direct links for photos */}
            <button
              onClick={onOpenImageManager}
              title="Trocar links diretos destas fotos"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff4ff] text-[#006398] hover:bg-[#dce9ff]"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <button
              onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
              aria-label="Ocultar ou exibir fotos"
              className="flex items-center gap-1 font-label-caps text-[11px] font-bold text-[#006398] bg-[#e5eeff] px-2.5 py-1 rounded-full hover:bg-[#dce9ff] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isPhotoBlurred ? 'visibility_off' : 'visibility'}
              </span>
              <span>{isPhotoBlurred ? 'Visível' : 'Privacidade'}</span>
            </button>
          </div>
        </div>

        {/* Comparative Split Stage */}
        <div className="grid grid-cols-2 gap-3">
          {/* Baseline Photo Card */}
          <div className="relative group rounded-xl overflow-hidden bg-[#dce9ff] aspect-[3/4] shadow-xs">
            <img
              src={imageLinks.baselinePhotoUrl}
              alt="Baseline Set 2024"
              className={`w-full h-full object-cover transition-all duration-300 ${
                isPhotoBlurred ? 'blur-md scale-105' : ''
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2.5 pt-6">
              <span className="font-label-caps text-[10px] text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md font-bold">
                Set 2024
              </span>
              <p className="font-body-sm text-[12px] text-white/90 mt-0.5 font-medium">
                66.0 kg
              </p>
            </div>
          </div>

          {/* Current Progress Photo Card */}
          <div className="relative group rounded-xl overflow-hidden bg-[#dce9ff] aspect-[3/4] shadow-xs">
            <img
              src={imageLinks.currentPhotoUrl}
              alt="Current Out 2024"
              className={`w-full h-full object-cover transition-all duration-300 ${
                isPhotoBlurred ? 'blur-md scale-105' : ''
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2.5 pt-6">
              <span className="font-label-caps text-[10px] text-white bg-[#006398] px-2 py-0.5 rounded-full backdrop-blur-md font-bold">
                Out 2024
              </span>
              <p className="font-body-sm text-[12px] text-white/90 mt-0.5 font-medium">
                {bodyComposition.weight.toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Workout Frequency Heatmap */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eff4ff]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
              Frequência no Mês
            </h3>
            <p className="font-body-sm text-[12px] text-[#45464d]">
              Outubro • 22 sessões completadas
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-label-caps text-[11px] text-[#45464d]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006398]"></span> Treinado
            <span className="w-2.5 h-2.5 rounded-full bg-[#dce9ff] ml-1"></span> Descanso
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-label-caps text-[11px] text-[#45464d] mb-1.5 font-bold">
          <span>D</span>
          <span>S</span>
          <span>T</span>
          <span>Q</span>
          <span>Q</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Calendar Month Matrix (31 days with 2 blank offset cells) */}
        <div className="grid grid-cols-7 gap-1 text-center font-label-md text-[12px]">
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>

          {OCT_CALENDAR_DAYS.map((d) => (
            <button
              key={d.day}
              onClick={() => setSelectedCalendarDay(d.day)}
              className={`aspect-square rounded-lg flex items-center justify-center font-bold transition-transform active:scale-90 cursor-pointer ${
                d.trained
                  ? 'bg-[#006398] text-white hover:bg-[#004b73]'
                  : 'bg-[#e5eeff] text-[#45464d] hover:bg-[#dce9ff]'
              } ${selectedCalendarDay === d.day ? 'ring-2 ring-[#0b1c30]' : ''}`}
            >
              {d.day}
            </button>
          ))}
        </div>

        {selectedCalendarDay && (
          <div className="mt-3 p-3 bg-[#eff4ff] rounded-xl text-[12px] text-[#0b1c30] border border-[#dce9ff]">
            <strong>Dia {selectedCalendarDay} de Outubro:</strong>{' '}
            {OCT_CALENDAR_DAYS.find((x) => x.day === selectedCalendarDay)?.trained
              ? '✅ Sessão de treino realizada com sucesso.'
              : '💤 Dia de recuperação e descanso muscular.'}
          </div>
        )}
      </div>

      {/* Primary CTA Action Button */}
      <div className="pt-1 pb-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-[52px] bg-[#000000] hover:bg-[#131b2e] text-white rounded-full font-label-lg text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
          <span>Registrar Nova Pesagem / Foto</span>
        </button>
      </div>

      {/* Modal Sheet for Record Logging */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0b1c30]/40 backdrop-blur-sm px-4 pb-safe animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl mb-4 border border-[#eff4ff] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <div>
                <h4 className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
                  Novo Registro de Evolução
                </h4>
                <p className="font-body-sm text-[12px] text-[#45464d]">
                  Adicione sua pesagem ou link direto de foto
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#e5eeff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="font-label-caps text-[11px] text-[#45464d] font-bold block mb-1 uppercase">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Ex: 64.0"
                  className="w-full h-12 bg-[#eff4ff] px-4 rounded-xl text-[#0b1c30] font-headline-sm text-[18px] font-bold focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#45464d] font-bold block mb-1 uppercase">
                  % Gordura Corporal (Opcional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputFat}
                  onChange={(e) => setInputFat(e.target.value)}
                  placeholder="Ex: 19.0"
                  className="w-full h-12 bg-[#eff4ff] px-4 rounded-xl text-[#0b1c30] font-headline-sm text-[18px] font-bold focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#45464d] font-bold block mb-1 uppercase">
                  Link Direto da Foto (Opcional)
                </label>
                <input
                  type="url"
                  value={inputPhotoUrl}
                  onChange={(e) => setInputPhotoUrl(e.target.value)}
                  placeholder="https://sua-foto.jpg"
                  className="w-full h-11 bg-[#eff4ff] px-4 rounded-xl text-[#0b1c30] font-mono text-[12px] focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#45464d] font-bold block mb-1 uppercase">
                  Notas / Sensações
                </label>
                <input
                  type="text"
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  placeholder="Ex: Treinos com boa energia essa semana"
                  className="w-full h-11 bg-[#eff4ff] px-4 rounded-xl text-[#0b1c30] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <button
                onClick={handleSaveModal}
                className="w-full h-12 bg-[#006398] hover:bg-[#004b73] text-white rounded-full font-label-lg text-[14px] font-bold flex items-center justify-center gap-1.5 mt-2 active:scale-95 transition-transform shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {saveSuccess ? 'check_circle' : 'check'}
                </span>
                <span>{saveSuccess ? 'Gravado com sucesso!' : 'Salvar Dados'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
