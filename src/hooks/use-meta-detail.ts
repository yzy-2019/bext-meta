import { Meta, MetaVersion } from '@/types';
import { createContext, useContext } from 'react';

export const MetaDetailContext = createContext<{
  versions?: MetaVersion[];
  currentVersion?: string;
  setVersion?: (hash: string) => void;
  currentMeta?: Meta;
  allLoading?: boolean;
  metaLoading?: boolean;
}>({});

export const useMetaDetail = () => useContext(MetaDetailContext);
