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
if (typeof fleegix.drag == 'undefined') { fleegix.drag = {}; }
fleegix.drag.xPos = null;
fleegix.drag.yPos = null;
// Manager singleton
fleegix.drag.DragManager = new function () {
  var _this = this;
  this.registry = [];
  this.raiseMap = {};
  this.dragMap = {};
  this.currentDraggable = null;
  this.currentZIndex = 999;
  this.addDragWindow = function (containerNode, handleNode) {
    if (!containerNode.id) {
      throw('Draggable DOM nodes must have an id'); }
    if (!handleNode) { handleNode = containerNode; }
    var setupDrag =
      function (e) { _this.setUpDrag.apply(_this, [e]); };
    fleegix.event.listen(handleNode, 'onmousedown', setupDrag);
    var raiseDraggable =
      function (e) { _this.raiseDraggable.apply(_this, [e]); };
    fleegix.event.listen(containerNode,
      'onmousedown', raiseDraggable);
    var d = new fleegix.drag.DragWindow({
      containerNode: containerNode });
    this.registry.push(d);
    this.raiseMap[containerNode.id] = d;
    this.dragMap[handleNode.id] = d;
    this.raiseDraggable(containerNode.id);
  };
  this.setUpDrag = function (e) {
    var elem = e.target;
    var d = this.dragMap[elem.id];
    // Look up the DOM hierarchy until we find
    //something in the map of raiseable nodes
    while (!d && elem != document.body) {
      if (elem.parentNode) {
        elem = elem.parentNode;
        d = this.dragMap[elem.id];
      }
    }
    if (d) {
      this.currentDraggable = d;
      this.currentDraggable.startDrag();
    }
  };
  this.raiseDraggable = function (p) {
    var key = '';
    if (typeof p == 'string') {
      var d = this.raiseMap[p];
    }
    else {
      var elem = p.target;
      var d = this.raiseMap[elem.id];
      // Look up the DOM hierarchy until we find
      //something in the map of raiseable nodes
      while (!d && elem != document.body) {
        if (elem.parentNode) {
          elem = elem.parentNode;
          d = this.raiseMap[elem.id];
        }
      }
    }
    this.currentZIndex++;
    d.containerNode.style.zIndex = this.currentZIndex;
  };
  this.mouseMoveHandler = function (e) {
    var d = fleegix.drag;
    d.xPos = e.clientX;
    d.yPos = e.clientY;
    if (_this.currentDraggable) {
      _this.currentDraggable.drag();
    }
  };
  this.mouseUpHandler = function (e) {
    if (_this.currentDraggable) {
      _this.currentDraggable.drop();
      _this.currentDraggable = null;
    }
  };
};
// Draggable DragWindow pseudoclass
fleegix.drag.DragWindow = function (p) {
  var params = p || {};
  this.containerNode = null;
  this.handleNode = null;
  this.clickOffsetX = 0;
  this.clickOffsetY = 0;
  for (var n in params) { this[n] = params[n] }
};
fleegix.drag.DragWindow.prototype.startDrag = function () {
  var d = fleegix.drag;
  this.clickOffsetX = d.xPos -
    parseInt(this.containerNode.style.left);
  this.clickOffsetY = d.yPos -
    parseInt(this.containerNode.style.top);
  // Turn off text selection in IE while dragging
  document.onselectstart = function () { return false; };
};
fleegix.drag.DragWindow.prototype.drag = function () {
  var d = fleegix.drag;
  this.containerNode.style.left =
    (d.xPos - this.clickOffsetX) + 'px';
  this.containerNode.style.top =
    (d.yPos - this.clickOffsetY) + 'px';
  // Hacky way of preventing text selection in FF
  // for the entire doc -- inserting a CSS rule for
  // -moz-user-select for all elements or something
  // seems like a lot of work
  document.body.focus();
};
fleegix.drag.DragWindow.prototype.drop = function () {
  // Re-enable text selection in IE
  document.onselectstart = null;
};
// Event listeners for dragging, raising DragWindow, dropping
fleegix.event.listen(document, 'onmousemove',
  fleegix.drag.DragManager, 'mouseMoveHandler');
fleegix.event.listen(document, 'onmouseup',
  fleegix.drag.DragManager, 'mouseUpHandler');

