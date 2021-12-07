import { BextThemeContext } from '@/contexts/custom-theme-provider';
import { classnames } from '@/util/classnames';
import { Spinner, useTheme } from '@fluentui/react';
import { useDebounce, usePersistFn } from 'ahooks';
import { noop } from 'lodash-es';
import type {
  IDisposable,
  editor as IEditor,
} from 'monaco-editor/esm/vs/editor/editor.api';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  className?: string;
  value?: string;
  onChange?: (code: string) => void;
  options?: IEditor.IStandaloneEditorConstructionOptions;
}

interface EditorState {
  subscription: IDisposable | null;
  editor: IEditor.IStandaloneCodeEditor | null;
}

export const Editor: FC<Props> = ({
  className,
  value = '',
  onChange = noop,
  options,
}) => {
  const theme = useContext(BextThemeContext);
  const fluentTheme = useTheme();

  const persistOnChange = usePersistFn(onChange);
  const getLatestValue = usePersistFn(() => value);
  const getLatestOptions = usePersistFn(() => options);
  const getLatestTheme = usePersistFn(() => theme);

  const [editorState, setEditorState] = useState<EditorState>({
    subscription: null,
    editor: null,
  });
  const ref = useRef<HTMLIFrameElement>(null);

  const onFrameLoad = useCallback(() => {
    const { monaco, container } = ref.current?.contentWindow as any;
    const editor = monaco.editor.create(container, {
      ...getLatestOptions(),
      automaticLayout: true,
      theme: getLatestTheme() ? 'vs' : 'vs-dark',
    });
    if (editor) {
      setEditorState({
        editor,
        subscription: editor.onDidChangeModelContent(() => {
          const currentValue = editor.getValue();
          if (currentValue !== getLatestValue()) {
            persistOnChange(currentValue);
          }
        }),
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      const { editor, subscription } = editorState;
      editor?.dispose();
      editor?.getModel()?.dispose();
      subscription?.dispose();
    };
  }, [editorState]);

  useEffect(() => {
    if (editorState.editor) {
      const { editor } = editorState;
      if (editor.getOption(80)) {
        editor.setValue(value);
      } else {
        if (value !== editor.getValue()) {
          editor.executeEdits('', [
            {
              range: editor.getModel()!.getFullModelRange(),
              text: value,
              forceMoveMarkers: true,
            },
          ]);
          editor.pushUndoStop();
        }
      }
    }
  }, [value, editorState]);

  useEffect(() => {
    if (editorState.editor) {
      editorState.editor.updateOptions({
        theme: theme === 'light' ? 'vs' : 'vs-dark',
      });
    }
  }, [theme, editorState]);

  const spinnerVisibe = useDebounce(!editorState.editor, {
    wait: 500,
  });

  return (
    <div className={classnames(className, 'w-full h-full relative')}>
      <iframe
        ref={ref}
        title="editor"
        src="/html/editor.html"
        className="w-full h-full"
        onLoad={onFrameLoad}
      />
      {spinnerVisibe ? (
        <Spinner
          label="加载编辑器 ..."
          className="absolute top-0 right-0 bottom-0 left-0"
          style={{ backgroundColor: fluentTheme.semanticColors.bodyBackground }}
        />
      ) : null}
    </div>
  );
};
