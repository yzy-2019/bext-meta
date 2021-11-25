import { identity } from 'lodash-es';

// replace https://github.com/JedWatson/classnames
export const classnames = (...cn: (string | undefined)[]) =>
  cn.filter(identity).join(' ');
