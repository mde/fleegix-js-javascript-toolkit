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
fleegix.xml = new function (){
  var pat = /^[\s\n\r]+|[\s\n\r]+$/g;
  var expandToArr = function (orig, val) {
    if (orig) {
      var r = null;
      if (typeof orig == 'string') {
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
    if (tagName) {
      kids = node.getElementsByTagName(tagName);
    }
    else {
      kids = node.childNodes;
    }
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      // Blow by the stupid Mozilla linebreak nodes
      if (k.nodeType == 1) {
        var key = k.tagName;
        // Tags with content
        if (k.firstChild) {
          // Node has only one child, a text node -- this is a leaf
          if(k.childNodes.length == 1 && k.firstChild.nodeType == 3) {
            // Either set plain value, or if this is a same-named
            // tag, start stuffing values into an array
            obj[key] = expandToArr(obj[key],
              k.firstChild.nodeValue.replace(pat, ''));
          }
          // Node has children -- branch node, recurse
          else {
            // Rinse and repeat
            obj[key] = this.parse(k);
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
  var xml = getXMLDoc('xmlThingDiv', 'thinglist');
  --------
  id: For IE to pull using documentElement
  tagName: For Moz/compat to pull using getElementsByTagName
  */
  // Returns a single, top-level XML document node
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

