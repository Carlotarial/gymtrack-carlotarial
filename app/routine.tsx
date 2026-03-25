import { AppColors, useTheme } from '@/context/ThemeContext';
import { getFullExerciseDetails } from '@/data/exercises';
import { ALL_WORKOUTS, getWorkoutById } from '@/data/workouts';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function RoutineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { colors } = useTheme();

  const workout = id ? getWorkoutById(id as string) : ALL_WORKOUTS[0];
  const exercises = workout ? getFullExerciseDetails(workout.exercises) : [];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // 🌟 FUNCIÓN PARA LANZAR EL WORKOUT DESDE UN PUNTO ESPECÍFICO
  const startWorkoutAt = (index: number) => {
    router.push({ 
      pathname: '/workout', 
      params: { id: workout?.id, startIndex: index.toString() } 
    } as any);
  };

  const s = dynamicStyles(colors);

  if (!workout) return null;

  return (
    <View style={s.container}>
      {/* Header Editorial */}
      <Animated.View entering={FadeInDown.duration(400)} style={s.header}>
        <Pressable onPress={handleBack} style={s.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <View style={s.headerTitleContainer}>
            <Text style={s.headerSubtitle}>DETALLES DE RUTINA</Text>
            <Text style={s.headerTitle}>{workout.title}<Text style={{color: colors.accent}}>.</Text></Text>
        </View>
        <View style={{ width: 44 }} /> 
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={staticStyles.scrollContent}>
        
        {/* Banner de Métricas */}
        <Animated.View entering={FadeInDown.delay(100)} style={s.infoBanner}>
          <View style={staticStyles.infoItem}>
            <Ionicons name="time-outline" size={24} color="#4A90E2" style={{marginBottom: 6}} />
            <Text style={s.infoValue}>{workout.duration}</Text>
            <Text style={s.infoLabel}>MINUTOS</Text>
          </View>
          <View style={s.divider} />
          <View style={staticStyles.infoItem}>
            <Ionicons name="flash-outline" size={24} color="#FFB800" style={{marginBottom: 6}} />
            <Text style={s.infoValue}>{workout.intensity}</Text>
            <Text style={s.infoLabel}>NIVEL</Text>
          </View>
          <View style={s.divider} />
          <View style={staticStyles.infoItem}>
            <Ionicons name="flame-outline" size={24} color="#FF4B4B" style={{marginBottom: 6}} />
            <Text style={s.infoValue}>{workout.kcalEstimate}</Text>
            <Text style={s.infoLabel}>KCAL</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={s.sectionTitle}>Plan de entrenamiento</Text>
        </Animated.View>

        {/* 🌟 Lista de Ejercicios Convertidos en Botones */}
        {exercises.map((item, index) => (
          <Animated.View entering={FadeInUp.delay(300 + (index * 100))} key={`${item.id}-${index}`}>
            <Pressable 
              style={({ pressed }) => [s.exerciseCard, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
              onPress={() => startWorkoutAt(index)}
            >
              <View style={s.exerciseNumberContainer}>
                  <Text style={s.exerciseNumber}>{(index + 1).toString().padStart(2, '0')}</Text>
              </View>
              <View style={s.iconWrapper}>
                <Ionicons name={item.icon as any} size={26} color={colors.accentDark} />
              </View>
              <View style={staticStyles.exerciseInfo}>
                <Text style={s.exerciseName}>{item.name}</Text>
                <Text style={s.exerciseReps}>{item.sets}</Text>
              </View>
              <View style={s.playCircle}>
                <Ionicons name="play" size={14} color={colors.accent} />
              </View>
            </Pressable>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInUp.delay(800)}>
          <Pressable 
            style={s.startButton} 
            onPress={() => startWorkoutAt(0)}
          >
            <Text style={s.startButtonText}>Comenzar desde el inicio</Text>
            <Ionicons name="flash" size={20} color={colors.buttonPrimaryText} style={{marginLeft: 8}} />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  infoItem: { flex: 1, alignItems: 'center' },
  exerciseInfo: { flex: 1 },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 60, marginBottom: 30, paddingHorizontal: 16 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: c.surfaceBorder },
  headerTitleContainer: { alignItems: 'center' },
  headerSubtitle: { fontSize: 10, fontWeight: '900', color: c.accent, letterSpacing: 2, marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: c.text, letterSpacing: -1 },
  infoBanner: { flexDirection: 'row', backgroundColor: c.surface, paddingVertical: 24, borderRadius: 32, marginBottom: 40, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 30, elevation: 4, borderWidth: 1, borderColor: c.surfaceBorder },
  infoLabel: { fontSize: 10, color: c.textSecondary, fontWeight: '800', marginTop: 6, letterSpacing: 1 },
  infoValue: { fontSize: 18, fontWeight: '900', color: c.text },
  divider: { width: 1, height: '50%', backgroundColor: c.surfaceBorder, alignSelf: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: c.text, marginBottom: 20, letterSpacing: -0.5 },
  
  exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, padding: 16, borderRadius: 28, marginBottom: 12, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2, borderWidth: 1, borderColor: c.surfaceBorder },
  exerciseNumberContainer: { marginRight: 12, opacity: 0.3 },
  exerciseNumber: { fontSize: 12, fontWeight: '900', color: c.text },
  iconWrapper: { width: 52, height: 52, borderRadius: 16, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  exerciseName: { fontSize: 16, fontWeight: '700', color: c.text, letterSpacing: -0.3 },
  exerciseReps: { fontSize: 13, color: c.textSecondary, marginTop: 2, fontWeight: '600' },
  
  // 🌟 Pequeño indicador de play en cada tarjeta
  playCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  startButton: { flexDirection: 'row', backgroundColor: c.buttonPrimary, padding: 22, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 30, shadowColor: c.accent, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 6 },
  startButtonText: { fontSize: 18, fontWeight: '800', color: c.buttonPrimaryText },
});