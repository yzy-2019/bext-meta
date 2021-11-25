import { classnames } from '@/util/classnames';
import { Spinner } from '@fluentui/react';
import { usePersistFn } from 'ahooks';
import { noop } from 'lodash-es';
import type {
  IDisposable,
  editor,
} from 'monaco-editor/esm/vs/editor/editor.api';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  className?: string;
  value?: string;
  onChange?: (code: string) => void;
}

interface EditorState {
  subscription: IDisposable | null;
  editor: editor.IStandaloneCodeEditor | null;
}

export const Editor: FC<Props> = ({
  className,
  value = '',
  onChange = noop,
}) => {
  const persistOnChange = usePersistFn(onChange);
  const getLatestValue = usePersistFn(() => value);

  const [editorState, setEditorState] = useState<EditorState>({
    subscription: null,
    editor: null,
  });
  const ref = useRef<HTMLIFrameElement>(null);

  const onFrameLoad = useCallback(() => {
    const editor = (ref.current?.contentWindow as any)
      ?.editorInstance as EditorState['editor'];

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

  return (
    <div className={classnames(className, 'w-full h-full relative')}>
      <iframe
        ref={ref}
        title="editor"
        src="/html/editor.html"
        className="w-full h-full"
        onLoad={onFrameLoad}
      />
      {editorState.editor ? null : (
        <Spinner
          label="加载编辑器 ..."
          className="absolute top-0 right-0 bottom-0 left-0"
        />
      )}
    </div>
  );
};
