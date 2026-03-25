import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Estructura de cada sesión completada
export interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  durationSecs: number;
  kcal: number;
}

export interface UserData {
  name: string;
  weight: string;
  height: string;
  goal: string;
  activityLevel: string;
  kcalBurned: number;
  sessionsCompleted: number;
  streak: number;
  waterIntake: number;
  workoutHistory: WorkoutSession[];
  avatar?: string;
}

export type AppState =
  | { status: 'loading' }
  | { status: 'ready'; user: UserData; allUsers: UserData[] }
  | { status: 'error'; error: Error };

interface UserContextType {
  user: UserData;
  allUsers: UserData[];
  status: AppState['status'];
  error?: Error;
  updateUser: (newData: Partial<UserData>) => Promise<void>;
  completeWorkout: (title: string, durationSecs: number, kcal: number) => Promise<void>;
  updateWater: (liters: number) => Promise<void>;
  switchUser: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteProfile: (name: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  isOnboarded: boolean;
  isLoading: boolean;
}

const DEFAULT_USER: UserData = {
  name: '',
  weight: '',
  height: '',
  goal: '',
  activityLevel: '',
  kcalBurned: 0,
  sessionsCompleted: 0,
  streak: 0,
  waterIntake: 0,
  workoutHistory: [],
  avatar: '',
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [appState, setAppState] = useState<AppState>({ status: 'loading' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedActive = await AsyncStorage.getItem('@user_data');
        const savedProfiles = await AsyncStorage.getItem('@all_profiles');
        
        let activeUser = DEFAULT_USER;
        let allUsers: UserData[] = [];

        if (savedProfiles) {
          allUsers = JSON.parse(savedProfiles);
        }

        if (savedActive) {
          activeUser = { ...DEFAULT_USER, ...JSON.parse(savedActive) };
          if (activeUser.name && !allUsers.find(p => p.name === activeUser.name)) {
            allUsers.push(activeUser);
            await AsyncStorage.setItem('@all_profiles', JSON.stringify(allUsers));
          }
        }

        setAppState({ status: 'ready', user: activeUser, allUsers });
      } catch (e) {
        setAppState({ status: 'error', error: e instanceof Error ? e : new Error('Error de almacenamiento') });
      }
    };
    loadData();
  }, []);

  // 🛡️ HELPERS BLINDADOS: Nunca devuelven undefined
  const user = appState.status === 'ready' ? appState.user : DEFAULT_USER;
  const allUsers = appState.status === 'ready' ? appState.allUsers : [];
  const isLoading = appState.status === 'loading';
  const error = appState.status === 'error' ? appState.error : undefined;

  const saveAll = async (activeUser: UserData, profiles: UserData[]) => {
    await AsyncStorage.setItem('@user_data', JSON.stringify(activeUser));
    await AsyncStorage.setItem('@all_profiles', JSON.stringify(profiles));
  };

  const updateUser = async (newData: Partial<UserData>) => {
    if (appState.status !== 'ready') return;
    const updatedUser = { ...appState.user, ...newData };
    let updatedProfiles = appState.allUsers.map(p => 
      p.name === appState.user.name ? updatedUser : p
    );
    if (newData.name && !appState.allUsers.find(p => p.name === newData.name)) {
        updatedProfiles = [...updatedProfiles, updatedUser];
    }
    setAppState({ status: 'ready', user: updatedUser, allUsers: updatedProfiles });
    await saveAll(updatedUser, updatedProfiles);
  };

  const completeWorkout = async (title: string, durationSecs: number, kcal: number) => {
    if (appState.status !== 'ready') return;
    const session: WorkoutSession = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString(),
      durationSecs,
      kcal,
    };
    const updatedUser: UserData = {
      ...appState.user,
      sessionsCompleted: appState.user.sessionsCompleted + 1,
      kcalBurned: appState.user.kcalBurned + kcal,
      streak: appState.user.streak + 1,
      workoutHistory: [session, ...appState.user.workoutHistory],
    };
    const updatedProfiles = appState.allUsers.map(p => 
      p.name === appState.user.name ? updatedUser : p
    );
    setAppState({ status: 'ready', user: updatedUser, allUsers: updatedProfiles });
    await saveAll(updatedUser, updatedProfiles);
  };

  const updateWater = async (liters: number) => {
    if (appState.status !== 'ready') return;
    const updatedUser = { ...appState.user, waterIntake: liters };
    const updatedProfiles = appState.allUsers.map(p => 
      p.name === appState.user.name ? updatedUser : p
    );
    setAppState({ status: 'ready', user: updatedUser, allUsers: updatedProfiles });
    await saveAll(updatedUser, updatedProfiles);
  };

  const switchUser = async (name: string) => {
    if (appState.status !== 'ready') return;
    const selected = appState.allUsers.find(p => p.name === name);
    if (selected) {
      setAppState({ ...appState, user: selected });
      await AsyncStorage.setItem('@user_data', JSON.stringify(selected));
    }
  };

  const logout = async () => {
    if (appState.status !== 'ready') return;
    setAppState({ ...appState, user: DEFAULT_USER });
    await AsyncStorage.removeItem('@user_data');
  };

  const deleteProfile = async (name: string) => {
    if (appState.status !== 'ready') return;
    const updatedProfiles = appState.allUsers.filter(p => p.name !== name);
    if (appState.user.name === name) {
        setAppState({ status: 'ready', user: DEFAULT_USER, allUsers: updatedProfiles });
        await AsyncStorage.removeItem('@user_data');
    } else {
        setAppState({ ...appState, allUsers: updatedProfiles });
    }
    await AsyncStorage.setItem('@all_profiles', JSON.stringify(updatedProfiles));
  };

  const clearAllData = async () => {
    setAppState({ status: 'ready', user: DEFAULT_USER, allUsers: [] });
    await AsyncStorage.clear();
  };

  // 🛡️ CORRECCIÓN CRÍTICA: Añadido optional chaining para evitar el error de length
  const isOnboarded = !!user?.name && user.name.length > 0;

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        allUsers,
        status: appState.status, 
        error, 
        updateUser, 
        completeWorkout, 
        updateWater, 
        switchUser,
        logout,
        deleteProfile,
        clearAllData, 
        isOnboarded, 
        isLoading 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};