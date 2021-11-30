import { RichEditor } from './rich-editor';
import { ID_RULE } from '@/constants';
import { useDraft } from '@/contexts/use-draft';
import { useMeta } from '@/contexts/use-meta';
import { Dropdown, Label, Panel, PanelType, TextField } from '@fluentui/react';
import { uniq } from 'lodash-es';
import { FC, useEffect, useMemo, useState } from 'react';

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

  const [matchInput, setMatchInput] = useState(
    () => draft?.match?.join('@@') || '',
  );
  useEffect(() => {
    setDraft({
      match: matchInput
        ? matchInput.split('@@').filter((rule) => rule)
        : undefined,
    });
  }, [matchInput, setDraft]);

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <TextField
          label="插件ID"
          value={draft?.id || ''}
          onChange={(_, id = '') => setDraft({ id })}
          errorMessage={
            ID_RULE.test(draft?.id || '')
              ? undefined
              : '字母、数字、中/下划线组合'
          }
        />
        <TextField
          label="插件名称"
          value={draft?.name || ''}
          onChange={(_, name = '') => setDraft({ name })}
        />
        <TextField
          label="版本"
          value={draft?.version || ''}
          onChange={(_, version = '') => setDraft({ version })}
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
      <TextField
        label="匹配规则（使用 @@ 分隔，匹配所有请留空）"
        value={matchInput}
        onChange={(_, text) => setMatchInput(text || '')}
      />
      <div>
        当前将会匹配
        {typeof draft?.match === 'undefined'
          ? '所有网站'
          : `以下网站：${draft.match.join(', ')}`}
      </div>
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
