/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
if (typeof fleegix.menu == 'undefined') { fleegix.menu = {}; }
fleegix.menu.MenuManager = new function () {
  this.contextMenu = null;
  this.createContextMenu = function(domNode, items) {
    var o = { preventDefault: true, stopPropagation: true };
    this.contextMenu = new fleegix.menu.ContextMenu(items);
    fleegix.event.listen(domNode, 'onmousedown',
      fleegix.menu.MenuManager, 'showContextMenu', o);
    fleegix.event.listen(domNode, 'oncontextmenu',
      function () { return false; }, o);
  };
  this.showContextMenu = function (e) {
    if (e.button == 2) {
      xPos = e.clientX;
      yPos = e.clientY;
      if (!this.contextMenu) {
        throw('Please set up a contextal menu using createContextMenu.')
      }
      var d = this.contextMenu.domNode;
      d.style.top = yPos + 'px';
      d.style.left = xPos + 'px';
      d.style.display = 'block';
    }
    else {
      this.hideContextMenu();
    }
  };
  this.hideContextMenu = function (e) {
    if (e && e.target && e.target.id &&
      e.target.id.indexOf('contextMenuItem') > -1) {
      return true;
    }
    var c = this.contextMenu;
    if (c) {
      c.domNode.style.display = 'none';
    }
  };
}

fleegix.menu.ContextMenu = function (items) {
  var _this = this;
  var d = document.createElement('div');
  this.domNode = d;
  this.handlers = {};
  d.id = 'contextMenu';
  d.style.position = 'absolute';
  d.style.display = 'none';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var m = document.createElement('a');
    m.id = 'contextMenuItem' + i;
    m.innerHTML = item.display;
    var handleClick = item.handleClick
    var f = function (e) {
      fleegix.menu.MenuManager.hideContextMenu();
      setTimeout(_this.handlers[e.target.id], 0);
    };
    this.handlers[m.id] = item.handleClick;
    fleegix.event.listen(m, 'onclick', f);
    d.appendChild(m);
  }

  document.body.appendChild(d);
};

fleegix.menu.ContextMenuItem = function (p) {
  this.display = p.display || '';
  this.handleClick = p.handleClick || null;
}
fleegix.event.listen(document, 'onmousedown',
  fleegix.menu.MenuManager, 'hideContextMenu');

