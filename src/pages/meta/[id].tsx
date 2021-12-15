import { DetailHeader } from '@/components/detail-header';
import { MetaContent } from '@/components/meta-content';
import { MetaDetailContext } from '@/contexts/meta-detail';
import { Meta, MetaIndex, MetaVersion } from '@/types';
import { config } from '@/util/config';
import {
  ProgressIndicator,
  Separator,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { useRequest } from 'ahooks';
import { FC, useState } from 'react';
import { useParams } from 'umi';

const ExtDetailPage: FC = () => {
  const params = useParams<{ id: string }>();

  const [versions, setVersions] = useState<MetaVersion[]>();
  const [currentMeta, setCurrentMeta] = useState<Meta>();
  const [currentVersion, setCurrentVersion] = useState<string>();

  const { loading: allLoading, error: indexError } = useRequest(
    async () => {
      const response = await fetch(
        `${config.metaPrefix}/${params.id}/_index.json`,
      );
      const metaIndex: MetaIndex = await response.json();

      setVersions(metaIndex.versions);
      setCurrentMeta(
        Object.assign({}, metaIndex.meta, { id: String(params.id) }),
      );
      setCurrentVersion(metaIndex.versions[0].hash);
    },
    {
      refreshDeps: [params.id],
    },
  );

  const {
    loading: metaLoading,
    run: setVersion,
    error: metaError,
  } = useRequest(
    async (hash: string) => {
      setCurrentVersion(hash);
      const response = await fetch(
        `${config.metaPrefix}/${params.id}/${hash}.json`,
      );
      setCurrentMeta({ ...(await response.json()), id: String(params.id) });
    },
    { manual: true, refreshDeps: [params.id] },
  );

  if (allLoading) {
    return <Spinner size={SpinnerSize.large} className="w-full h-full" />;
  }

  if (indexError || metaError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        出错了...
      </div>
    );
  }

  return (
    <MetaDetailContext.Provider
      value={{
        versions,
        currentVersion,
        setVersion,
        currentMeta,
        allLoading,
        metaLoading,
      }}
    >
      <div className="px-6 pt-4">
        <DetailHeader />
        {!metaLoading ? (
          <Separator />
        ) : (
          <div className="h-[29px] flex flex-col justify-center">
            <ProgressIndicator barHeight={1} />
          </div>
        )}
        {currentMeta ? (
          <MetaContent meta={currentMeta} />
        ) : (
          <Spinner size={SpinnerSize.large} className="pt-20 w-full" />
        )}
      </div>
    </MetaDetailContext.Provider>
  );
};

export default ExtDetailPage;
