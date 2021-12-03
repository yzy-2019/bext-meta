import { repository } from '../../package.json';
import { EditDetail } from './edit-detail';
import { useDraft } from '@/contexts/use-draft';
import { useInDev } from '@/contexts/use-in-dev';
import { excuteCompile } from '@/util/compile';
import {
  CommandBarButton,
  DefaultButton,
  Dialog,
  DialogType,
  Label,
  PrimaryButton,
} from '@fluentui/react';
import { useBoolean } from 'ahooks';
import DOMPurify from 'dompurify';
import FileSaver from 'file-saver';
import { cloneDeep, omit } from 'lodash-es';
import { FC, useEffect } from 'react';
import { useHistory } from 'umi';

export const DevHeader: FC = () => {
  const history = useHistory();
  const { draft, setDraftObject, saveDraft } = useDraft();
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

  return (
    <>
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

const ExportDialog: FC = () => {
  const { draft, setDraft } = useDraft();
  const onDownload = async () => {
    const { id, name, version, source, options } = draft!;
    if (id && name && version) {
      try {
        const build = await excuteCompile({
          meta: {
            id,
            name,
            version,
            source: source || '',
            options: options,
          },
        });
        const content = omit(cloneDeep(draft), 'id');
        content.build = build;
        content.detail = DOMPurify.sanitize(content.detail || '');
        setDraft({ detail: content.detail });
        FileSaver.saveAs(
          new Blob([JSON.stringify(content)]),
          `${draft?.id}.json`,
        );
      } catch (error) {
        alert('编译失败，请查看控制台');
      }
    } else {
      alert('请填写完整 ID，名称，版本号');
    }
  };

  const onUpload = () => {
    window.open(`${repository.url}/new/master?filename=meta/${draft?.id}.json`);
  };

  return (
    <div>
      <Label>第一步</Label>
      下载 Json 文件（描述了脚本的相关信息，请勿手动修改内容）
      <div className="text-right mt-2">
        <DefaultButton onClick={onDownload}>下载</DefaultButton>
      </div>
      <Label>第二步</Label>
      点击下方按钮跳转至 Github ，粘贴上面
      Json文件的内容并提交，请勿修改生成的文件名
      <div className="text-right mt-2">
        <PrimaryButton onClick={onUpload}>上传</PrimaryButton>
      </div>
    </div>
  );
};
