// ==UserScript==
// @name         Bext debug client
// @version      0.2
// @description  调试脚本
// @include      *
// @author       ikkz
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const id = decodeURIComponent('bext-debug-client');

  function runOnce(fn) {
    const uniqId = 'BEXT_UNIQ_ID_' + id;
    if (window[uniqId]) {
      return;
    }
    window[uniqId] = true;
    fn && fn();
  }

  runOnce(() => {
    const key = 'BEXT_DEBUG_SCRIPT';
    window.addEventListener('message', ({ data }) => {
      if (data?.type === 'bext/script') {
        localStorage.setItem(key, data.payload);
        window.location.reload();
      }
    });
    const script = localStorage.getItem(key);
    if (script) {
      localStorage.removeItem(key);
      eval(script);
    }
  });
})();
