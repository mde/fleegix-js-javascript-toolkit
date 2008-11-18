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
 * distributed under the License is distributed on an "AS IS" BASIS;
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
        switch (true) {
          // Null
          case obj === null:
            return 'null';
            break;
          // Arrays
          case obj instanceof Array: 
            for (var i = 0; i < obj.length; i++) {
              if (str) { str += ','; }
              str += fleegix.json.serialize(obj[i]);
            }
            return '[' + str + ']';
            break;
          // Exceptions don't serialize correctly in Firefox
          case (fleegix.isFF && obj instanceof DOMException):
            str += '"' + obj.toString() + '"';
            break;
          // All other generic objects
          case typeof obj.toString != 'undefined':
            for (var i in obj) {
              if (str) { str += ','; }
              str += '"' + i + '":';
              if (typeof obj[i] == 'undefined') {
                str += '"undefined"';
              }
              else {
                str += fleegix.json.serialize(obj[i]);
              }
            }
            return '{' + str + '}';
            break;
        }
        return str;
      case 'unknown':
      case 'undefined':
      case 'function':
        return '"undefined"';
      case 'string':
        str += '"' + obj.replace(/(["\\])/g, '\\$1').replace(
          /\r/g, '').replace(/\n/g, '\\n') + '"';
        return str;
      default:
        return String(obj);
    }
  };
};

