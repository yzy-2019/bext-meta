import { useDraft } from '@/hooks/use-draft';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { FC } from 'react';

const ScriptMDev: FC = () => {
  const { draft, setDraft } = useDraft();
  return (
    <CodeMirror
      value={draft?.source}
      extensions={[javascript({ jsx: true })]}
      onChange={(source) => setDraft({ source })}
      height="calc(100vh - 48px)"
    />
  );
};

export default ScriptMDev;
