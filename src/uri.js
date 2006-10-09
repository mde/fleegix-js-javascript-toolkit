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
