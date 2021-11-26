import { CurrentUpdate } from '@/components/current-update';
import { MetaList } from '@/components/meta-list';
import { TagList } from '@/components/tag-list';
import { useMeta } from '@/hooks/use-meta';
import { SearchBox } from '@fluentui/react';
import { useThrottle } from 'ahooks';
import { FC, useMemo, useState } from 'react';

const HomePage: FC = () => {
  const { metaList } = useMeta();
  const [searchText, setSearchText] = useState('');
  const throttledText = useThrottle(searchText, { wait: 500 });
  const searchResult = useMemo(
    () =>
      metaList.filter(
        ({ name, synopsis }) =>
          name
            ?.toLocaleLowerCase()
            ?.includes(throttledText.toLocaleLowerCase()) ||
          synopsis
            ?.toLocaleLowerCase()
            ?.includes(throttledText.toLocaleLowerCase()),
      ),
    [throttledText, metaList],
  );

  return (
    <div className="pt-4 px-6">
      <SearchBox
        placeholder="搜索扩展（匹配名称与简介）"
        underlined
        value={searchText}
        onChange={(e) => setSearchText(e?.target.value || '')}
      />
      {throttledText ? (
        searchResult.length ? (
          <MetaList list={searchResult} />
        ) : (
          <div className="text-center pt-7">哦豁，没有找到</div>
        )
      ) : (
        <>
          <TagList />
          <CurrentUpdate />
        </>
      )}
    </div>
  );
};

export default HomePage;
