import { Editor } from '@/components/editor';
import { useDraft } from '@/hooks/use-draft';
import { FC, useState } from 'react';

const ScriptDev: FC = () => {
  const { draft, setDraft } = useDraft();
  return (
    <Editor
      value={draft?.source}
      onChange={(source) => setDraft({ source: source })}
      className="h-full"
    />
  );
};

export default ScriptDev;
