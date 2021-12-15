import packageJson from '../../package.json';
import { useDraft } from '@/contexts/use-draft';
import { useMeta } from '@/contexts/use-meta';
import { excuteCompile } from '@/util/compile';
import { DefaultButton, Label, PrimaryButton } from '@fluentui/react';
import { useUnmountedRef } from 'ahooks';
import copy from 'copy-to-clipboard';
import DOMPurify from 'dompurify';
import FileSaver from 'file-saver';
import { cloneDeep, omit } from 'lodash-es';
import { FC, useState } from 'react';

export const ExportDialog: FC = () => {
  const { metaList } = useMeta();
  const { draft, setDraft } = useDraft();
  const [copied, setCopied] = useState(false);
  const unmounted = useUnmountedRef();

  const generate = async () => {
    const { id, name, version, source } = draft!;
    if (id && name && version) {
      try {
        const build = await excuteCompile({
          meta: {
            id,
            name,
            version,
            source: source || '',
          },
        });
        const content = omit(cloneDeep(draft), 'id');
        content.build = build;
        content.detail = DOMPurify.sanitize(content.detail || '');
        setDraft({ detail: content.detail });
        return JSON.stringify(content);
      } catch (error) {
        alert('编译失败，请查看控制台');
      }
    } else {
      alert('请填写完整 ID，名称，版本号');
    }
  };

  const onCopy = async () => {
    const fileContent = await generate();
    if (fileContent) {
      copy(fileContent);
      setCopied(true);
      setTimeout(() => {
        if (!unmounted.current) {
          setCopied(false);
        }
      }, 1000);
    }
  };

  const onDownload = async () => {
    const fileContent = await generate();
    if (fileContent) {
      FileSaver.saveAs(new Blob([fileContent]), `${draft?.id}.json`);
    }
  };

  const onUpload = () => {
    if (metaList.find(({ id }) => id === draft?.id)) {
      window.open(
        `${packageJson.repository.url}/edit/master/meta/${draft?.id}.json`,
      );
    } else {
      window.open(
        `${packageJson.repository.url}/new/master?filename=meta/${draft?.id}.json`,
      );
    }
  };

  return (
    <div>
      <Label>第一步</Label>
      下载或者复制 Json 文件内容（描述了脚本的相关信息，请勿手动修改内容）
      <div className="text-right mt-2">
        <DefaultButton onClick={onDownload}>下载</DefaultButton>
        <PrimaryButton onClick={onCopy} className="ml-2">
          {copied ? '已复制' : '复制'}
        </PrimaryButton>
      </div>
      <Label>第二步</Label>
      点击下方按钮跳转至 Github ，清除已有内容，粘贴上面
      Json文件的内容并提交，请勿修改生成的文件名，另外请覆盖填写提交按钮上方默认的“Create
      xxx.json”输入框，这里的内容将会成为脚本的更新信息
      <div className="text-right mt-2">
        <PrimaryButton onClick={onUpload}>上传</PrimaryButton>
      </div>
    </div>
  );
};
