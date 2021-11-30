import META_TAG from '../../meta-tag.json';
import META_INDEX from '../../public/meta/_index.json';
import { Meta } from '@/types';
import constate from 'constate';
import { uniq } from 'lodash-es';
import { useMemo } from 'react';

const { metas, latestUpdate } = META_INDEX;

// TODO: request
export const [MetaProvider, useMeta] = constate(() => {
  const metaList = metas as Meta[];
  const tagList = useMemo(
    () => uniq(metaList.map(({ tags }) => tags).flat()),
    [metaList],
  );
  const metaMap = useMemo(
    () => Object.fromEntries(metaList.map((meta) => [meta.id, meta])),
    [metaList],
  );
  const latestUpdateList = useMemo(
    () => latestUpdate.map((id) => metaMap[id]),
    [metaMap, latestUpdate],
  );

  return {
    metaList,
    tagList,
    latestUpdateList,
    metaTag: META_TAG as Record<string, { icon: string; description: string }>,
  };
});
