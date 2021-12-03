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
  const metaMap = useMemo(
    () => Object.fromEntries(metaList.map((meta) => [meta.id, meta])),
    [metaList],
  );
  const latestUpdateList = useMemo(
    () => latestUpdate.map((id) => metaMap[id]),
    [metaMap, latestUpdate],
  );
  const tagList = META_TAG as {
    name: string;
    icon?: string;
    html?: string;
    description?: string;
  }[];

  const tagMap = useMemo(
    () => Object.fromEntries(tagList.map((tag) => [tag.name, tag])),
    [tagList],
  );

  return {
    metaList,
    latestUpdateList,
    tagList,
    tagMap,
  };
});
