// Tips del día para la sección del dashboard

export interface Tip {
  id: string;
  title: string;
  text: string;
  icon: string; // Ionicons name
}

export const ALL_TIPS: Tip[] = [
  {
    id: 't1',
    title: 'Sabías que...',
    text: 'Beber agua antes de entrenar mejora tu rendimiento hasta un 25%.',
    icon: 'water-outline',
  },
  {
    id: 't2',
    title: 'Dato curioso',
    text: 'Entrenar por la mañana acelera tu metabolismo durante todo el día.',
    icon: 'sunny-outline',
  },
  {
    id: 't3',
    title: 'Consejo pro',
    text: 'Dormir 7-8 horas es tan importante como el propio entrenamiento.',
    icon: 'moon-outline',
  },
  {
    id: 't4',
    title: 'Nutrición',
    text: 'La proteína después del entrenamiento ayuda a reparar las fibras musculares.',
    icon: 'restaurant-outline',
  },
  {
    id: 't5',
    title: '¿Lo sabías?',
    text: 'Caminar 10.000 pasos al día reduce el riesgo de enfermedad cardiovascular un 30%.',
    icon: 'walk-outline',
  },
];

/**
 * Devuelve un tip aleatorio cada vez que se llama (recarga).
 */
export function getDailyTip(): Tip {
  const randomIndex = Math.floor(Math.random() * ALL_TIPS.length);
  return ALL_TIPS[randomIndex];
}
