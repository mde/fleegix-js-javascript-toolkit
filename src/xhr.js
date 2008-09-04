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
  // Public vars
  // ================================
  // Maximum number of XHR objects to spawn to handle requests
  // Moz/Safari seem to perform significantly better with XHR
  // re-use, IE -- not so much
  this.maxXhrs = 5;
  // Used to increment request IDs -- these may be used for
  // externally tracking or aborting specific requests
  this.lastReqId = 0;
  // Show exceptions for connection failures
  this.debug = false;
  // Default number of seconds before a request times out
  this.defaultTimeoutSeconds = 300;
  // If set to true, use the default err handler for sync requests
  // If false, failures always hand back the whole request object
  this.useDefaultErrHandlerForSync = true;
  // Possible formats for the XHR response
  this.responseFormats = { TXT: 'text',
   XML: 'xml',
   OBJ: 'object' };

  // Public methods
  // ================================
  this.get = function () {
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
  this.doGet = function () {
    return this.get.apply(this, arguments);
  }
  this.post = function () {
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
    var data = args.shift();
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
    o.data = data;
    o.method = 'POST';
    return this.doReq(o);
  };
  this.doPost = function () {
    return this.post.apply(this, arguments);
  }
  this.doReq = function (opts) {
    return this.send(opts);
  }
  this.send = function (o) {
    var opts = o || {};
    var req = new fleegix.xhr.Request();
    var xhrId = null;

    // Override default request opts with any specified
    for (var p in opts) {
      if (opts.hasOwnProperty(p)) {
        req[p] = opts[p];
      }
    }
    // HTTP req method all-caps
    req.method = req.method.toUpperCase();

    req.id = this.lastReqId;
    this.lastReqId++; // Increment req ID

    // Return request ID or response
    // Async -- handle request or queue it up
    // -------
    if (req.async) {
      // If we have an instantiated XHR we can use, let him handle it
      if (_idleXhrs.length) {
        xhrId = _idleXhrs.shift();
      }
      // No available XHRs -- spawn a new one if we're still
      // below the limit
      else if (_xhrs.length < this.maxXhrs) {
        xhrId = _spawnXhr();
      }

      // If we have an XHR xhr to handle the request, do it
      // xhrId should be a number (index of XHR obj in _xhrs)
      if (xhrId !== null) {
        _processReq(req, xhrId);
      }
      // No xhr available to handle the request -- queue it up
      else {
        // Uber-requests step to the front of the line, please
        if (req.uber) {
          _requestQueue.unshift(req);
        }
        // Normal queued requests are FIFO
        else {
          _requestQueue.push(req);
        }
      }
      // Return request ID -- may be used for aborting,
      // external tracking, etc.
      return req.id;
    }
    // Sync -- do request inlne and return actual result
    // -------
    else {
        return _processReq(req);
    }
  };
  this.abort = function (reqId) {
    var r = _processingMap[reqId];
    var t = _xhrs[r.xhrId];
    // Abort the req if it's still processing
    if (t) {
      // onreadystatechange can still fire as abort is executed
      t.onreadystatechange = function () { };
      t.abort();
      r.aborted = true;
      _cleanup(r);
      return true;
    }
    else {
      return false;
    }
  };
  // All the goofy normalization and logic to determine
  // what constitutes 'success'
  this.isReqSuccessful = function (obj) {
    var stat = obj.status;
    if (!stat) { return false; }
    // Handle stupid bogus URLMon "Operation Aborted"
    // code in IE for 204 no-content
    if (document.all && stat == 1223) {
      stat = 204;
    }
    if ((stat > 199 && stat < 300) || stat == 304) {
      return true;
    }
    else {
      return false;
    }
  };

  // Private vars
  // ================================
  var _this = this;
  // Prog ID for specific versions of MSXML -- caches after
  // initial req
  var _msProgId = null;
  // Used in response status test
  var _UNDEFINED_VALUE;
  // Array of XHR obj xhrs, spawned as needed up to
  // maxXhrs ceiling
  var _xhrs = [];
  // Queued-up requests -- appended to when all XHR xhrs
  // are in use -- FIFO list, XHR objs respond to waiting
  // requests immediately as then finish processing the current one
  var _requestQueue = [];
  // List of free XHR objs -- xhrs sit here when not
  // processing requests. If this is empty when a new request comes
  // in, we try to spawn a request -- if we're already at max
  // xhr number, we queue the request
  var _idleXhrs = [];
  // Hash of currently in-flight requests -- each string key is
  // the request id of the request
  // Used to abort processing requests
  var _processingMap = {};
  // Array of in-flight request for the watcher to iterate over
  var _processingArray = [];
  // The single XHR obj used for synchronous requests -- sync
  // requests do not participate in the request pooling
  var _syncXhr = null;
  // The single request obj used for sync requests, same
  // as above
  var _syncRequest = null;
  // The id for the setTimeout used in the the
  // request timeout watcher
  _processingWatcherId = null;

  // Private methods
  // ================================
  // The XHR object factory
  var _spawnXhr = function (isSync) {
    var i = 0;
    var t = [
      'Msxml2.XMLHTTP.6.0',
      'MSXML2.XMLHTTP.3.0',
      'Microsoft.XMLHTTP'
    ];
    var xhrObj = null;
    if (window.XMLHttpRequest) {
      xhrObj = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      if (_msProgId) {
        xhrObj = new ActiveXObject(_msProgId);
      }
      else {
        for (var i = 0; i < t.length; i++) {
          try {
            xhrObj = new ActiveXObject(t[i]);
            // Cache the prog ID, break the loop
            _msProgId = t[i]; break;
          }
          catch(e) {}
        }
      }
    }
    // Instantiate XHR obj
    if (xhrObj) {
      if (isSync) { return xhrObj; }
      else {
        _xhrs.push(xhrObj);
        var xhrId = _xhrs.length - 1;
        return xhrId;
      }
    }
    else {
      throw new Error('Could not create XMLHttpRequest object.');
    }
  };
  // This is the workhorse function that actually
  // sets up and makes the XHR request
  var _processReq = function (req, t) {
    var xhrId = null;
    var xhrObj = null;
    var url = '';
    var resp = null;

    // Async mode -- grab an XHR obj from the pool
    if (req.async) {
      xhrId = t;
      xhrObj = _xhrs[xhrId];
      _processingMap[req.id] = req;
      _processingArray.unshift(req);
      req.xhrId = xhrId;
    }
    // Sync mode -- use single sync XHR
    else {
      if (!_syncXhr) { _syncXhr = _spawnXhr(true); }
      xhrObj = _syncXhr;
      _syncRequest = req;
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
      xhrObj.abort();
    }

    // Set up the request
    // ==========================
    if (req.username && req.password) {
      xhrObj.open(req.method, url, req.async, req.username, req.password);
    }
    else {
      xhrObj.open(req.method, url, req.async);
    }
    // Override MIME type if necessary for Mozilla/Firefox & Safari
    if (req.mimeType && navigator.userAgent.indexOf('MSIE') == -1) {
      xhrObj.overrideMimeType(req.mimeType);
    }

    // Add any custom headers that are defined
    var headers = req.headers;
    for (var h in headers) {
      if (headers.hasOwnProperty(h)) {
        xhrObj.setRequestHeader(h, headers[h]);
      }
    }
    // Otherwise set correct content-type for POST
    if (req.method == 'POST' || req.method == 'PUT') {
      // Backward-compatibility
      req.data = req.data || req.dataPayload;
      // Firefox throws out the content-length
      // if data isn't present
      if (!req.data) {
        req.data = '';
      }
      // Set content-length for picky servers
      var contentLength = typeof req.data == 'string' ?
        req.data.length : 0;
      xhrObj.setRequestHeader('Content-Length', contentLength);
      // Set content-type to urlencoded if nothing
      // else specified
      if (typeof req.headers['Content-Type'] == 'undefined') {
        xhrObj.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded');
      }
    }
    // Send the request, along with any POST/PUT data
    // ==========================
    xhrObj.send(req.data);
    // ==========================
    if (_processingWatcherId === null) {
      _processingWatcherId = setTimeout(_watchProcessing, 10);
    }
    // Sync mode -- return actual result inline back to doReq
    if (!req.async) {
      // Blocks here
      var ret = _handleResponse(xhrObj, req);
      _syncRequest = null;
      // Start the watcher loop back up again if need be
      if (_processingArray.length) {
        _processingWatcherId = setTimeout(_watchProcessing, 10);
      }
      // Otherwise stop watching
      else {
        _processingWatcherId = null;
      }
      return ret;
    }
  };
  // Called in a setTimeout loop as long as requests are
  // in-flight, and invokes the handler for each request
  // as it returns
  var _watchProcessing = function () {
    var proc = _processingArray;
    var d = new Date().getTime();

    // Stop looping while processing sync requests
    // after req returns, it will start the loop back up
    if (_syncRequest !== null) {
      return;
    }
    else {
      for (var i = 0; i < proc.length; i++) {
        var req = proc[i];
        var xhrObj = _xhrs[req.xhrId];
        var isTimedOut = ((d - req.startTime) > (req.timeoutSeconds*1000));
        switch (true) {
          // Aborted requests
          case (req.aborted || !xhrObj.readyState):
            _processingArray.splice(i, 1);
            break;
          // Timeouts
          case isTimedOut:
            _processingArray.splice(i, 1);
            _timeout(req);
            break;
          // Actual responses
          case (xhrObj.readyState == 4):
            _processingArray.splice(i, 1);
            _handleResponse.call(_this, xhrObj, req);
            break;
        }
      }
    }
    clearTimeout(_processingWatcherId);
    if (_processingArray.length) {
      _processingWatcherId = setTimeout(_watchProcessing, 10);
    }
    else {
      _processingWatcherId = null;
    }
  };
  var _handleResponse = function (xhrObj, req) {
    // Grab the desired response type
    var resp;
    switch(req.responseFormat) {
      // XML
      case 'xml':
        resp = xhrObj.responseXML;
        break;
      // The object itself
      case 'object':
        resp = xhrObj;
        break;
      // Text
      case 'text':
      default:
        resp = xhrObj.responseText;
        break;
    }
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
          case _this.isReqSuccessful(xhrObj):
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
          case (xhrObj.status == 0):
            if (_this.debug) {
              throw new Error('XMLHttpRequest HTTP status is zero.');
            }
            break;
          // Status of null or undefined -- yes, null == undefined
          case (xhrObj.status == _UNDEFINED_VALUE):
            // Squelch -- if you want to get local files or
            // chrome, use 'handleAll' above
            if (_this.debug) {
              throw new Error('XMLHttpRequest HTTP status not set.');
            }
            break;
          // Request failed -- execute error handler or hand back
          // raw request obj
          default:
            // Blocking requests that want the raw object returned
            // on error, instead of letting the built-in handle it
            if (!req.async && !_this.useDefaultErrHandlerForSync) {
              return  resp;
            }
            else {
              if (req.handleErr) {
                req.handleErr(resp, req.id);
              }
              else {
                _handleErrDefault(xhrObj);
              }
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
      _cleanup(req);
    }
    return true;
  };
  var _timeout = function (req) {
    if (_this.abort.apply(_this, [req.id])) {
      if (typeof req.handleTimeout == 'function') {
        req.handleTimeout();
      }
      else {
        alert('XMLHttpRequest to ' + req.url + ' timed out.');
      }
    }
  };
  var _cleanup = function (req) {
    // Remove from list of xhrs currently in use
    // this XHR can't be aborted until it's processing again
    delete _processingMap[req.id];

    // Requests queued up, grab one to respond to
    if (_requestQueue.length) {
      var nextReq = _requestQueue.shift();
      // Reset the start time for the request for timeout purposes
      nextReq.startTime = new Date().getTime();
      _processReq(nextReq, req.xhrId);
    }
    // Otherwise this xhr is idle, waiting to respond
    else {
      _idleXhrs.push(req.xhrId);
    }
  };
  var _handleErrDefault = function (r) {
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
  this.xhrId = null;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.data = null;
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

