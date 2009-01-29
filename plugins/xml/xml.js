/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
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
fleegix.xml = new function () {
  var pat = /^[\s\n\r\t]+|[\s\n\r\t]+$/g;
  var expandToArr = function (orig, val) {
    if (orig) {
      var r = null;
      if (orig instanceof Array == false) {
        r = [];
        r.push(orig);
      }
      else { r = orig; }
      r.push(val);
      return r;
    }
    else { return val; }
  };
  // Parses an XML doc or doc fragment into a JS obj
  // Values for multiple same-named tags a placed in
  // an array -- ideas for improvement to hierarchical
  // parsing from Kevin Faulhaber (kjf@kjfx.net)
  this.parse = function (node, tagName) {
    var obj = {};
    var kids = [];
    var k;
    var key;
    var t;
    var val;
    if (tagName) {
      kids = node.getElementsByTagName(tagName);
    }
    else {
      kids = node.childNodes;
    }
    for (var i = 0; i < kids.length; i++) {
      k = kids[i];
      // Element nodes (blow by the stupid Mozilla linebreak nodes)
      if (k.nodeType == 1) {
        key = k.tagName;
        // Tags with content
        if (k.firstChild) {
          // Node has only one child
          if(k.childNodes.length == 1) {
            t =  k.firstChild.nodeType;
            // Leaf nodes - text, CDATA, comment
            if (t == 3 || t == 4 || t == 8) {
              // Either set plain value, or if this is a same-named
              // tag, start stuffing values into an array
              val = k.firstChild.nodeValue.replace(pat, '');
              obj[key] = expandToArr(obj[key], val);
            }
            // Node has a single child branch node, recurse
            else if (t == 1) {
              // Rinse and repeat
              obj[key] = expandToArr(obj[key], this.parse(k.firstChild));
            }
          }
          // Node has children branch nodes, recurse
          else {
            // Rinse and repeat
            obj[key] = expandToArr(obj[key], this.parse(k));
          }
        }
        // Empty tags -- create an empty entry
        else {
          obj[key] = expandToArr(obj[key], null);
        }
      }
    }
    return obj;
  };
  // Create an XML document from string
  this.createDoc = function (str) {
    // Mozilla
    if (typeof DOMParser != "undefined") {
      return (new DOMParser()).parseFromString(str, "application/xml");
    }
    // Internet Explorer
    else if (typeof ActiveXObject != "undefined") {
      var doc = XML.newDocument( );
      doc.loadXML(str);
      return doc;
    }
    else {
      // Try loading the document from a data: URL
      // Credits: Sarissa library (sarissa.sourceforge.net)
      var url = "data:text/xml;charset=utf-8," + encodeURIComponent(str);
      var request = new XMLHttpRequest();
      request.open("GET", url, false);
      request.send(null);
      return request.responseXML;
    }
  };
  // Returns a single, top-level XML document node
  // Ideal for grabbing embedded XML data from a page
  // (i.e., XML 'data islands')
  this.getXMLDoc = function (id, tagName) {
    var arr = [];
    var doc = null;
    if (document.all) {
      var str = document.getElementById(id).innerHTML;
      doc = new ActiveXObject("Microsoft.XMLDOM");
      doc.loadXML(str);
      doc = doc.documentElement;
    }
    // Moz/compat can access elements directly
    else {
      arr =
        window.document.body.getElementsByTagName(tagName);
      doc = arr[0];
    }
    return doc;
  };
};

