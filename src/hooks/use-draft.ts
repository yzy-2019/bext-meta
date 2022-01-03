import { Meta } from '@/types';
import { isBextClient } from '@/util/config';
import { useLocalStorageState, useMemoizedFn, useThrottleEffect } from 'ahooks';
import { useGetState } from 'ahooks';
import constate from 'constate';
import { useCallback, useEffect } from 'react';

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

  const [clientReady, setClientReady, getClientReady] = useGetState(false);

  const injectDraft = useMemoizedFn((content: string = '{}') => {
    try {
      setDraftObject(JSON.parse(content));
      setClientReady(true);
    } catch (error) {}
  });

  useEffect(() => ((window.injectDraft = injectDraft), void 0));

  useEffect(() => {
    if (isBextClient) {
      try {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: 'ready',
          }),
        );
      } catch (error) {}
    }
  }, [isBextClient]);

  const saveDraft = useMemoizedFn(() => {
    setCacheDraft(draft);
    if (isBextClient && getClientReady()) {
      try {
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: 'save',
            payload: draft,
          }),
        );
      } catch (error) {}
    }
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
