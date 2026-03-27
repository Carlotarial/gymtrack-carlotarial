import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { UserProvider, useUser } from '../../context/UserContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and load data', async () => {
    const wrapper = ({ children }: any) => <UserProvider>{children}</UserProvider>;
    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
    });

    expect(result.current.user.name).toBe('');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@user_data');
  });

  it('should complete workout and update global stats', async () => {
    const wrapper = ({ children }: any) => <UserProvider>{children}</UserProvider>;
    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
    });

    await act(async () => {
      await result.current.completeWorkout('Sesion HIIT', 1800, 250);
    });

    expect(result.current.user.sessionsCompleted).toBe(1);
    expect(result.current.user.kcalBurned).toBe(250);
    expect(result.current.user.streak).toBe(1);
    expect(result.current.user.workoutHistory.length).toBe(1);
    expect(result.current.user.workoutHistory[0].title).toBe('Sesion HIIT');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should reset user state completely', async () => {
    const wrapper = ({ children }: any) => <UserProvider>{children}</UserProvider>;
    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
    });

    await act(async () => {
      await result.current.updateUser({ name: 'Carlota' });
    });
    
    expect(result.current.user.name).toBe('Carlota');

    await act(async () => {
      await result.current.resetUser();
    });

    expect(result.current.user.name).toBe('');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@user_data');
  });
});
