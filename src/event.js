
/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.event = new function() {
  
  // List of handlers for event listeners
  var listenerCache = [];
  // List of channels being published to
  var channels = {};
  
  this.listen = function() {
    var tgtObj = arguments[0]; // Target object for the new listener
    var tgtMeth = arguments[1]; // Method to listen for
    // Look to see if there's already a registry of listeners
    var listenReg = tgtObj[tgtMeth] ? 
      tgtObj[tgtMeth].listenReg : null;
    
    // Create the registry of listeners if need be
    // -----------------
    if (!listenReg) {
      listenReg = {};
      // The original obj and method name 
      listenReg.orig = {}
      listenReg.orig.obj = tgtObj, 
      listenReg.orig.methName = tgtMeth;
      // Clone existing method code if it exists
      if (tgtObj[tgtMeth]) {
        listenReg.orig.methCode = tgtObj[tgtMeth];
      }
      // Array of handlers to execute if the method fires
      listenReg.after = [];
      // Replace the original method with the exec proxy
      tgtObj[tgtMeth] = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        fleegix.event.exec(
          tgtObj[tgtMeth].listenReg, args);
      }
      tgtObj[tgtMeth].listenReg = listenReg;
      // Add to global cache -- so we can remove listeners on unload
      listenerCache.push(tgtObj[tgtMeth].listenReg);
    }
    
    // Add the new handler to the listener registry
    // -----------------
    // Simple function
    if (typeof arguments[2] == 'function') {
      listenReg.after.push(arguments[2]);
    }
    // Object and method
    else {
      listenReg.after.push([arguments[2], arguments[3]]);
    }
    
    tgtObj[tgtMeth].listenReg = listenReg;
  };
  this.exec = function(reg, args) {
    // Execute the original code for the trigger
    // method if there is any -- apply arguments
    // passed in the right execution context
    if (reg.orig.methCode) {
      reg.orig.methCode.apply(reg.orig.obj, args);
    }
    if (reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)) {
      args[0] = args[0] || window.event;
    }
    
    // Execute all the handler functions registered
    for (var i = 0; i < reg.after.length; i++) {
      var ex = reg.after[i];
      // Single functions
      if (ex.length == 0) {
        var execFunction = ex;
        execFunction(args);
      }
      // Methods of objects
      else {
        execObj = ex[0];
        execMethod = ex[1];
        // Pass args and exec in correct scope
        execObj[execMethod].apply(execObj, args);
      }
    }
  };
  this.unlisten = function() {
    var tgtObj = arguments[0]; // Obj from which to remove
    var tgtMeth = arguments[1]; // Trigger method
    var listenReg = tgtObj[tgtMeth] ? 
      tgtObj[tgtMeth].listenReg : null;
    var remove = null;
    
    // Bail out if no handlers
    if (!listenReg) {
      return false;
    }
    
    // Simple function
    // Remove the handler if it's in the list
    for (var i = 0; i < listenReg.after.length; i++) {
      var ex = listenReg.after[i];
      if (typeof arguments[2] == 'function') {
        if (ex == arguments[2]) {
          listenReg.after.splice(i, 1);
        }
      }
      // Object and method
      else {
        if (ex[0] == arguments[2] && ex[1] == 
          arguments[3]) {
          listenReg.after.splice(i, 1);
        }
      }
    }
     tgtObj[tgtMeth].listenReg = listenReg;
  };
  this.flush = function() {
    // Remove all the registered listeners to avoid
    // IE6 memleak
    for (var i = 0; i < listenerCache.length; i++) {
      var reg = listenerCache[i];
      removeObj = reg.orig.obj;
      removeMethod = reg.orig.methName;
      removeObj[removeMethod] = null;
    }
  };
  this.subscribe = function(subscr, obj, method) {
    // Make sure there's an obj param
    if (!obj) { return };
    // Create the channel if it doesn't exist
    if (!channels[subscr]) {
      channels[subscr] = {};
      channels[subscr].audience = [];
    }
    else {
      // Remove any previous listener method for the obj
      this.unsubscribe(subscr, obj);
    }
    // Add the object and its handler to the array
    // for the channel
    channels[subscr].audience.push([obj, method]);
  };
  this.unsubscribe = function(unsubscr, obj) {
    // If not listener obj specified, kill the
    // entire channel
    if (!obj) {
      channels[unsubscr] = null;
    }
    // Otherwise remove the object and its handler
    // from the array for the channel
    else {
      if (channels[unsubscr]) {
        var aud = channels[unsubscr].audience;
        for (var i = 0; i < aud.length; i++) {
          if (aud[i][0] == obj) {
             aud.splice(i, 1); 
          }
        }
      }
    }
  };
  this.publish = function(pub, data) {
    // Make sure the channel exists
    if (channels[pub]) {
      aud = channels[pub].audience;
      // Pass the published data to all the 
      // obj/methods listening to the channel
      for (var i = 0; i < aud.length; i++) {
        var listenerObject = aud[i][0];
        var handlerMethod = aud[i][1];
        listenerObject[handlerMethod](data);
      }
    }
  };
  this.getSrcElementId = function(e) {
    var ret = null;
    if (e.srcElement) ret = e.srcElement;
    else if (e.target) ret = e.target;
    // Avoid trying to use fake obj from IE on disabled
    // form elements
    if (typeof ret.id == 'undefined') {
      return null;
    }
    // Look up the id of the elem or its parent
    else {
      // Look for something with an id -- not a text node
      while (!ret.id || ret.nodeType == 3) {
        // Bail if we run out of parents
        if (ret.parentNode) {
          ret = ret.parentNode;
        }
        else {
          return null;
        }
      }
    }
    return ret.id;
  };
}
fleegix.event.constructor = null;
// Prevent memleak in IE6
fleegix.event.listen(window, 'onunload', fleegix.event, 'flush');

