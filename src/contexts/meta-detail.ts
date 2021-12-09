import { Meta, MetaVersion } from '@/types';
import { createContext } from 'react';

export const MetaDetailContext = createContext<{
  versions?: MetaVersion[];
  currentVersion?: string;
  setVersion?: (hash: string) => void;
  currentMeta?: Meta;
  allLoading?: boolean;
  metaLoading?: boolean;
}>({});
