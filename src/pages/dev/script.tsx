import { Editor } from '@/components/editor';
import { FC, useState } from 'react';

const ScriptDev: FC = () => {
  const [code, setCode] = useState(
    'console.log("happy coding"); // 编辑器测试',
  );
  return <Editor value={code} onChange={setCode} className="h-full" />;
};

export default ScriptDev;
