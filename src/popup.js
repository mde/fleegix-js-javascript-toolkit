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


