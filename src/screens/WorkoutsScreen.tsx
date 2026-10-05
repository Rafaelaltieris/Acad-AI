import React, { useState } from 'react';
import { WorkoutRoutine } from '../types';

interface WorkoutsScreenProps {
  routines: WorkoutRoutine[];
  onStartWorkout: (routineId: string) => void;
  onViewExercises: (routine: WorkoutRoutine) => void;
  onRequestChange: () => void;
}

export const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({
  routines,
  onStartWorkout,
  onViewExercises,
  onRequestChange,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'custom' | 'history'>('current');

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-5 max-w-md mx-auto animate-fadeIn">
      {/* Title & Metadata Header */}
      <section className="flex flex-col gap-1 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#001d31] font-label-caps text-[11px] font-bold">
              CICLO 4 • SEMANA 2
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006398] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006398]"></span>
            </span>
          </div>
          <span className="font-label-md text-[12px] text-[#45464d] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#006398]">
              event_repeat
            </span>
            Atualizado seg
          </span>
        </div>

        <h1 className="font-headline-lg text-[26px] text-[#0b1c30] tracking-tight font-extrabold mt-1">
          Minha Ficha Atual
        </h1>
        <p className="font-body-md text-[13px] text-[#45464d] flex items-center gap-1.5">
          <span>Hipertrofia &amp; Força</span>
          <span className="text-[#c6c6cd] font-bold">•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#006398]">
              assignment_ind
            </span>
            Criada pelo Prof. Lucas
          </span>
        </p>
      </section>

      {/* Segmented Control Tabs */}
      <div className="p-1.5 bg-[#e5eeff] rounded-full flex items-center gap-1 mb-5 shadow-xs">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 px-3 rounded-full font-label-md text-[13px] transition-all duration-200 text-center ${
            activeTab === 'current'
              ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
              : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Ficha Atual
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-3 rounded-full font-label-md text-[13px] transition-all duration-200 text-center ${
            activeTab === 'custom'
              ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
              : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Personalizados
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 rounded-full font-label-md text-[13px] transition-all duration-200 text-center ${
            activeTab === 'history'
              ? 'bg-white text-[#0b1c30] shadow-sm font-bold'
              : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'current' && (
        <div className="flex flex-col gap-4">
          {routines.map((routine) => {
            const isFeatured = routine.id === 'C' || routine.isRecommendedToday;

            return (
              <article
                key={routine.id}
                className={`relative bg-white rounded-2xl p-4 shadow-sm border border-[#eff4ff] transition-all active:scale-[0.99] flex flex-col gap-3 overflow-hidden ${
                  isFeatured ? 'shadow-md border-[#006398]/30' : ''
                }`}
              >
                {/* Accent vertical line for recommended routine */}
                {isFeatured && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006398]" />
                )}

                <div
                  className={`flex items-start justify-between gap-2 ${
                    isFeatured ? 'pl-1' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-label-caps text-[11px] font-bold ${
                          isFeatured
                            ? 'bg-[#006398] text-white'
                            : 'bg-[#dce9ff] text-[#006398]'
                        }`}
                      >
                        {routine.code}
                      </span>
                      <span
                        className={`font-label-caps text-[11px] ${
                          isFeatured
                            ? 'text-[#006398] font-bold'
                            : 'text-[#45464d]'
                        }`}
                      >
                        {routine.splitTag}
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
                      {routine.subtitle}
                    </h2>
                  </div>

                  {/* Intensity Pill */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-caps text-[11px] font-semibold shrink-0 ${
                      routine.intensityType === 'max'
                        ? 'bg-[#cce5ff] text-[#001d31]'
                        : routine.intensityType === 'light'
                        ? 'bg-[#e5eeff] text-[#009668]'
                        : 'bg-[#eff4ff] text-[#45464d]'
                    }`}
                  >
                    {routine.intensityType === 'max' && (
                      <span className="material-symbols-outlined text-[14px]">
                        bolt
                      </span>
                    )}
                    {routine.intensityType !== 'max' && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          routine.intensityType === 'light'
                            ? 'bg-[#009668]'
                            : 'bg-[#006398]'
                        }`}
                      />
                    )}
                    {routine.intensity}
                  </span>
                </div>

                {/* Metadata row */}
                <div
                  className={`flex items-center gap-3 text-[#45464d] font-body-sm text-[12px] flex-wrap ${
                    isFeatured ? 'pl-1' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006398]">
                      fitness_center
                    </span>
                    {routine.exerciseCount} exercícios
                  </span>
                  <span className="text-[#c6c6cd]">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006398]">
                      schedule
                    </span>
                    ~{routine.estMinutes} min
                  </span>
                  <span className="text-[#c6c6cd]">•</span>
                  <span
                    className={`flex items-center gap-1 ${
                      routine.lastTrainedStatus === 'Concluído Ontem'
                        ? 'text-[#009668] font-semibold'
                        : isFeatured
                        ? 'text-[#006398] font-semibold'
                        : 'text-[#45464d]'
                    }`}
                  >
                    {routine.lastTrainedStatus === 'Concluído Ontem' && (
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                    )}
                    {routine.lastTrainedStatus === 'Programado' && (
                      <span className="material-symbols-outlined text-[16px]">
                        calendar_today
                      </span>
                    )}
                    {routine.lastTrainedStatus === 'Há 2 dias' && (
                      <span className="material-symbols-outlined text-[16px] text-[#009668]">
                        done_all
                      </span>
                    )}
                    {routine.lastTrainedStatus === 'Semana passada' && (
                      <span className="material-symbols-outlined text-[16px] text-[#76777d]">
                        history
                      </span>
                    )}
                    {routine.lastTrainedStatus}
                  </span>
                </div>

                {/* Tags */}
                <div
                  className={`flex items-center gap-1.5 flex-wrap ${
                    isFeatured ? 'pl-1' : ''
                  }`}
                >
                  {routine.featuredTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[#eff4ff] font-label-md text-[12px] text-[#45464d]"
                    >
                      {tag}
                    </span>
                  ))}
                  {routine.extraTagsCount > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-[#eff4ff] font-label-caps text-[11px] text-[#45464d]">
                      +{routine.extraTagsCount}
                    </span>
                  )}
                </div>

                {/* Actions Row */}
                <div
                  className={`flex items-center gap-2 pt-1 ${
                    isFeatured ? 'pl-1' : ''
                  }`}
                >
                  <button
                    onClick={() => onViewExercises(routine)}
                    className="flex-1 h-11 px-4 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-label-md text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      format_list_bulleted
                    </span>
                    Ver Exercícios
                  </button>

                  <button
                    onClick={() => onStartWorkout(routine.id)}
                    className={`h-11 px-5 rounded-full font-label-md text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                      routine.id === 'B'
                        ? 'bg-[#dce9ff] hover:bg-[#d3e4fe] text-[#0b1c30]'
                        : 'bg-[#006398] hover:bg-[#004b73] text-white'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        routine.id === 'B' ? 'text-[#006398]' : 'text-white'
                      }`}
                    >
                      {routine.id === 'B' ? 'replay' : 'play_arrow'}
                    </span>
                    <span>
                      {routine.id === 'B'
                        ? 'Refazer'
                        : isFeatured
                        ? 'Iniciar Treino'
                        : 'Iniciar'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* CUSTOM TAB */}
      {activeTab === 'custom' && (
        <div className="bg-white rounded-2xl p-6 text-center border border-[#eff4ff] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#006398] mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">tune</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-[16px] text-[#0b1c30] font-bold">
              Treinos Personalizados
            </h3>
            <p className="font-body-sm text-[13px] text-[#45464d] mt-1">
              Monte séries independentes para viagens ou treinos rápidos em casa.
            </p>
          </div>
          <button
            onClick={() => onStartWorkout('A')}
            className="px-6 py-2.5 bg-[#006398] text-white rounded-full font-label-md text-[13px] font-bold shadow-md hover:bg-[#004b73] transition-all"
          >
            + Criar Novo Treino Livre
          </button>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-5 border border-[#eff4ff] space-y-3">
          <h3 className="font-headline-sm text-[16px] text-[#0b1c30] font-bold">
            Últimas Sessões Finalizadas
          </h3>
          <div className="space-y-2.5">
            <div className="p-3 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#e5eeff]">
              <div>
                <div className="font-label-md text-[13px] font-bold text-[#0b1c30]">
                  Treino B • Costas e Bíceps
                </div>
                <div className="font-body-sm text-[11px] text-[#45464d]">
                  Ontem às 18:40 • 54 min • 440 kcal
                </div>
              </div>
              <span className="material-symbols-outlined text-[#009668] text-[20px]">
                check_circle
              </span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#e5eeff]">
              <div>
                <div className="font-label-md text-[13px] font-bold text-[#0b1c30]">
                  Treino A • Peito e Tríceps
                </div>
                <div className="font-body-sm text-[11px] text-[#45464d]">
                  Segunda às 07:15 • 51 min • 415 kcal
                </div>
              </div>
              <span className="material-symbols-outlined text-[#009668] text-[20px]">
                check_circle
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Coach Routine Change Request Action */}
      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={onRequestChange}
          className="w-full py-3.5 px-4 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-label-md text-[13px] font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[#006398]">
            edit_calendar
          </span>
          <span>Solicitar alteração de ficha ao Personal</span>
        </button>
        <p className="font-body-sm text-[12px] text-[#76777d] mt-2 text-center">
          Seu treino vence em 18 dias • 3 solicitações disponíveis
        </p>
      </div>
    </div>
  );
};
