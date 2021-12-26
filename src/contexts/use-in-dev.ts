import { useRouteMatch } from 'umi';

export const useInDev = () => !!useRouteMatch('/dev/:type');
