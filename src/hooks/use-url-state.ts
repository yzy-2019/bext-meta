// https://github.com/alibaba/hooks/blob/master/packages/use-url-state/src/index.ts
// 修改而来，消除警告
import { useMemoizedFn, useUpdate } from 'ahooks';
import { parse, stringify } from 'query-string';
import { useMemo, useRef } from 'react';
import { useHistory } from 'umi';

export interface Options {
  navigateMode?: 'push' | 'replace';
}

const parseConfig = {
  skipNull: false,
  skipEmptyString: false,
  parseNumbers: false,
  parseBooleans: false,
};

type UrlState = Record<string, any>;

export const useUrlState = <S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  options?: Options,
) => {
  type State = Partial<{ [key in keyof S]: any }>;
  const { navigateMode = 'push' } = options || {};
  const history = useHistory();
  const update = useUpdate();

  const initialStateRef = useRef(
    typeof initialState === 'function'
      ? (initialState as () => S)()
      : initialState || {},
  );

  const queryFromUrl = useMemo(() => {
    return parse(location.search, parseConfig);
  }, [location.search]);

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...queryFromUrl,
    }),
    [queryFromUrl],
  );

  const setState = (s: React.SetStateAction<State>) => {
    const newQuery = typeof s === 'function' ? s(targetQuery) : s;
    update();
    history[navigateMode]({
      hash: location.hash,
      search: stringify({ ...queryFromUrl, ...newQuery }, parseConfig) || '?',
    });
  };

  return [targetQuery, useMemoizedFn(setState)] as const;
};
