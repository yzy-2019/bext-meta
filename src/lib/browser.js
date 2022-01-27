import { base64, detectBrowser } from '@bext/util';

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
        author: meta.author,
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

export const meta_install = errorCatch((mett) => {
  let metaIds = [];

  // md5 BEGIN
  let md5 = (inputString) => {
    var hc = '0123456789abcdef';
    function rh(n) {
      var j,
        s = '';
      for (j = 0; j <= 3; j++)
        s +=
          hc.charAt((n >> (j * 8 + 4)) & 0x0f) +
          hc.charAt((n >> (j * 8)) & 0x0f);
      return s;
    }
    function ad(x, y) {
      var l = (x & 0xffff) + (y & 0xffff);
      var m = (x >> 16) + (y >> 16) + (l >> 16);
      return (m << 16) | (l & 0xffff);
    }
    function rl(n, c) {
      return (n << c) | (n >>> (32 - c));
    }
    function cm(q, a, b, x, s, t) {
      return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
      return cm((b & c) | (~b & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
      return cm((b & d) | (c & ~d), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
      return cm(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
      return cm(c ^ (b | ~d), a, b, x, s, t);
    }
    function sb(x) {
      var i;
      var nblk = ((x.length + 8) >> 6) + 1;
      var blks = new Array(nblk * 16);
      for (i = 0; i < nblk * 16; i++) blks[i] = 0;
      for (i = 0; i < x.length; i++)
        blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
      blks[i >> 2] |= 0x80 << ((i % 4) * 8);
      blks[nblk * 16 - 2] = x.length * 8;
      return blks;
    }
    var i,
      x = sb(inputString),
      a = 1732584193,
      b = -271733879,
      c = -1732584194,
      d = 271733878,
      olda,
      oldb,
      oldc,
      oldd;
    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;
      a = ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = ff(c, d, a, b, x[i + 10], 17, -42063);
      b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = hh(a, b, c, d, x[i + 5], 4, -378558);
      d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = ad(a, olda);
      b = ad(b, oldb);
      c = ad(c, oldc);
      d = ad(d, oldd);
    }
    return rh(a) + rh(b) + rh(c) + rh(d);
  };
  // md5 END

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
      id: mett.id,
      name: mett.name,
      type: 1,
      version: parseInt(mett.version),
      author: mett.author,
      brief: mett.synopsis,
      icon: '',
      host: buildMatch(mett.match, ',', ''),
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
      name: mett.name,
      appid: mett.id,
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
      name: mett.name,
      appid: mett.id,
      url: url,
      mime: '',
      encoding: '',
      enable: true,
    }),
  );

  // 5. 推送代码
  window.meta.putText('res/' + md5(url).substring(8, 24), mett.build, false);
});

export const meta_installed = errorCatch((mett) => {
  let metaApps = JSON.parse(window.meta.getWebAppManifestArray()),
    metaAppIds = [];
  for (let { id: m } of metaApps) metaAppIds.push(m);
  return metaAppIds.includes(+mett.id);
});

export const meta_uninstall = errorCatch((mett) =>
  window.meta.removeWebApp(+mett.id),
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
