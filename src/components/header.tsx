import { DevHeader } from './dev-header';
import { useInDev } from '@/contexts/use-in-dev';
import { usePreference } from '@/contexts/use-preference';
import { Coachmark, DirectionalHint, Pivot, PivotItem } from '@fluentui/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';

const NormalHeader = () => {
  const location = useLocation();
  const history = useHistory();
  const route = `/${location.pathname.split('/')[1]}`;
  const { setPreference, getPreference } = usePreference();

  const onLinkClick = useCallback(
    (key: string) => {
      history.replace(key);
    },
    [history],
  );

  useEffect(() => {
    switch (route) {
      case '/more':
        setCoachmarkVisible(false);
        setPreference({ neverShowCoachmark: true });
        break;
      default:
        break;
    }
  }, [route]);

  const moreRef = useRef(null);
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
          <PivotItem headerText="脚本" itemKey="/meta" />
          <PivotItem headerText="开发" itemKey="/dev" />
          <PivotItem
            headerText="更多"
            itemKey="/more"
            headerButtonProps={{ elementRef: moreRef }}
          />
        </Pivot>
      </header>
      {coachmarkVisible ? (
        <Coachmark
          target={moreRef.current}
          positioningContainerProps={{
            directionalHint: DirectionalHint.bottomCenter,
          }}
        />
      ) : null}
    </>
  );
};

export const Header: FC = () => {
  const inDev = useInDev();
  return inDev ? <DevHeader /> : <NormalHeader />;
};
