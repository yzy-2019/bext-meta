import { id, version } from '@bext/context';

export function detectBrowser() {
  return window.alook && window.alook.addon
    ? 'alook'
    : window.webmx && window.webmx.copyCode
    ? 'm'
    : window.mbrowser && window.mbrowser.getBrowsreInfo
    ? 'x'
    : window.bz && window.bz.addScript
    ? 'bz'
    : window.sharkbrowser && window.sharkbrowser.installAddon
    ? 'shark'
    : window.lit && window.lit.addon
    ? 'lit'
    : window.mx_browser_obj && window.mx_browser_obj.sethostjs
    ? 'mixia'
    : window.meta && window.meta.getWebAppManifestArray
    ? 'meta'
    : window.fy_bridge_app && window.fy_bridge_app.importRule
    ? 'hiker'
    : window.mthtml && window.mthtml.mtjs
    ? 'mt'
    : window.via && window.via.addon
    ? 'via'
    : 'unknown';
}

export function base64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function md5(str) {
  var hc = '0123456789abcdef';
  function rh(n) {
    var j,
      s = '';
    for (j = 0; j <= 3; j++)
      s +=
        hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
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
    x = sb(str),
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
}

function calcHash(content, algo = 512) {
  return new Promise((resolve) => {
    let alg = 'SHA-' + algo,
      uar,
      ab = new TextEncoder().encode(content);
    crypto.subtle.digest(alg, ab).then((v) => {
      uar = new Uint8Array(v);
      resolve(
        [].slice
          .call(uar)
          .map((o) => o.toString(16).padStart(2, '0'))
          .join(''),
      );
    });
  });
}

export async function sha1(cont) {
  return await calcHash(cont, 1);
}

export async function sha256(cont) {
  return await calcHash(cont, 256);
}

export async function sha384(cont) {
  return await calcHash(cont, 384);
}

export async function sha512(cont) {
  return await calcHash(cont);
}

function hex2sri(hex) {
  let type,
    ar = [],
    i = 0;
  switch (hex.length) {
    case 64:
      type = 'sha256-';
      break;
    case 96:
      type = 'sha384-';
      break;
    case 128:
      type = 'sha512-';
      break;
    default:
      return false;
  }
  for (i = 0; i < hex.length; i = i + 2) {
    ar.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return type + btoa(String.fromCharCode.apply(null, ar));
}

export function runOnce(fn) {
  const uniqId = 'BEXT_UNIQ_ID_' + id;
  if (window[uniqId]) {
    return;
  }
  window[uniqId] = true;
  fn && fn();
}

/*
 * runAt('document-end',alert,'a');  DOM 加载完成以后执行
 * runAt('document-idle',alert,'a'); window.onload 触发执行
 * runAt(500,alert,'a');             打开页面以后延时 500ms 执行
 */
export function runAt(start, fn, ...args) {
  if (typeof fn !== 'function') return;
  switch (start) {
    case 'document-body':
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'interactive') fn.call(this, ...args);
      });
      break;
    case 'document-end':
      document.addEventListener('DOMContentLoaded', fn.bind(this, ...args));
      break;
    case 'document-idle':
      window.addEventListener('load', fn.bind(this, ...args));
      break;
    default:
      setTimeout(fn, start, ...args);
  }
}

export function addElement({
  tag,
  attrs = {},
  to = document.body || document.documentElement,
}) {
  const el = document.createElement(tag);
  Object.assign(el, attrs);
  to.appendChild(el);
  return el;
}

/*
 * rules   String || [String]   指定一个或一组 选择器 或 XPath 规则
 * all     Bool                 匹配 全部元素 或是 首个元素
 * parent  Node                 指定 查找位置
 *
 * 如果只找到一个元素，返回它，否则返回包含所有元素的数组，未找到返回空数组
 */
export function getElement(rules, all = false, parent = document) {
  let rulearray = [],
    elemarray = [];
  if (rules instanceof Array) {
    rulearray.push(...rules);
  } else {
    rulearray.push(rules);
  }
  rulearray.forEach((rule) => {
    let temparray = [],
      xtype = all ? 7 : 9,
      xr;
    try {
      // CSS 选择器
      if (all) {
        temparray.push(...parent.querySelectorAll(rule));
      } else {
        temparray.push(parent.querySelector(rule));
      }
    } catch (e) {
      // XPath
      try {
        xr = document.evaluate(rule, parent, null, xtype, null);
        if (all) {
          for (let i = 0; i < xr.snapshotLength; i++) {
            temparray.push(xr.snapshotItem(i));
          }
        } else {
          temparray.push(xr.singleNodeValue);
        }
      } catch (e) {
        console.log('规则错误', e);
      }
    }
    elemarray.push(...temparray);
  });
  return elemarray.length == 1 ? elemarray[0] : elemarray;
}

/*
 * rules      String || [String]   指定一个或一组 CSS 选择器 或 XPath 规则
 */
export function removeElement(rules) {
  let elemarray = [],
    elems = getElement(rules);
  if (elems instanceof Array) {
    elemarray.push(...elems);
  } else {
    elemarray.push(elems);
  }
  elemarray.forEach((elem) => {
    elem.parentNode.removeChild(elem);
  });
}

export function loadScript(src, hash) {
  if (hash && hash.slice(0, 3) !== 'sha') hash = hex2sri(hash);
  return new Promise((resolve, reject) => {
    const el = addElement({
      tag: 'script',
      attrs: {
        src,
        type: 'text/javascript',
        integrity: hash ? hash : '',
        crossOrigin: 'anonymous',
        onload: () => resolve(el),
        onerror: reject,
      },
    });
  });
}

export function addStyle(css) {
  return addElement({
    tag: 'style',
    attrs: {
      textContent: css,
    },
    to: document.head,
  });
}

export function loadStyle(url, hash) {
  if (hash && !hash.slice(0, 3) == 'sha') hash = hex2sri(hash);
  return new Promise((resolve, reject) => {
    const el = addElement({
      tag: 'link',
      attrs: {
        href: url,
        rel: 'stylesheet',
        integrity: hash ? hash : '',
        crossOrigin: 'anonymous',
        onload: () => resolve(el),
        onerror: reject,
      },
    });
  });
}

export async function getBextHome() {
  const response = await fetch(
    `https://cdn.jsdelivr.net/gh/ikkz/bext@master/BEXT_HOME`,
  );
  return await response.text();
}

const LAST_CHECK_KEY = `BEXT_LAST_CHECK_KEY_${id}`;
export async function checkUpdate(day = 7) {
  const lastCheck = Number(localStorage.getItem(LAST_CHECK_KEY));
  localStorage.setItem(LAST_CHECK_KEY, Date.now());

  if (
    !Number.isNaN(lastCheck) &&
    (Date.now() - lastCheck) / (24 * 60 * 60) <= Math.max(3, day)
  ) {
    return;
  }
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/ikkz/bext@master/meta/${id}.json`,
    );
    const meta = await response.json();
    if (meta.version != version) {
      return `${await getBextHome()}/meta/${id}`;
    }
  } catch (error) {}
}

export class EventEmitter {
  listeners = {};

  on(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

  off(event, fn) {
    if (!event) {
      this.listeners = {};
      return;
    }

    if (!fn) {
      this.listeners[event] = [];
      return;
    }

    const index = this.listeners[event].findIndex((f) => f === fn);
    if (index >= 0) {
      this.listeners[event].splice(index, 1);
    }
  }

  emit(event, ...args) {
    this.listeners[event]?.forEach((fn) => fn?.(...args));
  }
}
