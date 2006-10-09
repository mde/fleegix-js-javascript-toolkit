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
 * Version 1.2.1
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.xhr = new function() {

  // Properties
  // ================================
  this.req = null;
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
  
  var i = 0;
  var reqTry = [ 
    function() { return new XMLHttpRequest(); },
    function() { return new ActiveXObject('Msxml2.XMLHTTP') },
    function() { return new ActiveXObject('Microsoft.XMLHTTP' )} ];
  
  while (!this.req && (i < reqTry.length)) {
    try { this.req = reqTry[i++](); } 
    catch(e) {}
  }
  if (this.req) {
    this.reqId = 0;
  }
  else {
    alert('Could not create XMLHttpRequest object.');
  }
  
  // Methods
  // ================================
  this.doGet = function(url, hand, format) {
    this.url = url;
    this.handleResp = hand;
    this.responseFormat = format || 'text';
    return this.doReq();
  };
  this.doPost = function(url, dataPayload, hand, format) {
    this.url = url;
    this.dataPayload = dataPayload;
    this.handleResp = hand;
    this.responseFormat = format || 'text';
    this.method = 'POST';
    return this.doReq();
  };
  this.doReq = function() {
    var self = null;
    var req = null;
    var id = null;
    var headArr = [];
     
    req = this.req;
    this.reqId++;
    id = this.reqId;
    // Set up the request
    // ==========================
    if (this.username && this.password) {
      req.open(this.method, this.url, this.async, this.username, this.password);
    }
    else {
      req.open(this.method, this.url, this.async);
    }
    // Override MIME type if necessary for Mozilla/Firefox & Safari
    if (this.mimeType && navigator.userAgent.indexOf('MSIE') == -1) {
      req.overrideMimeType(this.mimeType);
    }
    
    // Add any custom headers that are defined
    if (this.headers.length) {
      // Set any custom headers
      for (var i = 0; i < this.headers.length; i++) {
        headArr = this.headers[i].split(': ');
        req.setRequestHeader(headArr[i], headArr[1]);
      }
      this.headers = [];
    }
    // Otherwise set correct content-type for POST
    else {
      if (this.method == 'POST') {
        req.setRequestHeader('Content-Type', 
          'application/x-www-form-urlencoded');
      }
    }
    
    self = this; // Fix loss-of-scope in inner function
    req.onreadystatechange = function() {
      var resp = null;
      self.readyState = req.readyState;
      if (req.readyState == 4) {
        
        // Make these properties available to the Ajax object
        self.status = req.status;
        self.statusText = req.statusText;
        self.responseText = req.responseText;
        self.responseXML = req.responseXML;
        
        // Set the response according to the desired format
        switch(self.responseFormat) {
          // Text
          case 'text':
            resp = self.responseText;
            break;
          // XML
          case 'xml':
            resp = self.responseXML;
            break;
          // The object itself
          case 'object':
            resp = req;
            break;
        }
        
        // Request is successful -- pass off to response handler
        if (self.status > 199 && self.status < 300) {
          if (self.async) {
              // Make sure handler is defined
              if (!self.handleResp) {
                alert('No response handler defined ' +
                  'for this XMLHttpRequest object.');
                return;
              }
              else {
                self.handleResp(resp, id);
              }
          }
        }
        // Request fails -- pass to error handler
        else {
          self.handleErr(resp);
        }
      }
    }
    // Send the request, along with any data for POSTing
    // ==========================
    req.send(this.dataPayload);
    if (this.async) {
        return id;
    }
    else {
        return req;
    }
  };
  this.abort = function() {
    if (this.req) {
      this.req.onreadystatechange = function() { };
      this.req.abort();
      this.req = null;
    }
  };
  this.handleErr = function() {
    var errorWin;
    // Create new window and display error
    try {
      errorWin = window.open('', 'errorWin');
      errorWin.document.body.innerHTML = this.responseText;
    }
    // If pop-up gets blocked, inform user
    catch(e) {
      alert('An error occurred, but the error message cannot be' +
      ' displayed because of your browser\'s pop-up blocker.\n' +
      'Please allow pop-ups from this Web site.');
    }
  };
  this.setMimeType = function(mimeType) {
    this.mimeType = mimeType;
  };
  this.setHandlerResp = function(funcRef) {
    this.handleResp = funcRef;
  };
  this.setHandlerErr = function(funcRef) {
    this.handleErr = funcRef; 
  };
  this.setHandlerBoth = function(funcRef) {
    this.handleResp = funcRef;
    this.handleErr = funcRef;
  };
  this.setRequestHeader = function(headerName, headerValue) {
    this.headers.push(headerName + ': ' + headerValue);
  };
}

fleegix.xhr.constructor = null;
