import { useDraft } from '@/contexts/use-draft';
import { Events, trackEvent } from '@/util/tracker';
import { CompoundButton } from '@fluentui/react';
import { useHistory } from 'umi';

const DevPage = () => {
  const history = useHistory();
  const { cacheDraft, setDraftObject } = useDraft();
  const gotoDevScript = () => {
    history.push('/dev/script');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-[300px] pt-4">
        !!! 在开始开发之前，请点击下方“修改现有脚本”，选择 “示例脚本#example”
        查看内置能力。开发页面仅为桌面端、Chromium
        内核浏览器设计，移动端无法预览脚本。
      </div>
      <CompoundButton
        className="w-52 mt-6"
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
        onClick={() => history.push('/meta?from=dev')}
      >
        修改现有脚本
      </CompoundButton>
    </div>
  );
};
export default DevPage;
