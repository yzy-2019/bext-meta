import { useDraft } from '@/contexts/use-draft';
import { useUrlState } from '@/contexts/use-url-state';
import { Meta, MetaIndex } from '@/types';
import { classnames } from '@/util/classnames';
import { config } from '@/util/config';
import { Events, trackEvent } from '@/util/tracker';
import { List, useTheme } from '@fluentui/react';
import { FC, useCallback } from 'react';
import { useHistory } from 'umi';

export const MetaList: FC<{ list: Meta[]; withPaddingX?: boolean }> = ({
  list,
  withPaddingX,
}) =>
  list.length ? (
    <List
      items={list}
      onRenderCell={(item) => (
        <MetaItem meta={item!} withPaddingX={withPaddingX} key={item?.id} />
      )}
    />
  ) : (
    <div className="text-center pt-7">哦豁，暂无脚本哦</div>
  );

const MetaItem: FC<{ meta: Meta; withPaddingX?: boolean }> = ({
  meta,
  withPaddingX,
}) => {
  const theme = useTheme();
  const [query] = useUrlState({ from: undefined });
  const { setDraftObject } = useDraft();
  const history = useHistory();

  const onClick = useCallback(() => {
    if (query.from === 'dev') {
      trackEvent(Events.devModify, meta.id);
      fetch(`${config.metaPrefix}/${meta.id}/_index.json`)
        .then((response) => response.json())
        .then((metaIndex: MetaIndex) => {
          setDraftObject(
            metaIndex.meta
              ? { ...metaIndex.meta, id: meta.id }
              : { type: 'javascript' },
          );
          history.push('/dev/script');
        })
        .catch(console.error);
    } else {
      trackEvent(Events.metaClick, meta.id);
      history.push(`/meta/${meta?.id ?? ''}`);
    }
  }, [history, query.from, setDraftObject, meta]);

  return (
    <div
      className={classnames(
        'py-3 cursor-pointer',
        withPaddingX ? 'px-6' : undefined,
      )}
      style={{
        borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
      }}
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
