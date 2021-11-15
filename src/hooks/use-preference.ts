import constate from 'constate';
import { useCallback, useRef } from 'react';
import { useLocalStorageState } from 'ahooks';

interface Preference {
  neverShowDevDialog?: boolean;
  neverShowCoachmark?: boolean;
}

export const [PreferenceProvider, usePreference] = constate(() => {
  const [preference, set] = useLocalStorageState<Preference>('BEXT.PREF', {});
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
