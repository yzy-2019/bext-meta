import { useMeta } from '@/hooks/use-meta';
import { FC } from 'react';

export const TagList: FC = () => {
  const { tagList } = useMeta();

  return (
    <div className="grid grid-cols-2">
      {tagList.map((tag) => (
        <div className="border rounded h-12 flex items-center">
          <img
            src={`https://icongaga-api.bytedancer.workers.dev/api/genHexer?name=${tag}`}
            className="w-5 h-5"
          />
          {tag}
        </div>
      ))}
    </div>
  );
};
