import { RichEditor } from './rich-editor';
import { useDraft } from '@/hooks/use-draft';
import { useMeta } from '@/hooks/use-meta';
import { Dropdown, Label, Panel, PanelType, TextField } from '@fluentui/react';
import { uniq } from 'lodash-es';
import { FC, useMemo } from 'react';

const Content: FC = () => {
  const { draft, setDraft } = useDraft();
  const { tagList } = useMeta();
  const tagOptions = useMemo(
    () =>
      uniq([...tagList, ...(draft?.tags || [])]).map((tag) => ({
        key: tag,
        text: tag,
      })),
    [tagList, draft?.tags],
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="插件ID"
          value={draft?.id || ''}
          onChange={(_, id = '') => setDraft({ id })}
        />
        <TextField
          label="插件名称"
          value={draft?.name || ''}
          onChange={(_, name = '') => setDraft({ name })}
        />
      </div>
      <Dropdown
        className="flex-1"
        label="分类标签"
        multiSelect
        options={tagOptions}
        selectedKeys={draft?.tags || []}
        onChange={(_, item) =>
          setDraft({
            tags: item?.selected
              ? [...(draft?.tags || []), String(item.key)]
              : draft?.tags?.filter((key) => key !== item?.key),
          })
        }
      />
      <TextField
        label="简介"
        multiline
        placeholder="70字以内"
        value={draft?.synopsis || ''}
        onChange={(_, text) => {
          setDraft({ synopsis: text?.slice(0, 70) });
        }}
      />
      <TextField label="匹配规则" placeholder="// TODO" />
      <Label>详情（支持内联图片，请直接粘贴）</Label>
      <RichEditor
        defaultHtml={draft?.detail}
        onChange={(html) => setDraft({ detail: html })}
      />
    </>
  );
};

export const EditDetail: FC<{
  visible: boolean;
  hide: () => void;
}> = ({ visible, hide }) => {
  return (
    <Panel
      isOpen={visible}
      onDismiss={hide}
      type={PanelType.medium}
      headerText="编辑详情"
      styles={{
        commands: {
          zIndex: 10,
        },
        scrollableContent: {
          minHeight: '100%',
        },
      }}
      isLightDismiss
    >
      {visible ? <Content /> : null}
    </Panel>
  );
};
