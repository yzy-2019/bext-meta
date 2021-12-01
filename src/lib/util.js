import { id } from '@bext/context';

export function detectBrowser() {
  return window.via && (window.via.cmd || window.via.openSettings)
    ? 'via'
    : window.alook && window.alook.addon
    ? 'alook'
    : window.mbrowser && window.mbrowser.getBrowsreInfo
    ? 'x'
    : window.bz && window.bz.addScript
    ? 'bz'
    : window.sharkbrowser && window.sharkbrowser.installAddon
    ? 'shark'
    : window.lit && window.lit.addon
    ? 'lit'
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
