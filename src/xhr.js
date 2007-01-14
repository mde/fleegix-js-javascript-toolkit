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
  this.transporters = [];
  this.lastReqId = 0;
  this.maxTransporters = 10;
  this.requestQueue = [];
  this.idleTransporters = [];
  this.processing = {};
  this.syncTransporter = spawnTransporter(true);
  
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
    var format = args.shift() || 'text';
    
    o.handleResp = hand;
    o.url = url;
    o.responseFormat = format;
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
    var format = args.shift() || 'text';
    
    o.handleResp = hand;
    o.url = url;
    o.dataPayload = dataPayload;
    o.responseFormat = format;
    o.method = 'POST';
    return this.doReq(o);
  };
  this.doReq = function (o) {
    var opts = o || {};
    var req = new fleegix.xhr.Request();
    var trans = this.trans; // XHR transport
    var resp = null; // The response to return
    
    // Default err handler -- pop up full window with error
    // if request has no handler specifically defined
    function handleErrDefault(r) {
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
    }
    
    // Override default request opts with any specified 
    for (var p in opts) {
      req[p] = opts[p];
    }
    
    this.lastReqId++; // Increment req ID
    req.id = this.lastReqId;
    
    // Return request ID or response
    if (req.async) {
      if (this.idleTransporters.length) {
        var transporterId = this.idleTransporters.pop();
      }
      else if (this.transporters.length < this.maxTransporters) {
        var transporterId = spawnTransporter();
      }
      
      if (typeof transporterId == 'number') {
        this.sendRequest(transporterId, req);
      }
      else {
        this.requestQueue.push(req);
      }
      return req.id;
    }
    else {
        return resp;
    }
  };
  this.sendRequest = function (transporter, req) {
    var trans = req.async ? this.transporters[transporter] :
      transporter;
    var self = this;
    this.processing[transporterId] = trans;

    // Set up the request
    // ==========================
    if (req.username && req.password) {
      trans.open(req.method, req.url, req.async, req.username, req.password);
    }
    else {
      trans.open(req.method, req.url, req.async);
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
    trans.onreadystatechange = function () {
      if (trans.readyState == 4) {
        // Set the response according to the desired format
        switch(req.responseFormat) {
          // Text
          case 'text':
            resp = trans.responseText;
            break;
          // XML
          case 'xml':
            resp = trans.responseXML;
            break;
          // The object itself
          case 'object':
            resp = trans;
            break;
        }
        // Request is successful -- execute response handler
        if (trans.status > 199 && trans.status < 300) {
          if (req.async) {
              // Make sure handler is defined
              if (!req.handleResp) {
                throw('No response handler defined ' +
                  'for this request');
                return;
              }
              else {
                req.handleResp(resp, req.id);
              }
          }
        }
        // Request fails -- execute error handler
        else {
          if (req.handleErr) {
            req.handleErr(resp);
          }
          else {
            handleErrDefault(trans);
          }
        }
        
        // Clean up, handle any waiting requests
        if (req.async) {
          delete self.processing[transporter];
          
          if (self.requestQueue.length) {
            var nextReq = self.requestQueue.pop();
            self.sendRequest(transporterId, nextReq);
          }
          else {
            self.idleTransporters.push(transporterId);
          }
        }
      }
    };

    // Send the request, along with any data for POSTing
    // ==========================
    trans.send(req.dataPayload);
  }
  this.abort = function () {
    if (this.trans) {
      this.trans.onreadystatechange = function () { };
      this.trans.abort();
    }
  };
};

fleegix.xhr.constructor = null;

fleegix.xhr.Request = function () {
  this.reqId = 0;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.dataPayload = null;
  this.readyState = null;
  this.responseText = null;
  this.responseXML = null;
  this.handleResp = null;
  this.responseFormat = 'text', // 'text', 'xml', 'object'
  this.mimeType = null;
  this.username = '';
  this.password = '';
  this.headers = [];
}
fleegix.xhr.Request.prototype.setRequestHeader = function (headerName, headerValue) {
  this.headers.push(headerName + ': ' + headerValue);
};

