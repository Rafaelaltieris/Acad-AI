import React, { useState } from 'react';
import { WorkoutRoutine, DailyHydration } from '../types';

interface HomeScreenProps {
  onStartWorkout: (routineId: string) => void;
  onViewWorkoutSheet: (routine: WorkoutRoutine) => void;
  featuredRoutine: WorkoutRoutine;
  hydration: DailyHydration;
  onUpdateHydration: (liters: number) => void;
  onSelectTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartWorkout,
  onViewWorkoutSheet,
  featuredRoutine,
  hydration,
  onUpdateHydration,
  onSelectTab,
}) => {
  const [startingWorkout, setStartingWorkout] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [weekDaysState, setWeekDaysState] = useState([
    { day: 'SEG', done: true, isToday: false },
    { day: 'TER', done: true, isToday: false },
    { day: 'QUA', done: true, isToday: false },
    { day: 'QUI', done: false, isToday: true },
    { day: 'SEX', done: true, isToday: false },
    { day: 'SÁB', done: false, isToday: false },
    { day: 'DOM', done: false, isToday: false },
  ]);

  const toggleDay = (index: number) => {
    setWeekDaysState((prev) =>
      prev.map((d, i) => (i === index ? { ...d, done: !d.done } : d))
    );
  };

  const currentLiters = hydration.currentLiters;
  const targetLiters = hydration.targetLiters;
  const remainingMl = Math.max(0, Math.round((targetLiters - currentLiters) * 1000));
  const hydrationPercent = Math.min(100, Math.round((currentLiters / targetLiters) * 100));

  const handleAddWater = () => {
    if (currentLiters < targetLiters) {
      const nextVal = +(Math.min(targetLiters, currentLiters + 0.25).toFixed(2));
      onUpdateHydration(nextVal);
    }
  };

  const handleStartWorkoutClick = () => {
    setStartingWorkout(true);
    setTimeout(() => {
      setStartingWorkout(false);
      onStartWorkout(featuredRoutine.id);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-28 pt-20 px-5 max-w-md mx-auto animate-fadeIn">
      {/* Top Greeting & Motivation Banner */}
      <section className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-[22px] text-[#0b1c30] tracking-tight">
              Bom dia, Mariana
            </span>
            <span className="text-[20px] select-none">👋</span>
          </div>
          <div className="flex items-center gap-1 bg-[#dce9ff] px-2.5 py-1 rounded-full text-[#006398]">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-label-md text-[12px] font-semibold">Semana 4</span>
          </div>
        </div>
        <p className="font-body-md text-[14px] text-[#45464d]">
          Foco e constância no treino de hoje.
        </p>
      </section>

      {/* Weekly Activity Tracker Card */}
      <section className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006398] text-[20px]">
              calendar_month
            </span>
            <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold">
              Meta Semanal
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#e5eeff] px-2.5 py-0.5 rounded-full">
            <span className="font-label-caps text-[11px] text-[#0b1c30] uppercase tracking-wider font-bold">
              4 de 5 treinos
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          </div>
        </div>

        {/* Days of week strip */}
        <div className="grid grid-cols-7 gap-1 pt-1">
          {weekDaysState.map((d, idx) => (
            <div
              key={d.day}
              onClick={() => toggleDay(idx)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
              title={`Clique para alternar status de ${d.day}`}
            >
              <span
                className={`font-label-caps text-[11px] ${
                  d.isToday ? 'text-[#006398] font-bold' : 'text-[#45464d] font-medium'
                }`}
              >
                {d.day}
              </span>

              {d.done ? (
                <div className="w-9 h-9 rounded-full bg-[#131b2e] text-[#6ffbbe] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.8"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : d.isToday ? (
                <div className="relative w-9 h-9 rounded-full bg-[#dce9ff] text-[#006398] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="absolute inset-0 w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="text-[#006398]"
                      cx="18"
                      cy="18"
                      fill="none"
                      opacity="0.9"
                      r="15"
                      stroke="currentColor"
                      strokeDasharray="6, 4"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006398]"></span>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#45464d] opacity-50 group-hover:opacity-80 transition-opacity">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c6c6cd]"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Today's Workout Card */}
      <section className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex flex-col gap-4">
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-[#006398]/5 blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[11px] text-[#006398] font-bold uppercase tracking-wider">
                Treino Recomendado
              </span>
              <span className="w-1 h-1 rounded-full bg-[#c6c6cd]"></span>
              <span className="font-label-caps text-[11px] text-[#45464d]">Hoje</span>
            </div>
            <h2 className="font-headline-md text-[20px] text-[#0b1c30] tracking-tight font-bold">
              {featuredRoutine.title}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#00476e] font-label-caps text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006398]"></span>
            Planejado
          </span>
        </div>

        {/* Workout Highlights / Metrics Chips */}
        <div className="flex items-center gap-2 flex-wrap relative z-10">
          <div className="flex items-center gap-1.5 bg-[#e5eeff] px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[17px] text-[#006398]">
              fitness_center
            </span>
            <span className="font-label-md text-[12px] text-[#0b1c30]">
              {featuredRoutine.exerciseCount} exercícios
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#e5eeff] px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[17px] text-[#006398]">
              schedule
            </span>
            <span className="font-label-md text-[12px] text-[#0b1c30]">
              55 min est.
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#e5eeff] px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[17px] text-[#006398]">
              local_fire_department
            </span>
            <span className="font-label-md text-[12px] text-[#0b1c30]">
              ~{featuredRoutine.estCalories} kcal
            </span>
          </div>
        </div>

        {/* Exercises Overview Mini-Preview */}
        <div className="flex items-center justify-between py-2 px-3 bg-[#eff4ff] rounded-xl relative z-10 border border-[#dce9ff]/50">
          <div className="flex items-center gap-2 truncate">
            <span className="w-6 h-6 rounded-full bg-white text-[#0b1c30] font-label-caps text-[11px] flex items-center justify-center font-bold shadow-xs">
              1
            </span>
            <span className="font-body-sm text-[13px] text-[#0b1c30] truncate font-medium">
              Supino Reto com Barra + 5 outros
            </span>
          </div>
          <button
            onClick={() => onViewWorkoutSheet(featuredRoutine)}
            aria-label="Ver ficha completa"
            className="font-label-caps text-[11px] text-[#006398] font-bold hover:underline shrink-0 px-2 py-1"
            type="button"
          >
            Ver Ficha
          </button>
        </div>

        {/* Start Workout Button Action */}
        <button
          onClick={handleStartWorkoutClick}
          disabled={startingWorkout}
          className="relative z-10 w-full h-[52px] bg-[#000000] text-white rounded-full font-label-lg text-[14px] font-bold flex items-center justify-center gap-2.5 transition-transform active:scale-[0.98] shadow-md hover:bg-[#131b2e] cursor-pointer"
          type="button"
        >
          {startingWorkout ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] animate-spin">
                refresh
              </span>
              <span>Preparando Treino...</span>
            </div>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-[#006398] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">
                  play_arrow
                </span>
              </div>
              <span>Iniciar Treino</span>
            </>
          )}
        </button>
      </section>

      {/* Quick Health & Performance Indicators */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
            Resumo de Hoje
          </span>
          <span className="font-label-caps text-[11px] text-[#45464d] uppercase tracking-wider">
            Sincronizado
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Calories Card */}
          <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#006398]">
                <span className="material-symbols-outlined text-[18px]">
                  local_fire_department
                </span>
              </div>
              <span className="font-label-caps text-[11px] text-[#45464d] font-bold">
                +12%
              </span>
            </div>
            <div className="flex flex-col mt-3">
              <span className="font-metric-huge-mobile text-[30px] text-[#0b1c30] font-bold tracking-tight leading-none">
                480
              </span>
              <span className="font-label-caps text-[11px] text-[#45464d] font-medium mt-1">
                kcal gastas
              </span>
            </div>
          </div>

          {/* Active Time Card */}
          <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#006398]">
                <span className="material-symbols-outlined text-[18px]">
                  timer
                </span>
              </div>
              <span className="font-label-caps text-[11px] text-[#45464d] font-bold">
                Meta
              </span>
            </div>
            <div className="flex flex-col mt-3">
              <span className="font-metric-huge-mobile text-[30px] text-[#0b1c30] font-bold tracking-tight leading-none">
                42
              </span>
              <span className="font-label-caps text-[11px] text-[#45464d] font-medium mt-1">
                minutos ativos
              </span>
            </div>
          </div>

          {/* Volume Moved Card */}
          <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#006398]">
                <span className="material-symbols-outlined text-[18px]">
                  weight
                </span>
              </div>
              <span className="font-label-caps text-[11px] text-[#009668] font-bold">
                PR
              </span>
            </div>
            <div className="flex flex-col mt-3">
              <span className="font-metric-huge-mobile text-[30px] text-[#0b1c30] font-bold tracking-tight leading-none">
                3.2k
              </span>
              <span className="font-label-caps text-[11px] text-[#45464d] font-medium mt-1">
                kg volume
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle & Routine (Hydration & Scheduled Assessment) */}
      <section className="grid grid-cols-1 gap-3">
        {/* Hydration Tracker Tile */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#dce9ff] text-[#006398] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  water_drop
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold">
                  Hidratação
                </span>
                <span className="font-body-sm text-[12px] text-[#45464d]">
                  Meta diária recomendada
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
                {currentLiters.toFixed(1)}
              </span>
              <span className="font-body-sm text-[12px] text-[#45464d]">
                / {targetLiters.toFixed(1)} L
              </span>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
            <div
              className="h-full bg-[#006398] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${hydrationPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-body-sm text-[12px] text-[#45464d]">
              {remainingMl > 0 ? `Faltam ${remainingMl} ml` : '🎉 Meta batida hoje!'}
            </span>
            <button
              onClick={handleAddWater}
              disabled={currentLiters >= targetLiters}
              className={`flex items-center gap-1 font-label-caps text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                currentLiters >= targetLiters
                  ? 'bg-[#cce5ff] text-[#00476e] cursor-default'
                  : 'bg-[#e5eeff] text-[#006398] hover:bg-[#dce9ff] active:scale-95'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">
                {currentLiters >= targetLiters ? 'check' : 'add'}
              </span>
              {currentLiters >= targetLiters ? 'Concluído' : '+250 ml'}
            </button>
          </div>
        </div>

        {/* Scheduled Physical Assessment Card */}
        <div
          onClick={() => setShowAppointmentModal(true)}
          className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_8px_24px_-4px_rgba(15,23,42,0.05)] border border-[#eff4ff] flex items-center justify-between cursor-pointer hover:border-[#006398]/30 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#e5eeff] flex flex-col items-center justify-center shrink-0">
              <span className="font-label-caps text-[10px] text-[#006398] font-bold uppercase leading-none">
                NOV
              </span>
              <span className="font-headline-sm text-[18px] text-[#0b1c30] font-bold leading-none mt-1">
                18
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold truncate">
                Avaliação Física Bioimpedância
              </span>
              <span className="font-body-sm text-[12px] text-[#45464d] flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[14px] text-[#006398]">
                  schedule
                </span>
                09:30 • Prof. Gabriel Souza
              </span>
            </div>
          </div>
          <button
            aria-label="Detalhes do agendamento"
            className="w-9 h-9 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#45464d] hover:text-[#0b1c30] shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* Motivational Tip / Coach Note */}
      <section className="bg-[#eff4ff] rounded-2xl p-4 flex items-start gap-3 border border-[#dce9ff]/60">
        <div className="w-8 h-8 rounded-full bg-[#d3e4fe] text-[#006398] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">
            tips_and_updates
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-label-md text-[13px] text-[#0b1c30] font-bold">
            Dica do Personal
          </span>
          <p className="font-body-sm text-[12px] text-[#45464d] leading-relaxed">
            Priorize a cadência de 3 segundos na fase excêntrica do supino hoje para maximizar o recrutamento muscular.
          </p>
        </div>
      </section>

      {/* Appointment Detail Dialog */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#eff4ff] space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#cce5ff] text-[#006398] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">
                  event_available
                </span>
              </div>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#e5eeff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div>
              <span className="font-label-caps text-[11px] text-[#006398] font-bold uppercase tracking-wider">
                Agendamento Confirmado
              </span>
              <h4 className="font-headline-sm text-[18px] text-[#0b1c30] font-bold mt-0.5">
                Avaliação Física Bioimpedância
              </h4>
              <p className="font-body-sm text-[13px] text-[#45464d] mt-1">
                Data: <strong>18 de Novembro de 2024 às 09:30</strong>
                <br />
                Profissional: <strong>Prof. Gabriel Souza</strong>
                <br />
                Local: Sala de Avaliação 2 - Pulse Gym
              </p>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-2xl text-[12px] text-[#45464d] border border-[#e5eeff]">
              <strong>Recomendações pré-exame:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Jejum de cafeína e alimentos pesados por 3h</li>
                <li>Hidratação regular no dia anterior</li>
                <li>Roupas leves de academia</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowAppointmentModal(false);
                onSelectTab('evolucao');
              }}
              className="w-full py-3 bg-[#006398] text-white font-label-md text-[13px] font-bold rounded-full shadow-md active:scale-95 transition-all"
            >
              Ver Histórico de Avaliações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
