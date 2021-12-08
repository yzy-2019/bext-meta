import packageJson from '../../package.json';
import { MetaDetailContext } from '@/contexts/meta-detail';
import { browser } from '@/lib';
import { MetaVersion } from '@/types';
import {
  DefaultButton,
  Dropdown,
  IContextualMenuItem,
  PrimaryButton,
  ResponsiveMode,
} from '@fluentui/react';
import dayjs from 'dayjs';
import { FC, useContext, useMemo } from 'react';

const DROPDOWN_ITEM_STYLE = { height: 'auto' };

export const DetailHeader: FC = () => {
  const {
    currentMeta,
    id,
    currentVersion,
    versions,
    setVersion,
    review,
    setReview,
    metaLoading,
  } = useContext(MetaDetailContext);
  const onInstall = () => {
    if (currentMeta) {
      console.log(
        browser('install', {
          ...currentMeta,
          id,
          author: `bext/${currentMeta.id}`,
        }),
      );
    }
  };

  const onMenuClick = (item?: IContextualMenuItem) => {
    switch (item?.key) {
      case 'review':
        setReview?.((value) => !value);
        break;
      case 'report':
        const title = encodeURIComponent(
          `[Report] Meta ${currentMeta?.name}#${id}`,
        );
        const body = encodeURIComponent(`
请前往 ${packageJson.repository.url}/commits/master/meta/${id}.json
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
        onChange={(_, option) => setVersion?.(option?.data.hash)}
      />
      <div>
        <DefaultButton
          menuProps={{
            items: [
              {
                key: 'review',
                text: review ? '隐藏代码' : '查看代码',
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
        <PrimaryButton
          className="ml-2"
          onClick={onInstall}
          disabled={metaLoading}
        >
          安装此版本
        </PrimaryButton>
      </div>
    </div>
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
