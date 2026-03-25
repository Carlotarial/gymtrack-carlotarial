import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '../../hooks/useTimer';

jest.useFakeTimers();

describe('useTimer hook', () => {
  it('should start at default seconds', () => {
    const { result } = renderHook(() => useTimer(false, 10));
    expect(result.current.seconds).toBe(10);
  });

  it('should handle zero leading formatting correctly', () => {
    const { result } = renderHook(() => useTimer(false, 65));
    expect(result.current.formatted).toBe('01:05');
  });

  it('should increment time when actively running', () => {
    const { result } = renderHook(() => useTimer(true, 0));
    
    act(() => {
      jest.advanceTimersByTime(3000); // Avanzar 3 segundos
    });
    
    expect(result.current.seconds).toBe(3);
    expect(result.current.formatted).toBe('00:03');
  });

  it('should allow toggling active state', () => {
    const { result } = renderHook(() => useTimer(false, 0));
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isActive).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(result.current.seconds).toBe(2);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isActive).toBe(false);
  });
});
