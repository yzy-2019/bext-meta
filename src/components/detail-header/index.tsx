import packageJson from '../../../package.json';
import { InstallButton } from '../install-button';
import styles from './index.module.less';
import { BextThemeContext } from '@/contexts/custom-theme-provider';
import { MetaDetailContext } from '@/contexts/meta-detail';
import { MetaVersion } from '@/types';
import { classnames } from '@/util/classnames';
import { Events, trackEvent } from '@/util/tracker';
import {
  Checkbox,
  DefaultButton,
  Dropdown,
  IContextualMenuItem,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  ResponsiveMode,
  useTheme,
} from '@fluentui/react';
import Editor from '@monaco-editor/react';
import { useBoolean, useLocalStorageState } from 'ahooks';
import dayjs from 'dayjs';
import { FC, useContext, useMemo, useState } from 'react';

const DROPDOWN_ITEM_STYLE = { height: 'auto' };

export const DetailHeader: FC = () => {
  const { currentMeta, currentVersion, versions, setVersion } =
    useContext(MetaDetailContext);
  const theme = useTheme();

  const [reviewVisible, { setFalse: hideReview, setTrue: showReview }] =
    useBoolean(false);
  const [reviewKey, setReviewKey] = useState('source');
  const [monaco, setMonaco] = useLocalStorageState('BEXT.DETAIL_MONACO', {
    defaultValue: false,
  });
  const bextTheme = useContext(BextThemeContext);

  const onMenuClick = (item?: IContextualMenuItem) => {
    switch (item?.key) {
      case 'review':
        trackEvent(Events.metaReview, currentMeta?.id);
        showReview();
        break;
      case 'report':
        trackEvent(Events.metaReport, currentMeta?.id);
        const title = encodeURIComponent(
          `[Report] Meta ${currentMeta?.name}#${currentMeta?.id}`,
        );
        const body = encodeURIComponent(`
请前往 ${packageJson.repository.url}/commits/master/meta/${currentMeta?.id}.json
选择一位或者多位你认为能解决你问题的脚本作者，并在问题描述之后 at
问题描述：`);
        window.open(
          `${packageJson.repository.url}/issues/new?title=${title}&body=${body}`,
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <Dropdown
          className="min-w-[30%]"
          styles={{
            dropdownItem: DROPDOWN_ITEM_STYLE,
            dropdownItemSelected: DROPDOWN_ITEM_STYLE,
          }}
          selectedKey={currentVersion}
          responsiveMode={ResponsiveMode.small}
          onRenderOption={(opt) => <VersionOption version={opt?.data} />}
          options={
            versions?.map((version) => ({
              key: version.hash,
              text: version.version || version.hash.slice(0, 7),
              data: version,
            })) || []
          }
          onChange={(_, option) => {
            trackEvent(Events.metaSwitchVersion, currentMeta?.id);
            setVersion?.(option?.data.hash);
          }}
        />
        <div>
          <DefaultButton
            menuProps={{
              items: [
                {
                  key: 'review',
                  text: '查看代码',
                  iconProps: { iconName: 'RedEye' },
                },
                {
                  key: 'report',
                  text: '报告问题',
                  iconProps: { iconName: 'Bug' },
                },
              ],
              onItemClick: (_, item) => onMenuClick(item),
            }}
          >
            更多
          </DefaultButton>
          <InstallButton />
        </div>
      </div>
      <Panel
        isOpen={reviewVisible}
        onDismiss={hideReview}
        isLightDismiss
        onRenderNavigationContent={(props, render) => (
          <div
            className="flex w-full pl-6 items-center"
            style={{ backgroundColor: theme.semanticColors.bodyBackground }}
          >
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
            <div className={classnames(styles.closeButton, 'h-full pl-2')}>
              {render?.(props)}
            </div>
          </div>
        )}
        styles={{
          scrollableContent: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
          content: { flex: 1, padding: 0 },
        }}
        type={PanelType.extraLarge}
      >
        {monaco ? (
          <Editor
            value={(currentMeta as any)?.[reviewKey]}
            options={{
              readOnly: true,
            }}
            className="h-full"
            language={reviewKey === 'detail' ? 'html' : 'javascript'}
            theme={bextTheme === 'light' ? 'vs' : 'vs-dark'}
          />
        ) : (
          <div className="overflow-x-auto text-xs pt-4 pl-4">
            <code className="whitespace-pre">
              {(currentMeta as any)?.[reviewKey]}
            </code>
          </div>
        )}
      </Panel>
    </>
  );
};

const VersionOption: FC<{ version: MetaVersion }> = ({ version }) => {
  const date = useMemo(
    () => dayjs.unix(version.date).format('YY/MM/DD HH:mm'),
    [version.date],
  );
  return (
    <div className="py-3">
      <div className="font-semibold text-base">
        {version.version} <span className="font-normal"> by </span>
        {version.author_name}
      </div>
      <div className="text-xs text-gray-400">发布于 {date}</div>
      <div>{version.message}</div>
    </div>
  );
};
