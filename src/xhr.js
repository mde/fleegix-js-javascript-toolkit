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

  var UNDEFINED_VALUE;
  var msProgId = null; // Cache the prog ID if needed
  function spawnTransporter(isSync) {
    var i = 0;
    var t = [
      'Msxml2.XMLHTTP.6.0',
      'MSXML2.XMLHTTP.3.0',
      'Microsoft.XMLHTTP'
    ];
    var trans = null;
    if (window.XMLHttpRequest) {
      trans = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      if (msProgId) {
        trans = new ActiveXObject(msProgId);
      }
      else {
        for (var i = 0; i < t.length; i++) {
          try {
            trans = new ActiveXObject(t[i]);
            // Cache the prog ID, break the loop
            msProgId = t[i]; break;
          }
          catch(e) {}
        }
      }
    }
    // Instantiate XHR obj
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
      throw new Error('Could not create XMLHttpRequest object.');
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
  this.maxTransporters = 5;
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
  // the request id of the request
  // Used to abort processing requests
  this.processingMap = {};
  this.processingArray = [];
  // The single XHR obj used for synchronous requests -- sync
  // requests do not participate in the request pooling
  this.syncTransporter = spawnTransporter(true);
  this.syncRequest = null;
  // Show exceptions for connection failures
  this.debug = false;
  // The id for the setTimeout used in the the
  // request timeout watcher
  this.processingWatcherId = null;
  // Default number of seconds before a request times out
  this.defaultTimeoutSeconds = 30;
  // Possible formats for the XHR response
  this.responseFormats = { TXT: 'text',
   XML: 'xml',
   OBJ: 'object' };

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

    req.id = this.lastReqId;
    this.lastReqId++; // Increment req ID

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
      if (transporterId !== null) {
        this.processReq(req, transporterId);
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
        return this.processReq(req);
    }
  };
  this.processReq = function (req, t) {
    var self = this;
    var transporterId = null;
    var trans = null;
    var url = '';
    var resp = null;

    // Async mode -- grab an XHR obj from the pool
    if (req.async) {
      transporterId = t;
      trans = this.transporters[transporterId];
      this.processingMap[req.id] = req;
      this.processingArray.unshift(req);
      req.transporterId = transporterId;
    }
    // Sync mode -- use single sync XHR
    else {
      trans = this.syncTransporter;
      this.syncRequest = req;
    }

    // Defeat the evil power of the IE caching mechanism
    if (req.preventCache) {
      var dt = new Date().getTime();
      url = req.url.indexOf('?') > -1 ? req.url + '&preventCache=' + dt :
        req.url + '?preventCache=' + dt;
    }
    else {
      url = req.url;
    }

    // Call 'abort' method in IE to allow reuse of the obj
    if (document.all) {
      trans.abort();
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

    // Send the request, along with any data for POSTing
    // ==========================
    trans.send(req.dataPayload);

    if (this.processingWatcherId === null) {
      this.processingWatcherId = setTimeout(fleegix.xhr.watchProcessing, 10);
    }
    // Sync mode -- return actual result inline back to doReq
    if (!req.async) {
      // Blocks here
      var ret = this.handleResponse(trans, req);
      this.syncRequest = null;
      // Start the watcher loop back up again if need be
      if (self.processingArray.length) {
        self.processingWatcherId = setTimeout(
          fleegix.xhr.watchProcessing, 10);
      }
      return ret;
    }
  };
  this.getResponseByType = function (trans, req) {
    var r = null;
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
  };
  this.watchProcessing = function () {
    var self = fleegix.xhr;
    var proc = self.processingArray;
    var d = new Date().getTime();

    // Stop looping while processing sync requests
    // after req returns, it will start the loop back up
    if (self.syncRequest !== null) {
      return;
    }
    else {
      for (var i = 0; i < proc.length; i++) {
        var req = proc[i];
        var trans = self.transporters[req.transporterId];
        var isTimedOut = ((d - req.startTime) > (req.timeoutSeconds*1000));
        switch (true) {
          // Aborted requests
          case (req.aborted || !trans.readyState):
            self.processingArray.splice(i, 1);
            break;
          // Timeouts
          case isTimedOut:
            self.processingArray.splice(i, 1);
            self.timeout(req);
            break;
          // Actual responses
          case (trans.readyState == 4):
            self.processingArray.splice(i, 1);
            self.handleResponse.apply(self, [trans, req]);
            break;
        }
      }
    }
    clearTimeout(self.processingWatcherId);
    if (self.processingArray.length) {
      self.processingWatcherId = setTimeout(
        fleegix.xhr.watchProcessing, 10);
    }
    else {
      self.processingWatcherId = null;
    }
  };
  this.abort = function (reqId) {
    var r = this.processingMap[reqId];
    var t = this.transporters[r.transporterId];
    // Abort the req if it's still processing
    if (t) {
      // onreadystatechange can still fire as abort is executed
      t.onreadystatechange = function () { };
      t.abort();
      r.aborted = true;
      this.cleanupAfterReq(r);
      return true;
    }
    else {
      return false;
    }
  };
  this.timeout = function (req) {
    if (fleegix.xhr.abort.apply(fleegix.xhr, [req.id])) {
      if (typeof req.handleTimeout == 'function') {
        req.handleTimeout();
      }
      else {
        alert('XMLHttpRequest to ' + req.url + ' timed out.');
      }
    }
  };
  this.handleResponse = function (trans, req) {
    // Grab the desired response type
    var resp = this.getResponseByType(trans, req);

    // If we have a One True Event Handler, use that
    // Best for odd cases such as Safari's 'undefined' status
    // or 0 (zero) status from trying to load local files or chrome
    if (req.handleAll) {
      req.handleAll(resp, req.id);
    }
    // Otherwise hand to either success/failure
    else {
      try {
        switch (true) {
          // Request was successful -- execute response handler
          case ((trans.status > 199 && trans.status < 300) ||
              trans.status == 304):
            if (req.async) {
              // Make sure handler is defined
              if (!req.handleSuccess) {
                throw new Error('No response handler defined ' +
                  'for this request');
              }
              else {
                req.handleSuccess(resp, req.id);
              }
            }
            // Blocking requests return the result inline on success
            else {
              return resp;
            }
            break;
          // Status of 0 -- in FF, user may have hit ESC while processing
          case (trans.status == 0):
            if (this.debug) {
              throw new Error('XMLHttpRequest HTTP status is zero.');
            }
            break;
          // Status of null or undefined -- yes, null == undefined
          case (trans.status == UNDEFINED_VALUE):
            // Squelch -- if you want to get local files or
            // chrome, use 'handleAll' above
            if (this.debug) {
              throw new Error('XMLHttpRequest HTTP status not set.');
            }
            break;
          // Request failed -- execute error handler
          default:
            if (req.handleErr) {
              req.handleErr(resp, req.id);
            }
            else {
              this.handleErrDefault(trans);
            }
            break;
        }
      }
      // FIXME: Might be nice to try to catch NS_ERROR_NOT_AVAILABLE
      // err in Firefox for broken connections
      catch (e) {
        throw e; 
      }
    }
    // Clean up, move immediately to respond to any
    // queued up requests
    if (req.async) {
      this.cleanupAfterReq(req);
    }
    return true;
  };
  this.cleanupAfterReq = function (req) {
    // Remove from list of transporters currently in use
    // this XHR can't be aborted until it's processing again
    delete this.processingMap[req.id];

    // Requests queued up, grab one to respond to
    if (this.requestQueue.length) {
      var nextReq = this.requestQueue.shift();
      // Reset the start time for the request for timeout purposes
      nextReq.startTime = new Date().getTime();
      this.processReq(nextReq, req.transporterId);
    }
    // Otherwise this transporter is idle, waiting to respond
    else {
      this.idleTransporters.push(req.transporterId);
    }
  };
  this.handleErrDefault = function (r) {
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
};

fleegix.xhr.Request = function () {
  this.id = 0;
  this.transporterId = null;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.dataPayload = null;
  this.readyState = null;
  this.responseText = null;
  this.responseXML = null;
  this.handleSuccess = null;
  this.handleErr = null;
  this.handleAll = null;
  this.handleTimeout = null;
  this.responseFormat = fleegix.xhr.responseFormats.TXT; // TXT, XML, OBJ
  this.mimeType = null;
  this.username = '';
  this.password = '';
  this.headers = [];
  this.preventCache = false;
  this.startTime = new Date().getTime();
  this.timeoutSeconds = fleegix.xhr.defaultTimeoutSeconds; // Default to 30-sec timeout
  this.uber = false;
  this.aborted = false;
};
fleegix.xhr.Request.prototype.setRequestHeader = function (headerName, headerValue) {
  this.headers.push(headerName + ': ' + headerValue);
};

