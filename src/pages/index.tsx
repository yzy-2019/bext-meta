import { TagList } from '@/components/tag-list';
import { SearchBox } from '@fluentui/react';
import { FC } from 'react';

const HomePage: FC = () => (
  <div className="px-6 pt-4">
    <SearchBox placeholder="搜索扩展" />
    <TagList />
  </div>
);

export default HomePage;
