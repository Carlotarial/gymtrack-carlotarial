export interface Exercise {
  id: string;
  name: string;
  reps: string;
  sets: string;
  icon: string;
  gifSource: string | any;
  muscleGroup: MuscleGroup;
  description: string;
}

export type MuscleGroup = 'piernas' | 'pecho' | 'core' | 'espalda' | 'full-body';

/**
 * URLs de GIFs reales (Fuente: ExerciseDB Open Source)
 */
const getGifUrl = (id: string) => `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/${id}.gif`;

export const ALL_EXERCISES: Exercise[] = [
  { 
    id: 'e1', 
    name: 'Sentadilla Goblet', 
    reps: '12 Repeticiones', 
    sets: '4 x 12', 
    icon: 'fitness-outline', 
    gifSource: require('../assets/images/exercises/sentadillagoblet.gif'), 
    muscleGroup: 'piernas',
    description: 'Mantén el peso pegado al pecho y los codos por dentro de las rodillas en la bajada para máxima estabilidad.'
  },
  { 
    id: 'e2', 
    name: 'Flexiones Clásicas', 
    reps: '10 Repeticiones', 
    sets: '3 x 15', 
    icon: 'body-outline', 
    gifSource: getGifUrl('0662'), 
    muscleGroup: 'pecho',
    description: 'Alinea tus muñecas bajo los hombros y mantén el core activado para evitar que la cadera caiga.'
  },
  { 
    id: 'e3', 
    name: 'Zancadas Alternas', 
    reps: '20 Repeticiones', 
    sets: '3 x 20', 
    icon: 'walk-outline', 
    gifSource: require('../assets/images/exercises/zancadasalternas.gif'), 
    muscleGroup: 'piernas',
    description: 'Asegúrate de que la rodilla delantera no sobrepase la punta del pie y mantén el torso erguido.'
  },
  { 
    id: 'e4', 
    name: 'Sentadilla Isométrica', 
    reps: '1 min', 
    sets: '3 x 1m', 
    icon: 'timer-outline', 
    gifSource: require('../assets/images/exercises/sentadillaisometrica.gif'), 
    muscleGroup: 'piernas',
    description: 'Apoya toda la espalda contra la pared y mantén los muslos paralelos al suelo para una tensión constante.'
  },
  { 
    id: 'e5', 
    name: 'Flexiones Diamante', 
    reps: '8 Repeticiones', 
    sets: '4 x 8', 
    icon: 'body-outline', 
    gifSource: require('../assets/images/exercises/diamante.gif'), 
    muscleGroup: 'pecho',
    description: 'Forma un diamante con tus manos bajo el esternón para focalizar el trabajo en los tríceps.'
  },
  { 
    id: 'e6', 
    name: 'Zancada Inversa', 
    reps: '15 Reps por pierna', 
    sets: '3 x 15', 
    icon: 'walk-outline', 
    gifSource: require('../assets/images/exercises/zancadainversa.gif'), 
    muscleGroup: 'piernas',
    description: 'Un paso atrás controlado protege tus rodillas; busca un ángulo de 90 grados en ambas rodillas.'
  },
  { 
    id: 'e7', 
    name: 'Plancha Abdominal', 
    reps: '45 Segundos', 
    sets: '4 x 45s', 
    icon: 'accessibility-outline', 
    gifSource: getGifUrl('0464'), 
    muscleGroup: 'core',
    description: 'Empuja el suelo con los antebrazos y evita arquear la zona lumbar para proteger tu columna.'
  },
  { 
    id: 'e8', 
    name: 'Medio Burpee', 
    reps: '12 Repeticiones', 
    sets: '3 x 12', 
    icon: 'flash-outline', 
    gifSource: getGifUrl('1160'), 
    muscleGroup: 'full-body',
    description: 'Explosividad en el salto hacia atrás y mantén las manos firmes para proteger tus muñecas.'
  },
  { 
    id: 'e9', 
    name: 'Sentadilla con Salto', 
    reps: '15 Repeticiones', 
    sets: '3 x 15', 
    icon: 'rocket-outline', 
    gifSource: getGifUrl('0544'), 
    muscleGroup: 'piernas',
    description: 'Aterriza de forma suave sobre las puntas de los pies para reducir el impacto en las articulaciones.'
  },
  { 
    id: 'e10', 
    name: 'Zancada Explosiva', 
    reps: '10 Reps por pierna', 
    sets: '4 x 10', 
    icon: 'flash-outline', 
    gifSource: require('../assets/images/exercises/zancadaexplosiva.gif'), 
    muscleGroup: 'piernas',
    description: 'Utiliza el impulso de los brazos para saltar y cambia de pierna rápidamente en el aire.'
  },
  { 
    id: 'e11', 
    name: 'Pulse Squat', 
    reps: '20 Repeticiones', 
    sets: '3 x 20', 
    icon: 'fitness-outline', 
    gifSource: getGifUrl('3214'), 
    muscleGroup: 'piernas',
    description: 'Realiza rebotes cortos en la parte más baja de la sentadilla para intensificar el bombeo muscular.'
  },
];

/**
 * Obtener todos los detalles de una lista de IDs de ejercicios
 */
export function getFullExerciseDetails(ids: string[]): Exercise[] {
  return ids.map(id => ALL_EXERCISES.find(e => e.id === id) as Exercise).filter(Boolean);
}
