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
fleegix.i18n = new function () {
  this.localizedStrings = {};
  this.getText = function () {
    var args = arguments;
    var key = args[0];
    var str = this.localizedStrings[key] || "[[" + key + "]]";
    for (var i = 1; i < args.length; i++){
        str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    }
    return str;
  };
  this.setLocalizedStrings = function (obj) {
    this.localizedStrings = obj || {};
  };
};
