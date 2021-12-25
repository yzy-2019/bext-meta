import quill from '@/assets/quill';
import { useExternal } from 'ahooks';

export const useQuill = () =>
  quill.map((href) => useExternal(href)).every((status) => status === 'ready');
