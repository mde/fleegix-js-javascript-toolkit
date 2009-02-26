/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
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
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
if (typeof fleegix.string == 'undefined') { fleegix.string = {}; }

fleegix.string.truncate = function (str, len, tail) {
  var t = tail || '';
  if (str.length > len) {
    return str.substr(0, (len - t.length)) + t;
  }
  else {
    return str;
  }
};

fleegix.string.truncateHTML = function (str, len, tail) {
  // The returned string of content
  var s = '';
  // Any tail to append after truncation -- e.g. ellipses
  var t = tail || '';
  // Split pattern for HTML tags
  var pat = /(<[^>]*>)/;
  // Opening HTML tag -- used as a flag that there's an
  // HTML tag sitting open when truncation happens
  var openTag = null;
  // Used to close any open tag
  var closeTag = '';
  // An array of merged content and tags, e.g., ['foo',
  // '<strong>', 'bar', '</strong>']
  var arr = [];
  // Current length of the string to return
  var currLen = 0;
  // Lookahead to see if we'll overshoot the max length
  var nextLen = 0;
  // Truncated final segment of the string
  var trunc;
  // Each item in the merged tag/content array
  var item;

  // Build the merged array of tags/content
  var result = pat.exec(str);
  while (result) {
    var firstPos = result.index;
    var lastPos = pat.lastIndex;
    if (firstPos !== 0) {
      arr.push(str.substring(0, firstPos));
      str = str.slice(firstPos);
    }
    arr.push(result[0]);
    str = str.slice(result[0].length);
    result = pat.exec(str);
  }
  if (str !== '') {
    arr.push(str);
  }

  // Parse each item in the tag/content array
  // Have to parse in all cases -- no simple test to see
  // if you can just return the entire string
  // Global regex replace would work, but who knows
  // how much if any faster that is
  for (var i = 0; i < arr.length; i++) {
    item = arr[i];
    switch (true) {
      // Closing tag
      case item.indexOf('</') == 0:
        s += item;
        openTag = null;
        break;
      // Opening tag
      case item.indexOf('<') == 0:
        s += item;
        openTag = item;
        break;
      // Text
      default:
        nextLen += item.length;
        // If adding the content will overshoot the limit
        // use the truncation fu
        if (nextLen >= len) {
          // Chop the string to the amount needed to complete
          // the max length, minus the amount for the tail string if any
          // NOTE: Content segment can be less than the length of the
          // tail string -- this can result in a fudge factor of the length
          // of the tail for the entire string
          trunc = item.substr(0, (len - currLen) - t.length);
          s += trunc;
          // If we're sitting on an open HTML tag
          if (openTag) {
            // If there's content in the final truncated string,
            // just append a closing tag of the same kind as
            // the opening tag
            if (trunc.length) {
              closeTag = openTag.split(
                  /\s|>/)[0].replace('<', '</') + '>';
              s += closeTag;
            }
            // If there's no content in the truncated string,
            // just strip out the previous open tag
            else {
              s = s.replace(openTag, '');
            }
          }
          // Append the tail, if any, and return
          s += t;
          return s;
        }
        else {
          s += item;
        }
        currLen = nextLen;
      }
  }
  return s;
};


