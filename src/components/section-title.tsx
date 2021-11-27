import { FC } from 'react';

export const SectionTitle: FC = ({ children }) => {
  return (
    <div className="font-semibold mt-6 mb-3 text-base leading-none border-l-[2.5px] border-gray-800 pl-2">
      {children}
    </div>
  );
};
