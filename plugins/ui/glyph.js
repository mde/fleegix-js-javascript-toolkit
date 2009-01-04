/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
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
fleegix.ui.GlyphRegistry = {};
fleegix.ui.defaultUnits = 'px';
fleegix.ui.Glyph = function (domNode, id) {
  this.domNode = domNode || null;
  this.id = id || domNode.id;
  if (!this.id) { throw new Error('Glyph must have an id.'); }
  // Positioning fu
  this.top = 0;
  this.left = 0;
  this.width = 0;
  this.height = 0;
  // Data
  this.data = null;
  // Hierarchicalness
  this.parent = null;
  this.children = [];
  // Flag for init-only code that has to run
  this.hasBeenRendered = false;
  // Visibility flag
  this.visible = true;
  // List of Glyphes
  fleegix.ui.GlyphRegistry[id] = this;
  // Place to keep data
  this.data = null;
};
fleegix.ui.Glyph.prototype = new function () {
  this.cleanup =  function () {
    this.domNode = null;
  };
  this.clearNode =  function (node, useInnerHTML) {
    if (useInnerHTML) {
      node.innerHTML = '';
    }
    else {
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
    }
  };
  this.clearAll =  function () {
    if (this.domNode) {
      this.clearNode(this.domNode);
    }
    var ch = this.children;
    if (ch && ch.length) {
      for (var i = 0; i < ch.length; i++) {
        ch[i].clearAll();
      }
    }
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
    if (fleegix.ui.defaultUnits == 'px') {
      n = parseInt(n, 10);
    }
    this.domNode.style.position = 'absolute';
    this.domNode.style.top = n + fleegix.ui.defaultUnits;
  };
  this.setLeft =  function (left) {
    if (typeof left != 'undefined') {
      this.left = left;
    }
    n = this.left;
    if (fleegix.ui.defaultUnits == 'px') {
      n = parseInt(n, 10);
    }
    this.domNode.style.position = 'absolute';
    this.domNode.style.left = n + fleegix.ui.defaultUnits;
  };
  this.setWidth =  function (width) {
    if (typeof width != 'undefined') {
      this.width = width;
    }
    n = this.width;
    if (typeof n == 'number') {
      if (fleegix.ui.defaultUnits == 'px') {
        n = parseInt(n, 10);
      }
      n = n.toString() + fleegix.ui.defaultUnits
    }
    this.domNode.style.width = n;
  };
  this.setHeight =  function (height) {
    if (typeof height != 'undefined') {
      this.height = height;
    }
    n = this.height;
    if (typeof n == 'number') {
      if (fleegix.ui.defaultUnits == 'px') {
        n = parseInt(n, 10);
      }
      n = n.toString() + fleegix.ui.defaultUnits
    }
    this.domNode.style.height = n;
  };
  this.appendToDomNode = function (node) {
    if (!this.domNode) {
      throw new Error('Glyph "' + this.id + '" has no domNode.');
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
    this.visible = false;
  };
  this.show =  function (visOnly) {
    if (visOnly) {
      this.domNode.style.visibility = 'visible';
    }
    else {
      this.domNode.style.display = 'block';
    }
    this.visible = true;
  };
  this.renderSelf =  function () {};
  this.update = function (p) {
    var params = p || {};
    for (var n in params) { this[n] = params[n]; }
  };
  this.render = function () {
    // Run the init function on first render if it's defined
    if (!this.hasBeenRendered && typeof this.init == 'function') {
      this.init();
    }
    if (typeof this.renderSelf == 'function') {
      this.renderSelf();
    };
    var children = this.children;
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      child.render();
    }
    this.hasBeenRendered = true;
  };
  this.addChild = function (c) {
    this.children.push(c);
    c.parent = this;
    this[c.id] = c;
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



