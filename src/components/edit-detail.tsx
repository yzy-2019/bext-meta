import { RichEditor } from './rich-editor';
import { ID_RULE } from '@/constants';
import { useDraft } from '@/contexts/use-draft';
import { useMeta } from '@/contexts/use-meta';
import { Dropdown, Label, Panel, PanelType, TextField } from '@fluentui/react';
import { cloneDeep, set, uniq } from 'lodash-es';
import { FC, useEffect, useMemo, useState } from 'react';

const Content: FC = () => {
  const { draft, setDraft } = useDraft();
  const { tagList } = useMeta();
  const tagOptions = useMemo(
    () =>
      uniq([...tagList.map(({ name }) => name), ...(draft?.tags || [])]).map(
        (tag) => ({
          key: tag,
          text: tag,
        }),
      ),
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
          label="脚本ID"
          value={draft?.id || ''}
          onChange={(_, id = '') => setDraft({ id })}
          errorMessage={
            ID_RULE.test(draft?.id || '') ? undefined : '只允许数字 ID'
          }
        />
        <TextField
          label="脚本名称"
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
        description={`当前将会匹配
        ${
          typeof draft?.match === 'undefined'
            ? '所有网站'
            : `以下网站：${draft.match.join(', ')}`
        }`}
      />
      <Label>详情（支持内联图片，请直接粘贴）</Label>
      <RichEditor
        defaultHtml={draft?.detail}
        onChange={(html) => setDraft({ detail: html })}
      />
      <TextField
        label="X 浏览器元信息"
        multiline
        value={draft?.extra?.xMetaComment || ''}
        onChange={(_, text) => {
          setDraft({
            extra: set(cloneDeep(draft?.extra ?? {}), 'xMetaComment', text),
          });
        }}
        description="专用于 X 浏览器的元信息，填写示例：'// @run-at document-start'（需要注释符号），已自动生成无需在这里填写的：name、namespace、version、description、author、match"
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
