import { contributors } from '../../../package.json';
import { SectionTitle } from '@/components/section-title';
import dayjs from 'dayjs';

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
          <a href={url} className="underline mr-3" key={name}>
            @{name}
          </a>
        ))}
      </div>
      <div className="text-center font-extralight mt-6">
        Build @{dayjs.unix(BUILD_TIMESTAMP).format('YY/MM/DD HH:mm')} #
        {BUILD_HASH}
      </div>
    </div>
  );
};
export default AboutPage;
