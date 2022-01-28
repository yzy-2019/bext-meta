import { useDraft } from '@/hooks/use-draft';
import { config } from '@/util/config';
import {
  Link,
  Panel,
  PanelType,
  PrimaryButton,
  Separator,
} from '@fluentui/react';
import Form from '@rjsf/fluent-ui';
import { useBoolean, useEventListener, useUnmount } from 'ahooks';
import { FC, useMemo, useRef } from 'react';

export const ConfigSetting: FC = () => {
  const { draft, setDraft } = useDraft();
  const config = useMemo(
    () => JSON.stringify(draft?.defaultConfig),
    [draft?.defaultConfig],
  );
  const [modalVisible, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  return (
    <div className="p-4">
      <PrimaryButton onClick={showModal}>配置表单</PrimaryButton>
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
      在代码编辑器内通过
      <br />
      <code>import config from '@bext/config'</code>
      <br /> 可以取到配置选项，在下方表单填写默认配置，当前值：
      <code>{config}</code>
      <br />
      具体使用方式也可以查看脚本 #648648 。
      <Separator>以下表单将在用户安装时展示</Separator>
      {draft?.configSchema ? (
        <Form
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
    </div>
  );
};

const SchemaEditor: FC = () => {
  const { draft, setDraft } = useDraft();
  const defaultContent = useMemo(
    () => (draft?.configSchema ? JSON.stringify(draft?.configSchema) : ''),
    [],
  );
  const currentContent = useRef(defaultContent);

  useUnmount(() => {
    try {
      setDraft({ configSchema: JSON.parse(currentContent.current) });
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
