import { EditDetail } from './edit-detail';
import { ExportDialog } from './export-dialog';
import { useDraft } from '@/hooks/use-draft';
import { useInDev } from '@/hooks/use-in-dev';
import { excuteCompile } from '@/util/compile';
import { isBextClient } from '@/util/config';
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

  const onDebug = async () => {
    const { id, name, version, source, defaultConfig } = draft!;
    if (id && name && version) {
      try {
        const build = await excuteCompile({
          meta: {
            id,
            name,
            version,
            source: source || '',
            defaultConfig,
          },
        });
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: 'debug',
            payload: build,
          }),
        );
      } catch (error) {
        alert('编译失败，请查看控制台');
      }
    } else {
      alert('请填写完整 ID，名称，版本号');
    }
  };

  return (
    <>
      <header
        className="px-6 flex items-center justify-between h-12"
        style={{
          borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
        }}
      >
        {isBextClient ? null : (
          <CommandBarButton
            text="返回"
            iconProps={{ iconName: 'ChevronLeft' }}
            className="h-8"
            onClick={() => {
              saveDraft();
              history.replace('/dev');
            }}
          />
        )}
        <div>
          <DefaultButton onClick={showPanel}>编辑详情</DefaultButton>
          {isBextClient ? (
            <DefaultButton className="ml-3" onClick={onDebug}>
              调试
            </DefaultButton>
          ) : null}
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
