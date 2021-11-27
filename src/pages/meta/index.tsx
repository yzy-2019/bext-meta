import { MetaList } from '@/components/meta-list';
import { useMeta } from '@/hooks/use-meta';
import { useUrlState } from '@/hooks/use-url-state';
import { Dropdown, ResponsiveMode } from '@fluentui/react';
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
    { tag: undefined, from: undefined },
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
      <div className="flex items-center justify-between px-6 py-2">
        <div className="font-medium text-base">
          {filter.from === 'dev' ? '请选择需要修改的插件' : null}
        </div>
        <Dropdown
          options={options}
          selectedKey={filter.tag || FILTER_ALL}
          onChange={(_, option) => onChange(option?.key)}
          responsiveMode={ResponsiveMode.small}
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
