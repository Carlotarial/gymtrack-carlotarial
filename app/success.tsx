import { AppColors, useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';
import { useUser } from '../context/UserContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 🌟 Componente individual para cada trozo de confeti (Evita errores en Web)
const ConfettiPiece = ({ index }: { index: number }) => {
  const translateY = useSharedValue(-100);
  const rotate = useSharedValue(0);
  const horizontalOffset = useSharedValue(Math.random() * 40 - 20);

  const size = 7 + Math.random() * 9; // Un pelín más grandes para que se vean mejor los pasteles

  // 🌟 PALETA SUPER PASTEL SOFISTICADA
  const palette = [
    '#FFD1DC', // Rosa Pastel Suave
    '#B2E2F2', // Azul Cielo Pastel
    '#C1E1C1', // Verde Menta Deslavado
    '#FDFD96', // Amarillo Vainilla
    '#E6E6FA', // Lavanda Pálido
    '#F4BBFF', // Orquídea Pastel
    '#FFCC99'  // Melocotón Suave
  ];
  
  const color = palette[index % palette.length];
  const randomX = Math.random() * SCREEN_WIDTH;

  useEffect(() => {
    const delay = Math.random() * 2000;
    const duration = 3000 + Math.random() * 2500; // Caída un poco más lenta y majestuosa

    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(SCREEN_HEIGHT + 100, { duration, easing: Easing.linear }), -1, false)
    );

    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(720, { duration: duration * 1.5, easing: Easing.linear }), -1, false)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { translateX: horizontalOffset.value }
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -20,
          left: randomX,
          width: size,
          height: index % 3 === 0 ? size * 1.6 : size, // Mezcla de formas
          borderRadius: index % 2 === 0 ? size : 3, // Círculos y rectángulos suaves
          backgroundColor: color,
          opacity: 0.75, // Ligeramente transparentes para mayor suavidad
        },
        animatedStyle,
      ]}
    />
  );
};

export default function SuccessScreen() {
  const router = useRouter();
  const { seconds, title } = useLocalSearchParams();
  const { user, completeWorkout } = useUser();
  const { colors } = useTheme();
  const hasRecorded = useRef(false);

  const elapsedSeconds = parseInt(seconds as string, 10) || 0;
  const workoutTitle = (title as string) || 'Entrenamiento';
  const minutes = Math.max(Math.floor(elapsedSeconds / 60), 1);
  const kcal = Math.round((elapsedSeconds / 60) * 7) || 45; 

  useEffect(() => {
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      completeWorkout(workoutTitle, elapsedSeconds, kcal);
    }
  }, []);

  const s = dynamicStyles(colors);

  return (
    <SafeAreaView style={s.container}>
      {/* Sistema de Confeti Seguro y PASTEL 🌸 */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {[...Array(35)].map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </View>

      <View style={staticStyles.content}>
        
        {/* Trofeo Animado */}
        <Animated.View entering={ZoomIn.duration(800).springify()} style={s.iconCircle}>
          <Ionicons name="trophy" size={60} color={colors.gold} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={{ alignItems: 'center' }}>
          <View style={s.overlineContainer}>
            <View style={s.overlineDot} />
            <Text style={s.overlineText}>SESIÓN COMPLETADA</Text>
          </View>
          
          <Text style={s.title}>
            <Text style={s.titleLight}>¡Buen trabajo,{"\n"}</Text>
            <Text style={s.titleBold}>{user.name}</Text>
            <Text style={s.titleDot}>!</Text>
          </Text>
          
          <Text style={s.subtitle}>
            Has completado <Text style={{fontWeight: '700', color: colors.text}}>{workoutTitle}</Text>. Cada gota de sudor cuenta para tu objetivo.
          </Text>
        </Animated.View>

        {/* Tarjeta de Estadísticas */}
        <Animated.View entering={FadeInDown.delay(400)} style={s.statsCard}>
          <View style={staticStyles.statBox}>
            <Ionicons name="time-outline" size={20} color={colors.textMuted} style={{marginBottom: 8}} />
            <Text style={s.statNumber}>{minutes}</Text>
            <Text style={s.statLabel}>MINUTOS</Text>
          </View>

          <View style={s.divider} />

          <View style={staticStyles.statBox}>
            <Ionicons name="flame-outline" size={20} color={colors.textMuted} style={{marginBottom: 8}} />
            <Text style={s.statNumber}>{kcal}</Text>
            <Text style={s.statLabel}>KCAL</Text>
          </View>
        </Animated.View>

        {/* Mensaje de Racha */}
        <Animated.View entering={FadeInDown.delay(600)} style={s.streakBadge}>
          <Ionicons name="flash" size={18} color={colors.accent} />
          <Text style={s.streakText}>¡Racha de {user.streak + 1} días activa!</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(800)} style={staticStyles.footer}>
        <Pressable 
          style={({ pressed }) => [s.homeButton, pressed && { opacity: 0.8 }]} 
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={s.homeButtonText}>Volver al inicio</Text>
          <Text style={[s.homeButtonText, {color: colors.accent}]}>.</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const staticStyles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statBox: { alignItems: 'center', flex: 1 },
  footer: { paddingHorizontal: 24, paddingBottom: 50 },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  overlineContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  overlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginRight: 8 },
  overlineText: { fontSize: 11, fontWeight: '800', color: c.accentDark, letterSpacing: 2 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 32, shadowColor: c.gold, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 8, borderWidth: 1, borderColor: c.surfaceBorder },
  title: { fontSize: 42, letterSpacing: -1.5, textAlign: 'center', lineHeight: 48 },
  titleLight: { fontWeight: '300', color: c.textSecondary },
  titleBold: { fontWeight: '900', color: c.text },
  titleDot: { fontWeight: '900', color: c.accent },
  subtitle: { fontSize: 16, color: c.textSecondary, textAlign: 'center', lineHeight: 24, marginTop: 16, marginBottom: 40, paddingHorizontal: 30, fontWeight: '500' },
  statsCard: { flexDirection: 'row', backgroundColor: c.surface, borderRadius: 32, paddingVertical: 30, width: SCREEN_WIDTH - 48, justifyContent: 'space-around', alignItems: 'center', shadowColor: c.accentDark, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 25, elevation: 4, borderWidth: 1, borderColor: c.surfaceBorder },
  statNumber: { fontSize: 36, fontWeight: '900', color: c.text, letterSpacing: -1 },
  statLabel: { fontSize: 10, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '800' },
  divider: { width: 1, height: 40, backgroundColor: c.surfaceBorder },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.accentLight, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, marginTop: 32 },
  streakText: { fontSize: 15, fontWeight: '800', color: c.accentDark, marginLeft: 8 },
  homeButton: { flexDirection: 'row', backgroundColor: c.text, padding: 22, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 5 },
  homeButtonText: { fontSize: 18, fontWeight: '900', color: c.background },
});