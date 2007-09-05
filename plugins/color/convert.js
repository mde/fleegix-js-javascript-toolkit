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
if (typeof fleegix.color == 'undefined') { fleegix.color = {}; }

fleegix.color.hexPat = /^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
fleegix.color.hex2rgb = function (str) {
  var rgb = [];
  var h = str.match(fleegix.color.hexPat);
  if (h) {
    for (var i = 1; i < h.length; i++) {
      var s = h[i];
      s = s.length == 1 ? s + s : s;
      rgb.push(parseInt(s, 16));
    }
    return rgb;
  }
  else {
    throw('"' + str + '" not a valid hex value.');
  }
};

fleegix.color.rgb2hex = function(rP, gP, bP) {
  var conv = function (x) {
    x = new Number(x);
    var s = x.toString(16);
    while(s.length < 2) { s = "0" + s; }
    return s;
  };
  if (rP instanceof Array) {
    var rgb = rP;
  }
  else { var rgb = [rP, gP, bP]; }
  var hex = [];
  for (var i = 0; i < rgb.length; i++) {
    hex.push(conv(rgb[i]));
  }
  hex.unshift("#");
  return hex.join('');
};

// Credits: Based on C Code in "Computer Graphics --
// Principles and Practice," Foley et al, 1996, p. 593.
// Input is h (0-360), s (0-100), v (0-100),
//    or [h,s,v] with same ranges
// Output is 0-255 range for each of [r,g,b]
fleegix.color.hsv2rgb = function (hP, sP, vP) {
  var h = null; var s = null; var v = null;
  if (hP instanceof Array) {
    h = hP[0] || 0;
    s = hP[1] || 0;
    v = hP[2] || 0;
  }
  else { h = hP; s = sP; v = vP; }
  if (h == 360) { h = 0; }
  s /= 100; v /= 100;
  var r = null; var g = null; var b = null;

  if (s == 0) {
    // Color is on black-and-white center line
    // achromatic: shades of gray
    r = v; g = v; b = v;
  }
  else {
    // Chromatic color
    var hTemp = h / 60;    // h is now IN [0,6]
    var i = Math.floor(hTemp);  // largest integer <= h
    var f = hTemp - i;    // fractional part of h
    var p = v * (1 - s);
    var q = v * (1 - (s * f));
    var t = v * (1 - (s * (1 - f)));

    switch(i) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return [r, g, b];
};

// Credits: Based on C Code in "Computer Graphics --
// Principles and Practice," Foley et al, 1996, p. 593.
// Input is 0-255 for each of r,g,b or [r,g,b]
// Output is [h (0-360), s (0-100), v (0-100)]
fleegix.color.rgb2hsv = function(rP, gP, bP) {
  var r = null; var g = null; var b = null;
  if (rP instanceof Array) {
    r = rP[0] || 0;
    g = rP[1] || 0;
    b = rP[2] || 0;
  }
  else { r = rP; g = gP; b = bP; }

  var h = null; var s = null; var v = null;
  var min = Math.min(r, g, b);

  v = Math.max(r, g, b);
  var delta = v - min;
  // Calculate saturation (0 if r, g and b are all 0)
  s = (v == 0) ? 0 : delta/v;
  if (s == 0) {
    // Achromatic: when saturation is, hue is undefined
    h = 0;
  }
  else {
    // Chromatic
    if (r == v) {
      // Between yellow and magenta
      h = 60 * (g - b) / delta;
    }
    else {
      if (g == v) {
        // Between cyan and yellow
        h = 120 + 60 * (b - r) / delta;
      }
      else {
        if (b == v) {
          // Between magenta and cyan
          h = 240 + 60 * (r - g) / delta;
        }
      }
    }
    if (h <= 0) { h += 360; }
  }
  s = s * 100;
  v = (v / 255) * 100;

  h = Math.round(h);
  s = Math.round(s);
  v = Math.round(v);

  return [h, s, v];
};



