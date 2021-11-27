import { useMemo } from 'react';
import { useLocation } from 'umi';

export const useInDev = () => {
  const pathname = useLocation().pathname;
  return useMemo(() => /^\/dev\/.+$/.test(pathname), [pathname]);
};
