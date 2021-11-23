import { FC, useMemo } from 'react';
import { usePersistFn, useRequest } from 'ahooks';
import {
  Separator,
  Spinner,
  SpinnerSize,
  Dropdown,
  PrimaryButton,
  ResponsiveMode,
  ProgressIndicator,
} from '@fluentui/react';
import { MetaIndex, MetaVersion } from '@/types';
import { MetaContent } from '@/components/meta-content';
import { useParams } from 'umi';
import dayjs from 'dayjs';

const DROPDOWN_ITEM_STYLE = { height: 'auto' };

const ExtDetailPage: FC = () => {
  const params = useParams<{ id: string }>();
  const {
    loading,
    error,
    data: metaIndex,
    mutate,
  } = useRequest<MetaIndex>(`/meta/${params.id}/index.json`, {
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
      onSuccess: (meta) => persistMutate((data) => ({ ...data, meta })),
      manual: true,
    },
  );

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
      console.log(meta);
    }
  };

  return (
    <div className="px-6 pt-4">
      <div className="flex justify-between">
        <Dropdown
          className="min-w-[40%]"
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
        <PrimaryButton
          onClick={onInstall}
          disabled={!!(metaLoading || !meta || metaError)}
        >
          安装此版本
        </PrimaryButton>
      </div>
      {!metaLoading ? (
        <Separator />
      ) : (
        <div className="h-[29px] flex flex-col justify-center">
          <ProgressIndicator barHeight={1} />
        </div>
      )}
      {meta ? (
        <MetaContent meta={meta} />
      ) : (
        <Spinner size={SpinnerSize.large} className="pt-20 w-full" />
      )}
    </div>
  );
};
export default ExtDetailPage;

const VersionOption: FC<{ version: MetaVersion }> = ({ version }) => {
  const date = useMemo(
    () => dayjs(version.date).format('YY/MM/DD HH:mm'),
    [version.date],
  );
  return (
    <div className="py-3">
      <div className="font-semibold text-base">
        {version.version} <span className="font-normal"> by </span>
        {version.author_name}
      </div>
      <div className="text-xs text-gray-400">
        {version.author_email} <br /> 发布于 {date}
      </div>
      <div>{version.message}</div>
    </div>
  );
};
