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
 * Credits: getOffest method by Adam Christian (adam@adamchristian.com)
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
fleegix.dom = new function() {
  var getViewportMeasure = function (s) {
    // IE
    if (document.all) {
      if (document.documentElement &&
        document.documentElement['client' + s]) {
        return document.documentElement['client' + s];
      }
      else {
        return document.body['client' + s];
      }
    }
    // Moz/compat
    else {
      return window['inner' + s];
    }
  };
  this.getViewportWidth = function () {
    return getViewportMeasure('Width');
  };
  this.getViewportHeight = function () {
    return getViewportMeasure('Height');
  };
  this.center = function (node) {
    var nW = node.offsetWidth;
    var nH = node.offsetHeight;
    var vW = fleegix.dom.getViewportWidth();
    var vH = fleegix.dom.getViewportHeight();
    var calcLeft = parseInt((vW/2)-(nW/2), 10);
    var calcTop = parseInt((vH/2)-(nH/2), 10);
    calcTop += document.documentElement.scrollTop;
    node.style.left = calcLeft + 'px';
    node.style.top = calcTop + 'px';
    return true;
  };
  /* Get absolute XY pos of a DOM node */
  this.getOffset = function(node){
    var _getCoords = function (obj) {
      var curleft = 0;
      var curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      return { left: curleft, top: curtop };
    };
    var nodeCoords = null;
    //in IE and Mozilla we can use the
    // getBoundingClientRect()
    if (fleegix.isIE || fleegix.isMoz) {
      nodeCoords = node.getBoundingClientRect();
    }
    else {
      nodeCoords = _getCoords(node);
    }
    return nodeCoords;
  };
};

