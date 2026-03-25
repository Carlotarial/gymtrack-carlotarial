import { useTheme, AppColors } from '@/context/ThemeContext';
import { ALL_EXERCISES } from '@/data/exercises';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function MovementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const exercise = ALL_EXERCISES.find(e => e.id === id) || ALL_EXERCISES[0];
  const s = dynamicStyles(colors);

  return (
    <View style={s.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={s.header}>
        <Pressable onPress={() => router.back()} style={staticStyles.closeButton}>
          <Ionicons name="close-outline" size={32} color={colors.text} />
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500)}>
        <Text style={s.title}>{exercise.name}</Text>
        <Text style={s.subtitle}>Músculo principal: {exercise.muscleGroup.toUpperCase()}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).springify()} style={staticStyles.gifWrapper}>
        <View style={s.gifContainer}>
          <Image
            style={staticStyles.gifImage}
            source={exercise.gifSource}
            contentFit="contain"
            transition={300}
          />
        </View>
      </Animated.View>

      <View style={staticStyles.footer}>
         <Pressable style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backButtonText}>Entendido</Text>
        </Pressable>
      </View>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  closeButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  gifWrapper: { paddingHorizontal: 24, marginTop: 50 },
  gifImage: { width: '90%', height: '90%' },
  footer: { paddingHorizontal: 24, marginTop: 'auto', marginBottom: 40 },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  header: { marginTop: 60, paddingHorizontal: 24, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '700', color: c.text, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: c.textSecondary, textAlign: 'center', marginTop: 8, letterSpacing: 1.2, fontWeight: '600' },
  gifContainer: { backgroundColor: c.surface, height: 340, borderRadius: 36, overflow: 'hidden', borderWidth: 1, borderColor: c.surfaceBorder, justifyContent: 'center', alignItems: 'center' },
  backButton: { backgroundColor: c.buttonPrimary, padding: 22, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 17, fontWeight: '700', color: c.buttonPrimaryText },
});
