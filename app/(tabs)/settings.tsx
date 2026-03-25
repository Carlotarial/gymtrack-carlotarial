import { AppColors, useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInDown, ZoomIn } from 'react-native-reanimated';

const AVATARS = [
  { id: 'golden', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'husky', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'pug', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'corgi', url: 'https://i.pinimg.com/736x/2a/66/50/2a66500160effee5281510632f44f0d4.jpg' },
  { id: 'beagle', url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'frenchie', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'dalmatian', url: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'shiba', url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'labrador', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'border', url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=250&h=250&fit=crop&fm=jpg&q=80' },
  { id: 'schnauzer', url: 'https://i.pinimg.com/564x/67/1c/85/671c85f3129e46c6deffb6cc6b6abe99.jpg' },
  { id: 'poodle', url: 'https://i.pinimg.com/736x/ed/f1/20/edf120eade64c26bf371356174463cfd.jpg' },
];

const GOALS = [
  { id: 'perder_peso', label: 'Perder peso' },
  { id: 'ganar_musculo', label: 'Ganar músculo' },
  { id: 'tonificar', label: 'Tonificar' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentario', label: 'Sedentario' },
  { id: 'moderado', label: 'Moderado' },
  { id: 'activo', label: 'Muy Activo' },
];

const FAQ_DATA = [
  { q: '¿Cómo cambio mi peso o altura?', a: 'Dentro de tu perfil, despliega "Ajustes de Entrenamiento" y pulsa el botón de "Editar" en la esquina superior derecha.', icon: 'body-outline' },
  { q: '¿Cómo funcionan las rachas?', a: 'Tu racha aumenta cada día que completas al menos un entrenamiento. ¡No pierdas el ritmo!', icon: 'flash-outline' },
  { q: '¿Puedo usar la app sin conexión?', a: 'GymTrack requiere conexión para sincronizar tu perfil, pero las rutinas cargadas pueden visualizarse temporalmente.', icon: 'wifi-outline' },
  { q: '¿Quién ha desarrollado la app?', a: 'Esta aplicación es un proyecto exclusivo desarrollado para el TFC.', icon: 'code-slash-outline' },
];

const isWeb = Platform.OS === 'web';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser, logout, deleteProfile } = useUser();
  const { colors, mode, setMode } = useTheme();
  const { isEnabled: notificationsEnabled, toggleNotifications } = useNotifications();

  const [showStats, setShowStats] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempWeight, setTempWeight] = useState(user.weight || '');
  const [tempHeight, setTempHeight] = useState(user.height || '');

  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingDone, setRatingDone] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const userName = user.name || 'Usuario';
  const { userInitial, userEmail } = useMemo(() => {
    const initial = userName.charAt(0).toUpperCase();
    const email = `${userName.toLowerCase().replace(/\s+/g, '')}@gymtrack.com`;
    return { userInitial: initial, userEmail: email };
  }, [userName]);

  const handleLogout = async () => { await logout(); router.replace('/onboarding' as any); };
  const handleDeleteProfile = async () => { await deleteProfile(user.name); setShowDeleteConfirm(false); router.replace('/onboarding' as any); };
  
  const handleThemeToggle = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
    setMode(nextMode);
  };

  const getThemeLabel = () => {
    if (mode === 'system') return 'Sistema';
    return mode === 'dark' ? 'Oscuro' : 'Claro';
  };

  const getThemeIcon = () => {
    if (mode === 'system') return 'settings-outline';
    return mode === 'dark' ? 'moon-outline' : 'sunny-outline';
  };

  const handleSaveStats = async () => {
    await updateUser({ weight: tempWeight, height: tempHeight });
    setIsEditing(false);
  };

  const s = dynamicStyles(colors);

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView style={s.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        <View style={s.header}>
          <View style={s.overlineContainer}>
            <View style={s.overlineDot} />
            <Text style={s.overlineText}>GYMTRACK SETTINGS</Text>
          </View>
          <Text style={s.title}>
            <Text style={s.titleLight}>Tu </Text>
            <Text style={s.titleBold}>Perfil</Text>
            <Text style={s.titleDot}>.</Text>
          </Text>
          <Text style={s.subtitle}>Gestiona tus preferencias y datos físicos</Text>
        </View>

        {/* Tarjeta de Perfil Corregida (Sin recorte en el badge) */}
        <View style={s.profileCard}>
          <TouchableOpacity 
            style={s.avatarContainer} 
            activeOpacity={0.8} 
            onPress={() => setShowAvatarModal(true)}
          >
            <View style={s.avatarImageWrapper}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={s.avatarImage} contentFit="cover" transition={200} />
              ) : (
                <Text style={s.avatarText}>{userInitial}</Text>
              )}
            </View>
            <View style={s.avatarEditBadge}>
              <Ionicons name="camera" size={12} color={colors.accent} />
            </View>
          </TouchableOpacity>

          <View style={staticStyles.profileInfo}>
            <Text style={s.profileName}>{userName}</Text>
            <Text style={s.profileEmail}>{userEmail}</Text>
            <View style={s.streakMiniBadge}>
               <Ionicons name="flash" size={12} color="#FFF" />
               <Text style={s.streakMiniText}>{user.streak} días de racha</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN: PREFERENCIAS */}
        <View style={staticStyles.section}>
          <Text style={s.sectionTitle}>Preferencias</Text>
          <TouchableOpacity style={s.settingItem} onPress={handleThemeToggle}>
            <View style={staticStyles.settingLabelGroup}>
              <View style={[s.iconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name={getThemeIcon()} size={22} color={colors.accentDark} />
              </View>
              <Text style={s.settingText}>Modo Visual</Text>
            </View>
            <View style={s.themeBadge}><Text style={s.themeBadgeText}>{getThemeLabel()}</Text></View>
          </TouchableOpacity>

          <View style={s.settingItem}>
            <View style={staticStyles.settingLabelGroup}>
              <View style={[s.iconBox, { backgroundColor: colors.goldLight }]}>
                <Ionicons name="notifications-outline" size={22} color={colors.gold} />
              </View>
              <Text style={s.settingText}>Notificaciones</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={(val) => { toggleNotifications(val); }} 
              trackColor={{ false: colors.barInactive, true: colors.accent }} 
              thumbColor="#FFF" 
            />
          </View>

          <TouchableOpacity style={s.settingItem} onPress={() => setShowStats(!showStats)}>
            <View style={staticStyles.settingLabelGroup}>
              <View style={[s.iconBox, { backgroundColor: colors.surfaceBorder }]}>
                 <Ionicons name="body-outline" size={22} color={colors.textSecondary} />
              </View>
              <Text style={s.settingText}>Ajustes de Entrenamiento</Text>
            </View>
            <Ionicons name={showStats ? "chevron-down" : "chevron-forward"} size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {showStats && (
            <Animated.View entering={FadeInDown} style={s.statsContainer}>
              <View style={staticStyles.statsHeader}>
                <Text style={s.statsTitle}>Métricas e IA</Text>
                <TouchableOpacity onPress={() => isEditing ? handleSaveStats() : setIsEditing(true)} style={s.editBadge}>
                  <Text style={s.editBadgeText}>{isEditing ? 'Guardar' : 'Editar'}</Text>
                </TouchableOpacity>
              </View>
              <View style={staticStyles.statsRow}>
                <View style={s.statBox}>
                  <Text style={s.statLabel}>Peso</Text>
                  {isEditing ? (
                    <TextInput 
                      style={s.statInput} 
                      value={tempWeight} 
                      onChangeText={setTempWeight} 
                      keyboardType="numeric" 
                      maxLength={3}
                      placeholderTextColor={colors.textMuted}
                    />
                  ) : <Text style={s.statValue}>{user.weight}kg</Text>}
                </View>
                <View style={s.statBox}>
                  <Text style={s.statLabel}>Altura</Text>
                  {isEditing ? (
                    <TextInput 
                      style={s.statInput} 
                      value={tempHeight} 
                      onChangeText={setTempHeight} 
                      keyboardType="numeric" 
                      maxLength={3}
                      placeholderTextColor={colors.textMuted}
                    />
                  ) : <Text style={s.statValue}>{user.height}cm</Text>}
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={s.statLabel}>Cambiar Objetivo</Text>
                <View style={s.selectorRow}>
                  {GOALS.map((g) => (
                    <TouchableOpacity key={g.id} onPress={() => updateUser({ goal: g.id })} style={[s.selectorItem, user.goal === g.id && s.selectorItemActive]}>
                      <Text style={[s.selectorText, user.goal === g.id && s.selectorTextActive]}>{g.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.statLabel, { marginTop: 20 }]}>Nivel de actividad</Text>
                <View style={s.selectorRow}>
                  {ACTIVITY_LEVELS.map((a) => (
                    <TouchableOpacity key={a.id} onPress={() => updateUser({ activityLevel: a.id })} style={[s.selectorItem, user.activityLevel === a.id && s.selectorItemActive]}>
                      <Text style={[s.selectorText, user.activityLevel === a.id && s.selectorTextActive]}>{a.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}
        </View>

        {/* SECCIÓN: GENERAL */}
        <View style={staticStyles.section}>
          <Text style={s.sectionTitle}>General</Text>
          <TouchableOpacity style={s.settingItem} onPress={() => setShowRating(true)}>
            <View style={staticStyles.settingLabelGroup}>
              <View style={[s.iconBox, { backgroundColor: colors.surfaceBorder }]}><Ionicons name="star-outline" size={22} color={colors.textSecondary} /></View>
              <Text style={s.settingText}>Valorar la App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.settingItem} onPress={() => setShowSupport(true)}>
            <View style={staticStyles.settingLabelGroup}>
              <View style={[s.iconBox, { backgroundColor: colors.surfaceBorder }]}><Ionicons name="help-circle-outline" size={24} color={colors.textSecondary} /></View>
              <Text style={s.settingText}>Ayuda y Soporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ACCIONES FINALES */}
        <View style={s.footerActions}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.gold} />
            <Text style={s.logoutBtnText}>Cerrar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.deleteBtn} onPress={() => setShowDeleteConfirm(true)}>
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
            <Text style={s.deleteBtnText}>Eliminar Cuenta Permanente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL VALORACIÓN */}
      <Modal visible={showRating} transparent animationType="fade">
        <View style={staticStyles.modalOverlay}>
          <Animated.View entering={ZoomIn} style={s.modalContent}>
            <View style={[s.iconBox, { backgroundColor: colors.accentLight, width: 64, height: 64, borderRadius: 32, marginBottom: 20 }]}><Ionicons name="heart" size={32} color={colors.accent} /></View>
            <Text style={s.modalTitle}>{ratingDone ? '¡Gracias!' : 'Valorar GymTrack'}</Text>
            <Text style={s.modalSubtitle}>{ratingDone ? 'Tu opinión nos ayuda a mejorar cada día.' : '¿Qué te ha parecido nuestra APP?'}</Text>
            {!ratingDone && (
              <View style={staticStyles.starsRow}>
                {[1, 2, 3, 4, 5].map((st) => (
                  <TouchableOpacity key={st} onPress={() => setRating(st)}><Ionicons name={rating >= st ? "star" : "star-outline"} size={40} color={colors.accent} style={{ marginHorizontal: 4 }} /></TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity style={s.modalButton} onPress={() => { if (ratingDone) { setShowRating(false); setRatingDone(false); } else if (rating > 0) setRatingDone(true); }}>
              <Text style={s.modalButtonText}>{ratingDone ? 'Cerrar' : 'Enviar'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL SOPORTE */}
      <Modal visible={showSupport} transparent animationType="fade">
        <View style={staticStyles.modalOverlay}>
          <Animated.View entering={ZoomIn} style={s.modalContentWide}>
            <View style={staticStyles.modalHeader}>
                <View>
                    <Text style={s.modalTitleSmall}>Centro de Ayuda</Text>
                    <Text style={s.modalSubtitleSmall}>Preguntas frecuentes</Text>
                </View>
                <TouchableOpacity onPress={() => setShowSupport(false)} style={s.closeIcon}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              {FAQ_DATA.map((item, i) => (
                <TouchableOpacity key={i} style={s.faqItem} onPress={() => setExpandedFaq(expandedFaq === i ? null : i)} activeOpacity={0.7}>
                  <View style={staticStyles.faqHeaderRow}>
                    <View style={s.faqIconContainer}>
                        <Ionicons name={item.icon as any} size={18} color={colors.accent} />
                    </View>
                    <Text style={s.faqQuestion}>{item.q}</Text>
                    <Ionicons name={expandedFaq === i ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
                  </View>
                  {expandedFaq === i && <Animated.Text entering={FadeInDown} style={s.faqAnswer}>{item.a}</Animated.Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL CONFIRMACIÓN ELIMINACIÓN */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={staticStyles.modalOverlay}>
          <Animated.View entering={ZoomIn} style={s.modalContent}>
            <View style={s.warningIcon}><Ionicons name="warning" size={32} color="#FF6B6B" /></View>
            <Text style={s.modalTitle}>¿Seguro?</Text>
            <Text style={s.modalSubtitle}>Esta acción borrará todas tus rachas e historial de forma permanente.</Text>
            <TouchableOpacity style={s.confirmDeleteBtn} onPress={handleDeleteProfile}>
                <Text style={s.confirmDeleteText}>Borrar definitivamente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={s.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL AVATAR */}
      <Modal visible={showAvatarModal} transparent animationType="fade">
        <View style={staticStyles.modalOverlay}>
          <Animated.View entering={SlideInDown} style={s.avatarModalContent}>
            <View style={staticStyles.modalHeader}><Text style={s.modalTitle}>Elige tu Avatar</Text><TouchableOpacity onPress={() => setShowAvatarModal(false)}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity></View>
            <View style={s.avatarGrid}>
              {AVATARS.map((av) => (
                <TouchableOpacity key={av.id} style={s.avatarItem} onPress={async () => { await updateUser({ avatar: av.url }); setShowAvatarModal(false); }}>
                  <Image source={{ uri: av.url }} style={s.gridAvatarImage} contentFit="cover" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const staticStyles = StyleSheet.create({
  profileInfo: { flex: 1 },
  section: { marginBottom: 32 },
  settingLabelGroup: { flexDirection: 'row', alignItems: 'center' },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  faqHeaderRow: { flexDirection: 'row', alignItems: 'center' },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: c.background },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 50, marginBottom: 35 },
  overlineContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  overlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginRight: 8 },
  overlineText: { fontSize: 11, fontWeight: '800', color: c.accentDark, letterSpacing: 2 },
  title: { fontSize: 40, letterSpacing: -1 },
  titleLight: { fontWeight: '300', color: c.textSecondary }, 
  titleBold: { fontWeight: '900', color: c.text }, 
  titleDot: { fontWeight: '900', color: c.accent }, 
  subtitle: { fontSize: 15, color: c.textSecondary, marginTop: 8, fontWeight: '500' },

  profileCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: c.accent, 
    padding: 24, 
    borderRadius: 36, 
    marginBottom: 40,
    shadowColor: c.accentDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30
  },
  
  // 🌟 CONTENEDOR AVATAR FIX (Para que el badge no se corte)
  avatarContainer: { position: 'relative', marginRight: 20, width: 74, height: 74 },
  avatarImageWrapper: { width: 74, height: 74, borderRadius: 37, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontSize: 32, fontWeight: '800', color: c.accentDark },
  avatarEditBadge: { 
    position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFF', 
    justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4, zIndex: 20 
  },

  profileName: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  profileEmail: { fontSize: 14, color: '#FFF', opacity: 0.8 },
  streakMiniBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakMiniText: { color: '#FFF', fontSize: 11, fontWeight: '700', marginLeft: 4 },

  sectionTitle: { fontSize: 13, fontWeight: '800', color: c.textSecondary, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1.5 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.surface, padding: 20, borderRadius: 28, marginBottom: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingText: { fontSize: 17, color: c.text, fontWeight: '600' },
  themeBadge: { backgroundColor: c.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  themeBadgeText: { fontSize: 12, fontWeight: '700', color: c.accentDark },

  statsContainer: { backgroundColor: c.surface, padding: 24, borderRadius: 32, marginTop: -8, marginBottom: 20 },
  statsTitle: { fontSize: 16, fontWeight: '800', color: c.text },
  editBadge: { backgroundColor: c.accentLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  editBadgeText: { fontSize: 12, fontWeight: '800', color: c.accent },
  statBox: { backgroundColor: c.background, flex: 0.48, padding: 16, borderRadius: 20, alignItems: 'center' },
  statLabel: { fontSize: 10, color: c.textSecondary, fontWeight: '800', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  statValue: { fontSize: 20, fontWeight: '800', color: c.text },
  statInput: { 
    fontSize: 20, fontWeight: '800', color: c.accent, minWidth: 60, textAlign: 'center',
    ...Platform.select({ web: { outlineStyle: 'none' } as any })
  },

  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  selectorItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: c.background, borderWidth: 1, borderColor: c.surfaceBorder },
  selectorItemActive: { backgroundColor: c.accent, borderColor: c.accent },
  selectorText: { fontSize: 12, fontWeight: '700', color: c.textSecondary },
  selectorTextActive: { color: '#FFF' },

  footerActions: { gap: 4, marginTop: 10 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 22, borderRadius: 28, backgroundColor: c.goldLight },
  logoutBtnText: { marginLeft: 10, fontSize: 17, fontWeight: '800', color: c.gold },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 },
  deleteBtnText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#FF6B6B', opacity: 0.8 },

  modalContent: { backgroundColor: c.surface, width: '100%', borderRadius: 40, padding: 32, alignItems: 'center' },
  modalContentWide: { backgroundColor: c.surface, width: '92%', borderRadius: 40, padding: 28 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: c.text, marginBottom: 12, textAlign: 'center' },
  modalTitleSmall: { fontSize: 20, fontWeight: '900', color: c.text },
  modalSubtitle: { fontSize: 16, color: c.textSecondary, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  modalSubtitleSmall: { fontSize: 14, color: c.textSecondary, fontWeight: '500' },
  modalButton: { backgroundColor: c.accent, width: '100%', padding: 20, borderRadius: 24, alignItems: 'center' },
  modalButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  warningIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFEEED', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  confirmDeleteBtn: { backgroundColor: '#FF6B6B', padding: 18, borderRadius: 22, width: '100%', alignItems: 'center' },
  confirmDeleteText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  cancelBtn: { padding: 16, width: '100%', alignItems: 'center' },
  cancelBtnText: { color: c.textSecondary, fontWeight: '700' },
  
  avatarModalContent: { backgroundColor: c.background, width: '100%', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, position: 'absolute', bottom: 0, minHeight: 450 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  avatarItem: { width: '31%', aspectRatio: 1, borderRadius: 20, marginBottom: 12, overflow: 'hidden' },
  gridAvatarImage: { width: '100%', height: '100%' },
  
  faqItem: { backgroundColor: c.background, padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: c.surfaceBorder },
  faqIconContainer: { width: 32, height: 32, borderRadius: 10, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  faqQuestion: { fontSize: 15, fontWeight: '700', color: c.text, flex: 1 },
  faqAnswer: { fontSize: 14, color: c.textSecondary, marginTop: 12, lineHeight: 20, borderTopWidth: 1, borderTopColor: c.surfaceBorder, paddingTop: 12 },
  closeIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center' },
});