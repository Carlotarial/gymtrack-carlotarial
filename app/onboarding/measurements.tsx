import { AppColors, useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

export default function MeasurementsScreen() {
  const router = useRouter();
  const { userName, goal, activity } = useLocalSearchParams();
  const { updateUser } = useUser();
  const { colors } = useTheme();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const isValid = weight.length > 0 && height.length > 0;
  const s = dynamicStyles(colors);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInRight.duration(400)} style={{ flex: 1 }}>
          <View style={staticStyles.stepContainer}>
            { [1, 2, 3, 4].map((step) => (
              <View key={step} style={[s.stepDot, step === 4 && s.stepDotActive, step < 4 && s.stepDotDone]} />
            ))}
          </View>

          <View style={staticStyles.header}>
            {/* Etiqueta superior */}
            <View style={s.overlineContainer}>
              <View style={s.overlineDot} />
              <Text style={s.overlineText}>GYMTRACK ONBOARDING</Text>
            </View>

            {/* Título Editorial Personalizado */}
            <Text style={s.title}>
              <Text style={s.titleLight}>Tus{"\n"}</Text>
              <Text style={s.titleBold}>Medidas</Text>
              <Text style={s.titleDot}>.</Text>
            </Text>
            
            <Text style={s.subtitle}>Esto nos permite calcular tu IMC y ajustar tus objetivos calóricos con la máxima precisión.</Text>
          </View>

          <View style={staticStyles.inputsContainer}>
            <View style={staticStyles.inputGroup}>
              <Text style={s.label}>Peso actual</Text>
              <View style={s.inputWrapper}>
                <TextInput
                  style={s.input}
                  placeholder="00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  maxLength={3}
                  selectionColor={colors.accentDark}
                  cursorColor={colors.accentDark}
                  underlineColorAndroid="transparent"
                />
                <Text style={s.unitText}>kg</Text>
              </View>
            </View>

            <View style={staticStyles.inputGroup}>
              <Text style={s.label}>Altura</Text>
              <View style={s.inputWrapper}>
                <TextInput
                  style={s.input}
                  placeholder="000"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  maxLength={3}
                  selectionColor={colors.accentDark}
                  cursorColor={colors.accentDark}
                  underlineColorAndroid="transparent"
                />
                <Text style={s.unitText}>cm</Text>
              </View>
            </View>
          </View>

          <View style={staticStyles.footer}>
            {/* Botón de Atrás Secundario */}
            <Pressable 
              style={s.backButtonSecondary} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.accentDark} />
            </Pressable>

            <Pressable 
              style={[s.nextButton, !isValid && s.nextButtonDisabled]} 
              disabled={!isValid}
              onPress={async () => {
                await updateUser({ weight, height });
                router.push({
                  pathname: '/onboarding/generating',
                  params: { userName, goal, activity, weight, height }
                } as any);
              }}
            >
              <Text style={s.nextButtonText}>Finalizar test</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const staticStyles = StyleSheet.create({
  stepContainer: { flexDirection: 'row', marginTop: 70, marginBottom: 40, justifyContent: 'flex-start' },
  header: { marginBottom: 40 },
  inputsContainer: { flex: 1 },
  inputGroup: { marginBottom: 28 },
  footer: { paddingBottom: 50, flexDirection: 'row', alignItems: 'center' },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, paddingHorizontal: 32 },
  stepDot: { width: 12, height: 6, borderRadius: 3, backgroundColor: c.surfaceBorder, marginRight: 8 },
  stepDotActive: { width: 32, backgroundColor: c.accent },
  stepDotDone: { backgroundColor: c.gold },
  
  // Estilos del título editorial
  overlineContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  overlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginRight: 8 },
  overlineText: { fontSize: 11, fontWeight: '800', color: c.accentDark, letterSpacing: 2 },
  title: { fontSize: 46, letterSpacing: -1.5, lineHeight: 52 },
  titleLight: { fontWeight: '300', color: c.textSecondary }, 
  titleBold: { fontWeight: '900', color: c.text }, 
  titleDot: { fontWeight: '900', color: c.accent }, 
  subtitle: { fontSize: 16, color: c.textSecondary, marginTop: 18, lineHeight: 24, fontWeight: '500' },
  
  label: { fontSize: 14, fontWeight: '800', color: c.accentDark, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 28, paddingHorizontal: 28, height: 80, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  input: { flex: 1, fontSize: 32, fontWeight: '800', color: c.text, padding: 0, height: '100%', outlineStyle: 'none' } as any,
  unitText: { fontSize: 20, fontWeight: '800', color: c.accent },
  
  nextButton: { flex: 1, flexDirection: 'row', backgroundColor: c.buttonPrimary, padding: 24, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: c.accent, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 24 },
  nextButtonDisabled: { backgroundColor: c.buttonDisabled, shadowOpacity: 0 },
  nextButtonText: { fontSize: 18, fontWeight: '800', color: c.buttonPrimaryText, marginRight: 8 },
  
  backButtonSecondary: { width: 64, height: 64, borderRadius: 32, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: c.surfaceBorder, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
});