import { Editor } from './editor';
import { useDraft } from '@/contexts/use-draft';
import { excuteCompile } from '@/util/compile';
import { Label } from '@fluentui/react';
import { useDebounceEffect } from 'ahooks';
import dayjs from 'dayjs';
import { FC, useState } from 'react';

export const BuildPreview: FC = () => {
  const [build, setBuild] = useState<string>();
  const { draft } = useDraft();

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
      <Label className="text-base">脚本预览</Label>
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
