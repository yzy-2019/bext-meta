import { List } from '@fluentui/react';
import { FC } from 'react';
import { Link } from 'umi';
import { useMeta } from '@/hooks/use-meta';

export const MetaPage: FC = () => {
  const { metaList } = useMeta();
  return (
    <List
      items={metaList}
      onRenderCell={(item) => (
        <Link key={item?.id} to={`/meta/${item?.id ?? ''}`}>
          <div className="px-6 py-3 border-b border-opacity-40 border-gray-300 hover:bg-gray-50 cursor-pointer">
            <div className="font-medium mb-1">{item?.name}</div>
            <div>{item?.synopsis}</div>
          </div>
        </Link>
      )}
    />
  );
};
export default MetaPage;
