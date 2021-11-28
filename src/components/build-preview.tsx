import { Editor } from './editor';
import { useDraft } from '@/hooks/use-draft';
import { excuteCompile, workerReady } from '@/util/compile';
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
        const { id, name, version, source } = draft;
        if (id && name && version && source) {
          console.log(`[compile] start at ${dayjs().format('HH:mm:ss')} ==`);

          workerReady.then(() => {
            excuteCompile({
              meta: {
                id,
                name,
                version,
                source,
                options: {},
              },
            }).then((build) => {
              console.log('[compile] end');
              setBuild(build);
            });
          });
        } else {
          console.log('[compile] 请填写完整 ID，名称，版本');
        }
      }
    },
    [draft?.id, draft?.name, draft?.version, draft?.source],
    {
      wait: 1000,
    },
  );

  return (
    <div className="flex-1">
      <Label>脚本预览（错误、警告在开发者工具查看）</Label>
      <Editor
        value={build}
        options={{ readOnly: true, language: 'javascript' }}
      />
    </div>
  );
};
