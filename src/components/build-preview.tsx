import { useBextTheme } from '@/hooks/custom-theme-provider';
import { useBuild } from '@/hooks/use-build';
import { config } from '@/util/config';
import {
  DefaultButton,
  Label,
  Link,
  Modal,
  PrimaryButton,
  TextField,
} from '@fluentui/react';
import Editor from '@monaco-editor/react';
import { useBoolean } from 'ahooks';
import { FC, useContext, useMemo, useState } from 'react';

export const BuildPreview: FC = () => {
  const build = useBuild();
  const [modalVisible, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [url, setUrl] = useState('');
  const [debugWindow, setDebugWindow] = useState<Window | null>(null);

  const debugClientLink = useMemo(() => {
    return config.metaPrefix.replace(/meta$/, 'lib/debug-client.user.js');
  }, []);

  const theme = useBextTheme();

  const pushScript = () => {
    debugWindow?.postMessage(
      {
        type: 'bext/script',
        payload: build,
      },
      '*',
    );
  };

  return (
    <div className="flex-1 flex flex-col pt-2 h-full">
      <Label className="text-base flex items-center justify-between">
        脚本预览
        <div>
          <DefaultButton className="h-6 px-1" onClick={showModal}>
            打开调试窗口
          </DefaultButton>
          <PrimaryButton className="h-6 px-1 mx-2" onClick={pushScript}>
            推送脚本
          </PrimaryButton>
        </div>
      </Label>
      <Modal isOpen={modalVisible} onDismiss={hideModal}>
        <div className="w-[640px]">
          <div className="p-4">
            请先点击<Link href={debugClientLink}>此处</Link>
            安装油猴脚本，然后在下方文本框中输入需要调试的链接，点击打开。
            回到开发页面后点击“推送脚本”即可让正在编写的代码在目标窗口中刷新执行。
            若推送之后没有反应，请检查目标页面油猴脚本是否生效，并重新执行打开操作。
          </div>
          <div className="flex items-center px-4">
            <TextField
              className="flex-1 mr-2"
              value={url}
              onChange={(_, newUrl) => setUrl(newUrl || '')}
            />
            <PrimaryButton
              onClick={() => {
                hideModal();
                setDebugWindow(window.open(url));
              }}
            >
              打开
            </PrimaryButton>
          </div>
        </div>
      </Modal>
      <div className="text-sm pb-2">
        错误警告在请按 F12 打开浏览器开发者工具查看
      </div>
      <Editor
        value={build}
        options={{ readOnly: true }}
        language="javascript"
        className="flex-1"
        theme={theme === 'light' ? 'vs' : 'vs-dark'}
      />
    </div>
  );
};
