import { useLocalStorageState } from 'ahooks';
import constate from 'constate';
import { useCallback, useRef } from 'react';

export interface Preference {
  neverShowCoachmark?: boolean;
  darkMode?: 'light' | 'dark';
}

export const [PreferenceProvider, usePreference] = constate(() => {
  const [preference, set] = useLocalStorageState<Preference>('BEXT.PREF', {
    defaultValue: {},
  });
  const ref = useRef(preference);
  const setPreference = useCallback((value: Partial<Preference>) => {
    set((old) => {
      ref.current = { ...old, ...value };
      return ref.current;
    });
  }, []);

  const getPreference = useCallback(() => ref.current, []);

  return {
    preference,
    setPreference,
    getPreference,
  };
});
