import { MetaDetailContext } from '@/contexts/meta-detail';
import { browser } from '@/lib';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
} from '@fluentui/react';
import { useBoolean, useInterval, useMemoizedFn } from 'ahooks';
import { FC, useContext, useState } from 'react';

type InstallStatus = 'installed' | 'notinstalled' | 'unknown';

export const InstallButton: FC = () => {
  const { currentMeta, metaLoading } = useContext(MetaDetailContext);
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

  const onClick = () => {
    if (showUninstall) {
      console.log(
        browser.call('uninstall', {
          ...currentMeta,
          author: `bext/${currentMeta?.id}`,
        }),
      );
    } else if (browser.support('install')) {
      console.log(
        browser.call('install', {
          ...currentMeta,
          author: `bext/${currentMeta?.id}`,
        }),
      );
    } else {
      alert('你的浏览器不支持安装');
    }
    hideComfirm();
  };

  return (
    <PrimaryButton
      className="ml-2"
      onClick={showUninstall ? onClick : showConfirm}
      disabled={metaLoading}
    >
      {showUninstall ? '卸载' : '安装此版本'}
      <Dialog
        hidden={!confirmVisible}
        dialogContentProps={{
          title: '确认安装',
          subText:
            '本站仅作为脚本的托管站点，不对脚本的内容、版权进行审核，并且在安装后出现的任何情况均与本站无关',
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={onClick} text="同意并安装" />
          <DefaultButton onClick={hideComfirm} text="取消" />
        </DialogFooter>
      </Dialog>
    </PrimaryButton>
  );
};
