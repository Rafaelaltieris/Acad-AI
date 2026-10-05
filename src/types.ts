export interface ExerciseSet {
  id: string;
  setNumber: number;
  label: string; // 'Aquec.' | 'Trabalho' | 'Atual' | 'Final' | 'Extra'
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  recommendedLoad: string;
  defaultSetsCount: number;
  defaultReps: string;
  imageUrl: string;
  tip?: string;
  sets: ExerciseSet[];
}

export interface WorkoutRoutine {
  id: string; // 'A' | 'B' | 'C' | 'D'
  code: string;
  title: string;
  splitTag: string;
  subtitle: string;
  intensity: string;
  intensityType: 'high' | 'max' | 'light';
  isRecommendedToday?: boolean;
  exerciseCount: number;
  estMinutes: number;
  estCalories: number;
  lastTrainedStatus: string;
  featuredTags: string[];
  extraTagsCount: number;
  exercises: Exercise[];
}

export interface BodyComposition {
  weight: number;
  weightChange: number;
  bodyFat: number;
  bodyFatChange: number;
  leanMass: number;
  leanMassChange: number;
  maxBenchPress: number;
  maxBenchPressChange: number;
}

export interface ComparisonPhoto {
  id: string;
  periodLabel: string;
  date: string;
  weight: string;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  cycle: string;
  week: string;
  coachName: string;
  gymName: string;
}

export interface DailyHydration {
  currentLiters: number;
  targetLiters: number;
}

export interface AppImageLinks {
  logoUrl: string;
  profileUrl: string;
  exerciseBenchPressUrl: string;
  baselinePhotoUrl: string;
  currentPhotoUrl: string;
}
