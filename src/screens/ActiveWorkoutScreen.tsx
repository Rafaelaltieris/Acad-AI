import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, AppImageLinks } from '../types';

interface ActiveWorkoutScreenProps {
  routine: WorkoutRoutine;
  imageLinks: AppImageLinks;
  onFinishWorkout: (summary: { routineTitle: string; durationMinutes: number; calories: number; volumeKg: number }) => void;
  onDiscardWorkout: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  routine,
  imageLinks,
  onFinishWorkout,
  onDiscardWorkout,
}) => {
  // Elapsed Workout Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(24 * 60 + 15); // Starts around 24:15 as in mockup
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Exercise Navigation State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = routine.exercises[currentExerciseIndex] || routine.exercises[0];
  const nextExercise = routine.exercises[currentExerciseIndex + 1];

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(72); // 01:12
  const initialRestTotal = 75;
  const [isRestActive, setIsRestActive] = useState(true);

  // Sets state for current exercise
  const [setsList, setSetsList] = useState(currentExercise.sets);
  const [activeSetWeight, setActiveSetWeight] = useState(70.0);
  const [activeSetReps, setActiveSetReps] = useState(9);
  const [completedSetFeedback, setCompletedSetFeedback] = useState(false);

  // Tick active workout timer
  useEffect(() => {
    if (isTimerPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused]);

  // Tick rest countdown timer
  useEffect(() => {
    if (!isRestActive || restSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          setIsRestActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestActive, restSeconds]);

  // Format MM:SS
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Rest timer circular progress
  const ringCircumference = 125.6;
  const restProgress = Math.min(1, restSeconds / initialRestTotal);
  const strokeOffset = ringCircumference - restProgress * ringCircumference;

  const handleAddTime = () => {
    setRestSeconds((prev) => prev + 15);
    setIsRestActive(true);
  };

  const handleSkipRest = () => {
    setRestSeconds(0);
    setIsRestActive(false);
  };

  const handleAdjustWeight = (delta: number) => {
    setActiveSetWeight((prev) => Math.max(0, +(prev + delta).toFixed(1)));
  };

  const handleAdjustReps = (delta: number) => {
    setActiveSetReps((prev) => Math.max(1, prev + delta));
  };

  const handleCompleteCurrentSet = () => {
    setCompletedSetFeedback(true);
    // Mark Set 3 as completed
    setSetsList((prev) =>
      prev.map((s, idx) =>
        idx === 2
          ? { ...s, completed: true, weight: activeSetWeight, reps: activeSetReps }
          : s
      )
    );

    // Restart rest timer for next set
    setRestSeconds(75);
    setIsRestActive(true);

    setTimeout(() => {
      setCompletedSetFeedback(false);
    }, 1200);
  };

  const handleAddExtraSet = () => {
    const newNumber = setsList.length + 1;
    setSetsList((prev) => [
      ...prev,
      {
        id: `extra-${Date.now()}`,
        setNumber: newNumber,
        label: 'Extra',
        weight: activeSetWeight,
        reps: activeSetReps,
        completed: false,
      },
    ]);
  };

  const handleToggleSet = (index: number) => {
    setSetsList((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < routine.exercises.length - 1) {
      const nextIdx = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIdx);
      setSetsList(routine.exercises[nextIdx].sets);
      setRestSeconds(75);
      setIsRestActive(true);
    }
  };

  // Estimated calories: roughly 8.5 kcal per minute
  const estCalories = Math.round((elapsedSeconds / 60) * 8.7);

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-5 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Live Workout Header Overview */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#eff4ff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[11px] bg-[#cce5ff] text-[#001d31] font-bold uppercase tracking-wider">
              {routine.title.split('•')[0] || 'Treino A'}
            </span>
            <span className="font-label-md text-[13px] text-[#45464d] font-medium">
              Exercício {currentExerciseIndex + 1} de {routine.exercises.length}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-label-caps text-[11px] text-[#0b1c30] uppercase tracking-wider font-bold">
              Ao Vivo
            </span>
          </div>
        </div>

        {/* Metrics Row: Timer & Calorie Tracker */}
        <div className="grid grid-cols-2 gap-3 mt-3 pt-1">
          <div className="flex items-center space-x-2.5 bg-[#eff4ff] rounded-xl p-2.5 border border-[#dce9ff]/50">
            <div className="w-8 h-8 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#006398]">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold">
                Tempo Total
              </span>
              <span className="font-headline-sm text-[18px] text-[#0b1c30] font-bold tabular-nums">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#eff4ff] rounded-xl p-2.5 border border-[#dce9ff]/50">
            <div className="w-8 h-8 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006398]">
              <span className="material-symbols-outlined text-[18px]">
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold">
                Gasto Est.
              </span>
              <span className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
                {estCalories}{' '}
                <span className="font-body-sm text-[12px] font-normal text-[#45464d]">
                  kcal
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Rest Timer Active Card (Momentum & Delight) */}
      <section className="bg-[#131b2e] text-white rounded-2xl p-4 shadow-md flex items-center justify-between relative overflow-hidden transition-all duration-300">
        <div className="flex items-center space-x-3.5 z-10">
          {/* Circular Progress Ring matching design */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
              <circle
                className="stroke-[#3f465c]"
                cx="24"
                cy="24"
                fill="none"
                r="20"
                strokeDasharray="4 3"
                strokeWidth="3.5"
              />
              <circle
                className="stroke-[#5bb8fe] transition-all duration-500 ease-linear"
                cx="24"
                cy="24"
                fill="none"
                r="20"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="material-symbols-outlined absolute text-[#6ffbbe] text-[20px]">
              snooze
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-[#5bb8fe] uppercase tracking-wider font-bold">
              Descanso Sugerido
            </span>
            <span className="font-headline-md text-[24px] text-white font-bold tabular-nums">
              {formatTime(restSeconds)}
            </span>
          </div>
        </div>

        {/* Quick action timer buttons */}
        <div className="flex items-center space-x-2 z-10">
          <button
            onClick={handleAddTime}
            className="h-9 px-3.5 rounded-full bg-[#3f465c]/50 hover:bg-[#3f465c] text-white font-label-md text-[13px] font-semibold transition-all active:scale-95 flex items-center cursor-pointer"
          >
            +15s
          </button>
          <button
            onClick={handleSkipRest}
            className="h-9 px-3.5 rounded-full bg-[#006398] hover:bg-[#004b73] text-white font-label-md text-[13px] font-semibold transition-all active:scale-95 flex items-center cursor-pointer"
          >
            Pular
          </button>
        </div>

        {/* Soft ambient light glow */}
        <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#006398]/20 rounded-full blur-xl pointer-events-none" />
      </section>

      {/* Current Exercise Workstation Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#eff4ff] space-y-4">
        {/* Exercise Header Info */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="font-label-caps text-[11px] text-[#006398] uppercase font-bold tracking-wider">
              Exercício Principal
            </span>
            <h2 className="font-headline-sm text-[18px] text-[#0b1c30] font-bold mt-0.5 truncate">
              {currentExercise.name}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center font-body-sm text-[12px] text-[#45464d]">
                <span className="material-symbols-outlined text-[15px] mr-1 text-[#45464d]">
                  fitness_center
                </span>
                {currentExercise.targetMuscle}
              </span>
              <span className="text-[#c6c6cd]">•</span>
              <span className="font-body-sm text-[12px] text-[#45464d]">
                {currentExercise.recommendedLoad}
              </span>
            </div>
          </div>

          {/* Exercise Media Thumbnail (uses direct image link with fallback) */}
          <div className="w-14 h-14 rounded-xl bg-[#e5eeff] overflow-hidden shrink-0 relative border border-[#dce9ff] shadow-xs">
            <img
              src={
                currentExerciseIndex === 0
                  ? imageLinks.exerciseBenchPressUrl
                  : currentExercise.imageUrl
              }
              alt={currentExercise.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80';
              }}
            />
          </div>
        </div>

        {/* Set Progression Table */}
        <div className="space-y-2">
          <div className="grid grid-cols-12 font-label-caps text-[11px] text-[#45464d] px-2 uppercase pb-1 tracking-wider">
            <span className="col-span-3">Série</span>
            <span className="col-span-3 text-center">Peso</span>
            <span className="col-span-3 text-center">Reps</span>
            <span className="col-span-3 text-right">Status</span>
          </div>

          {setsList.map((set, index) => {
            const isSet3 = index === 2 && !set.completed;

            if (isSet3) {
              return (
                /* Set 3: ACTIVE SET (Card with soft highlight & editable inputs) */
                <div
                  key={set.id}
                  className="bg-[#dce9ff]/60 border border-[#006398]/30 rounded-2xl p-3 shadow-xs space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006398] animate-ping" />
                      <span className="font-label-md text-[13px] font-bold text-[#0b1c30]">
                        Série {set.setNumber} (Atual)
                      </span>
                    </div>
                    <span className="font-label-caps text-[11px] bg-[#cce5ff] text-[#001d31] font-bold px-2 py-0.5 rounded-full">
                      Meta: 8-10 reps
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Weight Input Container */}
                    <div className="flex flex-col bg-white rounded-xl p-2 border border-[#eff4ff]">
                      <label className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold">
                        Carga (kg)
                      </label>
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={() => handleAdjustWeight(-2.5)}
                          className="w-7 h-7 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] active:scale-90 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            remove
                          </span>
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          value={activeSetWeight}
                          onChange={(e) =>
                            setActiveSetWeight(parseFloat(e.target.value) || 0)
                          }
                          className="w-16 text-center font-headline-sm text-[18px] font-bold text-[#0b1c30] bg-transparent focus:outline-none"
                        />
                        <button
                          onClick={() => handleAdjustWeight(2.5)}
                          className="w-7 h-7 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] active:scale-90 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Reps Input Container */}
                    <div className="flex flex-col bg-white rounded-xl p-2 border border-[#eff4ff]">
                      <label className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold">
                        Repetições Feitas
                      </label>
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={() => handleAdjustReps(-1)}
                          className="w-7 h-7 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] active:scale-90 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            remove
                          </span>
                        </button>
                        <input
                          type="number"
                          value={activeSetReps}
                          onChange={(e) =>
                            setActiveSetReps(parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 text-center font-headline-sm text-[18px] font-bold text-[#0b1c30] bg-transparent focus:outline-none"
                        />
                        <button
                          onClick={() => handleAdjustReps(1)}
                          className="w-7 h-7 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] active:scale-90 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Button for Set 3 */}
                  <button
                    onClick={handleCompleteCurrentSet}
                    className={`w-full mt-2 h-11 rounded-full font-label-lg text-[14px] font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer ${
                      completedSetFeedback
                        ? 'bg-[#002113] text-[#6ffbbe]'
                        : 'bg-[#000000] text-white hover:bg-[#131b2e] active:scale-98'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">
                      check_circle
                    </span>
                    <span>
                      {completedSetFeedback ? 'Série Concluída!' : 'Concluir Série 3'}
                    </span>
                  </button>
                </div>
              );
            }

            // Normal or completed set row
            return (
              <div
                key={set.id}
                onClick={() => handleToggleSet(index)}
                className={`grid grid-cols-12 items-center rounded-xl p-2.5 transition-all cursor-pointer hover:bg-[#eff4ff] ${
                  set.completed
                    ? 'bg-[#eff4ff] border border-transparent'
                    : 'bg-white border border-[#eff4ff] opacity-60'
                }`}
              >
                <div className="col-span-3 flex flex-col">
                  <span className="font-label-md text-[13px] font-bold text-[#0b1c30]">
                    {set.setNumber}
                  </span>
                  <span className="font-label-caps text-[10px] text-[#45464d]">
                    {set.label}
                  </span>
                </div>

                <div className="col-span-3 text-center font-headline-sm text-[16px] font-bold text-[#0b1c30]">
                  {set.weight}{' '}
                  <span className="font-body-sm text-[12px] font-normal text-[#45464d]">
                    kg
                  </span>
                </div>

                <div className="col-span-3 text-center font-headline-sm text-[16px] font-bold text-[#0b1c30]">
                  {set.reps}
                </div>

                <div className="col-span-3 flex justify-end">
                  {set.completed ? (
                    <div className="w-8 h-8 rounded-full bg-[#6ffbbe] text-[#002113] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[20px] font-bold">
                        check
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#76777d] text-[18px]">
                        radio_button_unchecked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Set Button */}
        <button
          onClick={handleAddExtraSet}
          className="w-full py-2.5 rounded-full bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-label-md text-[13px] font-semibold flex items-center justify-center space-x-1.5 active:scale-98 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Adicionar Série Extra</span>
        </button>
      </section>

      {/* Next Exercise Up Preview (Smooth Visual Momentum) */}
      {nextExercise ? (
        <section
          onClick={handleNextExercise}
          className="bg-[#eff4ff] rounded-2xl p-4 flex items-center justify-between shadow-xs border border-[#dce9ff]/60 cursor-pointer hover:border-[#006398]/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#006398] shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                fast_forward
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-caps text-[10px] text-[#45464d] uppercase font-bold">
                A Seguir
              </span>
              <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold truncate">
                {nextExercise.name}
              </span>
              <span className="font-body-sm text-[12px] text-[#45464d]">
                {nextExercise.defaultSetsCount} séries • {nextExercise.targetMuscle}
              </span>
            </div>
          </div>
          <button
            aria-label="Ver detalhes do próximo exercício"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0b1c30] shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </section>
      ) : null}

      {/* Final Workout Actions Floating Tray */}
      <section className="pt-2 flex flex-col space-y-2">
        <button
          onClick={() =>
            onFinishWorkout({
              routineTitle: routine.title,
              durationMinutes: Math.round(elapsedSeconds / 60),
              calories: estCalories,
              volumeKg: 3200,
            })
          }
          className="w-full h-12 bg-[#006398] hover:bg-[#004b73] text-white rounded-full font-label-lg text-[14px] font-bold flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">flag</span>
          <span>Finalizar Treino</span>
        </button>

        <div className="flex items-center justify-center space-x-4 pt-1">
          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="font-label-md text-[13px] text-[#45464d] hover:text-[#0b1c30] transition-colors flex items-center space-x-1 py-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isTimerPaused ? 'play_circle' : 'pause_circle'}
            </span>
            <span>{isTimerPaused ? 'Retomar' : 'Pausar'}</span>
          </button>

          <span className="text-[#c6c6cd]">•</span>

          <button
            onClick={onDiscardWorkout}
            className="font-label-md text-[13px] text-[#ba1a1a] hover:opacity-80 transition-opacity flex items-center space-x-1 py-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            <span>Descartar</span>
          </button>
        </div>
      </section>
    </div>
  );
};
