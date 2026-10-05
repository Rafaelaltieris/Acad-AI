import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ImageManagerModal } from './components/ImageManagerModal';
import {
  ExerciseDetailModal,
  RequestRoutineChangeModal,
  WorkoutCompletedModal,
  NotificationsModal,
} from './components/Modals';
import { HomeScreen } from './screens/HomeScreen';
import { WorkoutsScreen } from './screens/WorkoutsScreen';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { EvolutionScreen } from './screens/EvolutionScreen';
import {
  INITIAL_IMAGES,
  INITIAL_HYDRATION,
  ROUTINES_DATA,
  INITIAL_BODY_COMPOSITION,
} from './data/mockData';
import { AppImageLinks, WorkoutRoutine, DailyHydration, BodyComposition } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'treinos' | 'executar' | 'evolucao'>('inicio');

  // Image links with localStorage persistence
  const [imageLinks, setImageLinks] = useState<AppImageLinks>(() => {
    try {
      const saved = localStorage.getItem('pulse_image_links');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_IMAGES;
  });

  // Save image links when updated
  const handleUpdateImageLinks = (newLinks: AppImageLinks) => {
    setImageLinks(newLinks);
    try {
      localStorage.setItem('pulse_image_links', JSON.stringify(newLinks));
    } catch {
      // ignore
    }
  };

  // Workout state
  const [routines] = useState<WorkoutRoutine[]>(ROUTINES_DATA);
  const [activeRoutineId, setActiveRoutineId] = useState<string>('A');
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(true);

  // Daily hydration state
  const [hydration, setHydration] = useState<DailyHydration>(INITIAL_HYDRATION);

  // Body composition state
  const [bodyComposition, setBodyComposition] = useState<BodyComposition>(INITIAL_BODY_COMPOSITION);

  // Modals state
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoutineChangeOpen, setIsRoutineChangeOpen] = useState(false);
  const [exerciseDetailRoutine, setExerciseDetailRoutine] = useState<WorkoutRoutine | null>(null);
  const [workoutCompletedSummary, setWorkoutCompletedSummary] = useState<{
    routineTitle: string;
    durationMinutes: number;
    calories: number;
    volumeKg: number;
  } | null>(null);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const activeRoutine =
    routines.find((r) => r.id === activeRoutineId) || routines[0];
  const featuredRoutine =
    routines.find((r) => r.id === 'A') || routines[0];

  const handleStartWorkout = (routineId: string) => {
    setActiveRoutineId(routineId);
    setIsWorkoutActive(true);
    setCurrentTab('executar');
  };

  const handleFinishWorkout = (summary: {
    routineTitle: string;
    durationMinutes: number;
    calories: number;
    volumeKg: number;
  }) => {
    setWorkoutCompletedSummary(summary);
    setIsWorkoutActive(false);
  };

  const handleDiscardWorkout = () => {
    if (confirm('Deseja realmente pausar ou descartar o treino atual?')) {
      setIsWorkoutActive(false);
      setCurrentTab('inicio');
    }
  };

  const handleSaveNewEntry = (data: {
    weight: number;
    bodyFat?: number;
    notes?: string;
    photoUrl?: string;
  }) => {
    setBodyComposition((prev) => ({
      ...prev,
      weight: data.weight,
      weightChange: +(data.weight - 66.0).toFixed(1),
      bodyFat: data.bodyFat ?? prev.bodyFat,
      bodyFatChange: data.bodyFat ? +(data.bodyFat - 20.6).toFixed(1) : prev.bodyFatChange,
    }));

    if (data.photoUrl) {
      handleUpdateImageLinks({
        ...imageLinks,
        currentPhotoUrl: data.photoUrl,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#cce5ff]">
      {/* Universal Fixed Header */}
      <Header
        currentTab={currentTab}
        imageLinks={imageLinks}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenImageManager={() => setIsImageManagerOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 w-full">
        {currentTab === 'inicio' && (
          <HomeScreen
            featuredRoutine={featuredRoutine}
            hydration={hydration}
            onUpdateHydration={(liters) =>
              setHydration((prev) => ({ ...prev, currentLiters: liters }))
            }
            onStartWorkout={handleStartWorkout}
            onViewWorkoutSheet={(routine) => setExerciseDetailRoutine(routine)}
            onSelectTab={(tab) => setCurrentTab(tab as any)}
          />
        )}

        {currentTab === 'treinos' && (
          <WorkoutsScreen
            routines={routines}
            onStartWorkout={handleStartWorkout}
            onViewExercises={(routine) => setExerciseDetailRoutine(routine)}
            onRequestChange={() => setIsRoutineChangeOpen(true)}
          />
        )}

        {currentTab === 'executar' && (
          <ActiveWorkoutScreen
            routine={activeRoutine}
            imageLinks={imageLinks}
            onFinishWorkout={handleFinishWorkout}
            onDiscardWorkout={handleDiscardWorkout}
          />
        )}

        {currentTab === 'evolucao' && (
          <EvolutionScreen
            bodyComposition={bodyComposition}
            imageLinks={imageLinks}
            onOpenImageManager={() => setIsImageManagerOpen(true)}
            onSaveNewEntry={handleSaveNewEntry}
          />
        )}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab as any)}
        isWorkoutActive={isWorkoutActive}
      />

      {/* Modals & Dialogs */}
      <ImageManagerModal
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        imageLinks={imageLinks}
        onUpdateImageLinks={handleUpdateImageLinks}
      />

      <ExerciseDetailModal
        routine={exerciseDetailRoutine}
        onClose={() => setExerciseDetailRoutine(null)}
        onStartWorkout={handleStartWorkout}
      />

      <RequestRoutineChangeModal
        isOpen={isRoutineChangeOpen}
        onClose={() => setIsRoutineChangeOpen(false)}
      />

      <WorkoutCompletedModal
        summary={workoutCompletedSummary}
        onClose={() => {
          setWorkoutCompletedSummary(null);
          setCurrentTab('inicio');
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
