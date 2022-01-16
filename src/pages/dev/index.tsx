import packageJson from '../../../package.json';
import { IS_MOBILE } from '@/constants';
import { useDraft } from '@/hooks/use-draft';
import { Events, trackEvent } from '@/util/tracker';
import { CompoundButton, Link } from '@fluentui/react';
import { useHistory } from 'umi';

const DevPage = () => {
  const history = useHistory();
  const { cacheDraft, setDraftObject } = useDraft();

  const devPath = IS_MOBILE ? '/dev/script-m' : '/dev/script';
  const gotoDevScript = () => {
    history.push(devPath);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-[300px] p-4">
        !!! 在开始开发之前，请先阅读
        <Link
          href={`${packageJson.repository.url}/blob/master/README.md`}
          underline
          target="_blank"
        >
          开发文档
        </Link>
      </div>
      <CompoundButton
        className="w-52 mt-2"
        primary
        secondaryText={`${
          cacheDraft ? '发现本地草稿' : '本地暂无草稿'
        }（清理缓存、卸载浏览器都会导致草稿丢失哦）`}
        onClick={() => {
          trackEvent(Events.devNew);
          setDraftObject(cacheDraft);
          gotoDevScript();
        }}
        disabled={!cacheDraft}
      >
        载入草稿
      </CompoundButton>
      <CompoundButton
        className="w-52 mt-6"
        primary={!cacheDraft}
        secondaryText="将会覆盖现存的草稿，请谨慎操作"
        onClick={() => {
          trackEvent(Events.devNew);
          setDraftObject({ type: 'javascript' });
          gotoDevScript();
        }}
      >
        创建新脚本
      </CompoundButton>
      <CompoundButton
        className="w-52 mt-6 mb-40"
        secondaryText="将会覆盖现存的草稿，请谨慎操作"
        onClick={() =>
          history.push(`/meta?from=dev&devPath=${encodeURIComponent(devPath)}`)
        }
      >
        修改现有脚本
      </CompoundButton>
    </div>
  );
};
export default DevPage;
