
// 新建一个 Bar
// var bar1 = buttonBar(true);
// 加个 Button
// a = () => {alert('a')}
// bar1.add('test','测试',a,'red','snow');
// 变更样式
// bar1.change('test','limegreen','white','成功');
// 删除 Button
// bar1.del('test');
export function buttonBar(pos) { // true: bottom false: top
  // TODO: 应该让用户修改位置
  let bar = document.querySelector('#myScriptBar'),sty;
  if (!bar) { // 不允许开发者随便新建 bar
    bar = document.createElement('div'),
    sty = document.createElement('style'),
    first = document.createElement('span');
    first.id = 'myScriptBarExpand';
    first.innerText = '<';
    first.onclick = function() {
        if (bar.className.indexOf('small')>=0) {
            bar.classList.remove('small');
            first.innerText = '<';
        } else {
            bar.classList.add('small');
            first.innerText = '>';
        }
    }
    bar.appendChild(first);
    sty.innerText = `
        #myScriptBar {
            position: sticky;
            width: 100%;
            height: 25pt;
            ${ pos ? 'bottom' : 'top' }: 0;
            background: white;
            border-radius: 5px;
            overflow-x: scroll;
            display: flex;
            transition: width 2s ease;
            z-index: 1000000;
        }
        #myScriptBar.small {
            width: 28px;
            overflow-x: clip;
        }
        #myScriptBarExpand {
            font-family: monospace;
            font-size: 20px;
            line-height: 20px;
            margin: auto .5em;
            color: #333;
            font-weight: bold;
        }
        .button {
            margin: 5px .5em;
            padding: 4px .75em;
            background: whitesmoke;
            border: none;
            outline: none;
            border-radius: 1em;
            font-size: 13px;
            line-height: 13px;
            flex-shrink: 0;
        }
        .delButton {
            font-family: sans-serif;
            margin-left: .5rem;
        }
    `;
    document.head.appendChild(sty); bar.id = 'myScriptBar';
    document.body.insertAdjacentElement((pos) ? 'beforeend' : 'afterbegin',bar);
  }
    return {
        bar: bar,
        del: function(id) {
            let button = this.bar.querySelector(`#scriptButton-${id}`);
            if (button) this.bar.removeChild(button);
        },
        change: function(id,backcolor,textcolor,text,callback) {
            let button = this.bar.querySelector(`#scriptButton-${id}`);
            if (textcolor) button.style.color = textcolor;
            if (backcolor) button.style.backgroundColor = backcolor;
            if (text) button.querySelector('span').innerText = text;
            if (callback) button.onclick = callback;
        },
        add: function(id,text = '按钮',callback = null,backcolor = 'whitesmoke',textcolor = '#333') {
            if (!this.bar.querySelector(`#scriptButton-${id}`)) {
                let button = document.createElement('button'),
                btext = document.createElement('span');
                button.id = `scriptButton-${id}`;
                button.className = 'button';
                button.appendChild(btext);
            //  TODO: 用户应有权删除按钮
            //  但下次脚本运行时还会加 ...
                let close = document.createElement('span');
                close.innerText = '✖'; close.className = 'delButton'
                close.onclick = this.del(id);
                button.appendChild(close);
                this.bar.appendChild(button);
                this.change(id,backcolor,textcolor,text,callback);
            }
        } // TODO: DnD
    }
}

/*
 * t: 文字
 * s: 持续时间
 * c: {
 *    text: 按钮文字
 *    color: 按钮文字颜色
 *    onclick: 点击按钮的回调函数
 *    onclose: Toast 消失后的回调函数
 * }
 */
function toast(t,s,c) {
  let td = document.createElement('div'),
  tk = document.createElement('style'),
  tt = function(){
    document.body.removeChild(td);
    document.head.removeChild(tk);
    if (c && c.onclose) c.onclose.call(this);
  };
  tk.innerHTML = `
  @-webkit-keyframes toast {
    0% { opacity: 0%; }
    20% { opacity: 100%; }
    80% { opacity: 100%; }
    100% { opacity: 0%; }
  }
  @keyframes toast {
    0% { opacity: 0%; }
    20% { opacity: 100%; }
    80% { opacity: 100%; }
    100% { opacity: 0%; }
  }`
  document.head.appendChild(tk);
  td.style.cssText = `
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20vw;
    width: max-content;
    margin: 0 auto;
    border-radius: 20px;
    padding: .5rem 1rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: rgba(0,0,0,0.5);
    color: white;
    text-align: center;
    z-index: 1000000;
    opacity: 0%;
    animation: toast ${s}s ease;
    -webkit-animation: toast ${s}s ease;
  `;
  td.innerHTML = t;
  if (c) {
      let ctext = document.createElement('span');
      ctext.innerText = c.text;
      ctext.style.cssText = `
        padding-left: .5rem;
        color: ${ ( c && c.color ) ? c.color : 'turquoise'};
      `
      if (c && c.onclick) {
          ctext.onclick = c.onclick;
      }
      td.appendChild(ctext);
  }
  document.body.appendChild(td);
  td.onanimationend = tt;
  td.onwebkitanimationend = tt;
}
