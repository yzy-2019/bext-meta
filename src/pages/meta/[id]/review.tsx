import { useBextTheme } from '@/hooks/custom-theme-provider';
import { useMetaDetail } from '@/hooks/use-meta-detail';
import { Events, trackEvent } from '@/util/tracker';
import {
  Checkbox,
  CommandBarButton,
  Pivot,
  PivotItem,
  useTheme,
} from '@fluentui/react';
import Editor from '@monaco-editor/react';
import { useLocalStorageState, useMount } from 'ahooks';
import { FC, useContext, useState } from 'react';
import { useHistory } from 'umi';

const MetaReview: FC = () => {
  useMount(() => {
    trackEvent(Events.metaReview, currentMeta?.id);
  });

  const { currentMeta } = useMetaDetail();
  const theme = useTheme();

  const [reviewKey, setReviewKey] = useState('source');
  const [monaco, setMonaco] = useLocalStorageState('BEXT.DETAIL_MONACO', {
    defaultValue: false,
  });
  const bextTheme = useBextTheme();
  const history = useHistory();

  return (
    <>
      <header
        className="px-3 flex items-center justify-between"
        style={{
          borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
        }}
      >
        <CommandBarButton
          text="返回"
          iconProps={{ iconName: 'ChevronLeft' }}
          className="h-8 mr-2"
          onClick={() => {
            history.replace(`/meta/${currentMeta?.id}`);
          }}
        />
        <Pivot
          headersOnly
          selectedKey={reviewKey}
          onLinkClick={(item) =>
            item && setReviewKey(item.props.itemKey || 'source')
          }
          className="flex-1"
        >
          <PivotItem headerText="Source" itemKey="source" />
          <PivotItem headerText="Build" itemKey="build" />
          <PivotItem headerText="Detail" itemKey="detail" />
        </Pivot>
        <Checkbox
          key={String(monaco)}
          label="Monaco"
          checked={monaco}
          onChange={() => setMonaco(!monaco)}
        />
      </header>
      {monaco ? (
        <Editor
          value={(currentMeta as any)?.[reviewKey]}
          options={{
            readOnly: true,
          }}
          className="h-full z-10"
          language={reviewKey === 'detail' ? 'html' : 'javascript'}
          theme={bextTheme === 'light' ? 'vs' : 'vs-dark'}
        />
      ) : (
        <div className="p-4 overflow-auto flex-1">
          <code className="whitespace-pre text-xs">
            {(currentMeta as any)?.[reviewKey]}
          </code>
        </div>
      )}
    </>
  );
};

export default MetaReview;
