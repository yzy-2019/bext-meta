import { Editor } from './editor';
import { useDraft } from '@/hooks/use-draft';
import { Label } from '@fluentui/react';
import { FC } from 'react';

export const BuildPreview: FC = () => {
  const { draft } = useDraft();
  return (
    <div className="flex-1">
      <Label>脚本预览</Label>
      <Editor
        value={draft?.build}
        options={{ readOnly: true, language: 'javascript' }}
      />
    </div>
  );
};
