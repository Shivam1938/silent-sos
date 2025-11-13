import { useCallback, useRef } from 'react';

export const usePatternActivator = ({ requiredPresses = 3, timeWindow = 1500, onActivate }) => {
  const pressStateRef = useRef({
    count: 0,
    lastPress: 0,
  });

  return useCallback(() => {
    const now = Date.now();
    const state = pressStateRef.current;

    if (now - state.lastPress > timeWindow) {
      state.count = 0;
    }

    state.lastPress = now;
    state.count += 1;

    if (state.count >= requiredPresses) {
      state.count = 0;
      onActivate?.();
    }
  }, [onActivate, requiredPresses, timeWindow]);
};

