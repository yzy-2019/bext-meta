import { ReactComponent as DragHandle } from '@/assets/drag-handle.svg';
import { BuildPreview } from '@/components/build-preview';
import { CompileOptions } from '@/components/compile-options';
import { Editor } from '@/components/editor';
import { useDraft } from '@/hooks/use-draft';
import { Resizable } from 're-resizable';
import { FC } from 'react';

const ScriptDev: FC = () => {
  const { draft, setDraft } = useDraft();
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
            <div className="flex items-center h-full bg-gray-200">
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
          className="h-full"
          options={{ language: 'javascript' }}
        />
      </Resizable>
      <div className="flex flex-col w-full pl-2 min-w-[280px]">
        <CompileOptions />
        <BuildPreview />
      </div>
    </div>
  );
};

export default ScriptDev;
