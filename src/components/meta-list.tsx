import { useDraft } from '@/hooks/use-draft';
import { useUrlState } from '@/hooks/use-url-state';
import { Meta, MetaIndex } from '@/types';
import { classnames } from '@/util/classnames';
import { List } from '@fluentui/react';
import { FC, useCallback } from 'react';
import { useHistory } from 'umi';

export const MetaList: FC<{ list: Meta[]; withPaddingX?: boolean }> = ({
  list,
  withPaddingX,
}) => (
  <List
    items={list}
    onRenderCell={(item) => (
      <MetaItem meta={item!} withPaddingX={withPaddingX} key={item?.id} />
    )}
  />
);

const MetaItem: FC<{ meta: Meta; withPaddingX?: boolean }> = ({
  meta,
  withPaddingX,
}) => {
  const [query] = useUrlState({ from: undefined });
  const { setDraftObject } = useDraft();
  const history = useHistory();

  const onClick = useCallback(() => {
    if (query.from === 'dev') {
      fetch(`/meta/${meta.id}/_index.json`)
        .then((response) => response.json())
        .then((metaIndex: MetaIndex) =>
          setDraftObject(
            metaIndex.meta ? { ...metaIndex.meta, id: meta.id } : null,
          ),
        )
        .catch(console.error);
    } else {
      history.push(`/meta/${meta?.id ?? ''}`);
    }
  }, [history, query.from, setDraftObject, meta]);

  return (
    <div
      className={classnames(
        'py-3 border-b border-opacity-40 border-gray-300 hover:bg-gray-50 cursor-pointer',
        withPaddingX ? 'px-6' : undefined,
      )}
      key={meta?.id}
      onClick={onClick}
    >
      <div className="font-medium mb-1 flex justify-between">
        <span>{meta?.name}</span>
        <span className="font-light">#{meta?.id}</span>
      </div>
      <div>{meta?.synopsis}</div>
    </div>
  );
};
