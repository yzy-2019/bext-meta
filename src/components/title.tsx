import { useTheme } from '@fluentui/react';
import { FC } from 'react';

export const Title: FC = ({ children }) => {
  const theme = useTheme();
  return (
    <div
      className="font-semibold mt-6 mb-3 text-base leading-none pl-2"
      style={{ borderLeft: `2.5px solid ${theme.palette.neutralDark}` }}
    >
      {children}
    </div>
  );
};
