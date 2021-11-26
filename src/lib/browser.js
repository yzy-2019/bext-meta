const browsers = {};

function detectBrowser() {
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
function base64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

('@browser:via');
{
  const methods = (browsers['via'] = {});
  ('@method:install');
  {
    methods.install = meta => {
      let ret = window.via.addon(base64(JSON.stringify({
        id: meta.id,
        name: meta.name,
        author: meta.author_name,
        url: meta.match.split(','),
        code: base64(meta.build)
      })));
      return {
        code: -1,
        result: ret
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = meta => {
      let ret = JSON.parse(
        window.via.getInstalledAddonID()
      );
      return {
        code: (ret.includes(meta.id)) ? 0 : 1,
        result: ret // 已安装的所有脚本 ID 数组 [Number, Number]
      }
    };
  }
}

('@browser:alook');
{
  const methods = (browsers['alook'] = {});
  ('@method:install');
  {
    methods.install = meta => {
      let ret = window.alook.addon(base64(encodeURIComponent(JSON.stringify({
        id: meta.id,
        name: meta.name,
        author: meta.author_name,
        url: meta.match.split('@@'),
        code: base64(meta.build)
      }))));
      return {
        code: -1,
        result: ret
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = meta => {
      return {
        code: -1;
        result: undefined;
      }
    };
  }
}

('@browser:x');
{
  const methods = (browsers['x'] = {});
  ('@method:install');
  {
    methods.install = meta => {
      let ret = window.mbrowser.addNewScript(JSON.stringify({
        resource_id: meta.id, // TODO 格式不一样
        title: meta.name,
        description: meta.synopsis,
        nick_name: meta.author_name,
        content: meta.build
      }));
      return {
        code: -1,
        result: ret
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = meta => {
      let ret = window.mbrowser.scriptInstalled(meta.id);
      return {
        code: (!!ret) ? 0 : 1,
        result: ret
      }
    };
  }
  ('@method:uninstall');
  {
    methods.uninstall = meta => {
      let ret = window.mbrowser.uninstallScript(meta.id);
      return {
        code: -1,
        result: ret
      }
    };
  }
}

('@browser:bz');
{
  const methods = (browsers['bz'] = {});
  ('@method:install');
  {
    methods.install = meta => {
      let ret = window.bz.addScript(JSON.stringify({
        title: meta.name,
        hostListStr: meta.match.split(','),
        code: meta.build
      }));
      return {
        code: -1,
        result: ret
      };
    };
  }
  ('@method:installed');
  {
    methods.installed = meta => {
      let ret = false, arr = JSON.parse(window.via.getInstalledAddonID());
      for (let {title:title} of arr) {
        ret = (title==meta.synopsis) || ret;
      }
      return {
        code: (ret) ? 0 : 1,
        result: arr
      };
    };
  }
}

('@browser:shark');
{
  const methods = (browsers['shark'] = {});
  ('@method:install');
  {
    methods.install = meta => {
      let ret = window.sharkbrowser.installAddon(base64(JSON.stringify({
        id: meta.id,
        name: meta.name,
        author: meta.author_name,
        code: base64(meta.build)
      })));
      return {
        code: -1,
        result: ret
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = meta => {
      let ret = JSON.parse(
        window.sharkbrowser.getInstalledAddonID()
      );
      return {
        code: (ret.includes(meta.id)) ? 0 : 1,
        result: ret
      }
    };
  }
}


('@browser:lit');
{
  const methods = (browsers['lit'] = {});
  ('@method:install');
  {
    methods.install = meta => {
      let ret = window.lit.addon(base64(JSON.stringify({
        id: meta.id,
        name: meta.name,
        author: meta.author_name,
        url: meta.match.split(','),
        code: base64(meta.build)
      })));
      return {
        code: -1,
        result: ret
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = meta => {
      let ret = JSON.parse(
        window.lit.getInstalledAddonID()
      );
      return {
        code: (ret.includes(meta.id)) ? 0 : 1,
        result: ret
      }
    };
  }
}

('@method:install');
export function install(meta) {
  return browsers[detectBrowser()]?.install?.(meta);
}
