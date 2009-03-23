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

// Params:
// containerNode -- Container node for all the interactivity
//  One event listener for each specified event type is set
//  on this node, and events are dispatched according to the
//  desired class names
// actions -- defines the event listeners to set, and the
//  actions to take based on CSS class. Organized by
//  className/eventType, like so:
//  { classNameA: {
//      click: function () {},
//      mouseover: function () {},
//      mouseout: function () {}
//    },
//    classNameB: {
//      click: function () {}
//    }
// options -- stopPropagation/preventDefault, both default
//   to true, and idTransformer, a function to run on any
//   passed-back DOM-node id
fleegix.event.Delegator = function (containerNode, actions,
  options) {
  var _this = this; // Scope
  // Supported types of event handlers
  var _supportedEvents = {
    'click': true,
    'mousedown': true,
    'mouseup': true,
    'mouseover': true,
    'mouseout': true
  };
  // Set up a particular type of event listener
  // if it doesn't already exist
  var _initEventType = function (p) {
    if (typeof _this.actions[p] == 'undefined') {
      _this.actions[p] = {};
    }
  };

  // Container node for all the interactivity
  this.containerNode = containerNode;
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
  this.idTransformer = opts.idTransformer || null;

  // List of CSS class names and their corresponding
  // event-actions -- organized like so:
  // click: {
  //  classNameA: function () {},
  //  classNameB: function () {}
  // },
  // mouseover: {
  //  classNameC: function () {}
  // }
  // Etc.
  this.actions = {};
  // Look for specific event types to listen for
  // Maps param organized as obj[className][eventType]
  // to internal structure of obj[eventType][className]
  // so we only have to recurse upward through the DOM
  // tree looking at class names for the desired event
  // types
  this.addAction = function (className, act) {
    var useDefault = true;
    for (var p in act) {
      if (typeof _supportedEvents[p] != 'undefined') {
        _initEventType(p);
        this.actions[p][className] = act[p];
        useDefault = false;
      }
    }
    if (useDefault) {
      _initEventType('click');
      this.actions.click[className] = act;
    }
    this.actions[className] = act;
  };
  this.getAction = function (e) {
    var actions = this.actions[e.type];
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
  this.handleEvent = function (e) {
    var context = this.context;
    var key = _this.getAction(e);
    // If there's a CSS class in the click chain with
    // a matching action, exec the action, passing it
    // the event, and the id of the closest node above
    // the event target in the tree
    if (key) {
      var act = this.actions[e.type][key];
      var id = fleegix.event.getSrcElementId(e);
      if (id && typeof this.idTransformer == 'function') {
        id = this.idTransformer(id);
      }
      if (context) {
        act.call(context, e, id);
      }
      else {
        act(e, id);
      }
      if (this.stopPropagation) {
        fleegix.event.stopPropagation(e);
      }
      if (this.preventDefault) {
        fleegix.event.preventDefault(e);
      }
    }
  };
  
  for (var className in actions) {
    this.addAction(className, actions[className]);
  }
  
  for (var evt in this.actions) {
    fleegix.event.listen(containerNode, 'on' + evt,
        this, 'handleEvent');
  }
};

