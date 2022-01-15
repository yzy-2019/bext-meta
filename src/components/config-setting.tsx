import { Editor } from './editor';
import { useDraft } from '@/hooks/use-draft';
import { Link } from '@fluentui/react';
import Form from '@rjsf/fluent-ui';
import { useUpdateEffect } from 'ahooks';
import { FC, useMemo, useState } from 'react';

export const ConfigSchema: FC = () => {
  const { draft, setDraft } = useDraft();
  const [schemaText, setSchemaText] = useState(() =>
    draft?.configSchema ? JSON.stringify(draft.configSchema, null, 4) : '',
  );

  useUpdateEffect(() => {
    try {
      setDraft({
        configSchema: schemaText.trim().length
          ? JSON.parse(schemaText)
          : undefined,
        defaultConfig: undefined,
      });
    } catch (error) {
      console.log('json 格式错误');
    }
  }, [schemaText]);

  return (
    <div className="h-full flex flex-col">
      <div className="py-3">
        请先点击前往
        <Link
          href="https://hellosean1025.github.io/json-schema-visual-editor/"
          underline
          target="_blank"
        >
          这里
        </Link>
        配置该脚本的安装选项，右边内容粘贴到最下面的编辑器中，然后前往“默认配置”
        Tab 配置默认值。
      </div>
      <Editor
        value={schemaText}
        onChange={(value) => setSchemaText(value || '')}
        language="json"
        className="flex-1 min-h-[300px]"
      />
    </div>
  );
};

export const DefaultConfig: FC = () => {
  const { draft, setDraft } = useDraft();
  const config = useMemo(
    () => JSON.stringify(draft?.defaultConfig),
    [draft?.defaultConfig],
  );
  return (
    <div className="p-4">
      在代码编辑器内通过
      <br />
      <code>import config from '@bext/config'</code>
      <br /> 可以取到配置选项，当前默认的配置为
      <code>{config}</code>
      <br />
      具体使用方式也可以查看脚本 #648648 。以下表单将会在用户安装时展示：
      {draft?.configSchema ? (
        <Form
          schema={draft.configSchema}
          omitExtraData
          liveOmit
          formData={draft.defaultConfig}
          onChange={({ formData }) => setDraft({ defaultConfig: formData })}
          liveValidate
        >
          <></>
        </Form>
      ) : null}
    </div>
  );
};
