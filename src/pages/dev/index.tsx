import { useDraft } from '@/hooks/use-draft';
import { CompoundButton } from '@fluentui/react';
import { useHistory } from 'umi';

const DevPage = () => {
  const history = useHistory();
  const { cacheDraft, setDraftObject } = useDraft();
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <CompoundButton
        className="w-52"
        primary
        secondaryText={`${
          cacheDraft ? '发现本地草稿' : '本地暂无草稿'
        }（清理缓存、卸载浏览器都会导致草稿丢失哦）`}
        onClick={() => setDraftObject(cacheDraft)}
        disabled={!cacheDraft}
      >
        载入草稿
      </CompoundButton>
      <CompoundButton
        className="w-52 mt-6"
        primary={!cacheDraft}
        secondaryText="将会覆盖现存的草稿，请谨慎操作"
        onClick={() => setDraftObject({ type: 'javascript' })}
      >
        创建新插件
      </CompoundButton>
      <CompoundButton
        className="w-52 mt-6 mb-40"
        secondaryText="将会覆盖现存的草稿，请谨慎操作"
        onClick={() => history.push('/meta?from=dev')}
      >
        修改现有插件
      </CompoundButton>
    </div>
  );
};
export default DevPage;
