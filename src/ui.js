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
