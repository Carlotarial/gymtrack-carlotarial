import { AppColors, useTheme } from '@/context/ThemeContext';
import { ALL_EXERCISES } from '@/data/exercises';
import { CATEGORIES, filterWorkouts } from '@/data/workouts';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DiscoverScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Estados de los datos
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Todos');
  const [mode, setMode] = useState<'workouts' | 'library'>('workouts');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');

  // Estados para mostrar/ocultar paneles
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredWorkouts = filterWorkouts(search, activeTag);
  const filteredExercises = ALL_EXERCISES.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'Todos' || e.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();
    return matchesSearch && matchesMuscle;
  });

  const s = dynamicStyles(colors);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* CABECERA */}
      <Animated.View entering={FadeInDown.duration(400)} style={s.header}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <View style={s.overlineContainer}>
              <View style={s.overlineDot} />
              <Text style={s.overlineText}>GYMTRACK DISCOVER</Text>
            </View>
            
            <Text style={s.title}>
              <Text style={s.titleLight}>Modo </Text>
              <Text style={s.titleBold}>Explorar</Text>
              <Text style={s.titleDot}>.</Text>
            </Text>
            
            <Text style={s.subtitle}>Encuentra tu próximo {mode === 'workouts' ? 'nivel' : 'movimiento'}</Text>
          </View>
          
          <View style={[s.modeToggle, { marginTop: 16 }]}>
             <Pressable 
                onPress={() => setMode('workouts')}
                style={[s.modeBtn, mode === 'workouts' && s.modeBtnActive]}
             >
                <Ionicons name="flash" size={18} color={mode === 'workouts' ? colors.buttonPrimaryText : colors.textSecondary} />
             </Pressable>
             <Pressable 
                onPress={() => setMode('library')}
                style={[s.modeBtn, mode === 'library' && s.modeBtnActive]}
             >
                <Ionicons name="book" size={18} color={mode === 'library' ? colors.buttonPrimaryText : colors.textSecondary} />
             </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* BARRA DE HERRAMIENTAS */}
      <Animated.View entering={FadeInDown.delay(50)} style={s.toolbar}>
        <Pressable 
          style={[s.toolbarBtn, (showSearch || search.length > 0) && s.toolbarBtnActive]} 
          onPress={() => setShowSearch(!showSearch)}
        >
          <Ionicons name="search" size={18} color={(showSearch || search.length > 0) ? colors.buttonPrimaryText : colors.text} />
          <Text style={[s.toolbarBtnText, (showSearch || search.length > 0) && s.toolbarBtnTextActive]}>Buscar</Text>
        </Pressable>
        
        <Pressable 
          style={[s.toolbarBtn, (showFilters || activeTag !== 'Todos' || selectedMuscle !== 'Todos') && s.toolbarBtnActive]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options" size={18} color={(showFilters || activeTag !== 'Todos' || selectedMuscle !== 'Todos') ? colors.buttonPrimaryText : colors.text} />
          <Text style={[s.toolbarBtnText, (showFilters || activeTag !== 'Todos' || selectedMuscle !== 'Todos') && s.toolbarBtnTextActive]}>Filtros</Text>
        </Pressable>
      </Animated.View>

      {/* PANEL DE BÚSQUEDA */}
      {showSearch && (
        <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} style={{ marginBottom: 24 }}>
          <View style={s.searchContainer}>
            <Ionicons name="search-outline" size={22} color={colors.textSecondary} />
            <TextInput
              style={s.searchInput}
              placeholder={mode === 'workouts' ? "Buscar rutinas..." : "Buscar ejercicios..."}
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
              selectionColor={colors.accentDark}
              cursorColor={colors.accentDark}
              underlineColorAndroid="transparent"
              autoFocus 
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
        </Animated.View>
      )}

      {/* PANEL DE FILTROS (Rutinas) */}
      {showFilters && mode === 'workouts' && (
        <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} style={{ marginBottom: 32 }}>
          <Text style={s.sectionTitle}>Etiquetas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              ...CATEGORIES.map(c => ({ id: c, type: 'tag', label: c })),
              ...['Abdomen', 'Inferior', 'Express'].map(s => ({ id: s, type: 'search', label: s }))
            ].map((item) => {
              const hasResults = filterWorkouts(item.type === 'search' ? item.id : '', item.type === 'tag' ? item.id : 'Todos').length > 0;
              if (!hasResults && item.id !== 'Todos') return null;

              const isActive = (item.type === 'tag' && activeTag === item.id) || (item.type === 'search' && search === item.id);
              return (
                <Pressable 
                  key={item.id} 
                  style={[s.tag, isActive && s.tagActive]}
                  onPress={() => {
                    if (item.type === 'tag') {
                      setActiveTag(item.id);
                      setSearch('');
                    } else {
                      setSearch(item.id);
                      setActiveTag('Todos');
                    }
                  }}
                >
                  <Text style={[s.tagText, isActive && s.tagTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}

      {/* PANEL DE FILTROS (Biblioteca) */}
      {showFilters && mode === 'library' && (
        <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} style={{ marginBottom: 32 }}>
          <Text style={s.sectionTitle}>Músculo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Todos', 'Piernas', 'Pecho', 'Core', 'Full-body'].map((muscle) => {
              const isActive = selectedMuscle === muscle;
              return (
                <Pressable 
                  key={muscle} 
                  style={[s.tag, isActive && s.tagActive]}
                  onPress={() => setSelectedMuscle(muscle)}
                >
                  <Text style={[s.tagText, isActive && s.tagTextActive]}>
                    {muscle}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}

      {/* CONTENIDO PRINCIPAL */}
      {mode === 'workouts' ? (
        <>
          {/* Destacado del Día (Hero) */}
          {search.length === 0 && activeTag === 'Todos' && (
            <Animated.View entering={FadeInDown.delay(250)} style={staticStyles.section}>
              <Text style={s.sectionTitle}>Destacado del Día</Text>
              <Pressable 
                style={s.heroCard}
                onPress={() => router.push({ pathname: '/routine', params: { id: 'w1', title: 'Abdomen de Acero' } } as any)}
              >
                <View style={s.heroContent}>
                   <View style={s.heroBadge}>
                      <Ionicons name="flame" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={s.heroBadgeText}>RETO DE HOY</Text>
                   </View>
                   <Text style={s.heroTitle}>Abdomen de{"\n"}Acero</Text>
                   <Text style={s.heroSubtitle}>15 min • Alta Intensidad</Text>
                </View>
                <View style={s.heroEmojiBox}>
                   <Ionicons name="trophy" size={48} color="#FFFFFF" />
                </View>
              </Pressable>
            </Animated.View>
          )}

          {/* Lista de Resultados de Rutinas */}
          <Animated.View entering={FadeInDown.delay(300)} style={staticStyles.section}>
            <Text style={s.sectionTitle}>Entrenamientos para ti</Text>
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout, idx) => (
                <Pressable 
                  key={workout.id} 
                  style={s.workoutCard}
                  onPress={() => router.push({ pathname: '/routine', params: { id: workout.id, title: workout.title } } as any)}
                >
                  <View style={staticStyles.workoutInfo}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={s.workoutTitle}>{workout.title}</Text>
                      {idx === 0 && (
                        <View style={s.trendingBadge}>
                          <Ionicons name="flame" size={12} color={colors.accentDark} />
                        </View>
                      )}
                    </View>
                    <Text style={s.workoutDetails}>{workout.duration} • {workout.intensity}</Text>
                  </View>
                  <View style={s.actionIcon}>
                    <Ionicons name="chevron-forward" size={24} color={colors.accentDark} />
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={staticStyles.noResults}>
                <Ionicons name="file-tray-outline" size={48} color={colors.textMuted} style={{ marginBottom: 10 }} />
                <Text style={s.noResultsText}>Sin resultados para "{search}"</Text>
              </View>
            )}
          </Animated.View>
        </>
      ) : (
        /* BIBLIOTECA DE EJERCICIOS */
        <>
          <Animated.View entering={FadeInDown.delay(200)} style={staticStyles.section}>
            <Text style={s.sectionTitle}>Biblioteca Técnica</Text>
            <View style={staticStyles.grid}>
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <Pressable 
                    key={exercise.id}
                    style={staticStyles.gridItem} 
                    onPress={() => setSelectedExercise(exercise)}
                  >
                    <View style={s.imageBox}>
                       <Ionicons name={exercise.icon as any} size={40} color={colors.accent} />
                    </View>
                    <Text style={s.gridTitle}>{exercise.name}</Text>
                    <Text style={s.gridSubtitle}>{exercise.muscleGroup.toUpperCase()}</Text>
                  </Pressable>
                ))
              ) : (
                <View style={[staticStyles.noResults, {width: '100%'}]}>
                   <Ionicons name="barbell-outline" size={48} color={colors.textMuted} style={{ marginBottom: 10 }} />
                   <Text style={s.noResultsText}>No hay ejercicios de {selectedMuscle}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </>
      )}

      {/* Modal de Detalle de Ejercicio */}
      <Modal 
        visible={!!selectedExercise} 
        transparent 
        animationType="fade"
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {selectedExercise && (
              <>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>{selectedExercise.name}</Text>
                  <Pressable onPress={() => setSelectedExercise(null)} style={s.modalClose}>
                    <Ionicons name="close" size={24} color={colors.text} />
                  </Pressable>
                </View>
                
                <View style={s.modalGifSource}>
                   <Image 
                      source={selectedExercise.gifSource} 
                      style={{width: '100%', height: '100%'}} 
                      contentFit="contain"
                   />
                </View>

                <View style={s.modalInfo}>
                   <View style={s.infoBadge}>
                      <Text style={s.infoBadgeText}>{selectedExercise.muscleGroup.toUpperCase()}</Text>
                   </View>
                   <Text style={s.infoDescription}>
                      {selectedExercise.description}
                   </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const staticStyles = StyleSheet.create({
  section: { marginBottom: 40 },
  workoutInfo: { flex: 1 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  gridItem: { width: '47%', alignItems: 'center', marginBottom: 24 },
  noResults: { alignItems: 'center', marginTop: 40, opacity: 0.7 },
});

const dynamicStyles = (c: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background, paddingHorizontal: 24 },
  
  header: { marginTop: 50, marginBottom: 20 },
  overlineContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  overlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginRight: 8 },
  overlineText: { fontSize: 11, fontWeight: '800', color: c.accentDark, letterSpacing: 2 },
  title: { fontSize: 38, letterSpacing: -1 }, 
  titleLight: { fontWeight: '300', color: c.textSecondary }, 
  titleBold: { fontWeight: '900', color: c.text }, 
  titleDot: { fontWeight: '900', color: c.accent }, 
  subtitle: { fontSize: 15, color: c.textSecondary, marginTop: 8, fontWeight: '500', lineHeight: 22 },
  
  toolbar: { flexDirection: 'row', marginBottom: 30, gap: 12 },
  toolbarBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, borderWidth: 1, borderColor: c.surfaceBorder },
  toolbarBtnActive: { backgroundColor: c.buttonPrimary, borderColor: c.buttonPrimary },
  toolbarBtnText: { marginLeft: 6, fontSize: 14, fontWeight: '700', color: c.text },
  toolbarBtnTextActive: { color: c.buttonPrimaryText },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 24, paddingHorizontal: 20, height: 56, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4, borderWidth: 1, borderColor: c.surfaceBorder },
  searchInput: { flex: 1, fontSize: 16, color: c.text, marginLeft: 12, fontWeight: '600' },
  
  tag: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, marginRight: 10, backgroundColor: c.surface, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, borderWidth: 1, borderColor: c.surfaceBorder },
  tagActive: { backgroundColor: c.buttonPrimary, borderColor: c.buttonPrimary },
  tagText: { color: c.textSecondary, fontWeight: '700', fontSize: 14 },
  tagTextActive: { color: c.buttonPrimaryText },
  
  sectionTitle: { fontSize: 20, fontWeight: '700', color: c.text, marginBottom: 16, letterSpacing: -0.5 },

  heroCard: { backgroundColor: c.accent, borderRadius: 36, padding: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: c.accentDark, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 32, elevation: 6 },
  heroContent: { flex: 1 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  heroBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', lineHeight: 32 },
  heroSubtitle: { fontSize: 14, color: '#FFFFFF', marginTop: 8, opacity: 0.9, fontWeight: '600' },
  heroEmojiBox: { width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },

  workoutCard: { flexDirection: 'row', backgroundColor: c.surface, borderRadius: 32, padding: 28, alignItems: 'center', marginBottom: 16, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 30, elevation: 4 },
  workoutTitle: { fontSize: 18, fontWeight: '800', color: c.text, marginRight: 8 },
  trendingBadge: { backgroundColor: c.accentLight, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  workoutDetails: { fontSize: 14, color: c.textSecondary, fontWeight: '600', marginTop: 2 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center' },
  
  imageBox: { width: '100%', height: 150, backgroundColor: c.surface, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: c.accentDark, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 30, elevation: 4, borderWidth: 1, borderColor: c.surfaceBorder },
  gridTitle: { fontSize: 16, fontWeight: '700', color: c.text, textAlign: 'center' },
  gridSubtitle: { fontSize: 10, fontWeight: '800', color: c.accent, marginTop: 4, letterSpacing: 1 },
  noResultsText: { marginTop: 8, color: c.textSecondary, fontSize: 16, fontWeight: '600' },

  modeToggle: { flexDirection: 'row', backgroundColor: c.surface, padding: 4, borderRadius: 20, borderWidth: 1, borderColor: c.surfaceBorder },
  modeBtn: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  modeBtnActive: { backgroundColor: c.buttonPrimary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: c.background, borderRadius: 40, width: '100%', padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: c.text, letterSpacing: -1 },
  modalClose: { width: 40, height: 40, borderRadius: 20, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center' },
  modalGifSource: { width: '100%', height: 240, backgroundColor: c.surface, borderRadius: 32, marginBottom: 24, overflow: 'hidden' },
  modalInfo: { backgroundColor: c.surface, padding: 24, borderRadius: 32 },
  infoBadge: { backgroundColor: c.accentLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  infoBadgeText: { fontSize: 10, fontWeight: '800', color: c.accentDark, letterSpacing: 1 },
  infoDescription: { fontSize: 15, color: c.textSecondary, lineHeight: 22, fontWeight: '500' },
});