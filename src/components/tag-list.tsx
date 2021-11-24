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
          <div className="border rounded h-12 flex items-center">
            <Icon
              iconName={metaTag[tag]?.icon || 'TestBeaker'}
              className="text-xl px-3"
            />
            {tag}
          </div>
        ))}
      </div>
    </>
  );
};
