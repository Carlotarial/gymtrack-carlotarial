import { AppColors, useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function NameScreen() {
  const router = useRouter();
  const { updateUser, allUsers, switchUser, logout, isLoading, user } = useUser();
  const { colors, setMode } = useTheme();
  const [name, setName] = useState('');
  const [showProfiles, setShowProfiles] = useState(false);

  useEffect(() => {
    if (user.name !== '') {
      logout();
    }
  }, []);

  const trimmedName = name.trim();
  const isNameTaken = allUsers.some(
    (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
  );
  const isNameTooShort = trimmedName.length < 2;
  const canContinue = !isNameTaken && !isNameTooShort;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const handleContinue = async () => {
    if (!canContinue) return;
    
    await updateUser({ name: trimmedName });
    router.push({
      pathname: '/onboarding/objective',
      params: { userName: trimmedName }
    } as any);
  };

  const handleSelectProfile = async (profileName: string) => {
    const userToLoad = allUsers?.find(u => u.name === profileName);
    await switchUser(profileName);
    
    if (userToLoad?.theme) {
      setMode(userToLoad.theme);
    } else {
      setMode('system');
    }

    setShowProfiles(false);
    router.replace('/(tabs)' as any);
  };

  const s = dynamicStyles(colors);
  const hasProfiles = (allUsers?.length ?? 0) > 0;

  return (
    <View style={s.container}>
      <Animated.View entering={FadeIn.delay(200).duration(1500)} style={s.blob1} />
      <Animated.View entering={FadeIn.delay(400).duration(1500)} style={s.blob2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          bounces={false} 
          showsVerticalScrollIndicator={false}
        >
          <View style={s.mainWrapper}>
            <View style={s.stepContainer}>
              <View style={[s.stepDot, s.stepDotActive]} />
              <View style={s.stepDot} />
              <View style={s.stepDot} />
              <View style={s.stepDot} />
              <View style={s.stepDot} />
            </View>

            <View style={staticStyles.content}>
              <Animated.View entering={FadeInUp.duration(800).delay(100)}>
                <View style={s.logoWrapper}>
                  <View style={s.logoInner}>
                    <Image 
                      source={require('../../assets/images/logo.png')} 
                      style={s.logoImage} 
                      contentFit="contain" 
                      transition={1000}
                    />
                  </View>
                  <View style={s.logoShadow} />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(800).delay(300)}>
                <View style={s.welcomeBadge}>
                  <Ionicons name="sparkles" size={14} color={colors.accentDark} style={{ marginRight: 6 }} />
                  <Text style={s.badgeText}>Tu viaje comienza aquí</Text>
                </View>
                
                <Text style={s.title}>
                  <Text style={s.titleLight}>Perfil de{"\n"}</Text>
                  <Text style={s.titleBold}>Atleta</Text>
                  <Text style={s.titleDot}>.</Text>
                </Text>

                <Text style={s.subtitle}>
                  Personalizaremos cada gramo y cada repetición para que alcances tu mejor versión.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(800).delay(500)} style={staticStyles.inputContainer}>
                <View style={[s.inputWrapper, isNameTaken && { borderColor: '#FF6B6B', borderWidth: 1.5 }]}>
                  <Ionicons 
                    name={isNameTaken ? "alert-circle" : "person-outline"} 
                    size={22} 
                    color={isNameTaken ? "#FF6B6B" : colors.accent} 
                    style={{ marginLeft: 20 }} 
                  />
                  <TextInput
                    style={s.input}
                    placeholder="Escribe tu nombre..."
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    selectionColor={colors.accentDark}
                  />
                </View>

                {isNameTaken && (
                  <Animated.Text entering={FadeInUp} style={s.errorText}>
                    Ese nombre ya tiene un perfil activo.
                  </Animated.Text>
                )}

                {hasProfiles && (
                  <Pressable style={s.loginButton} onPress={() => setShowProfiles(true)}>
                    <Text style={s.loginButtonText}>Ingresar con perfil existente</Text>
                    <Ionicons name="people-outline" size={18} color={colors.accentDark} />
                  </Pressable>
                )}
              </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.duration(800).delay(700)} style={staticStyles.footer}>
              <Pressable
                style={[s.nextButton, !canContinue && s.nextButtonDisabled]}
                disabled={!canContinue}
                onPress={handleContinue}
              >
                <Text style={s.nextButtonText}>
                  {isNameTaken ? "Nombre no disponible" : "Comenzar ahora"}
                </Text>
                <Ionicons 
                  name={isNameTaken ? "close-circle" : "chevron-forward"} 
                  size={20} 
                  color={colors.buttonPrimaryText} 
                />
              </Pressable>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showProfiles}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfiles(false)}
      >
        <View style={s.modalOverlay}>
          <Pressable style={s.modalDismiss} onPress={() => setShowProfiles(false)} />
          <Animated.View entering={isWeb ? undefined : SlideInDown} style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Seleccionar Perfil</Text>
              <Pressable style={s.closeIcon} onPress={() => setShowProfiles(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={s.profileList}>
              {allUsers?.map((profile) => (
                <Pressable 
                  key={profile.name} 
                  style={s.profileCard}
                  onPress={() => handleSelectProfile(profile.name)}
                >
                  <View style={s.profileAvatar}>
                    {profile.avatar ? (
                      <Image
                        source={{ uri: profile.avatar }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <Ionicons name="person" size={28} color={colors.accentDark} />
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={s.profileName}>{profile.name}</Text>
                    <Text style={s.profileMeta}>{profile.goal?.replace('_', ' ') || 'Perfil nuevo'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  content: { flex: 1, paddingTop: 20 },
  inputContainer: { marginTop: 48 },
  footer: { paddingBottom: 60, marginTop: 40 }, 
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, overflow: 'hidden' },
  mainWrapper: { flex: 1, paddingHorizontal: 32 }, 
  
  blob1: { position: 'absolute', width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8, borderRadius: SCREEN_WIDTH * 0.4, backgroundColor: c.accentLight, top: -100, right: -100, opacity: 0.6 },
  blob2: { position: 'absolute', width: SCREEN_WIDTH * 0.6, height: SCREEN_WIDTH * 0.6, borderRadius: SCREEN_WIDTH * 0.3, backgroundColor: c.goldLight, bottom: 20, left: -100, opacity: 0.4 },

  stepContainer: { flexDirection: 'row', marginTop: 70, marginBottom: 40, justifyContent: 'flex-start' },
  stepDot: { width: 12, height: 6, borderRadius: 3, backgroundColor: c.surfaceBorder, marginRight: 8 },
  stepDotActive: { width: 32, backgroundColor: c.accent },

  logoWrapper: { width: 100, height: 100, marginBottom: 40, position: 'relative' },
  logoInner: { width: '100%', height: '100%', backgroundColor: c.surface, borderRadius: 32, justifyContent: 'center', alignItems: 'center', zIndex: 2, borderWidth: 1, borderColor: c.surfaceBorder, overflow: 'hidden' },
  logoImage: { width: '80%', height: '80%' },
  logoShadow: { position: 'absolute', width: '90%', height: '90%', backgroundColor: c.accent, bottom: -8, right: -8, borderRadius: 32, opacity: 0.15, zIndex: 1 },

  welcomeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.accentLight, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, alignSelf: 'flex-start', marginBottom: 24, borderWidth: 1, borderColor: c.accent },
  badgeText: { fontSize: 13, fontWeight: '800', color: c.accentDark, textTransform: 'uppercase', letterSpacing: 1 },

  title: { fontSize: 46, letterSpacing: -1.5, lineHeight: 52 },
  titleLight: { fontWeight: '300', color: c.textSecondary }, 
  titleBold: { fontWeight: '900', color: c.text }, 
  titleDot: { fontWeight: '900', color: c.accent }, 

  subtitle: { fontSize: 18, color: c.textSecondary, marginTop: 18, lineHeight: 28, fontWeight: '500', opacity: 0.9 },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 28, height: 84, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 3, borderWidth: 1, borderColor: c.surfaceBorder },
  input: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 18, fontWeight: '700', color: c.text, outlineStyle: 'none' } as any,

  errorText: { color: '#FF6B6B', fontSize: 13, fontWeight: '700', marginTop: 8, marginLeft: 12 },

  loginButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingVertical: 12 },
  loginButtonText: { fontSize: 15, fontWeight: '700', color: c.accentDark, marginRight: 8, textDecorationLine: 'underline' },

  nextButton: { flexDirection: 'row', backgroundColor: c.buttonPrimary, padding: 24, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: c.accent, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 5 },
  nextButtonDisabled: { backgroundColor: c.buttonDisabled, shadowOpacity: 0 },
  nextButtonText: { fontSize: 18, fontWeight: '800', color: c.buttonPrimaryText, marginRight: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalDismiss: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: { backgroundColor: c.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, minHeight: 400, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: c.text },
  closeIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center' },
  
  profileList: { flex: 1 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: c.surface, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: c.surfaceBorder },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 16, overflow: 'hidden' },
  profileName: { fontSize: 18, fontWeight: '700', color: c.text },
  profileMeta: { fontSize: 14, color: c.textSecondary, marginTop: 2 },
});