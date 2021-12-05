import DEBUG_CLIENT_SCRIPT from '!!raw-loader!@/lib/debug-client.js';
import { Editor } from './editor';
import { useDraft } from '@/contexts/use-draft';
import { excuteCompile } from '@/util/compile';
import {
  DefaultButton,
  Label,
  Modal,
  PrimaryButton,
  TextField,
} from '@fluentui/react';
import { useBoolean, useDebounceEffect } from 'ahooks';
import dayjs from 'dayjs';
import { FC, useState } from 'react';

export const BuildPreview: FC = () => {
  const [build, setBuild] = useState<string>();
  const { draft } = useDraft();
  const [modalVisible, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [url, setUrl] = useState('');
  const [debugWindow, setDebugWindow] = useState<Window | null>(null);

  const pushScript = () => {
    debugWindow?.postMessage(
      {
        type: 'bext/script',
        payload: build,
      },
      '*',
    );
  };

  useDebounceEffect(
    () => {
      if (draft) {
        const { id, name, version, source, options } = draft;
        if (id && name && version && source) {
          console.log(`[compile] start at ${dayjs().format('HH:mm:ss')} ==`);

          excuteCompile({
            meta: {
              id,
              name,
              version,
              source,
              options,
            },
          }).then((build) => {
            console.log('[compile] end');
            setBuild(build);
          });
        } else {
          console.log('[compile] 请填写完整 ID，名称，版本');
        }
      }
    },
    [draft?.id, draft?.name, draft?.version, draft?.source, !draft?.options],
    {
      wait: 1000,
    },
  );

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
        <div className="w-[640px] h-[600px]">
          <div className="p-4">
            请先通过油猴安装下方编辑器中的脚本，然后在文本框中输入需要调试的链接，点击打开。
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
                setDebugWindow(window.open(url));
              }}
            >
              打开
            </PrimaryButton>
          </div>
          <Editor
            value={DEBUG_CLIENT_SCRIPT}
            options={{ readOnly: true, language: 'javascript' }}
          />
        </div>
      </Modal>
      <div className="text-sm pb-2">
        错误警告在请按 F12 打开浏览器开发者工具查看
      </div>
      <Editor
        value={build}
        options={{ readOnly: true, language: 'javascript' }}
        className="flex-1"
      />
    </div>
  );
};
