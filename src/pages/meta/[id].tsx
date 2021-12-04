import packageJson from '../../../package.json';
import { MetaContent } from '@/components/meta-content';
import { browser } from '@/lib';
import { MetaIndex, MetaVersion } from '@/types';
import {
  DefaultButton,
  Dropdown,
  IContextualMenuItem,
  PrimaryButton,
  ProgressIndicator,
  ResponsiveMode,
  Separator,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { usePersistFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { useParams } from 'umi';

const DROPDOWN_ITEM_STYLE = { height: 'auto' };

const ExtDetailPage: FC = () => {
  const params = useParams<{ id: string }>();
  const {
    loading,
    error,
    data: metaIndex,
    mutate,
  } = useRequest<MetaIndex>(`/meta/${params.id}/_index.json`, {
    refreshDeps: [params.id],
  });
  const persistMutate = usePersistFn(mutate);
  const {
    loading: metaLoading,
    run: onVersionChange,
    error: metaError,
  } = useRequest(
    (version: MetaVersion) => `/meta/${params.id}/${version.hash}.json`,
    {
      onSuccess: (meta, [{ hash }]) =>
        persistMutate((data) => ({ ...data, meta: { ...meta, hash } })),
      manual: true,
    },
  );
  const [review, setReview] = useState(false);

  const onMenuClick = (item?: IContextualMenuItem) => {
    switch (item?.key) {
      case 'review':
        setReview((value) => !value);
        break;
      case 'report':
        const title = encodeURIComponent(
          `[Report] Meta ${meta?.name}#${params?.id}`,
        );
        const body = encodeURIComponent(`
请前往 ${packageJson.repository.url}/commits/master/meta/${params?.id}.json
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

  if (loading) {
    return <Spinner size={SpinnerSize.large} className="w-full h-full" />;
  }

  if (error || !metaIndex) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        出错了...
      </div>
    );
  }

  const { meta } = metaIndex;

  const onInstall = () => {
    if (meta) {
      console.log(
        browser('install', {
          ...meta,
          id: params.id,
          author: `bext/${params.id}`,
        }),
      );
    }
  };

  return (
    <div className="px-6 pt-4">
      <div className="flex justify-between">
        <Dropdown
          className="min-w-[30%]"
          styles={{
            dropdownItem: DROPDOWN_ITEM_STYLE,
            dropdownItemSelected: DROPDOWN_ITEM_STYLE,
          }}
          selectedKey={metaIndex.hash}
          responsiveMode={ResponsiveMode.small}
          onRenderOption={(opt) => <VersionOption version={opt?.data} />}
          options={metaIndex.versions.map((version) => ({
            key: version.hash,
            text: version.version || version.hash.slice(0, 7),
            data: version,
          }))}
          onChange={(_, option) => {
            persistMutate((data) => ({ ...data, hash: option?.data.hash }));
            onVersionChange(option?.data);
          }}
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
            disabled={!!(metaLoading || !meta || metaError)}
          >
            安装此版本
          </PrimaryButton>
        </div>
      </div>
      {!metaLoading ? (
        <Separator />
      ) : (
        <div className="h-[29px] flex flex-col justify-center">
          <ProgressIndicator barHeight={1} />
        </div>
      )}
      {meta ? (
        <MetaContent
          meta={meta}
          key={(meta as any)?.hash || 'index'}
          review={review}
        />
      ) : (
        <Spinner size={SpinnerSize.large} className="pt-20 w-full" />
      )}
    </div>
  );
};
export default ExtDetailPage;

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
