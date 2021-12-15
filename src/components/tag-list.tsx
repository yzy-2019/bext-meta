import { Title } from './title';
import { useMeta } from '@/contexts/use-meta';
import { Events, trackEvent } from '@/util/tracker';
import { useTheme } from '@fluentui/react';
import { FC } from 'react';
import { Link } from 'umi';

export const TagList: FC = () => {
  const { tagList } = useMeta();
  const theme = useTheme();
  return (
    <>
      <Title>全部分类</Title>
      <div className="grid grid-cols-3 gap-3">
        {tagList.map((tag) => (
          <Link
            to={`/meta?tag=${encodeURIComponent(tag.name)}`}
            key={tag.name}
            onClick={() => trackEvent(Events.tagClick, tag.name)}
          >
            <div
              className="h-12 flex items-center justify-center cursor-pointer"
              style={{
                boxShadow: theme.effects.elevation4,
              }}
            >
              {tag.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
