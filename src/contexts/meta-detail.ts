import { Meta, MetaVersion } from '@/types';
import { Dispatch, SetStateAction, createContext } from 'react';

export const MetaDetailContext = createContext<{
  id?: string;
  versions?: MetaVersion[];
  currentVersion?: string;
  setVersion?: (hash: string) => void;
  currentMeta?: Meta;
  allLoading?: boolean;
  metaLoading?: boolean;

  review?: boolean;
  setReview?: Dispatch<SetStateAction<boolean>>;
}>({});
