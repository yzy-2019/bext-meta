import { CompoundButton } from '@fluentui/react';
import { useHistory } from 'umi';

const DevPage = () => {
  const history = useHistory();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <CompoundButton
        primary
        secondaryText="轻松编写新脚本，Show me your code"
        onClick={() => history.push('/dev/new')}
      >
        创建新脚本
      </CompoundButton>
    </div>
  );
};
export default DevPage;
