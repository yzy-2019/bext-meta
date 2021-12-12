/*
 * 新建 / 获取 bextBar
 * getBextBar()
 * >> {
 *      bar: { Element } ,        // bextBar DOM 元素
 *      buttons: [ String ] ,     // 包含所有按钮 ID 的数组
 *      add: ( id 'String', opt { // 添加一个按钮
 *                                text: 'String',      // 按钮文字
 *                                textcolor: 'String', // 按钮文字颜色
 *                                backcolor: 'String', // 按钮背景颜色
 *                                callback: Function(  // 点击回调
 *                                            { bextBar },
 *                                            { Element }, // 按钮 DOM 元素
 *                                            { Event }    // 点击事件
 *                                          )
 *                              } )
 *            >> 0   // 成功
 *            >> 1-7 // 参数错误
 *            >> 10  // 已存在重复 ID
 *       change: ( id, opt ),       // 修改一个按钮，参数同 add(),
 *            >> 0   // 成功
 *            >> 1-6 // 参数错误
 *       query: ( id ),             // 查询按钮样式
 *         >> {
 *              button: { Element }, // 按钮 DOM 元素
 *              text: 'String',      // 按钮文字
 *              textcolor: 'String', // 按钮文字颜色
 *              backcolor: 'String', // 按钮背景颜色
 *            }
 *       del: ( id ),               // 删除一个按钮
 *         >> 0 // 成功
 *         >> 1 // 不存在指定 id 的按钮
 *    }
 */
