const browsers = {};

function detectBrowser() {
  return (window.via && (window.via.cmd || window.via.openSettings)) ? 'via' :
    (window.mbrowser && window.mbrowser.getBrowsreInfo) ? 'x' :
    (window.bz && window.bz.addScript) ? 'bz' :
    (window.sharkbrowser && window.sharkbrowser.installAddon) ? 'shark' :
    (window.alook && window.alook.addon) ? 'alook' ;
    // TODO: 其它兼容 Via 接口的浏览器是要一一列出，
    //       还是检测到 window.via.addon 就开放安装呢？
}

('@browser:via');
{
  const methods = (browsers['via'] = {});
  ('@method:addon');
  {
    methods.addon = () => {};
  }
}

('@method:addon');
export function addon(...params) {
  return browsers[detectBrowser()]?.addon?.(...params);
}
