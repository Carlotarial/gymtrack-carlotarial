import { Exercise, getFullExerciseDetails } from '@/data/exercises';
import { getWorkoutById, ALL_WORKOUTS } from '@/data/workouts';
import { useCallback, useState } from 'react';

/**
 * Hook que encapsula la lógica de navegación entre ejercicios durante un entrenamiento.
 */
export function useWorkoutPlayer(workoutId: string) {
  // Obtenemos los ejercicios reales de esa rutina o asignamos un fallback de seguridad
  const workout = getWorkoutById(workoutId) || ALL_WORKOUTS[0];
  const exercises = getFullExerciseDetails(workout.exercises);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback si por alguna razón falla el mapeo
  const currentExercise: Exercise = exercises[currentIndex] || exercises[0];
  const totalExercises = exercises.length;
  const isLastExercise = currentIndex >= totalExercises - 1;
  const progress = (currentIndex + 1) / totalExercises;

  const goToNext = useCallback(() => {
    if (!isLastExercise) {
      setIsLoading(true);
      setCurrentIndex((i) => i + 1);
    }
  }, [isLastExercise]);

  const onLoadStart = useCallback(() => setIsLoading(true), []);
  const onLoadEnd = useCallback(() => setIsLoading(false), []);

  return {
    currentExercise,
    nextExercise: exercises[currentIndex + 1] || null,
    currentIndex,
    totalExercises,
    isLastExercise,
    isLoading,
    progress,
    goToNext,
    onLoadStart,
    onLoadEnd,
    workoutTitle: workout.title,
  };
}
