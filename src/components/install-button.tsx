import { ConfigInstall } from './config-install';
import { useMetaDetail } from '@/hooks/use-meta-detail';
import { browser } from '@/lib';
import { Events, trackEvent } from '@/util/tracker';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
} from '@fluentui/react';
import { useBoolean, useInterval, useMemoizedFn } from 'ahooks';
import { FC, useState } from 'react';

type InstallStatus = 'installed' | 'notinstalled' | 'unknown';

export const InstallButton: FC = () => {
  const { currentMeta, metaLoading } = useMetaDetail();
  const [confirmVisible, { setTrue: showConfirm, setFalse: hideComfirm }] =
    useBoolean(false);

  const installedChecker = useMemoizedFn((): InstallStatus => {
    const box = browser.call('installed', currentMeta);
    if (box.code === 0) {
      return box.result ? 'installed' : 'notinstalled';
    }
    return 'unknown';
  });

  const [installStatus, setInstallStatus] = useState(installedChecker);

  useInterval(() => {
    setInstallStatus(installedChecker);
  }, 1000);

  const showUninstall =
    installStatus === 'installed' && browser.support('uninstall');

  const onUninstall = () => {
    trackEvent(Events.metaUninstall, currentMeta?.id);
    console.log(
      browser.call('uninstall', {
        ...currentMeta,
        author: `bext/${currentMeta?.id}`,
      }),
    );
  };

  const onInstall = (build?: string) => {
    hideComfirm();
    trackEvent(Events.metaInstallSuccess, currentMeta?.id);
    console.log(
      browser.call('install', {
        ...currentMeta,
        author: `bext/${currentMeta?.id}`,
        ...(build ? { build } : undefined),
      }),
    );
  };

  return showUninstall ? (
    <PrimaryButton
      className="ml-2"
      onClick={onUninstall}
      disabled={metaLoading}
    >
      卸载
    </PrimaryButton>
  ) : (
    <PrimaryButton
      className="ml-2"
      onClick={() => {
        trackEvent(Events.metaInstallClick, currentMeta?.id);
        if (browser.support('install')) {
          showConfirm();
        } else {
          alert('你的浏览器不支持安装');
        }
      }}
      disabled={metaLoading}
    >
      安装此版本
      <Dialog
        hidden={!confirmVisible}
        dialogContentProps={{
          title: '确认安装',
          subText:
            '安装即表示您已了解并同意：脚本有权限访问、修改、上传您在网站和系统上的一些信息，使用该内容造成的一切后果均与本站无关；安装成功后对脚本进行二次发布、共享请先获得作者授权。',
        }}
        onDismiss={hideComfirm}
      >
        <DialogFooter>
          {currentMeta?.configSchema ? (
            <ConfigInstall onInstall={onInstall} />
          ) : (
            <PrimaryButton onClick={() => onInstall()} text="同意并安装" />
          )}
          <DefaultButton onClick={hideComfirm} text="取消" />
        </DialogFooter>
      </Dialog>
    </PrimaryButton>
  );
};
