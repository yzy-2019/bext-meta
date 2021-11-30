import { useDraft } from '@/hooks/use-draft';
import { Checkbox, Label } from '@fluentui/react';
import { FC } from 'react';

export const CompileOptions: FC = () => {
  const { draft, setDraft } = useDraft();

  return (
    <div className="pt-2">
      <Label className="text-base">编译选项</Label>
      <Checkbox
        onRenderLabel={() => <>脚本增强（详情查看文档）</>}
        checked={!!draft?.options}
        onChange={() => {
          setDraft({ options: draft?.options ? undefined : {} });
        }}
      />
      <Checkbox
        className="mt-2"
        onRenderLabel={() => <>Preact jsx 语法支持（实验性）</>}
        disabled={!draft?.options}
        checked={!!draft?.options?.preact}
        onChange={() => {
          setDraft({
            options: {
              ...draft?.options,
              preact: !draft?.options?.preact,
            },
          });
        }}
      />
    </div>
  );
};
