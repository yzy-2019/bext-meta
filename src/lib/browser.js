const browsers = {};

function detectBrowser() {
  return window.via && (window.via.cmd || window.via.openSettings)
    ? 'via'
    : window.mbrowser && window.mbrowser.getBrowsreInfo
    ? 'x'
    : window.bz && window.bz.addScript
    ? 'bz'
    : window.sharkbrowser && window.sharkbrowser.installAddon
    ? 'shark'
    : window.alook && window.alook.addon
    ? 'alook'
    : undefined;
}

('@browser:via');
{
  const methods = (browsers['via'] = {});
  ('@method:install');
  {
    methods.install = () => {};
  }
}

('@method:install');
export function install(meta) {
  return browsers[detectBrowser()]?.install?.(meta);
}
