import { SectionTitle } from './section-title';
import { useMeta } from '@/hooks/use-meta';
import { Icon } from '@fluentui/react';
import { FC } from 'react';
import { Link } from 'umi';

export const TagList: FC = () => {
  const { tagList, metaTag } = useMeta();

  return (
    <>
      <SectionTitle>全部分类</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {tagList.map((tag) => (
          <Link to={`/meta?tag=${encodeURIComponent(tag)}`} key={tag}>
            <div className="border rounded h-20 flex items-center cursor-pointer">
              <Icon
                iconName={metaTag[tag]?.icon || 'TestBeaker'}
                className="text-2xl pl-3 pr-1"
              />
              <div className="h-full flex-1 overflow-hidden p-2">
                <div className="font-medium text-base truncate">{tag}</div>
                <div className="text-xs line-clamp-2">
                  {metaTag[tag]?.description || '暂无描述'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
