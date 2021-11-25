import { SectionTitle } from '@/components/section-title';

import { contributors } from '../../../package.json';

const AboutPage = () => {
  return (
    <div className="px-6">
      <SectionTitle>开放源代码</SectionTitle>
      <div>
        <a href="https://github.com/ikkz/bext" className="underline">
          Github
        </a>
      </div>
      <SectionTitle>开发者们</SectionTitle>
      <div className="flex flex-wrap">
        {contributors.map(({ name, url }) => (
          <a href={url} className="underline mr-3">
            @{name}
          </a>
        ))}
      </div>
    </div>
  );
};
export default AboutPage;
