# Bext

一个纯前端的脚本站点

## 其他开发者
[Lemon399](https://gitee.com/lemon399): 开发支持了各种浏览器的安装、卸载等功能，以及丰富强大的内置模块等。（部分 commit 由 ikkz 代为提交）

### 脚本开发者
<a href="https://github.com/ikkz/bext/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ikkz/bext" />
</a>

对以上所有开发者表示感谢。
## 开发者指南

提供了脚本开发功能，能够使开发者高效快速的实现脚本逻辑，[示例脚本](https://bext.ketra.fun/meta/example/review)

### 编辑器
桌面端为 Monaco，移动端为 CodeMirror

### 调试预览（仅桌面端）
在编辑器中编写的代码经过一道预处理之后才会成为用户实际安执行装的代码，例如在编辑器中编写
``` js
// log
console.log('hello world');
```
用户实际安装的脚本经过基本的预处理（包裹立即执行函数、删除所有注释）：
``` js
(function () {
	'use strict';
	console.log('hello world');
})();
```
在右边的调试预览中可以实时查看到处理后的代码。另外还提供了脚本调试功能，输入想要脚本执行的网页地址后点击打开一个新窗口，再点击脚本推送，就能够将正在编写的代码推送到该窗口中执行，无需复制粘贴。

### 用户安装选项

支持脚本安装时用户自定义配置，例如开发者进入配置表单填写：
``` json
{
    "type": "object",
    "properties": {
        "h": {
            "type": "string",
            "title": "横向位置",
            "enum": [
                "left",
                "right"
            ]
        },
        "v": {
            "type": "string",
            "title": "垂直位置",
            "enum": [
                "top",
                "bottom"
            ]
        }
    },
    "title": "按钮位置配置",
    "required": [
        "h",
        "v"
    ]
}
```
用户在安装时就能够显示对应的选项，[示例#648648](https://bext.ketra.fun/meta/648648)，在脚本中取到用户选择的值并使用
``` js
import config from '@bext/config';
console.log(config);
// {"h":"right","v":"bottom"}
```

### 外部代码
支持通过链接导入外部代码，**这部分代码将会内嵌到用户实际安装的代码中，并不是运行时远程加载**，将会增加实际脚本体积请谨慎使用，例如
``` js
// 使用 underscore 的 节流函数
import throttle from 'https://cdn.jsdelivr.net/npm/underscore@1.13.1/modules/throttle.js';
// 直接使用
throttle(()=>{ /* ... */ })
```
针对 jsdelivr 的特别优化：jsdelivr 支持脚本地址后缀 min.js 生成压缩后的代码，能够减小代码体积，比如上面这个例子如果手动改为 `throttle.min.js`，确实能够导入到压缩后的代码，然而在该文件内还有一个 import 语句 `import now from './now.js';` 不是压缩的版本，因此我们额外支持了 `?min` 后缀：
``` js
import throttle from 'https://cdn.jsdelivr.net/npm/underscore@1.13.1/modules/throttle.js?min';
```
对于有该后缀的导入，其本身以及内部导入的所有地址，全部自动修改为 `.min.js` 导入。

### 内置模块
引入了模块化，直接引用内置模块，例如
``` js
import { runOnce } from '@bext/util';

runOnce(()=>{
  console.log('保证只会打印一次');
})
```

#### @bext/context
``` js
import {
  id, // 当前脚本 id
  name, // 当前脚本名称
  version // 当前脚本版本号
} from '@bext/context';
```

#### [@bext/util](https://github.com/ikkz/bext/blob/master/src/lib/util.js)
``` js
import {
  detectBrowser, // 检测当前浏览器
  runOnce, // 保证传入函数仅执行一次
  addElement, // 添加元素
  runAt, getElement, removeElement // 请点击标题查看源代码注释,
  loadScript, // 加载远程脚本
  addStyle, // 添加样式
  loadStyle, // 加载远程样式
} from '@bext/util';
```

#### [@bext/ui](https://github.com/ikkz/bext/blob/master/src/lib/ui.js)
bar 能够直接在网页上添加多个按钮，包含有拖拽、展开收起等功能，以及toast 提示，详细使用方法请点击标题查看源代码

#### @bext/preact
暂时仅导出了一个特定版本的 preact，[使用示例](https://bext.ketra.fun/meta/648648/review)

### 发布/更新
本站所有脚本的信息以 json 格式保存在 meta 目录下，名字为脚本 id ，因此脚本的发布与更新也就对应着相应文件的创建/修改，在开发页面点击右上角准备发布根据指引操作提交 pr 即可，请务必仔细阅读相关文字。提交 pr 之后稍等几分钟将会有一个预览版本的地址，可通过此地址安装脚本。
