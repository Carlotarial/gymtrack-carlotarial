export interface Workout {
  id: string;
  title: string;
  duration: string;
  durationMinutes: number;
  intensity: 'Baja' | 'Media' | 'Alta';
  kcalEstimate: number;
  tag: WorkoutTag;
  icon: string;
  exercises: string[];
}

export type WorkoutTag = 'HIIT' | 'Fuerza' | 'Yoga' | 'Cardio' | 'Core';

export const WORKOUT_TAGS: WorkoutTag[] = ['HIIT', 'Fuerza', 'Yoga', 'Cardio', 'Core'];

export const CATEGORIES = ['Todos', ...WORKOUT_TAGS];

export const ALL_WORKOUTS: Workout[] = [
  { id: 'w1', title: 'Abdomen de Acero', duration: '15 min', durationMinutes: 15, intensity: 'Alta', kcalEstimate: 180, tag: 'HIIT', icon: 'flame-outline', exercises: ['e7', 'e2', 'e5', 'e8'] },
  { id: 'w2', title: 'Movilidad Matutina', duration: '10 min', durationMinutes: 10, intensity: 'Baja', kcalEstimate: 60, tag: 'Yoga', icon: 'leaf-outline', exercises: ['e1', 'e3'] },
  { id: 'w3', title: 'Fuerza Superior', duration: '35 min', durationMinutes: 35, intensity: 'Media', kcalEstimate: 320, tag: 'Fuerza', icon: 'barbell-outline', exercises: ['e2', 'e5', 'e7'] },
  { id: 'w4', title: 'Cardio Quemagrasa', duration: '20 min', durationMinutes: 20, intensity: 'Alta', kcalEstimate: 280, tag: 'Cardio', icon: 'bicycle-outline', exercises: ['e9', 'e8', 'e10', 'e3'] },
  { id: 'w5', title: 'Circuito HIIT', duration: '25 min', durationMinutes: 25, intensity: 'Alta', kcalEstimate: 300, tag: 'HIIT', icon: 'flash-outline', exercises: ['e9', 'e2', 'e10', 'e8'] },
  { id: 'w6', title: 'Tren Inferior Pro', duration: '45 min', durationMinutes: 45, intensity: 'Media', kcalEstimate: 340, tag: 'Fuerza', icon: 'fitness-outline', exercises: ['e1', 'e11', 'e6', 'e4'] },
  { id: 'w7', title: 'Zona Core Express', duration: '20 min', durationMinutes: 20, intensity: 'Baja', kcalEstimate: 150, tag: 'Core', icon: 'accessibility-outline', exercises: ['e7', 'e8', 'e2'] },
  { id: 'w8', title: 'Hipertrofia Total', duration: '50 min', durationMinutes: 50, intensity: 'Alta', kcalEstimate: 450, tag: 'Fuerza', icon: 'barbell-outline', exercises: ['e1', 'e5', 'e6', 'e2', 'e3'] },
];

export function getRecommendedWorkouts(goal: string, activityLevel?: string): Workout[] {
  let baseWorkouts = [...ALL_WORKOUTS];
  
  // 1. Filtrar por objetivo primario
  if (goal === 'perder_peso') {
    baseWorkouts = ALL_WORKOUTS.filter(w => ['HIIT', 'Cardio'].includes(w.tag));
  } else if (goal === 'ganar_musculo') {
    baseWorkouts = ALL_WORKOUTS.filter(w => w.tag === 'Fuerza');
  } else if (goal === 'tonificar') {
    baseWorkouts = ALL_WORKOUTS.filter(w => ['Core', 'Fuerza', 'Yoga'].includes(w.tag));
  }

  // 2. Ajustar por nivel de actividad (Intensidad)
  if (activityLevel) {
    const level = activityLevel.toLowerCase();
    if (level === 'sedentario') {
      // Principiante: Evitar intensidad Alta si es posible
      const easy = baseWorkouts.filter(w => w.intensity !== 'Alta');
      if (easy.length >= 2) baseWorkouts = easy;
    } else if (level === 'activo') {
      // Avanzado: Priorizar intensidad Alta
      const hard = baseWorkouts.filter(w => w.intensity === 'Alta');
      if (hard.length >= 2) baseWorkouts = hard;
    }
  }

  // Retornar al menos 2, mezclando si es necesario
  if (baseWorkouts.length < 2) {
    return [...baseWorkouts, ...ALL_WORKOUTS].slice(0, 2);
  }
  
  return baseWorkouts.slice(0, 2);
}

export function filterWorkouts(search: string, tag: string): Workout[] {
  return ALL_WORKOUTS.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = tag === 'Todos' || w.tag === tag;
    return matchesSearch && matchesTag;
  });
}

export function getWorkoutById(id: string): Workout | undefined {
  return ALL_WORKOUTS.find(w => w.id === id);
}
