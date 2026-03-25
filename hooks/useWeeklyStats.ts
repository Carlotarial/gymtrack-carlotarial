import { useMemo } from 'react';
import { WorkoutSession } from '@/context/UserContext';

interface WeeklyStats {
  /** Kcal por día [L, M, X, J, V, S, D] */
  dailyKcal: number[];
  /** Barras normalizadas 0-100 para la gráfica */
  bars: number[];
  /** Total kcal de la semana */
  totalKcal: number;
  /** Sesiones de la semana */
  sessionsThisWeek: number;
  /** Total minutos de la semana */
  totalMinutes: number;
  /** Si hay actividad en la semana */
  hasActivity: boolean;
}

/**
 * Hook que calcula estadísticas semanales a partir del historial de entrenamientos.
 */
export function useWeeklyStats(workoutHistory: WorkoutSession[]): WeeklyStats {
  return useMemo(() => {
    // Calcular inicio de la semana (lunes)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=domingo
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - mondayOffset);

    // Filtrar sesiones de esta semana
    const weekSessions = workoutHistory.filter(s => new Date(s.date) >= monday);

    // Agrupar kcal por día de la semana
    const dailyKcal = [0, 0, 0, 0, 0, 0, 0]; // L M X J V S D
    weekSessions.forEach((session) => {
      const date = new Date(session.date);
      const day = date.getDay();
      const index = day === 0 ? 6 : day - 1;
      dailyKcal[index] += session.kcal;
    });

    // Normalizar a porcentajes para la gráfica
    const max = Math.max(...dailyKcal, 1);
    const bars = dailyKcal.map((val) => Math.round((val / max) * 100));

    const totalKcal = dailyKcal.reduce((a, b) => a + b, 0);
    const totalMinutes = Math.round(
      weekSessions.reduce((acc, s) => acc + s.durationSecs, 0) / 60
    );

    return {
      dailyKcal,
      bars,
      totalKcal,
      sessionsThisWeek: weekSessions.length,
      totalMinutes,
      hasActivity: bars.some(v => v > 0),
    };
  }, [workoutHistory]);
}

/**
 * Formatear una fecha ISO a texto relativo (Hoy, Ayer, Hace X días).
 */
export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
}
