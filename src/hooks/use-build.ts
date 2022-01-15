import { useDraft } from '@/hooks/use-draft';
import { excuteCompile } from '@/util/compile';
import { useDebounceEffect } from 'ahooks';
import dayjs from 'dayjs';
import { useState } from 'react';

export const useBuild = () => {
  const { draft } = useDraft();
  const [build, setBuild] = useState<string>();

  useDebounceEffect(
    () => {
      if (draft) {
        const { id, name, version, source, defaultConfig } = draft;
        if (id && name && version && source) {
          console.log(`[compile] start at ${dayjs().format('HH:mm:ss')} ==`);

          excuteCompile({
            meta: {
              id,
              name,
              version,
              source,
              defaultConfig,
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
    [
      draft?.id,
      draft?.name,
      draft?.version,
      draft?.source,
      draft?.defaultConfig,
    ],
    {
      wait: 1000,
    },
  );

  return build;
};
