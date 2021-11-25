import { useMeta } from '@/hooks/use-meta';
import { FC } from 'react';
import { Icon } from '@fluentui/react';
import { SectionTitle } from './section-title';

export const TagList: FC = () => {
  const { tagList, metaTag } = useMeta();

  return (
    <>
      <SectionTitle>分类</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {tagList.map((tag) => (
          <div className="border rounded h-14 flex items-center cursor-pointer">
            <Icon
              iconName={metaTag[tag]?.icon || 'TestBeaker'}
              className="text-xl pl-3 pr-1"
            />
            <div className="h-full flex-1 flex flex-col justify-between p-2 overflow-hidden">
              <div className="font-semibold truncate">{tag}</div>
              <div className="text-xs truncate">
                {metaTag[tag]?.description || '暂无描述'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
