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
fleegix.css = new function() {
    this.addClass = function (elem, s) {
      fleegix.css.removeClass(elem, s); // Don't add twice
      var c = elem.className;
      c += ' ' + s;
      c = fleegix.string.trim(c);
      elem.className = c;
    };
    this.removeClass = function (elem, s) {
      var c = elem.className;
      // Esc backslashes in regex pattern
      var pat = '\\b' + s + '\\b';
      // Do global search -- shouldn't be multiple
      // instances of the selector, but who knows
      pat = new RegExp(pat, 'g');
      c = c.replace(pat, '');
      c = c.replace('  ', ' ');
      c = fleegix.string.trim(c);
      elem.className = c;
    };
    this.replaceClass = function (elem, oldClass, newClass) {
      this.removeClass(elem, oldClass);
      this.addClass(elem, newClass);
    };
};

