/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org) 
 * and SitePoint Pty. Ltd, www.sitepoint.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS;
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.xhr = new function () {
  
  function spawnTransporter(isSync) {
    var i = 0;
    var t = [ // Array of XHR obj to try to invoke
      function () { return new XMLHttpRequest(); },
      function () { return new ActiveXObject('Msxml2.XMLHTTP') },
      function () { return new ActiveXObject('Microsoft.XMLHTTP' )} ];
    var trans = null;
    // Instantiate XHR obj
    while (!trans && (i < t.length)) {
      try { trans = t[i++](); } 
      catch(e) {}
    }
    if (trans) {
      if (isSync) {
        return trans;
      }
      else {
        fleegix.xhr.transporters.push(trans);
        var transporterId = fleegix.xhr.transporters.length - 1;
        return transporterId;
      }
    }
    else {
      throw('Could not create XMLHttpRequest object.');
    }
  }
  
  // Public members 
  // ================================
  // Array of XHR obj transporters, spawned as needed up to 
  // maxTransporters ceiling
  this.transporters = [];
  // Maximum number of XHR objects to spawn to handle requests
  // IE6 and IE7 are shite for XHR re-use -- fortunately
  // copious numbers of XHR objs don't seem to be a problem
  // Moz/Safari perform significantly better with XHR re-use
  this.maxTransporters = document.all ? 500 : 5;
  // Used to increment request IDs -- these may be used for
  // externally tracking or aborting specific requests
  this.lastReqId = 0;
  // Queued-up requests -- appended to when all XHR transporters
  // are in use -- FIFO list, XHR objs respond to waiting
  // requests immediately as then finish processing the current one
  this.requestQueue = [];
  // List of free XHR objs -- transporters sit here when not 
  // processing requests. If this is empty when a new request comes
  // in, we try to spawn a request -- if we're already at max 
  // transporter number, we queue the request
  this.idleTransporters = [];
  // Hash of currently in-flight requests -- each string key is
  // the index pos in this.transporters of the XHR obj that's in use
  // Used to abort processing requests
  this.processing = {};
  // The single XHR obj used for synchronous requests -- sync
  // requests do not participate in the request pooling
  this.syncTransporter = spawnTransporter(true);
  // Show exceptions for connection failures
  this.debug = false;
  
  // Public methods
  // ================================
  this.doGet = function () {
    var o = {};
    var hand = null;
    var args = Array.prototype.slice.apply(arguments);
    if (typeof args[0] == 'function') {
      o.async = true;
      hand = args.shift();
    }
    else {
      o.async = false;
    }
    var url = args.shift();
    // Passing in keyword/obj after URL
    if (typeof args[0] == 'object') {
      var opts = args.shift();
      for (var p in opts) {
        o[p] = opts[p];
      }
    }
    // Normal order-based params of URL, [responseFormat]
    else {
      o.responseFormat = args.shift() || 'text';
    }
    o.handleSuccess = hand;
    o.url = url;
    return this.doReq(o);
  };
  this.doPost = function () {
    var o = {};
    var hand = null;
    var args = Array.prototype.slice.apply(arguments);
    if (typeof args[0] == 'function') {
      o.async = true;
      hand = args.shift();
    }
    else {
      o.async = false;
    }
    var url = args.shift();
    var dataPayload = args.shift();
    // Passing in keyword/obj after URL
    if (typeof args[0] == 'object') {
      var opts = args.shift();
      for (var p in opts) {
        o[p] = opts[p];
      }
    }
    // Normal order-based params of URL, [responseFormat]
    else {
      o.responseFormat = args.shift() || 'text';
    }
    o.handleSuccess = hand;
    o.url = url;
    o.dataPayload = dataPayload;
    o.method = 'POST';
    return this.doReq(o);
  };
  this.doReq = function (o) {
    var opts = o || {};
    var req = new fleegix.xhr.Request();
    var transporterId = null;

    // Override default request opts with any specified 
    for (var p in opts) {
      req[p] = opts[p];
    }
    
    this.lastReqId++; // Increment req ID
    req.id = this.lastReqId;
    
    // Return request ID or response
    // Async -- handle request or queue it up
    // -------
    if (req.async) {
      // If we have an instantiated XHR we can use, let him handle it
      if (this.idleTransporters.length) {
        transporterId = this.idleTransporters.shift();
      }
      // No available XHRs -- spawn a new one if we're still
      // below the limit
      else if (this.transporters.length < this.maxTransporters) {
        transporterId = spawnTransporter();
      }
      
      // If we have an XHR transporter to handle the request, do it
      // transporterId should be a number (index of XHR obj in this.transporters)
      if (transporterId != null) {
        this.processReq(transporterId, req);
      }
      // No transporter available to handle the request -- queue it up
      else {
        // Uber-requests step to the front of the line, please
        if (req.uber) {
          this.requestQueue.unshift(req);
        }
        // Normal queued requests are FIFO
        else {
          this.requestQueue.push(req);
        }
      }
      // Return request ID -- may be used for aborting, 
      // external tracking, etc.
      return req.id;
    }
    // Sync -- do request inlne and return actual result 
    // -------
    else {
        return this.processReq(this.syncTransporter, req);
    }
  };
  this.processReq = function (t, req) {
    var self = this;
    var transporterId = null;
    var trans = null;
    var url = '';
    var resp = null;
    
    // Return desired type of response, text, xml, or raw obj.
    // Used both in the anonymous function for onreadystatechange
    // in async mode and in blocking mode
    function getResponseByType() {
        // Set the response according to the desired format
        switch(req.responseFormat) {
          // Text
          case 'text':
            r = trans.responseText;
            break;
          // XML
          case 'xml':
            r = trans.responseXML;
            break;
          // The object itself
          case 'object':
            r = trans;
            break;
        }
        return r;
    }
   
    // Async mode -- grab an XHR obj from the pool
    if (req.async) {
      transporterId = t;
      trans = this.transporters[transporterId];
      this.processing[transporterId] = trans;
    }
    // Sync mode -- use XHR transporter passed in 
    else {
      trans = t;
    }
    
    if (req.preventCache) {
      var dt = new Date.getTime();
      url = req.url.indexOf('?') > -1 ? req.url + '&preventCache=' + dt : 
        req.url + '?preventCache=' + dt;
    }
    else {
      url = req.url;
    }
    
    // Set up the request
    // ==========================
    if (req.username && req.password) {
      trans.open(req.method, url, req.async, req.username, req.password);
    }
    else {
      trans.open(req.method, url, req.async);
    }
    // Override MIME type if necessary for Mozilla/Firefox & Safari
    if (req.mimeType && navigator.userAgent.indexOf('MSIE') == -1) {
      trans.overrideMimeType(req.mimeType);
    }
    
    // Add any custom headers that are defined
    if (req.headers.length) {
      // Set any custom headers
      for (var i = 0; i < req.headers.length; i++) {
        var headArr = req.headers[i].split(': ');
        trans.setRequestHeader(headArr[i], headArr[1]);
      }
    }
    // Otherwise set correct content-type for POST
    else {
      if (req.method == 'POST') {
        trans.setRequestHeader('Content-Type', 
          'application/x-www-form-urlencoded');
      }
    }
    
    // Anonymous handler for async mode
    trans.onreadystatechange = function () {
      // When request completes
      if (trans.readyState == 4) {
        
        // Grab the desired response type
        resp = getResponseByType();
        
        // If we have a One True Event Handler, use that
        // Best for odd cases such as Safari's 'undefined' status
        if (req.handleAll) {
          req.handleAll(resp, req.id);
        }
        // Otherwise hand to either success/failure
        else {
          // Use try-catch to avoid NS_ERROR_NOT_AVAILABLE 
          // err in Firefox for broken connections or hitting ESC
          try {
            // Request was successful -- execute response handler
            if (trans.status > 199 && trans.status < 300) {
              // Make sure handler is defined
              if (!req.handleSuccess) {
                throw('No response handler defined ' +
                  'for this request');
                return;
              }
              else {
                req.handleSuccess(resp, req.id);
              }
            }
            // Request failed -- execute error handler
            else {
              if (req.handleErr) {
                req.handleErr(resp, req.id);
              }
              else {
                fleegix.xhr.handleErrDefault(trans);
              }
            }
          }
          // Squelch
          catch (e) { 
            if (self.debug) { throw(e); }
          }
        }

        // Clean up, move immediately to respond to any
        // queued up requests
        if (req.async) {
          // Cancel timeout timer 
          clearTimeout(req.timeoutId);
          
          // Remove from list of transporters currently in use
          // this XHR can't be aborted until it's processing again
          delete self.processing[transporterId];
          
          // Requests queued up, grab one to respond to 
          if (self.requestQueue.length) {
            var nextReq = self.requestQueue.shift();
            self.processReq(transporterId, nextReq);
          }
          // Otherwise this transporter is idle, waiting to respond
          else {
            self.idleTransporters.push(transporterId);
          }
        }
      }
    };

    // Send the request, along with any data for POSTing
    // ==========================
    trans.send(req.dataPayload);
    
    // Async -- setup timeout timer to wait designated time
    // before aborting request
    if (req.async) {
      var f = function () {
        if (fleegix.xhr.abort(req.id)) {
          if (typeof req.handleTimeout == 'function') {
            req.handleTimeout();
          }
          else {
            alert('XMLHttpRequest to ' + req.url + ' timed out.');
          }
        }
      };
      req.timeoutId = setTimeout(f, req.timeoutPeriod);
    }
    // Sync mode -- return actual result inline back to doReq
    else {
      resp = getResponseByType();
      return resp;
    }
  }
  this.abort = function (reqId) {
    // Abort the req if it's still processing
    var t = this.processing[reqId];
    if (t) {
      // onreadystatechange can still fire as abort is executed
      t.onreadystatechange = function () { };
      t.abort();
      return true;
    }
    else {
      return false;
    }
  };
};

