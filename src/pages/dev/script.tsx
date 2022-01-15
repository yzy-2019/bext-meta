import styles from './index.less';
import { ReactComponent as DragHandle } from '@/assets/drag-handle.svg';
import { BuildPreview } from '@/components/build-preview';
import { ConfigSchema, DefaultConfig } from '@/components/config-setting';
import { Editor } from '@/components/editor';
import { useDraft } from '@/hooks/use-draft';
import { classnames } from '@/util/classnames';
import { Pivot, PivotItem, useTheme } from '@fluentui/react';
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
          onChange={(source) => setDraft({ source: source || '' })}
          className="h-full pr-[5px]"
          language="javascript"
        />
      </Resizable>
      <div className="w-full pl-4 min-w-[300px]">
        <Pivot className={classnames('h-full flex flex-col', styles.pivot)}>
          <PivotItem headerText="预览" className="h-full">
            <BuildPreview />
          </PivotItem>
          <PivotItem headerText="配置表单" className="h-full">
            <ConfigSchema />
          </PivotItem>
          <PivotItem headerText="默认配置" className="h-full">
            <DefaultConfig />
          </PivotItem>
        </Pivot>
      </div>
    </div>
  );
};

export default ScriptDev;
