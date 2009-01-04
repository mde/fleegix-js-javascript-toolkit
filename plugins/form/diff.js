/*
 * Copyright 2009 Matthew Eernisse (mde@fleegix.org)
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
 *
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
if (typeof fleegix.form == 'undefined') { fleegix.form = {}; }
if (typeof fleegix.form.toObject == 'undefined') {
  throw('fleegix.form.diff depends on the base fleegix.form module in fleegix.js.'); }

fleegix.form.diff = function (formUpdated, formOrig, opts) {
  var o = opts || {};
  // Accept either form or hash-conversion of form
  var hUpdated = formUpdated.elements ?
    fleegix.form.toObject(formUpdated) : formUpdated;
  var hOrig = formOrig.elements ?
    fleegix.form.toObject(formOrig) : formOrig;
  var diffs = [];
  var count = 0;

  function addDiff(n, hA, hB, secondPass) {
    if (!diffs[n]) {
      count++;
      diffs[n] = secondPass?
        { origVal: hB[n], newVal: hA[n] } :
        { origVal: hA[n], newVal: hB[n] };
    }
  }

  function diffSweep(hA, hB, secondPass) {
    for (n in hA) {
      // Elem doesn't exist in B
      if (typeof hB[n] == 'undefined') {
        // If intersectionOnly flag set, ignore stuff that's
        // not in both sets
        if (o.intersectionOnly) { continue; };
        // Otherwise we want the union, note the diff
        addDiff(n, hA, hB, secondPass);
      }
      // Elem exists in both
      else {
        v = hA[n];
        // Multi-value -- array, hA[n] actually has values
        if (v instanceof Array) {
          if (!hB[n] || (hB[n].toString() != v.toString())) {
            addDiff(n, hA, hB, secondPass);
          }
        }
        // Single value -- null or string
        else {
          if (hB[n] != v) {
            addDiff(n, hA, hB, secondPass);
          }
        }
      }
    }
  }
  // First sweep check all items in updated
  diffSweep(hUpdated, hOrig, false);
  // Second sweep, check all items in orig
  diffSweep(hOrig, hUpdated, true);

  // Return an obj with the count and the hash of diffs
  return {
    count: count,
    diffs: diffs
  };
};


