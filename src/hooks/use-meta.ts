import META_TAG from '../../meta-tag.json';
import METAS from '../../public/meta/_index.json';
import { Meta } from '@/types';
import constate from 'constate';
import { uniq } from 'lodash-es';
import { useMemo } from 'react';

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
    metaTag: META_TAG as Record<string, { icon: string; description: string }>,
  };
});
