import constate from 'constate';
import METAS from '../../public/meta/index.json';
import { Meta } from '@/types';

// TODO: request
export const [MetaProvider, useMeta] = constate(() => METAS as Meta[]);
