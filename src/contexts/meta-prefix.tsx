import BEXT_HOME from '!!raw-loader!../../BEXT_HOME';
import packageJson from '../../package.json';
import { useRequest } from 'ahooks';
import constate from 'constate';
import { useMemo } from 'react';

export const [MetaPrefixProvider, useMetaPrefix] = constate(() => {
  const { loading, data, error } = useRequest(
    `https://data.jsdelivr.com/v1/package/npm/${packageJson.name}`,
  );

  const isProduction = useMemo(
    () => window.location.origin.startsWith(BEXT_HOME),
    [],
  );

  if (!isProduction) {
    return {
      loading: false,
      prefix: `/meta`,
      error: undefined,
    };
  }

  return {
    loading,
    prefix: data?.tags?.latest
      ? `https://cdn.jsdelivr.net/npm/${packageJson.name}@${data?.tags?.latest}/public/meta`
      : undefined,
    error,
  };
});
