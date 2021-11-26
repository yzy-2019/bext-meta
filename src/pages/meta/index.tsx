import { MetaList } from '@/components/meta-list';
import { useMeta } from '@/hooks/use-meta';
import useUrlState from '@ahooksjs/use-url-state';
import { Dropdown } from '@fluentui/react';
import { FC, useMemo } from 'react';

const FILTER_ALL = 'filterAll';

export const MetaPage: FC = () => {
  const { metaList, tagList } = useMeta();
  const options = useMemo(
    () => [
      { key: FILTER_ALL, text: '全部分类' },
      ...tagList.map((tag) => ({ key: tag, text: tag })),
    ],
    [tagList],
  );
  const [filter, setFilter] = useUrlState(
    { tag: undefined },
    { navigateMode: 'replace' },
  );
  const list = useMemo(
    () =>
      filter.tag
        ? metaList.filter(({ tags }) => tags?.includes(filter.tag))
        : metaList,
    [metaList, filter.tag],
  );
  const onChange = (tag?: string | number) => {
    if (typeof tag === 'string') {
      setFilter({ tag: tag === FILTER_ALL ? undefined : tag });
    }
  };

  return (
    <>
      <div className="flex justify-end px-6 py-2">
        <Dropdown
          options={options}
          selectedKey={filter.tag || FILTER_ALL}
          onChange={(_, option) => onChange(option?.key)}
          onRenderOption={(option) => (
            <span
              className={
                option?.key === FILTER_ALL ? 'font-semibold' : undefined
              }
            >
              {option?.text}
            </span>
          )}
        />
      </div>
      <MetaList list={list} withPaddingX />
    </>
  );
};
export default MetaPage;
