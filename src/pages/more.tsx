import { contributors } from '../../package.json';
import { Title } from '@/components/title';
import { Preference, usePreference } from '@/contexts/use-preference';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import dayjs from 'dayjs';

const MorePage = () => {
  const { preference, setPreference } = usePreference();

  return (
    <div className="px-6">
      <Title>主题颜色</Title>
      <ChoiceGroup
        selectedKey={preference.darkMode ?? 'system'}
        onChange={(_, option) =>
          setPreference({
            darkMode: (['light', 'dark'].includes(option?.key!)
              ? option?.key
              : undefined) as Preference['darkMode'],
          })
        }
        options={themeOptions}
      />
      <Title>开放源代码</Title>
      <div>
        <a href="https://github.com/ikkz/bext" className="underline">
          Github
        </a>
      </div>
      <Title>开发者们</Title>
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
export default MorePage;

const themeOptions: IChoiceGroupOption[] = [
  {
    key: 'system',
    text: '跟随系统',
    iconProps: {
      iconName: 'System',
    },
  },
  {
    key: 'light',
    text: '亮色',
    iconProps: {
      iconName: 'Sunny',
    },
  },
  {
    key: 'dark',
    text: '暗色',
    iconProps: {
      iconName: 'ClearNight',
    },
  },
];
