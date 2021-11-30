import { MetaList } from './meta-list';
import { Title } from './title';
import { useMeta } from '@/contexts/use-meta';
import { FC } from 'react';

export const CurrentUpdate: FC = () => {
  const { latestUpdateList } = useMeta();
  return (
    <>
      <Title>最近更新</Title>
      <MetaList list={latestUpdateList} />
    </>
  );
};
