import { classnames } from '@/util/classnames';
import { FC } from 'react';

export const SectionTitle: FC<{ small?: boolean }> = ({ children, small }) => {
  return (
    <div
      className={classnames(
        'font-semibold mt-4 mb-2',
        small ? 'text-base' : 'text-lg',
      )}
    >
      {children}
    </div>
  );
};
