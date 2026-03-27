import { Exercise, getFullExerciseDetails } from '@/data/exercises';
import { ALL_WORKOUTS, getWorkoutById } from '@/data/workouts';
import { useCallback, useState } from 'react';


export function useWorkoutPlayer(workoutId: string) {
  const workout = getWorkoutById(workoutId) || ALL_WORKOUTS[0];
  const exercises = getFullExerciseDetails(workout.exercises);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
