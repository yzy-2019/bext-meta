import { usePreference } from '@/hooks/use-preference';
import {
  Coachmark,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  DirectionalHint,
  Pivot,
  PivotItem,
  PrimaryButton,
} from '@fluentui/react';
import { useBoolean, useResponsive } from 'ahooks';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';

export const Header: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const responsive = useResponsive();
  const route = `/${location.pathname.split('/')[1]}`;
  const [
    devDialogVisible,
    { setTrue: showDevDialog, setFalse: hideDevDialog },
  ] = useBoolean(false);
  const {
    preference: { neverShowDevDialog },
    setPreference,
    getPreference,
  } = usePreference();

  const onLinkClick = useCallback(
    (key: string) => {
      if (key.startsWith('/dev') && !neverShowDevDialog && !responsive.md) {
        showDevDialog();
        return;
      }
      history.replace(key);
    },
    [neverShowDevDialog, responsive, history],
  );

  const switchToDev = useCallback(() => {
    hideDevDialog();
    history.replace('/dev');
  }, [history]);

  useEffect(() => {
    switch (route) {
      case '/dev':
        setPreference({ neverShowDevDialog: true });
        break;
      case '/about':
        setCoachmarkVisible(false);
        setPreference({ neverShowCoachmark: true });
        break;
      default:
        break;
    }
  }, [route]);

  const aboutRef = useRef(null);
  const [coachmarkVisible, setCoachmarkVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!getPreference().neverShowCoachmark) {
        setCoachmarkVisible(true);
      }
    }, 1000);
  }, []);
  return (
    <>
      <header className="px-6 flex items-center bg-white">
        <span className="text-xl font-extralight mr-4">Bext</span>
        <Pivot
          selectedKey={route}
          onLinkClick={(item) => onLinkClick(item?.props.itemKey || '/')}
        >
          <PivotItem headerText="首页" itemKey="/" />
          <PivotItem headerText="插件" itemKey="/meta" />
          <PivotItem headerText="开发" itemKey="/dev" />
          <PivotItem
            headerText="关于"
            itemKey="/about"
            headerButtonProps={{ elementRef: aboutRef }}
          />
        </Pivot>
      </header>
      <Dialog
        hidden={!devDialogVisible}
        dialogContentProps={{
          type: DialogType.normal,
          title: '切换至开发页面',
          subText:
            '开发页面的布局与功能专为桌面端设计，并且将会下载额外资源，是否确认切换？',
        }}
        onDismiss={hideDevDialog}
      >
        <DialogFooter>
          <PrimaryButton onClick={switchToDev} text="切换并不再提示" />
          <DefaultButton onClick={hideDevDialog} text="取消" />
        </DialogFooter>
      </Dialog>
      {coachmarkVisible ? (
        <Coachmark
          target={aboutRef.current}
          positioningContainerProps={{
            directionalHint: DirectionalHint.bottomCenter,
          }}
        />
      ) : null}
    </>
  );
};
