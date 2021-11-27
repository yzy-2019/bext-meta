import { Meta } from '@/types';
import { classnames } from '@/util/classnames';
import { List } from '@fluentui/react';
import { FC } from 'react';
import { Link } from 'umi';

export const MetaList: FC<{ list: Meta[]; withPaddingX?: boolean }> = ({
  list,
  withPaddingX,
}) => (
  <List
    items={list}
    onRenderCell={(item) => (
      <Link key={item?.id} to={`/meta/${item?.id ?? ''}`}>
        <div
          className={classnames(
            'py-3 border-b border-opacity-40 border-gray-300 hover:bg-gray-50 cursor-pointer',
            withPaddingX ? 'px-6' : undefined,
          )}
        >
          <div className="font-medium mb-1 flex justify-between">
            <span>{item?.name}</span>
            <span className="font-light">#{item?.id}</span>
          </div>
          <div>{item?.synopsis}</div>
        </div>
      </Link>
    )}
  />
);
