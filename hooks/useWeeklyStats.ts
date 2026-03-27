import { WorkoutSession } from '@/context/UserContext';
import { useMemo } from 'react';

interface WeeklyStats {
  dailyKcal: number[];
  bars: number[];
  totalKcal: number;
  sessionsThisWeek: number;
  totalMinutes: number;
  hasActivity: boolean;
}


export function useWeeklyStats(workoutHistory: WorkoutSession[]): WeeklyStats {
  return useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - mondayOffset);

    const weekSessions = workoutHistory.filter(s => new Date(s.date) >= monday);

    const dailyKcal = [0, 0, 0, 0, 0, 0, 0]; 
    weekSessions.forEach((session) => {
      const date = new Date(session.date);
      const day = date.getDay();
      const index = day === 0 ? 6 : day - 1;
      dailyKcal[index] += session.kcal;
    });

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


export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
}
