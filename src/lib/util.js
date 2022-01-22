import { id, version } from '@bext/context';

export function detectBrowser() {
  return window.alook && window.alook.addon
    ? 'alook'
    : window.mbrowser && window.mbrowser.getBrowsreInfo
    ? 'x'
    : window.bz && window.bz.addScript
    ? 'bz'
    : window.sharkbrowser && window.sharkbrowser.installAddon
    ? 'shark'
    : window.lit && window.lit.addon
    ? 'lit'
    : window.via && window.via.addon
    ? 'via'
    : undefined;
}

export function base64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
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
 * runAt('+500',alert,'a');          window.onload 触发以后延时 500ms 执行
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
      if (typeof start == 'number') {
        setTimeout(fn, start, ...args);
      } else {
        window.addEventListener('load', function () {
          setTimeout(fn, parseInt(start), ...args);
        });
      }
  }
}

export function addElement({ tag, attrs = {}, to = document.body }) {
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
    } catch {
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
      } catch {
        console.log('规则错误');
      }
    }
    elemarray.push(...temparray);
  });
  return elemarray.length == 1 ? elemarray[0] : elemarray;
}

/*
 * rules      String || [String]   指定一个或一组 CSS 选择器 或 XPath 规则
 * withParent Bool                 是否删除 外层 盒子
 * out        Number               阈值，默认 20 px ，
 *                                 如果只比广告元素多出这点大小，
 *                                 即判定为广告的盒子，一并去除
 */
export function removeElement(rules, withParent = false, out = 20) {
  let elemarray = [],
    elems = getElement(rules),
    getSize = (elem, prop) => {
      return parseInt(getComputedStyle(elem)[prop]);
    };
  if (elems instanceof Array) {
    elemarray.push(...elems);
  } else {
    elemarray.push(elems);
  }
  elemarray.forEach((elem) => {
    if (withParent) {
      let parent = elem.parentNode,
        eHeight =
          elem.offsetHeight +
          getSize(elem, 'marginTop') +
          getSize(elem, 'marginBottom'),
        eWidth =
          elem.offsetWidth +
          getSize(elem, 'marginLeft') +
          getSize(elem, 'marginRight');
      if (
        parent.offsetHeight < eHeight + out &&
        parent.offsetWidth < eWidth + out
      )
        parent.remove();
    }
    elem.remove();
  });
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = addElement({
      tag: 'script',
      attrs: {
        src,
        type: 'text/javascript',
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

export function loadStyle(url) {
  return new Promise((resolve, reject) => {
    const el = addElement({
      tag: 'link',
      attrs: {
        href: url,
        rel: 'stylesheet',
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
