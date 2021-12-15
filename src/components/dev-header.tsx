import { EditDetail } from './edit-detail';
import { ExportDialog } from './export-dialog';
import { useDraft } from '@/contexts/use-draft';
import { useInDev } from '@/contexts/use-in-dev';
import {
  CommandBarButton,
  DefaultButton,
  Dialog,
  DialogType,
  PrimaryButton,
  useTheme,
} from '@fluentui/react';
import { useBoolean } from 'ahooks';
import { FC, useEffect } from 'react';
import { useHistory } from 'umi';

export const DevHeader: FC = () => {
  const history = useHistory();
  const { draft, saveDraft } = useDraft();
  const [detailVisible, { setTrue: showPanel, setFalse: hidePanel }] =
    useBoolean(false);
  const inDev = useInDev();
  useEffect(() => {
    if (inDev && !draft?.id) {
      showPanel();
    }
  }, [inDev, showPanel, draft]);

  const [exportVisible, { setTrue: showExport, setFalse: hideExport }] =
    useBoolean(false);
  const theme = useTheme();

  return (
    <>
      <header
        className="px-6 flex items-center justify-between h-12"
        style={{
          borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
        }}
      >
        <CommandBarButton
          text="返回"
          iconProps={{ iconName: 'ChevronLeft' }}
          className="h-8"
          onClick={() => {
            saveDraft();
            history.replace('/dev');
          }}
        />
        <div>
          <DefaultButton onClick={showPanel}>编辑详情</DefaultButton>
          <PrimaryButton className="ml-3" onClick={showExport}>
            准备发布
          </PrimaryButton>
          <EditDetail visible={detailVisible} hide={hidePanel} />
        </div>
      </header>
      <Dialog
        hidden={!exportVisible}
        onDismiss={hideExport}
        dialogContentProps={{ type: DialogType.normal, title: '发布步骤' }}
        modalProps={{ isBlocking: false }}
      >
        <ExportDialog />
      </Dialog>
    </>
  );
};
