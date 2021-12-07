import { ReactComponent as DragHandle } from '@/assets/drag-handle.svg';
import { BuildPreview } from '@/components/build-preview';
import { Editor } from '@/components/editor';
import { useDraft } from '@/contexts/use-draft';
import { useTheme } from '@fluentui/react';
import { Resizable } from 're-resizable';
import { FC } from 'react';

const ScriptDev: FC = () => {
  const { draft, setDraft } = useDraft();
  const theme = useTheme();
  return (
    <div className="h-full w-full flex overflow-hidden">
      <Resizable
        defaultSize={{
          width: '70%',
          height: '100%',
        }}
        maxWidth="100%"
        minWidth="450px"
        handleComponent={{
          right: (
            <div
              className="flex items-center h-full"
              style={{ backgroundColor: theme.semanticColors.bodyDivider }}
            >
              <DragHandle />
            </div>
          ),
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <Editor
          value={draft?.source}
          onChange={(source) => setDraft({ source })}
          className="h-full pr-[5px]"
          options={{ language: 'javascript' }}
        />
      </Resizable>
      <div className="w-full pl-4 min-w-[300px]">
        <BuildPreview />
      </div>
    </div>
  );
};

export default ScriptDev;
