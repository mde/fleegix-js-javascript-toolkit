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


fleegix.json = new function() {
  this.serialize = function(obj) {
    var str = '';
    switch (typeof obj) {
      case 'object':
        // Null
        if (obj == null) {
           return 'null';
        }
        // Arrays
        else if (obj instanceof Array) {
          for (var i = 0; i < obj.length; i++) {
            if (str) { str += ',' }
            str += fleegix.json.serialize(obj[i]);
          }
          return '[' + str + ']';
        }
        // Objects
        else if (typeof obj.toString != 'undefined') {
          for (var i in obj) {
            if (str) { str += ',' }
            str += '"' + i + '":';
            str += (obj[i] == undefined) ? 
              '"undefined"' : fleegix.json.serialize(obj[i]); 
          }
          return '{' + str + '}';
        }
        return str;
        break;
      case 'unknown':
      case 'undefined':
      case 'function':
        return '"undefined"';
        break;
      case 'string':
        str += '"' + obj.replace(/(["\\])/g, '\\$1').replace(
          /\r/g, '').replace(/\n/g, '\\n') + '"';
        return str;
        break;
      default:
        return String(obj);
        break;
    }
  };
}

fleegix.json.constructor = null;


fleegix.xml = new function(){
    
    var self = this;
    
    // Takes an array of XML items, transforms into an array of JS objects
    // Call it like this: res = fleegix.xml.parse(xml, 'Item'); 
    this.parse = function(xmlDocElem, tagItemName) {
        var xmlElemArray = new Array;
        var xmlElemRow;
        var objArray = [];
        
        // Rows returned
        if (xmlDocElem.hasChildNodes()) {
            xmlElemArray = xmlDocElem.getElementsByTagName(tagItemName);
            xmlElemRow = xmlElemArray[0];
            // Create array of objects and set properties
            for (var j = 0; j < xmlElemArray.length; j++) {
                xmlElemRow = xmlElemArray[j];
                objArray[j] = self.xmlElem2Obj(xmlElemArray[j]);
            }
        }
        return objArray;
    };
    
    // Transforms an XML element into a JS object
    this.xmlElem2Obj = function(xmlElem) {
        var ret = new Object();
        self.setPropertiesRecursive(ret, xmlElem);
        return ret;
    };
    
    this.setPropertiesRecursive = function(obj, node) {
        if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType == 1 &&
                  node.childNodes[i].firstChild) {
                    // If node has only one child
                    // set the obj property to the value of the node
                    if(node.childNodes[i].childNodes.length == 1) {
                        obj[node.childNodes[i].tagName] = 
                        node.childNodes[i].firstChild.nodeValue;
                    }
                    // Otherwise this obj property is an array
                    // Recurse to set its multiple properties
                    else {
                        obj[node.childNodes[i].tagName] = [];
                        // Call recursively -- rinse and repeat
                        // ==============
                        self.setPropertiesRecursive(
                        obj[node.childNodes[i].tagName], 
                        node.childNodes[i]);
                    }
                }
            }
        }
    };
    
    this.cleanXMLObjText = function(xmlObj) {
        var cleanObj = xmlObj;
        for (var prop in cleanObj) {
            cleanObj[prop] = cleanText(cleanObj[prop]);
        }
        return cleanObj;
    };
    
    this.cleanText = function(str) {
        var ret = str;
        ret = ret.replace(/\n/g, '');
        ret = ret.replace(/\r/g, '');
        ret = ret.replace(/\'/g, "\\'");
        ret = ret.replace(/\[CDATA\[/g, '');
        ret = ret.replace(/\]]/g, '');
        return ret;
    };
    
    this.rendered2Source = function(str) {
        // =============
        // Convert string of markup into format which will display
        // markup in the browser instead of rendering it
        // =============
        var proc = str;    
        proc = proc.replace(/</g, '&lt;');
        proc = proc.replace(/>/g, '&gt;');
        return '<pre>' + proc + '</pre>';
    };
    
    /*
    Works with embedded XML document structured like this:
    =====================
    <div id="xmlThingDiv" style="display:none;">
        <xml>
            <thinglist>
                <thingsection sectionname="First Section o' Stuff">
                    <thingitem>
                        <thingproperty1>Foo</thingproperty1>
                        <thingproperty2>Bar</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                    <thingitem>
                        <thingproperty1>Free</thingproperty1>
                        <thingproperty2>Beer</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                </thingsection> 
                <thingsection sectionname="Second Section o' Stuff">
                    <thingitem>
                        <thingproperty1>Far</thingproperty1>
                        <thingproperty2>Boor</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                </thingsection>
            </thinglist>
        </xml>
    </div>
    
    Call the function like this:
    var xmlElem = getXMLDocElem('xmlThingDiv', 'thinglist');
    --------
    xmlDivId: For IE to pull using documentElement
    xmlNodeName: For Moz/compat to pull using getElementsByTagName
    */
    
    // Returns a single, top-level XML document node
    this.getXMLDocElem = function(xmlDivId, xmlNodeName) {
        var xmlElemArray = [];
        var xmlDocElem = null;
        if (document.all) {
                var xmlStr = document.getElementById(xmlDivId).innerHTML;
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.loadXML(xmlStr);    
                xmlDocElem = xmlDoc.documentElement;
          }
          // Moz/compat can access elements directly
          else {
            xmlElemArray = 
                window.document.body.getElementsByTagName(xmlNodeName);
            xmlDocElem = xmlElemArray[0]; ;
          }
          return xmlDocElem;
    };
}
fleegix.xml.constructor = null;

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
    var transporterId = null;
    var trans = null;
    var self = this;
    var resp = null;
    
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
    
    // Anonymous handler for async mode
    trans.onreadystatechange = function () {
      // When request completes
      if (trans.readyState == 4) {
        
        // Grab the desired response type
        resp = getResponseByType();

        // Request was successful -- execute response handler
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
        // Request failed -- execute error handler
        else {
          if (req.handleErr) {
            req.handleErr(resp);
          }
          else {
            handleErrDefault(trans);
          }
        }
        
        // Clean up, move immediately to respond to any
        // queued up requests
        if (req.async) {
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
    
    // Sync mode -- return actual result inline back to doReq
    if (!req.async) {
      resp = getResponseByType();
      return resp;
    }
  }
  this.abort = function (reqId) {
    // Abort the req if it's still processing
    var t = this.processing[reqId];
    if (t) {
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
  this.uber = false;
}
fleegix.xhr.Request.prototype.setRequestHeader = function (headerName, headerValue) {
  this.headers.push(headerName + ': ' + headerValue);
};




/**
 * Serializes the data from all the inputs in a Web form
 * into a query-string style string.
 * @param docForm -- Reference to a DOM node of the form element
 * @param formatOpts -- JS object of options for how to format
 * the return string. Supported options:
 *    collapseMulti: (Boolean) take values from elements that
 *    can return multiple values (multi-select, checkbox groups)
 *    and collapse into a single, comman-delimited value
 *    (e.g., thisVar=asdf,qwer,zxcv)
 * @returns query-string style String of variable-value pairs
 */
fleegix.form = {};
fleegix.form.serialize = function (f, o) {
  var h = fleegix.form.toHash(f);
  var opts = o || {};
  var str = '';
  var pat = null;

  if (opts.stripTags) { pat = /<[^>]*>/g; }
  for (var n in h) {
    var s = '';
    var v = h[n];
    if (v) {
      // Single val -- string
      if (typeof v == 'string') {
        s = opts.stripTags ? v.replace(pat, '') : v;
        str += n + '=' + encodeURIComponent(s);
      }
      // Multiple vals -- array
      else {
        var sep = ''; 
        if (opts.collapseMulti) {
          sep = ',';
          str += n + '=';
        }
        else {
          sep = '&';
        }
        for (var j = 0; j < v.length; j++) {
          s = opts.stripTags ? v[j].replace(pat, '') : v[j];
          s = (!opts.collapseMulti) ? n + '=' + encodeURIComponent(s) : 
            encodeURIComponent(s);
          str += s + sep;
        }
        str = str.substr(0, str.length - 1);
      }
      str += '&'
    }
    else {
      if (opts.includeEmpty) { str += n + '=&'; }
    }
  }
  str = str.substr(0, str.length - 1);
  return str;
};

fleegix.form.toHash = function (f) { 
  var h = {};
  
  function expandToArr(orig, val) {
    if (orig) {
      var r = null;
      if (typeof orig == 'string') {
        r = [];
        r.push(orig);
      }
      else {
        r = orig;
      }
      r.push(val);
      return r;
    }
    else {
      return val;
    }
  }
  
  for (i = 0; i < f.elements.length; i++) {
    elem = f.elements[i];
    
    switch (elem.type) {
      // Text fields, hidden form elements
      case 'text':
      case 'hidden':
      case 'password':
      case 'textarea':
      case 'select-one':
        h[elem.name] = elem.value;
        break;
        
      // Multi-option select
      case 'select-multiple':
        h[elem.name] = null;
        for(var j = 0; j < elem.options.length; j++) {
          var o = elem.options[j];
          if(o.selected) {
            h[elem.name] = expandToArr(h[elem.name], o.value);
          }
        }
        break;
      
      // Radio buttons
      case 'radio':
        if (typeof h[elem.name] == 'undefined') { h[elem.name] = null; }
        if (elem.checked) {
          h[elem.name] = elem.value; 
        }
        break;
        
      // Checkboxes
      case 'checkbox':
        if (typeof h[elem.name] == 'undefined') { h[elem.name] = null; }
        if (elem.checked) {
          h[elem.name] = expandToArr(h[elem.name], elem.value);
        }
        break;
        
    }
  }
  return h;
};

fleegix.form.restore = function (form, str) {
  var arr = str.split('&');
  var d = {};
  for (var i = 0; i < arr.length; i++) {
    var pair = arr[i].split('=');
    var name = pair[0];
    var val = pair[1];
    if (typeof d[name] == 'undefined') {
      d[name] = val;
    }
    else {
      if (!(d[name] instanceof Array)) {
        var t = d[name];
        d[name] = [];
        d[name].push(t);
      }
      d[name].push(val);
    }
  }
  for (var i = 0; i < form.elements.length; i++) {
    elem = form.elements[i];
    if (typeof d[elem.name] != 'undefined') {
      val = d[elem.name];
      switch (elem.type) {
        case 'text':
          case 'hidden':
          case 'password':
          case 'textarea':
          case 'select-one':
          elem.value = decodeURIComponent(val);
          break;
        case 'radio':
          if (encodeURIComponent(elem.value) == val) {
            elem.checked = true; 
          }
          break;
        case 'checkbox':
          for (var j = 0; j < val.length; j++) {
            if (encodeURIComponent(elem.value) == val[j]) {
              elem.checked = true; 
            }
          }
          break;
        case 'select-multiple':
          for (var h = 0; h < elem.options.length; h++) {
            var opt = elem.options[h];
            for (var j = 0; j < val.length; j++) {
              if (encodeURIComponent(opt.value) == val[j]) {
                opt.selected = true; 
              }
            }
          }
          break;
      }
    }
  }
  return form;
};

fleegix.form.Differ = function() {
  this.count = 0;
  this.diffs = {};
}  
fleegix.form.Differ.prototype.hasKey = function (k) {
  return (typeof this.diffs[k] != 'undefined');
};

fleegix.form.diff = function (formA, formB) {
  // Accept either form or hash-conversion of form
  var hA = formA.toString() == '[object HTMLFormElement]' ? 
    fleegix.form.toHash(formA) : formA;
  var hB = formB.toString() == '[object HTMLFormElement]' ? 
    fleegix.form.toHash(formB) : formB;
  var ret = new fleegix.form.Differ();
  
  function addDiff(n) {
    ret.count++;
    ret.diffs[n] = [hA[n], hB[n]];
  }
 
  for (n in hA) {
    // Elem doesn't exist in B
    if (typeof hB[n] == 'undefined') {
      addDiff(n);
    }
    // Elem exists in both
    else {
      v = hA[n];
      // Multi-value -- array, hA[n] actually has values
      if (v instanceof Array) {
        if (!hB[n] || (hB[n].toString() != v.toString())) {
          addDiff(n);
        }
      }
      // Single value -- null or string
      else {
        if (hB[n] != v) {
          addDiff(n);
        }
      }
    }
  }
  return ret;
}










fleegix.popup = new function() {
  
  var self = this;
  this.win = null;
  this.open = function(url, optParam) {
    var opts = optParam || {}
    var str = '';
    var propList = {
      'width':'', 
      'height':'', 
      'location':0, 
      'menubar':0, 
      'resizable':1, 
      'scrollbars':0,
      'status':0,
      'titlebar':1,
      'toolbar':0
      };
    for (var prop in propList) {
      str += prop + '=';
      str += opts[prop] ? opts[prop] : propList[prop];
      str += ',';
    }
    var len = str.length;
    if (len) {
      str = str.substr(0, len-1);
    }
    if(!self.win || self.win.closed) {
      self.win = window.open(url, 'thePopupWin', str);
    }
    else {	  
      self.win.focus(); 
      self.win.document.location = url;
    }
  };
  this.close = function() {
    if (self.win) {
      self.win.window.close();
      self.win = null;
    }
  };
  this.goURLMainWin = function(url) {
    location = url;
    self.close();
  };
}
fleegix.popup.constructor = null;




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


fleegix.uri = new function () {
  var self = this;
  
  this.params = {};
  
  this.getParamHash = function (str) {
    var q = str || self.getQuery();
    var d = {};
    if (q) {
      var arr = q.split('&');
      for (var i = 0; i < arr.length; i++) {
        var pair = arr[i].split('=');
        var name = pair[0];
        var val = pair[1];
        if (typeof d[name] == 'undefined') {
          d[name] = val;
        }
        else {
          if (!(d[name] instanceof Array)) {
            var t = d[name];
            d[name] = [];
            d[name].push(t);
          }
          d[name].push(val);
        }
      }
    }
    return d;
  };
  this.getParam = function (name, str) {
    var p = null;
    if (str) {
      var h = this.getParamHash(str);
      p = h[name];
    }
    else {
      p = this.params[name];
    }
    return p;
  };
  this.setParam = function (name, val, str) {
    var ret = null;
    if (str) { 
      var pat = new RegExp('(^|&)(' + name + '=[^\&]*)(&|$)');
      var arr = str.match(pat);
      if (arr) {
        ret = str.replace(arr[0], arr[1] + name + '=' + val + arr[3]);
      }
    }
    else {
      ret = name + '=' + val;
    }
    return ret;
  };
  this.getQuery = function () {
    return location.href.split('?')[1];
  };
  this.params = this.getParamHash();
}
fleegix.uri.constructor = null;

fleegix.ui = new function() {
  this.getWindowHeight = function() {
    // IE
    if (document.all) {
      if (document.documentElement && 
        document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
      }
      else {
        return document.body.clientHeight;
      }
    }
    // Moz/compat
    else {
      return window.innerHeight;
    }
  };
  this.getWindowWidth = function() {
    // IE
    if (document.all) {
      if (document.documentElement && 
        document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
      }
      else {
        return document.body.clientWidth;
      }
    }
    // Moz/compat
    else {
      return window.innerWidth;
    }
  };
};
fleegix.ui.constructor = null;

fleegix.cookie = new function() {
  this.set = function(name, value, optParam) {
    var opts = optParam || {}
    var exp = '';
    var t = 0;
    var path = opts.path || '/';
    var days = opts.days || 0;
    var hours = opts.hours || 0;
    var minutes = opts.minutes || 0;
    
    t += days ? days*24*60*60*1000 : 0;
    t += hours ? hours*60*60*1000 : 0;
    t += minutes ? minutes*60*1000 : 0;
    
    if (t) {
      var dt = new Date();
      dt.setTime(dt.getTime() + t);
      exp = '; expires=' + dt.toGMTString();
    }
    else {
      exp = '';
    }
    document.cookie = name + '=' + value + 
      exp + '; path=' + path;
  };
  this.get = function(name) {
    var nameEq = name + '=';
    var arr = document.cookie.split(';');
    for(var i = 0; i < arr.length; i++) {
      var c = arr[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEq) == 0) {
        return c.substring(nameEq.length, c.length);
      }
    }
    return null;
  };
  this.create = this.set;
  this.destroy = function(name, path) {
    var opts = {};
    opts.minutes = -1;
    if (path) { opts.path = path; }
    this.set(name, '', opts);
  };
}
fleegix.cookie.constructor = null; 

