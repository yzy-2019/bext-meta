import { Meta } from '@/types';
import { useLocalStorageState, useMemoizedFn, useThrottleEffect } from 'ahooks';
import { useGetState } from 'ahooks';
import constate from 'constate';
import { useCallback } from 'react';

const BEXT_DRAFT_KEY = 'BEXT.DRAFT';
type Draft = Partial<Meta> | null;

export const [DraftProvider, useDraft] = constate(() => {
  const [cacheDraft, setCacheDraft] = useLocalStorageState<Draft>(
    BEXT_DRAFT_KEY,
    { defaultValue: null },
  );

  const [draft, setDraftObject, getDraftObject] =
    useGetState<Draft>(cacheDraft);

  const setDraft = useCallback(
    (state: Draft) =>
      setDraftObject((prev) => (state === null ? null : { ...prev, ...state })),
    [],
  );

  const saveDraft = useMemoizedFn(() => {
    setCacheDraft(draft);
  });

  useThrottleEffect(
    () => {
      if (draft) {
        saveDraft();
      }
    },
    [draft],
    { wait: 3000 },
  );

  return {
    draft,
    setDraft,
    setDraftObject,
    getDraftObject,
    saveDraft,
    cacheDraft,
  };
});
