import { base64, detectBrowser, md5 } from '@bext/util';

const errorCatch = (fn) => {
  return (...args) => {
    try {
      return {
        code: 0,
        result: fn?.(...args),
      };
    } catch (error) {
      console.log(error);
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

export const via_install = errorCatch((meta) => {
  window.via.addon(
    base64(
      JSON.stringify({
        id: +meta.id,
        name: meta.name,
        url: buildMatch(meta.match, ',', '*'),
        code: base64(`/*
 * @name: ${meta.name}
 * @Author: ${meta.author}
 * @version: ${meta.version}
 * @description: ${meta.synopsis}${
          meta.match?.map((match) => '\n * @include: ' + match).join('') || ''
        }
 */
${meta.build}`),
      }),
    ),
  );
});

export const via_installed = errorCatch((meta) =>
  JSON.parse(window.via.getInstalledAddonID()).includes(+meta.id),
);

export const via_uninstall = via_install;

export const alook_install = errorCatch((meta) =>
  window.alook.addon(
    base64(
      encodeURIComponent(
        JSON.stringify({
          name: meta.name,
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
      resource_id: meta.id,
      title: meta.name,
      description: meta.synopsis,
      nick_name: meta.author,
      content: `// ==UserScript==
// @name         ${meta.name}
// @namespace    ${meta.id}
// @version      ${meta.version}
// @description  ${meta.synopsis}
// @author       ${meta.author}${
        meta.match?.map((match) => '\n// @match ' + match).join('') || ''
      }${meta.extra?.xMetaComment ? `\n${meta.extra?.xMetaComment}` : ''}
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
        code: base64(meta.build),
      }),
    ),
  ),
);

export const shark_installed = errorCatch((meta) =>
  JSON.parse(window.sharkbrowser.getInstalledAddonID()).includes(meta.id),
);

export const shark_uninstall = shark_install;

export const lit_install = errorCatch((meta) =>
  window.lit.addon(
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

export const lit_installed = errorCatch((meta) =>
  JSON.parse(window.lit.getInstalledAddonID()).includes(+meta.id),
);

export const lit_uninstall = lit_install;

export const mixia_install = errorCatch((meta) => {
  let multiSign = meta.match && meta.match.length ? '@' : '';

  window.mx_browser_obj.sethostjs(
    meta.name,
    multiSign + buildMatch(meta.match, ' ', '*'),
    `mxjshost:${base64(meta.build)}`,
  );
});

export const meta_install = errorCatch((meta) => {
  let metaIds = [];

  // 0. 获取各种 ID
  for (let { id: a } of JSON.parse(window.meta.getWebAppManifestArray())) {
    let arr = JSON.parse(window.meta.getWebAppJsArray(a));
    for (let { id: m } of arr) metaIds.push(m);
    arr = JSON.parse(window.meta.getWebAppHtmlArray(a));
    for (let { id: m } of arr) metaIds.push(m);
    arr = JSON.parse(window.meta.getWebAppResArray(a));
    for (let { id: m } of arr) metaIds.push(m);
  }

  // 1. 脚本 ID 生成
  // http://uujian.cn/assets/webapp/edit/:245
  let getId = function (time) {
    let tid = parseInt(time / 1000);
    return metaIds.includes(tid) ? getId(time + 1000) : tid;
  };

  let id = getId(new Date().getTime()),
    url = `file:///meta_res/${id}.js`;

  // 2. 清单
  // http://uujian.cn/assets/js/metax/webapp/manifest.js
  window.meta.putWebAppManifest(
    JSON.stringify({
      id: +meta.id,
      name: meta.name,
      type: 1,
      version: +meta.version,
      author: meta.author,
      brief: meta.synopsis,
      icon: '',
      host: buildMatch(meta.match, ',', ''),
      js: true,
      html: false,
      system: false,
    }),
  );

  // 3. 脚本
  // http://uujian.cn/assets/webapp/edit/:641
  // http://uujian.cn/assets/js/metax/webapp/js.js
  window.meta.putWebAppJs(
    JSON.stringify({
      id: id,
      name: meta.name,
      appid: +meta.id,
      regex: '*',
      url: url,
      debug: '',
      runat: 0,
      enable: true,
    }),
  );

  // 4. 资源
  // http://uujian.cn/assets/webapp/edit/:658
  // http://uujian.cn/assets/js/metax/webapp/res.js
  window.meta.putWebAppRes(
    JSON.stringify({
      id: id,
      name: meta.name,
      appid: +meta.id,
      url: url,
      mime: '',
      encoding: '',
      enable: true,
    }),
  );

  // 5. 推送代码
  window.meta.putText('res/' + md5(url).substring(8, 24), meta.build, false);
});

export const meta_installed = errorCatch((meta) => {
  let metaApps = JSON.parse(window.meta.getWebAppManifestArray()),
    metaAppIds = [];
  for (let { id: m } of metaApps) metaAppIds.push(m);
  return metaAppIds.includes(+meta.id);
});

export const meta_uninstall = errorCatch((meta) =>
  window.meta.removeWebApp(+meta.id),
);

export const hiker_install = errorCatch((meta) => {
  let domain = meta.match && meta.match.length == 1 ? meta.match[0] : 'global',
    code =
      meta.match && meta.match.length > 1
        ? `(function(){
if (!${JSON.stringify(meta.match)}.some(
  white => location.host.indexOf(white) >= 0
)) return;
${meta.build}
})();`
        : meta.build,
    name = (meta.name + '，id:' + meta.id)
      .replace(/\s+/g, '')
      .replace(/@/g, '')
      .replace(/_/g, '')
      .replace(/￥/g, '')
      .slice(0, 32);

  window.fy_bridge_app.importRule(
    `海阔视界，来自 Bext 的脚本￥js_url￥${domain}_${name}@base64://${base64(
      code,
    )}`,
  );
});

export const m_install = errorCatch((meta) => {
  window.webmx.copyCode(`
// @name ${meta.name}${
    meta.match?.map((match) => '\n// @match: ' + match).join('') ||
    '\n// @match: *'
  }
// m-script-end
${meta.build}`);
});

export const mt_install = errorCatch((meta) => {
  let domain = meta.match && meta.match.length == 1 ? meta.match[0] : '*',
    code =
      meta.match && meta.match.length > 1
        ? `(function(){
if (!${JSON.stringify(meta.match)}.some(
  white => location.host.indexOf(white) >= 0
)) return;
${meta.build}
})();`
        : meta.build;

  window.mthtml.mtjs(
    base64(meta.name + '，id:' + meta.id),
    base64(domain),
    base64(code),
  );
});

export const unknown_install = errorCatch((meta) => {
  window.postMessage({
    type: 'bext/unknown_install',
    payload: meta,
  });
});

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