fleegix.xhr.constructor = null;

fleegix.xhr.Request = function () {
  this.id = 0;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.dataPayload = null;
  this.readyState = null;
  this.responseText = null;
  this.responseXML = null;
  this.handleAll = null;
  this.handleSuccess = null;
  this.handleErr = null;
  this.handleTimeout = null;
  this.responseFormat = 'text', // 'text', 'xml', 'object'
  this.mimeType = null;
  this.username = '';
  this.password = '';
  this.headers = [];
  this.preventCache = false;
  this.timeoutId = null;
  this.timeoutPeriod = 30000; // Default to 30-sec timeout
  this.uber = false;
}
fleegix.xhr.Request.prototype.setRequestHeader = function (headerName, headerValue) {
  this.headers.push(headerName + ': ' + headerValue);
};
    
// Default err handler -- pop up full window with error
// if request has no handler specifically defined
fleegix.xhr.handleErrDefault = function (r) {
    var errorWin;
    // Create new window and display error
    try {
      errorWin = window.open('', 'errorWin');
      errorWin.document.body.innerHTML = r.responseText;
    }
    // If pop-up gets blocked, inform user
    catch(e) {
      alert('An error occurred, but the error message cannot be' +
      ' displayed because of your browser\'s pop-up blocker.\n' +
      'Please allow pop-ups from this Web site.');
    }
};

