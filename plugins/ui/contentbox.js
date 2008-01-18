/*
 * Copyright 2007 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

if (typeof fleegix == 'undefined') { var fleegix = {}; }
if (typeof fleegix.ui == 'undefined') { fleegix.ui = {}; }
fleegix.ui.ContentBox = function (domNode, id) {
  this.domNode = domNode || null;
  this.id = id || domNode.id;
  if (!this.id) { throw new Error('ContentBox must have an id.'); }
  // Positioning fu
  this.top = 0;
  this.left = 0;
  this.width = 0;
  this.height = 0;
  // Hierarchicalness
  this.parent = null;
  this.children = [];
  // Flag for init-only code that has to run
  this.hasBeenRendered = false;
}
fleegix.ui.ContentBox.prototype = new function () {
  this.cleanup =  function () {
    this.domNode = null;
  };
  this.clearAll =  function () {
    while (this.domNode.hasChildNodes()) {
      this.domNode.removeChild(this.domNode.firstChild);
    }
    this.domNode.innerHTML = '';
  };
  this.setPosition =  function (left, top) {
    this.setTop(top);
    this.setLeft(left);
  };
  this.setSize =  function (width, height) {
    this.setWidth(width);
    this.setHeight(height);
  };
  this.setTop =  function (top) {
    if (typeof top != 'undefined') {
      this.top = top;
    }
    n = this.top;
    this.domNode.style.position = 'absolute';
    this.domNode.style.top = parseInt(n) + 'px';
  };
  this.setLeft =  function (left) {
    if (typeof left != 'undefined') {
      this.left = left;
    }
    n = this.left;
    this.domNode.style.position = 'absolute';
    this.domNode.style.left = parseInt(n) + 'px';
  };
  this.setWidth =  function (width) {
    if (typeof width != 'undefined') {
      this.width = width;
    }
    n = this.width;
    n = n.toString();
    n = n.indexOf('%') > -1 ? n : parseInt(n) + 'px';
    this.domNode.style.width = n;
  };
  this.setHeight =  function (height) {
    if (typeof height != 'undefined') {
      this.height = height;
    }
    n = this.height;
    n = n.toString();
    n = n.indexOf('%') > -1 ? n : parseInt(n) + 'px';
    this.domNode.style.height = n;
  };
  this.appendToDomNode = function (node) {
    if (!this.domNode) {
      throw new Error('ContentBox "' + this.id + '" has no domNode.');
    }
    else {
      node.appendChild(this.domNode);
    }
  }
  this.hide =  function (visOnly) {
    if (visOnly) {
      this.domNode.style.visibility = 'hidden';
    }
    else {
      this.domNode.style.display = 'none';
    }
  };
  this.show =  function (visOnly) {
    if (visOnly) {
      this.domNode.style.visibility = 'visible';
    }
    else {
      this.domNode.style.display = 'block';
    }
  };
  this.renderSelf =  function () {};
  this.update = function (p) {
    var params = p || {};
    for (var n in params) { this[n] = params[n]; }
  };
  this.render = function () {
    if (typeof this.renderSelf == 'function') {
      this.renderSelf();
    };
    var ch = this.children;
    for (var i = 0; i < ch.length; i++) {
      ch[i].render();
    }
  };
  this.addChild = function (c) {
    this.children.push(c);
    c.parent = this;
    this.domNode.appendChild(c.domNode);
  };
  this.center = function () {
    if (!fleegix.dom) {
      throw new Error('This method depends on the fleegix.dom module in fleegix.js base.');
    }
    else {
      this.domNode.style.position = 'absolute';
      fleegix.dom.center(this.domNode);
    }
  };
};



