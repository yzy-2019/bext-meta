import { DetailHeader } from '@/components/detail-header';
import { MetaContent } from '@/components/meta-content';
import { MetaDetailContext } from '@/contexts/meta-detail';
import {
  ProgressIndicator,
  Separator,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { FC, useContext } from 'react';

const ExtDetailPage: FC = () => {
  const { currentMeta, metaLoading } = useContext(MetaDetailContext);
  return (
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
  );
};

export default ExtDetailPage;
