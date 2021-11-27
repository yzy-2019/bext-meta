import { EditDetail } from './edit-detail';
import { useDraft } from '@/hooks/use-draft';
import { useInDev } from '@/hooks/use-in-dev';
import {
  CommandBarButton,
  DefaultButton,
  PrimaryButton,
} from '@fluentui/react';
import { useBoolean } from 'ahooks';
import { FC, useEffect } from 'react';
import { useHistory } from 'umi';

export const DevHeader: FC = () => {
  const history = useHistory();
  const { setDraftObject, saveDraft } = useDraft();
  const [visible, { setTrue: showPanel, setFalse: hidePanel }] =
    useBoolean(false);
  const inDev = useInDev();
  useEffect(() => {
    if (inDev) {
      showPanel();
    }
  }, [inDev, showPanel]);

  return (
    <header className="px-6 flex items-center justify-between h-12 border-b">
      <CommandBarButton
        text="返回"
        iconProps={{ iconName: 'ChevronLeft' }}
        className="h-8"
        onClick={() => {
          saveDraft();
          setDraftObject(null);
          setTimeout(() => history.push('/dev'));
        }}
      />
      <div>
        <DefaultButton onClick={showPanel}>编辑详情</DefaultButton>
        <PrimaryButton className="ml-3">准备发布</PrimaryButton>
        <EditDetail visible={visible} hide={hidePanel} />
      </div>
    </header>
  );
};
