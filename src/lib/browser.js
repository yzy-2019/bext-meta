import { base64, detectBrowser } from '@bext/util';

const errorCatch = (fn) => {
  return (...args) => {
    try {
      return {
        code: 0,
        result: fn?.(...args),
      };
    } catch (error) {
      return { code: error.bextCode ?? -1 };
    }
  };
};

const buildMatch = (match, sep, all) => {
  if (match && match.length) {
    return match.join(sep);
  }
  return all;
};

export const via_install = errorCatch((meta) =>
  window.via.addon(
    base64(
      JSON.stringify({
        id: +meta.id,
        name: meta.name,
        author: meta.author,
        url: buildMatch(meta.match, ',', '*'),
        code: base64(meta.build),
      }),
    ),
  ),
);

export const via_installed = errorCatch((meta) =>
  JSON.parse(window.via.getInstalledAddonID()).includes(+meta.id),
);

export const via_uninstall = via_install;

export const alook_install = errorCatch((meta) =>
  window.alook.addon(
    base64(
      encodeURIComponent(
        JSON.stringify({
          id: +meta.id,
          name: meta.name,
          author: meta.author,
          url: buildMatch(meta.match, '@@', '*'),
          code: base64(meta.build),
        }),
      ),
    ),
  ),
);

export const x_install = errorCatch((meta) =>
  window.mbrowser.addNewScript(
    JSON.stringify({
      resource_id: meta.id, // TODO 格式不一样
      title: meta.name,
      description: meta.synopsis,
      nick_name: meta.author,
      content: `
// ==UserScript==
// @name         ${meta.name}
// @namespace    ${meta.id}
// @version      ${meta.version}
// @description  ${meta.synopsis}
// @author       ${meta.author}${
        meta.match?.map((match) => '\n@match ' + match).join('') || ''
      }
// ==/UserScript==
${meta.build}
`,
    }),
  ),
);

export const x_installed = errorCatch((meta) =>
  window.mbrowser.scriptInstalled(meta.id),
);

export const x_uninstall = errorCatch((meta) =>
  window.mbrowser.uninstallScript(meta.id),
);

export const bz_install = errorCatch((meta) =>
  window.bz.addScript(
    JSON.stringify({
      title: meta.name,
      hostListStr: buildMatch(meta.match, ',', '*'),
      code: meta.build,
    }),
  ),
);

export const shark_install = errorCatch((meta) =>
  window.sharkbrowser.installAddon(
    base64(
      JSON.stringify({
        id: +meta.id,
        name: meta.name,
        author: meta.author,
        code: base64(meta.build),
      }),
    ),
  ),
);

export const shark_installed = errorCatch((meta) =>
  JSON.parse(window.sharkbrowser.getInstalledAddonID()).includes(meta.id),
);

export const lit_install = errorCatch((meta) =>
  window.lit.addon(
    base64(
      JSON.stringify({
        id: +meta.id,
        name: meta.name,
        author: meta.author,
        url: meta.match.join(','),
        code: base64(meta.build),
      }),
    ),
  ),
);

export const lit_installed = errorCatch((meta) =>
  JSON.parse(window.lit.getInstalledAddonID()).includes(meta.id),
);

export const buildMethods = (impls) => {
  const browser = detectBrowser();

  return {
    call: (method, ...args) => {
      const fn = impls[`${browser}_${method}`];
      return fn ? fn(...args) : { code: -1 };
    },
    support: (method) => {
      return !!impls[`${browser}_${method}`];
    },
  };
};
