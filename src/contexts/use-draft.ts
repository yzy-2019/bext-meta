import { useInDev } from './use-in-dev';
import { Meta } from '@/types';
import { useLocalStorageState, useMemoizedFn, useThrottleEffect } from 'ahooks';
import constate from 'constate';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'umi';

const BEXT_DRAFT_KEY = 'BEXT.DRAFT';
type Draft = Partial<Meta> | null;

export const [DraftProvider, useDraft] = constate(() => {
  const [cacheDraft, setCacheDraft] = useLocalStorageState<Draft>(
    BEXT_DRAFT_KEY,
    { defaultValue: null },
  );

  const [draft, setDraftObject] = useState<Draft>(null);

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
    saveDraft,
    cacheDraft,
  };
});

export const useDraftNavigate = () => {
  const { draft } = useDraft();
  const history = useHistory();
  const inDev = useInDev();

  useEffect(() => {
    if (draft && !inDev) {
      switch (draft.type) {
        case 'javascript':
          history.replace('/dev/script');
          break;
        default:
          break;
      }
    }
    if (!draft && inDev) {
      history.replace('/dev');
    }
  }, [draft, inDev, history]);
};
