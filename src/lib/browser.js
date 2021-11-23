const browsers = {};

function detectBrowser() {
  // TODO: 检测浏览器，返回代号
  return 'via';
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
