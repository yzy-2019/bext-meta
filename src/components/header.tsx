import { DevHeader } from './dev-header';
import { useDraftNavigate } from '@/hooks/use-draft';
import { useInDev } from '@/hooks/use-in-dev';
import { usePreference } from '@/hooks/use-preference';
import { Coachmark, DirectionalHint, Pivot, PivotItem } from '@fluentui/react';
import { useResponsive } from 'ahooks';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';

const NormalHeader = () => {
  const location = useLocation();
  const history = useHistory();
  const responsive = useResponsive();
  const route = `/${location.pathname.split('/')[1]}`;
  const {
    preference: { neverShowDevDialog },
    setPreference,
    getPreference,
  } = usePreference();

  const onLinkClick = useCallback(
    (key: string) => {
      history.replace(key);
    },
    [neverShowDevDialog, responsive, history],
  );

  useEffect(() => {
    switch (route) {
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
      <header className="px-6 flex items-center">
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

export const Header: FC = () => {
  useDraftNavigate();
  const inDev = useInDev();
  return inDev ? <DevHeader /> : <NormalHeader />;
};
