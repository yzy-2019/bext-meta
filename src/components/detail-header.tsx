import packageJson from '../../package.json';
import { InstallButton } from './install-button';
import { MetaDetailContext } from '@/contexts/meta-detail';
import { MetaVersion } from '@/types';
import { Events, trackEvent } from '@/util/tracker';
import {
  DefaultButton,
  Dropdown,
  IContextualMenuItem,
  ResponsiveMode,
} from '@fluentui/react';
import dayjs from 'dayjs';
import { FC, useContext, useMemo } from 'react';
import { useHistory } from 'umi';

const DROPDOWN_ITEM_STYLE = { height: 'auto' };

export const DetailHeader: FC = () => {
  const { currentMeta, currentVersion, versions, setVersion } =
    useContext(MetaDetailContext);
  const history = useHistory();

  const onMenuClick = (item?: IContextualMenuItem) => {
    switch (item?.key) {
      case 'review':
        history.push(`/meta/${currentMeta?.id}/review`);
        break;
      case 'report':
        trackEvent(Events.metaReport, currentMeta?.id);
        const title = encodeURIComponent(
          `[Report] Meta ${currentMeta?.name}#${currentMeta?.id}`,
        );
        const body = encodeURIComponent(`
请前往 ${packageJson.repository.url}/commits/master/meta/${currentMeta?.id}.json
选择一位或者多位你认为能解决你问题的脚本作者，并在问题描述之后 at
问题描述：`);
        window.open(
          `${packageJson.repository.url}/issues/new?title=${title}&body=${body}`,
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <Dropdown
          className="min-w-[30%]"
          styles={{
            dropdownItem: DROPDOWN_ITEM_STYLE,
            dropdownItemSelected: DROPDOWN_ITEM_STYLE,
          }}
          selectedKey={currentVersion}
          responsiveMode={ResponsiveMode.small}
          onRenderOption={(opt) => <VersionOption version={opt?.data} />}
          options={
            versions?.map((version) => ({
              key: version.hash,
              text: version.version || version.hash.slice(0, 7),
              data: version,
            })) || []
          }
          onChange={(_, option) => {
            trackEvent(Events.metaSwitchVersion, currentMeta?.id);
            setVersion?.(option?.data.hash);
          }}
        />
        <div>
          <DefaultButton
            menuProps={{
              items: [
                {
                  key: 'review',
                  text: '查看代码',
                  iconProps: { iconName: 'RedEye' },
                },
                {
                  key: 'report',
                  text: '报告问题',
                  iconProps: { iconName: 'Bug' },
                },
              ],
              onItemClick: (_, item) => onMenuClick(item),
            }}
          >
            更多
          </DefaultButton>
          <InstallButton />
        </div>
      </div>
    </>
  );
};

const VersionOption: FC<{ version: MetaVersion }> = ({ version }) => {
  const date = useMemo(
    () => dayjs.unix(version.date).format('YY/MM/DD HH:mm'),
    [version.date],
  );
  return (
    <div className="py-3">
      <div className="font-semibold text-base">
        {version.version} <span className="font-normal"> by </span>
        {version.author_name}
      </div>
      <div className="text-xs text-gray-400">发布于 {date}</div>
      <div>{version.message}</div>
    </div>
  );
};
