import { Title } from './title';
import { useMeta } from '@/contexts/use-meta';
import { Icon, useTheme } from '@fluentui/react';
import { FC } from 'react';
import { Link } from 'umi';

export const TagList: FC = () => {
  const { tagList } = useMeta();
  const theme = useTheme();
  return (
    <>
      <Title>全部分类</Title>
      <div className="grid grid-cols-2 gap-4">
        {tagList.map((tag) => (
          <Link to={`/meta?tag=${encodeURIComponent(tag.name)}`} key={tag.name}>
            <div
              className="h-[70px] flex items-center cursor-pointer"
              style={{
                boxShadow: theme.effects.elevation4,
              }}
            >
              <div
                className="ml-3 w-6 h-10 flex justify-center items-center"
                dangerouslySetInnerHTML={
                  tag.html ? { __html: tag.html } : undefined
                }
              >
                {tag.html ? null : (
                  <Icon iconName={tag.icon} className=" text-2xl" />
                )}
              </div>
              <div className="h-full flex-1 overflow-hidden p-2">
                <div className="font-normal text-sm truncate">{tag.name}</div>
                <div className="text-xs line-clamp-2">
                  {tag?.description || '暂无描述'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
