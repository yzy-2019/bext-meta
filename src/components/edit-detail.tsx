import { useDraft } from '@/hooks/use-draft';
import { useMeta } from '@/hooks/use-meta';
import { Dropdown, Label, Panel, PanelType, TextField } from '@fluentui/react';
import { useSet } from 'ahooks';
import { uniq } from 'lodash-es';
import { FC, KeyboardEvent, useMemo, useState } from 'react';

const Content: FC = () => {
  const { draft, setDraft } = useDraft();
  const { tagList } = useMeta();
  const [customTags, { add: addTag }] = useSet<string>([]);
  const tagOptions = useMemo(
    () =>
      uniq([...tagList, ...customTags, ...(draft?.tags || [])]).map((tag) => ({
        key: tag,
        text: tag,
      })),
    [tagList, customTags, draft?.tags],
  );

  const onAddTagKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code.toLowerCase() === 'enter') {
      const value = e.currentTarget.value;
      addTag(value);
      setDraft({
        tags: uniq([...(draft?.tags || []), String(value)]),
      });
      e.currentTarget.value = '';
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="插件ID"
          value={draft?.id}
          onChange={(_, id = '') => setDraft({ id })}
        />
        <TextField
          label="插件名称"
          value={draft?.name}
          onChange={(_, name = '') => setDraft({ name })}
        />
      </div>
      <div className="flex items-end">
        <Dropdown
          className="flex-1"
          label="分类标签"
          multiSelect
          options={tagOptions}
          selectedKeys={draft?.tags}
          onChange={(_, item) =>
            setDraft({
              tags: item?.selected
                ? [...(draft?.tags || []), String(item.key)]
                : draft?.tags?.filter((key) => key !== item?.key),
            })
          }
        />
        <TextField
          placeholder="回车添加自定义标签"
          className="ml-4"
          onKeyDown={onAddTagKeydown}
        />
      </div>
      <TextField
        label="简介"
        multiline
        placeholder="70字以内"
        value={draft?.synopsis}
        onChange={(_, text) => {
          setDraft({ synopsis: text?.slice(0, 70) });
        }}
      />
      <TextField label="匹配规则" placeholder="// TODO" />
      <Label>详情</Label>
      // TODO
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
    >
      {visible ? <Content /> : null}
    </Panel>
  );
};