export function getBextBar() {
  if (!window.bextBar) {
    let bar = document.querySelector('#bextBar'),
      sty,
      buttons = [],
      drag = null,
      pos = [],
      downPos = 0,
      first,
      unlock = () => (document.onmousemove = null),
      ghost,
      ghostbox = document.createElement('div'),
      isObj = (o) =>
        typeof o == 'object' && !(o instanceof Array || o instanceof Function),
      optCheck = (opt, strict) => {
        if (
          !isObj(opt) ||
          (!opt.backcolor && !opt.textcolor && !opt.text && !opt.callback)
        )
          return 2;
        if (
          (strict || opt.text) &&
          (typeof opt.text !== 'string' || opt.text == '')
        )
          return 3;
        if ((strict || opt.callback) && typeof opt.callback !== 'function')
          return 4;
        if (
          (strict || opt.backcolor) &&
          (typeof opt.backcolor !== 'string' || opt.backcolor == '')
        )
          return 5;
        if (
          (strict || opt.textcolor) &&
          (typeof opt.textcolor !== 'string' || opt.textcolor == '')
        )
          return 6;
        return 0;
      };

    bar = document.createElement('div');
    sty = document.createElement('style');
    first = document.createElement('div');
    first.id = 'bextBarExpand';
    first.onclick = function (e) {
      if (
        'ontouchend' in document ||
        Math.abs(downPos - e.clientX * e.clientY) <= 50
      )
        bar.classList.toggle('close');
    };
    if ('ontouchend' in document) {
      first.addEventListener(
        'touchstart',
        function (e) {
          pos = [
            e.touches[0].clientX - bar.offsetLeft,
            e.touches[0].clientY - bar.offsetTop,
          ];
        },
        { passive: true },
      );
      first.addEventListener(
        'touchmove',
        function (e) {
          bar.style.left = e.touches[0].clientX - pos[0] + 'px';
          bar.style.top = e.touches[0].clientY - pos[1] + 'px';
        },
        { passive: true },
      );
    } else {
      first.addEventListener('mousedown', function (e) {
        pos = [e.clientX - bar.offsetLeft, e.clientY - bar.offsetTop];
        downPos = e.clientX * e.clientY;
        document.onmousemove = function (e) {
          if (Math.abs(downPos - e.clientX * e.clientY) > 50) {
            bar.style.left = e.clientX - pos[0] + 'px';
            bar.style.top = e.clientY - pos[1] + 'px';
          }
        };
        document.removeEventListener('mouseup', unlock);
        document.addEventListener('mouseup', unlock);
      });
    }
    bar.appendChild(first);
    sty.innerText = `
      #bextBar {
          position: fixed;
          display: block;
          max-width: 80vw;
          height: max-content;
          top: calc(95vh - 110px);
          margin: 5px;
          padding: 2px;
          background: white;
          border-radius: 5px;
          z-index: 1000000;
          box-shadow: 0 2px 5px gray;
          user-select: none;
      }
      #bextBar.close {
          width: 23px;
          height: 33px;
          overflow: clip;
      }
      #bextBarExpand {
          margin: 8px;
          margin-right: 0;
          border-width: 4px 0 0 4px;
          border-color: #333 transparent transparent #333;
          border-style: solid none none solid;
          width: 13px;
          height: 13px;
          transform: rotate(315deg);
          float: left;
      }
      #bextBar.close #bextBarExpand {
          transform: rotate(135deg);
          margin-left: 0px;
      }
      .bextButton {
          margin: 4px .5em;
          padding: 4px .75em;
          background: whitesmoke;
          border: none;
          outline: none;
          border-radius: 1em;
          font-size: 13px;
          line-height: 13px;
          width: auto;
          box-shadow: 0 2px 2px lightgray;
          transition: opacity .5s;
      }
      .bextButton span {
          margin: .125rem;
          display: inline;
      }
      .delButton {
          font-family: sans-serif;
      }
      .ghost {
          opacity: 0.5;
      }
      #bextGhostBox {
          position: fixed;
          left: -150%;
          top: -150%;
          background: transparent;
          z-index: 1000001;
      }
      #bextGhost {
          position: absolute;
          top: 0;
          left: 0;
          width: max-content;
          opacity: 2;
      }`;
    document.head.appendChild(sty);
    bar.id = 'bextBar';
    document.body.appendChild(bar);
    ghostbox.id = 'bextGhostBox';
    document.body.appendChild(ghostbox);

    window.bextBar = {
      bar,
      buttons,
      del: function (id) {
        if (!bextBar.buttons.includes(id)) return 1;
        let button = this.bar.querySelector(`#bextButton-${id}`);
        if (button) this.bar.removeChild(button);
        bextBar.buttons.splice(bextBar.buttons.indexOf(id), 1);
        return 0;
      },
      query: function (id) {
        if (!bextBar.buttons.includes(id)) return 1;
        let button = this.bar.querySelector(`#bextButton-${id}`);
        return {
          button: button,
          text: button.querySelector('span').innerText,
          backcolor: button.style.backgroundColor,
          textcolor: button.style.color,
        };
      },
      change: function (id, opt) {
        if (!bextBar.buttons.includes(id)) return 1;
        let optret = optCheck(opt, false);
        if (optret !== 0) return optret;
        let button = this.bar.querySelector(`#bextButton-${id}`);
        if (button) {
          if (opt.textcolor) button.style.color = opt.textcolor;
          if (opt.backcolor) button.style.backgroundColor = opt.backcolor;
          if (opt.text) button.querySelector('span').innerText = opt.text;
          if (opt.callback)
            button.onclick = opt.callback.bind(window, this, button);
          return 0;
        }
      },
      add: function (id, opt) {
        if (!id || !isObj(opt)) return 1;
        opt = Object.assign(
          {
            text: '按钮',
            backcolor: 'whitesmoke',
            textcolor: '#333',
          },
          opt,
        );
        if (typeof id !== 'string') return 7;
        let optret = optCheck(opt, true);
        if (optret !== 0) return optret;
        if (!this.bar.querySelector(`#bextButton-${id}`)) {
          let button = document.createElement('button'),
            btext = document.createElement('span'),
            switchBtn = function (frombtn, tobtn) {
              let a = document.createElement('a');
              tobtn.insertAdjacentElement('beforeBegin', a);
              frombtn.insertAdjacentElement('beforeBegin', tobtn);
              a.insertAdjacentElement('beforeBegin', frombtn);
              tobtn.parentNode.removeChild(a);
            },
            idBtn = (id) => bar.querySelector(`#bextButton-${id}`),
            switchArr = (fromid, toid) => {
              let fromPos = bextBar.buttons.indexOf(fromid),
                toPos = bextBar.buttons.indexOf(toid);
              bextBar.buttons[toPos] = fromid;
              bextBar.buttons[fromPos] = toid;
            },
            shuffleBtn = function (frombtn, tobtn) {
              let fromid = frombtn.id.slice(11),
                toid = tobtn.id.slice(11),
                fromPos = bextBar.buttons.indexOf(fromid),
                toPos = bextBar.buttons.indexOf(toid),
                movePos = Math.max(fromPos, toPos) - Math.min(fromPos, toPos);
              if (movePos > 1) {
                if (fromPos > toPos) {
                  for (let i = fromPos; i > toPos; i--) {
                    switchBtn(
                      idBtn(bextBar.buttons[i]),
                      idBtn(bextBar.buttons[i - 1]),
                    );
                    switchArr(bextBar.buttons[i], bextBar.buttons[i - 1]);
                  }
                } else {
                  for (let i = fromPos; i < toPos; i++) {
                    switchBtn(
                      idBtn(bextBar.buttons[i]),
                      idBtn(bextBar.buttons[i + 1]),
                    );
                    switchArr(bextBar.buttons[i], bextBar.buttons[i + 1]);
                  }
                }
              } else {
                switchBtn(frombtn, tobtn);
                switchArr(fromid, toid);
              }
            };
          button.id = `bextButton-${id}`;
          button.className = 'bextButton';
          button.draggable = true;
          button.appendChild(btext);
          bextBar.buttons.push(id);
          if ('ontouchend' in document) {
            button.addEventListener('touchstart', (e) => {
              ghostbox.innerHTML = '';
              ghost = document.importNode(e.currentTarget, true);
              ghost.id = 'bextGhost';
              ghostbox.appendChild(ghost);
            });
            button.addEventListener('touchmove', (e) => {
              let ghostWidth = parseInt(
                  getComputedStyle(e.currentTarget).width,
                ),
                ghostHeight = parseInt(
                  getComputedStyle(e.currentTarget).height,
                );
              e.currentTarget.classList.add('ghost');
              ghost.style.opacity = 0.5;
              ghostbox.style.left =
                e.touches[0].clientX - ghostWidth / 2 + 'px';
              ghostbox.style.top =
                e.touches[0].clientY - ghostHeight - 10 + 'px';
              drag = e.currentTarget;
            });
            button.addEventListener('touchend', (e) => {
              let target = document.elementFromPoint(
                e.changedTouches[0].clientX,
                e.changedTouches[0].clientY,
              );
              if (target.tagName == 'SPAN') target = target.parentNode;
              if (
                drag &&
                target.className.includes('bextButton') &&
                drag != target
              ) {
                shuffleBtn(drag, target);
              }
              bextBar.bar
                .querySelectorAll('.bextButton')
                .forEach((btn) => btn.classList.remove('ghost'));
              ghostbox.style.top = ghostbox.style.bottom = '-150%';
              drag = null;
            });
          } else {
            button.addEventListener('dragstart', (e) => {
              e.target.classList.add('ghost');
              ghostbox.innerHTML = '';
              ghost = document.importNode(e.currentTarget, true);
              ghost.id = 'bextGhost';
              ghostbox.appendChild(ghost);
              if (e.dataTransfer.mozCursor) {
                e.dataTransfer.setDragImage(ghost, -25, -75);
              } else {
                e.dataTransfer.setDragImage(ghost, 25, 25);
              }
              drag = e.currentTarget;
            });
            button.addEventListener('dragover', (e) => e.preventDefault());
            button.addEventListener('dragend', () => {
              bextBar.bar
                .querySelectorAll('.button')
                .forEach((b) => b.classList.remove('ghost'));
            });
            button.addEventListener('drop', (e) => {
              e.preventDefault();
              if (drag != e.currentTarget) {
                shuffleBtn(drag, e.currentTarget);
              }
              drag.classList.remove('ghost');
              drag = e.currentTarget;
            });
          }
          //  TODO: 用户应有权删除按钮
          //  但下次脚本运行时还会加 ...
          let close = document.createElement('span');
          close.innerText = '✖';
          close.className = 'delButton';
          close.onclick = (e) => {
            e.stopPropagation();
            bextBar.del(id);
          };
          button.appendChild(close);
          this.bar.appendChild(button);
          let change = this.change(id, opt);
          if (change != 0) this.del(id);
          return change;
        } else return 10;
      },
    };
  }
  return window.bextBar;
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
export function toast(t, s, c) {
  let isObj = (o) =>
    typeof o == 'object' && !(o instanceof Array || o instanceof Function);
  if (typeof t != 'string' || t == '') return 1;
  if (typeof s != 'number' || s < 1) return 2;
  if (!isObj(c) || (!c.text && !c.color && !c.onclick && !c.onclose)) return 3;
  if (c.text && (typeof c.text != 'string' || c.text == '')) return 4;
  if (c.color && (typeof c.color != 'string' || c.color == '')) return 5;
  if (c.onclick && typeof c.onclick !== 'function') return 6;
  if (c.onclose && typeof c.onclose !== 'function') return 7;
  let td = document.createElement('div'),
    tk = document.createElement('style'),
    tt = function () {
      document.body.removeChild(td);
      document.head.removeChild(tk);
      // TODO: 如果触发了 onclick ，不应该触发 onclose
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
}`;
  document.head.appendChild(tk);
  td.style.cssText = `
  position: fixed;
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
      color: ${c && c.color ? c.color : 'turquoise'};
    `;
    if (c && c.onclick) {
      ctext.onclick = c.onclick;
    }
    td.appendChild(ctext);
  }
  document.body.appendChild(td);
  td.onanimationend = tt;
  td.onwebkitanimationend = tt;
}
