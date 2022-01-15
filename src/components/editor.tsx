import { useBextTheme } from '@/hooks/custom-theme-provider';
import MonacoEditor from '@monaco-editor/react';
import { ComponentProps, FC } from 'react';

export const Editor: FC<ComponentProps<typeof MonacoEditor>> = (props) => {
  const theme = useBextTheme();
  return (
    <MonacoEditor {...props} theme={theme === 'dark' ? 'vs-dark' : 'vs'} />
  );
};
