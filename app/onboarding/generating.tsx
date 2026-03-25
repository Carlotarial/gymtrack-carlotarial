import { AppColors, useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FITNESS_TIPS = [
  "La hidratación constante mejora el rendimiento.",
  "El descanso es clave para el crecimiento real.",
  "Pequeños progresos suman grandes resultados.",
  "La técnica correcta previene lesiones.",
  "La constancia es la llave del éxito físico."
];

const MESSAGES = [
  { text: 'Analizando biometría...', p: 0.25, icon: 'finger-print-outline' },
  { text: 'Calculando TDEE y macros...', p: 0.55, icon: 'calculator-outline' },
  { text: 'Filtrando ejercicios...', p: 0.75, icon: 'barbell-outline' },
  { text: 'Estructurando programa...', p: 1.0, icon: ' medal-outline' }
];

export default function GeneratingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [currentTip, setCurrentTip] = useState(FITNESS_TIPS[0]);

  const progress = useSharedValue(0.1);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Animación de pulso del icono
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Ciclo de mensajes de carga
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < MESSAGES.length - 1) {
          const next = prev + 1;
          progress.value = withTiming(MESSAGES[next].p, { duration: 2000 });
          return next;
        }
        return prev;
      });
    }, 2000);

    // Ciclo de tips
    let tipIndex = 0;
    const tipInterval = setInterval(() => {
      tipIndex = (tipIndex + 1) % FITNESS_TIPS.length;
      setCurrentTip(FITNESS_TIPS[tipIndex]);
    }, 4000);

    // Navegación final
    const timer = setTimeout(() => {
      router.replace('/(tabs)' as any);
    }, 8500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: (SCREEN_WIDTH * 0.7) * progress.value
  }));

  const s = dynamicStyles(colors);

  return (
    <View style={s.container}>
      {/* Blobs de fondo para coherencia con el inicio */}
      <View style={s.blob1} />
      <View style={s.blob2} />

      <View style={staticStyles.content}>
        {/* Icono Dinámico */}
        <Animated.View style={[s.iconBox, pulseStyle]}>
          <Animated.View 
            key={MESSAGES[stepIndex].icon} 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)}
          >
            <Ionicons name={MESSAGES[stepIndex].icon as any} size={42} color={colors.accent} />
          </Animated.View>
        </Animated.View>

        <View style={{ alignItems: 'center' }}>
          <View style={s.overlineContainer}>
            <View style={s.overlineDot} />
            <Text style={s.overlineText}>IA GENERATIVA</Text>
          </View>
          
          <Text style={s.title}>
            <Text style={s.titleLight}>Preparando </Text>
            <Text style={s.titleBold}>tu plan</Text>
            <Text style={s.titleDot}>.</Text>
          </Text>
          
          <Text style={s.subtitle}>Planeando tu experiencia de entrenamiento exclusiva.</Text>
        </View>

        <View style={s.progressRow}>
          <View style={s.progressBarTrack}>
            <Animated.View style={[s.progressBarFill, progressStyle]} />
          </View>
          <Text style={s.loadingMessage}>{MESSAGES[stepIndex].text}</Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(500)} style={staticStyles.footer}>
        <View style={s.tipCard}>
          <View style={s.tipIconBox}>
            <Ionicons name="bulb" size={18} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.tipHeader}>TIP DEL MOMENTO</Text>
            <Text style={s.tipText}>{currentTip}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  footer: { marginBottom: 60, alignItems: 'center', paddingHorizontal: 32, zIndex: 10 },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, overflow: 'hidden' },

  // Blobs para match visual con NameScreen
  blob1: { position: 'absolute', width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8, borderRadius: SCREEN_WIDTH * 0.4, backgroundColor: c.accentLight, top: -100, right: -100, opacity: 0.4 },
  blob2: { position: 'absolute', width: SCREEN_WIDTH * 0.6, height: SCREEN_WIDTH * 0.6, borderRadius: SCREEN_WIDTH * 0.3, backgroundColor: c.goldLight, bottom: -50, left: -100, opacity: 0.3 },

  overlineContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  overlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginRight: 8 },
  overlineText: { fontSize: 11, fontWeight: '800', color: c.accentDark, letterSpacing: 2 },

  title: { fontSize: 36, letterSpacing: -1 },
  titleLight: { fontWeight: '300', color: c.textSecondary }, 
  titleBold: { fontWeight: '900', color: c.text }, 
  titleDot: { fontWeight: '900', color: c.accent }, 

  iconBox: { width: 110, height: 110, backgroundColor: c.surface, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 40, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.1, shadowRadius: 25, elevation: 6, borderWidth: 1, borderColor: c.surfaceBorder },
  
  subtitle: { fontSize: 15, color: c.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: 12, paddingHorizontal: 40, fontWeight: '500' },

  progressRow: { marginTop: 50, alignItems: 'center', width: '100%' },
  progressBarTrack: { width: SCREEN_WIDTH * 0.7, height: 10, backgroundColor: c.surface, borderRadius: 5, overflow: 'hidden', borderWidth: 1, borderColor: c.surfaceBorder },
  progressBarFill: { height: '100%', backgroundColor: c.accent, borderRadius: 5 },
  
  loadingMessage: { marginTop: 24, fontSize: 13, fontWeight: '800', color: c.accentDark, textTransform: 'uppercase', letterSpacing: 1.5 },
  
  tipCard: { flexDirection: 'row', backgroundColor: c.surface, padding: 20, borderRadius: 28, alignItems: 'center', borderWidth: 1, borderColor: c.surfaceBorder, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10 },
  tipIconBox: { width: 40, height: 40, borderRadius: 14, backgroundColor: c.goldLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  tipHeader: { fontSize: 10, fontWeight: '900', color: c.gold, letterSpacing: 1, marginBottom: 4 },
  tipText: { fontSize: 14, color: c.textSecondary, fontWeight: '600', lineHeight: 20 },
});