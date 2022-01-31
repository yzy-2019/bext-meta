import { Editor } from './editor';
import { DEFAULT_SCHEMA } from '@/constants';
import { useDraft } from '@/hooks/use-draft';
import { config } from '@/util/config';
import { Link, Panel, PanelType, Separator, Toggle } from '@fluentui/react';
import Form from '@rjsf/fluent-ui';
import { useBoolean, useCounter, useEventListener, useUnmount } from 'ahooks';
import { FC, useEffect, useMemo, useRef } from 'react';

export const ConfigSetting: FC = () => {
  const [formKey, { inc: resetForm }] = useCounter(0);
  const { draft, setDraft } = useDraft();
  const [modalVisible, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  useEffect(() => {
    if (!modalVisible) {
      resetForm();
    }
  }, [modalVisible]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Toggle
          label="启用安装配置"
          inlineLabel
          checked={!!draft?.configSchema}
          className="mb-0"
          onChange={() =>
            setDraft({
              configSchema: draft?.configSchema ? undefined : DEFAULT_SCHEMA,
              defaultConfig: undefined,
            })
          }
        />
        {draft?.configSchema ? <Link onClick={showModal}>配置表单</Link> : null}
      </div>
      {draft?.configSchema ? (
        <>
          <Panel
            isOpen={modalVisible}
            onDismiss={hideModal}
            type={PanelType.smallFluid}
            headerText="配置表单"
            styles={{
              content: {
                padding: 0,
                flex: 1,
              },
              scrollableContent: {
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
            isLightDismiss
          >
            {modalVisible ? <SchemaEditor /> : null}
          </Panel>
          <Editor
            value={`// 使用示例
import config from '@bext/config';
console.log(config);
/* config = ${JSON.stringify(draft.defaultConfig, null, 2)}
具体使用方式可查看
https://bext.ketra.fun/meta/648648
*/
`}
            height="200px"
            language="javascript"
            options={{
              readOnly: true,
              lineNumbers: 'off',
              minimap: { enabled: false },
              folding: false,
            }}
          />

          <Separator>配置默认值</Separator>
          {draft?.configSchema ? (
            <Form
              key={String(formKey)}
              schema={draft.configSchema}
              omitExtraData
              liveOmit
              formData={draft.defaultConfig}
              onChange={({ formData }) => setDraft({ defaultConfig: formData })}
              liveValidate
              className="overflow-auto"
            >
              <></>
            </Form>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

const SchemaEditor: FC = () => {
  const { draft, setDraft } = useDraft();
  const defaultContent = useMemo(
    () => JSON.stringify(draft?.configSchema || {}),
    [],
  );
  const currentContent = useRef(defaultContent);

  useUnmount(() => {
    try {
      setDraft({
        configSchema: JSON.parse(currentContent.current),
        defaultConfig: undefined,
      });
    } catch (error) {}
  });

  const ref = useRef<HTMLIFrameElement>(null);

  useEventListener('message', ({ data }) => {
    switch (data?.type) {
      case 'jse/init':
        ref.current?.contentWindow?.postMessage(
          { type: 'jse/set', payload: defaultContent },
          '*',
        );
        break;
      case 'jse/content':
        currentContent.current = data.payload;
        break;
      default:
        break;
    }
  });

  return <iframe src={config.jse} ref={ref} className="w-full h-full" />;
};
