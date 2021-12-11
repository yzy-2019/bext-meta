import packageJson from '../../package.json';
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
      <Title>声明</Title>
      使用本站提供的任何功能，即表示我已了解并同意：本站仅作为脚本的托管站点，不对第三方发布的脚本内容进行审核，并且使用脚本后造成的任何情况均与本站无关。
      <Title>开放源代码</Title>
      <div>
        <a href="https://github.com/ikkz/bext" className="underline">
          Github
        </a>
      </div>
      <Title>开发者们</Title>
      <div className="flex flex-wrap">
        {packageJson.contributors.map(({ name, url }) => (
          <a href={url} className="underline mr-3" key={name}>
            @{name}
          </a>
        ))}
      </div>
      <Title>联系我们</Title>
      <a href="https://github.com/ikkz/bext/issues" className="underline">
        Github issue
      </a>
      <a
        href="https://jq.qq.com/?_wv=1027&k=cD7xSpnh"
        className="underline ml-3"
      >
        交流群
      </a>
      <div className="text-center font-extralight mt-6">
        Build @{dayjs.unix(BUILD_TIMESTAMP).format('YY/MM/DD HH:mm')} #
        {BUILD_HASH.slice(0, 8)}
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
