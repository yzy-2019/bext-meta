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
    methods.install = (meta) => {
      try {
        let ret = window.via.addon(
          base64(
            JSON.stringify({
              id: meta.id,
              name: meta.name,
              author: meta.author,
              url: meta.match.join(','),
              code: base64(meta.build),
            }),
          ),
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1, // ､
            result: undefined,
          };
        } else {
          // 接口不兼容，新版浏览器接口参数改变 等等
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = (meta) => {
      try {
        let ret = JSON.parse(window.via.getInstalledAddonID()).includes(
          meta.id,
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
}

('@browser:alook');
{
  const methods = (browsers['alook'] = {});
  ('@method:install');
  {
    methods.install = (meta) => {
      try {
        let ret = window.alook.addon(
          base64(
            encodeURIComponent(
              JSON.stringify({
                id: meta.id,
                name: meta.name,
                author: meta.author,
                url: meta.match.join('@@'),
                code: base64(meta.build),
              }),
            ),
          ),
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = (meta) => {
      return {
        code: -1,
        result: undefined,
      };
    };
  }
}

('@browser:x');
{
  const methods = (browsers['x'] = {});
  ('@method:install');
  {
    methods.install = (meta) => {
      try {
        let ret = window.mbrowser.addNewScript(
          JSON.stringify({
            resource_id: meta.id, // TODO 格式不一样
            title: meta.name,
            description: meta.synopsis,
            nick_name: meta.author,
            content: meta.build,
          }),
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = (meta) => {
      try {
        let ret = window.mbrowser.scriptInstalled(meta.id);
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
  ('@method:uninstall');
  {
    methods.uninstall = (meta) => {
      try {
        let ret = window.mbrowser.uninstallScript(meta.id);
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
}

('@browser:bz');
{
  const methods = (browsers['bz'] = {});
  ('@method:install');
  {
    methods.install = (meta) => {
      try {
        let ret = window.bz.addScript(
          JSON.stringify({
            title: meta.name,
            hostListStr: meta.match.join(','),
            code: meta.build,
          }),
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
}

('@browser:shark');
{
  const methods = (browsers['shark'] = {});
  ('@method:install');
  {
    methods.install = (meta) => {
      try {
        let ret = window.sharkbrowser.installAddon(
          base64(
            JSON.stringify({
              id: meta.id,
              name: meta.name,
              author: meta.author,
              code: base64(meta.build),
            }),
          ),
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = (meta) => {
      try {
        let ret = JSON.parse(
          window.sharkbrowser.getInstalledAddonID(),
        ).includes(meta.id);
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
}

('@browser:lit');
{
  const methods = (browsers['lit'] = {});
  ('@method:install');
  {
    methods.install = (meta) => {
      try {
        let ret = window.lit.addon(
          base64(
            JSON.stringify({
              id: meta.id,
              name: meta.name,
              author: meta.author,
              url: meta.match.join(','),
              code: base64(meta.build),
            }),
          ),
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
  ('@method:installed');
  {
    methods.installed = (meta) => {
      try {
        let ret = JSON.parse(window.lit.getInstalledAddonID()).includes(
          meta.id,
        );
        return {
          code: 0,
          result: ret,
        };
      } catch (e) {
        if (e instanceof TypeError || e instanceof ReferenceError) {
          return {
            code: -1,
            result: undefined,
          };
        } else {
          return {
            code: 1,
            result: undefined,
          };
        }
      }
    };
  }
}

('@method:install');
export function install(meta) {
  return browsers[detectBrowser()]?.install?.(meta);
}
