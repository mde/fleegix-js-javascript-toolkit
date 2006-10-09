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
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
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
      self.win = null;  
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


/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
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
 * Original code by Matthew Eernisse (mde@fleegix.org), March 2005
 * Additional bugfixes by Mark Pruett (mark.pruett@comcast.net), 12th July 2005
 * Multi-select added by Craig Anderson (craig@sitepoint.com), 24th August 2006
 *
 * Version 1.3
*/

if (typeof fleegix == 'undefined') { var fleegix = {}; }
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
fleegix.form.serialize = function(docForm, formatOpts) {
  
  var opts = formatOpts || {};
  var str = '';
  var formElem;
  var lastElemName = '';
  
  for (i = 0; i < docForm.elements.length; i++) {
    formElem = docForm.elements[i];
    
    switch (formElem.type) {
      // Text fields, hidden form elements
      case 'text':
      case 'hidden':
      case 'password':
      case 'textarea':
      case 'select-one':
        str += formElem.name + '=' + encodeURI(formElem.value) + '&'
        break;
        
      // Multi-option select
      case 'select-multiple':
        var isSet = false;
        for(var j = 0; j < formElem.options.length; j++) {
          var currOpt = formElem.options[j];
          if(currOpt.selected) {
            if (opts.collapseMulti) {
              if (isSet) {
                str += ',' + encodeURI(currOpt.value);
              }
              else {
                str += formElem.name + '=' + encodeURI(currOpt.value);
                isSet = true;
              }
            }
            else {
              str += formElem.name + '=' + encodeURI(currOpt.value) + '&';
            }
          }
        }
        if (opts.collapseMulti) {
          str += '&';
        }
        break;
      
      // Radio buttons
      case 'radio':
        if (formElem.checked) {
          str += formElem.name + '=' + encodeURI(formElem.value) + '&'
        }
        break;
        
      // Checkboxes
      case 'checkbox':
        if (formElem.checked) {
          // Collapse multi-select into comma-separated list
          if (opts.collapseMulti && (formElem.name == lastElemName)) {
            // Strip of end ampersand if there is one
            if (str.lastIndexOf('&') == str.length-1) {
              str = str.substr(0, str.length - 1);
            }
            // Append value as comma-delimited string
            str += ',' + encodeURI(formElem.value);
          }
          else {
            str += formElem.name + '=' + encodeURI(formElem.value);
          }
          str += '&';
          lastElemName = formElem.name;
        }
        break;
        
    }
  }
  // Remove trailing separator
  str = str.substr(0, str.length - 1);
  return str;
};


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
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.event = new function() {
    
    // List of channels being published to
    var channels = {};
    
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
}
fleegix.event.constructor = null;

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
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
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
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.uri = new function() {
  var self = this;
  
  this.params = {};
  
  this.getParamHash = function() {
    var query = self.getQuery();
    var arr = [];
    var params = [];
    var ret = null;
    var pat = /(\S+?)=(\S+?)&/g;
    if (query) {
      query += '&';
      while (arr = pat.exec(query)) {
        params[arr[1]] = arr[2];
      }
    }
    return params;
  };
  this.getParam = function(name) {
    return self.params[name];
  };
  this.getQuery = function() {
    return location.href.split('?')[1];
  };
  this.params = this.getParamHash();
}
fleegix.uri.constructor = null;
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
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
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
 * Version 1.0
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
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

