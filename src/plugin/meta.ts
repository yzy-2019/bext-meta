import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'bextMeta',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  api.onGenerateFiles(() => {});
};
