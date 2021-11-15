import 'tailwindcss/tailwind.css';
import { IRouteComponentProps } from 'umi';
import { ThemeProvider, initializeIcons } from '@fluentui/react';
import { CommonProvider } from '@/hooks';
import { Header } from '@/components/header';
import './index.less';

initializeIcons(
  'https://static2.sharepointonline.com/files/fabric/assets/icons/',
);

export default function Layout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  return (
    <ThemeProvider>
      <CommonProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </CommonProvider>
    </ThemeProvider>
  );
}
