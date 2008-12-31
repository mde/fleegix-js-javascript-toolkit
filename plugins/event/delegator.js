/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
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
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
if (typeof fleegix.event == 'undefined') {
  throw('fleegix.event.delegator depends on the base fleegix.event module in fleegix.js.'); }

fleegix.event.Delegator = function (containerNode, actions,
  options) {
  var _this = this;
  this.containerNode = containerNode;
  // List of CSS class names and their corresponding
  // click-actions
  this.actions = actions || {};
  // Optional execution context for called actions
  var opts = options || {};
  this.context = opts.context || null;
  // Assume we want to stop any further action
  this.stopPropagation =
    typeof opts.stopPropagation != 'undefined' ?
    opts.stopPropagation : true;
  this.preventDefault =
    typeof opts.preventDefault != 'undefined' ?
    opts.preventDefault : true;

  // Add another action
  this.addClickAction = function (className, act) {
    this.actions[className] = act;
  };
  this.getClickAction = function (e) {
    var actions = this.actions;
    var containerNode = this.containerNode;
    var node = e.target;
    var topNode = containerNode || document.body;
    // Look upward from the click target to the
    // a predefined parent -- if any of the parentNodes
    // have an action class attached, return the
    // class and bail out
    while (node.parentNode && node != topNode) {
      if (node.className) {
        for (var c in actions) {
          // Look through class name(s) set on the node
          var names = node.className.split(' ');
          for (var i = 0; i < names.length; i++) {
            if (names[i] == c) {
              return c;
            }
          }
        }
      }
      node = node.parentNode;
    }
    return null;
  };
  this.handleClick = function (e) {
    var context = this.context;
    var key = _this.getClickAction(e);
    // If there's a CSS class in the click chain with
    // a matching action, exec the action
    if (key) {
      var act = this.actions[key];
      if (context) {
        act.call(context, e);
      }
      else {
        act(e);
      }
      if (this.stopPropagation) {
        fleegix.event.stopPropagation(e);
      }
      if (this.preventDefault) {
        fleegix.event.preventDefault(e);
      }
    }
  };
  fleegix.event.listen(containerNode, 'onclick',
    this, 'handleClick');
};

