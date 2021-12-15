import { CurrentUpdate } from '@/components/current-update';
import { MetaList } from '@/components/meta-list';
import { TagList } from '@/components/tag-list';
import { useMeta } from '@/contexts/use-meta';
import { Events, trackEvent } from '@/util/tracker';
import { SearchBox } from '@fluentui/react';
import { useThrottle } from 'ahooks';
import { FC, useEffect, useMemo, useState } from 'react';

const HomePage: FC = () => {
  const { metaList } = useMeta();
  const [searchText, setSearchText] = useState('');
  const throttledText = useThrottle(searchText, { wait: 500 });
  const searchResult = useMemo(
    () =>
      metaList.filter(({ name, synopsis, id }) => {
        const text = throttledText.toLowerCase();
        return (
          id?.toLowerCase()?.includes(text) ||
          name?.toLowerCase()?.includes(text) ||
          synopsis?.toLowerCase()?.includes(text)
        );
      }),
    [throttledText, metaList],
  );

  useEffect(() => {
    if (throttledText) {
      trackEvent(Events.search, throttledText);
    }
  }, [throttledText]);

  return (
    <div className="pt-4 px-6">
      <SearchBox
        placeholder="搜索脚本（匹配ID、名称与简介）"
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
