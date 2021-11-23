import constate from 'constate';
import METAS from '../../public/meta/index.json';
import { Meta } from '@/types';
import { useMemo } from 'react';
import { uniq } from 'lodash-es';

// TODO: request
export const [MetaProvider, useMeta] = constate(() => {
  const metaList = METAS as Meta[];
  const tagList = useMemo(
    () => uniq(METAS.map(({ tags }) => tags).flat()),
    [metaList],
  );

  return {
    metaList,
    tagList,
  };
});
