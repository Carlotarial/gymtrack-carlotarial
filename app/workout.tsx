import { AppColors, useTheme } from '@/context/ThemeContext';
import { useTimer } from '@/hooks/useTimer';
import { useWorkoutPlayer } from '@/hooks/useWorkoutPlayer';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
// 🌟ScrollView añadida aquí abajo:
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function WorkoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const timer = useTimer(true);
  const { id } = useLocalSearchParams();
  const player = useWorkoutPlayer(id as string);

  const handleNextExercise = () => {
    if (!player.isLastExercise) {
      player.goToNext();
    } else {
      router.push({ 
        pathname: '/success', 
        params: { seconds: timer.seconds.toString(), title: player.workoutTitle } 
      } as any);
    }
  };

  const s = dynamicStyles(colors);

  return (
    <View style={s.container}>
      {/* Header con progreso */}
      <Animated.View entering={FadeInDown.delay(100)} style={s.header}>
        <Pressable onPress={() => router.back()} style={s.closeButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        
        <View style={s.progressBadge}>
          <Text style={s.progressBadgeText}>EJERCICIO {player.currentIndex + 1} DE {player.totalExercises}</Text>
        </View>
        
        <View style={{ width: 44 }} /> 
      </Animated.View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View 
          key={player.currentIndex} 
          entering={FadeInRight.duration(450).easing(Easing.out(Easing.exp))} 
          exiting={FadeOutLeft.duration(200)}
          style={s.content}
        >
          {/* Nombre del Ejercicio Estilo Editorial */}
          <View style={s.titleContainer}>
            <Text style={s.exerciseTitle}>
              <Text style={s.exerciseTitleLight}>Ahora: </Text>
              <Text style={s.exerciseTitleBold}>{player.currentExercise.name}</Text>
              <Text style={s.titleDot}>.</Text>
            </Text>
            <View style={s.repsBadge}>
               <Ionicons name="repeat" size={14} color={colors.gold} style={{ marginRight: 6 }} />
               <Text style={s.repsText}>{player.currentExercise.reps}</Text>
            </View>
          </View>

          {/* Visualizador de Ejercicio */}
          <View style={s.gifWrapper}>
            <View style={s.gifContainer}>
              <Image
                style={s.gifImage}
                source={player.currentExercise.gifSource}
                contentFit="contain"
                onLoadStart={player.onLoadStart}
                onLoadEnd={player.onLoadEnd}
                transition={400}
              />
              {player.isLoading && (
                <View style={s.loaderOverlay}>
                  <ActivityIndicator size="large" color={colors.accent} />
                </View>
              )}
            </View>
          </View>

          {/* Cronómetro Centralizado */}
          <View style={s.timerSection}>
            <Text style={s.timerValue}>{timer.formatted}</Text>
            <Text style={s.timerLabel}>TIEMPO TRANSCURRIDO</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer Fijo */}
      <Animated.View entering={FadeInDown.delay(400)} style={s.footer}>
        {player.nextExercise && (
          <View style={s.nextPreviewCard}>
            <View style={s.nextPreviewIcon}>
              <Image 
                source={player.nextExercise.gifSource} 
                style={{ width: '100%', height: '100%' }} 
                contentFit="cover"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.nextPreviewLabel}>PRÓXIMO</Text>
                <Text style={s.nextPreviewName} numberOfLines={1}>{player.nextExercise.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        )}

        <Pressable 
          style={[s.nextButton, player.isLastExercise && { backgroundColor: colors.accentDark }]} 
          onPress={handleNextExercise}
        >
          <Text style={s.nextButtonText}>
            {!player.isLastExercise ? 'Siguiente ejercicio' : 'Finalizar sesión'}
          </Text>
          <Ionicons 
            name={!player.isLastExercise ? "arrow-forward" : "checkmark-done"} 
            size={20} 
            color={colors.buttonPrimaryText} 
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 50, paddingHorizontal: 20, marginBottom: 10 },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: c.surfaceBorder },
  progressBadge: { backgroundColor: c.accentLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  progressBadgeText: { fontSize: 11, fontWeight: '900', color: c.accentDark, letterSpacing: 1 },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  
  titleContainer: { alignItems: 'center', marginBottom: 24 },
  exerciseTitle: { fontSize: 28, letterSpacing: -1, textAlign: 'center' },
  exerciseTitleLight: { fontWeight: '300', color: c.textSecondary },
  exerciseTitleBold: { fontWeight: '800', color: c.text },
  titleDot: { color: c.accent, fontWeight: '900' },
  
  repsBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: c.goldLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  repsText: { fontSize: 15, color: c.gold, fontWeight: '800' },

  gifWrapper: { shadowColor: c.accentDark, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 },
  gifContainer: { backgroundColor: c.surface, height: 300, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: c.surfaceBorder, justifyContent: 'center', alignItems: 'center' },
  gifImage: { width: '85%', height: '85%' },
  loaderOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: c.surface },

  timerSection: { alignItems: 'center', marginTop: 35, marginBottom: 20 },
  timerValue: { fontSize: 64, fontWeight: '800', color: c.text, fontVariant: ['tabular-nums'], letterSpacing: -2 },
  timerLabel: { fontSize: 12, color: c.textSecondary, fontWeight: '800', letterSpacing: 2, marginTop: -5 },

  footer: { paddingHorizontal: 24, paddingBottom: 40, backgroundColor: c.background },
  nextPreviewCard: { flexDirection: 'row', backgroundColor: c.surface, padding: 12, borderRadius: 24, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: c.surfaceBorder },
  nextPreviewIcon: { width: 48, height: 48, backgroundColor: c.accentLight, borderRadius: 12, overflow: 'hidden' },
  nextPreviewLabel: { fontSize: 9, fontWeight: '900', color: c.accent, letterSpacing: 1 },
  nextPreviewName: { fontSize: 15, fontWeight: '700', color: c.text },
  
  nextButton: { flexDirection: 'row', backgroundColor: c.buttonPrimary, padding: 22, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: c.accent, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  nextButtonText: { fontSize: 18, fontWeight: '800', color: c.buttonPrimaryText, marginRight: 10 },
});