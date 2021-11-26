import { contributors } from '../../../package.json';
import { SectionTitle } from '@/components/section-title';

const AboutPage = () => {
  return (
    <div className="px-6">
      <SectionTitle small>开放源代码</SectionTitle>
      <div>
        <a href="https://github.com/ikkz/bext" className="underline">
          Github
        </a>
      </div>
      <SectionTitle small>开发者们</SectionTitle>
      <div className="flex flex-wrap">
        {contributors.map(({ name, url }) => (
          <a href={url} className="underline mr-3" key={name}>
            @{name}
          </a>
        ))}
      </div>
    </div>
  );
};
export default AboutPage;
