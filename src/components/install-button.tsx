import { MetaDetailContext } from '@/contexts/meta-detail';
import { browser } from '@/lib';
import { PrimaryButton } from '@fluentui/react';
import { useInterval, useMemoizedFn } from 'ahooks';
import { FC, useContext, useState } from 'react';

type InstallStatus = 'installed' | 'notinstalled' | 'unknown';

export const InstallButton: FC = () => {
  const { currentMeta, metaLoading } = useContext(MetaDetailContext);

  const installedChecker = useMemoizedFn((): InstallStatus => {
    const box = browser.call('installed', currentMeta);
    console.log(box);
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
      console.log(browser.call('uninstall', currentMeta));
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
  };

  return (
    <PrimaryButton className="ml-2" onClick={onClick} disabled={metaLoading}>
      {showUninstall ? '卸载' : '安装此版本'}
    </PrimaryButton>
  );
};
