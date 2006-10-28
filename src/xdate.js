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
if (typeof fleegix.date == 'undefined') { fleegix.date = {}; }
fleegix.date.XDate = function() {
   
  var a = [];
  var dt = null;
   
  // Use Date obj proxy for instantiation
  if (arguments.length == 1) {
    if (typeof arguments[0] == 'string') {
      dt = new Date(arguments[0]);
    }
    else {
      // Just create the UTC date for the timestamp
      dt = new Date(0);
      dt.setMilliseconds(arguments[0] + (dt.getTimezoneOffset()*60*1000));
    }
  }
  else {
    var args = [];
    for (var i = 0; i < 3; i++) {
      a[i] = arguments[i] || 0;
    }
    dt = new Date(a[0], a[1], a[2]);
  }
  
  this.year = 0;
  this.month = 0;
  this.date = 0;
  this.isXDate = true;
  
  this.setFromDateObjProxy(dt);
  return this;
}

fleegix.date.XDate.prototype = {
  getDate: function() { return this.date; },
  getDay: function() {},
  getFullYear: function() { return this.year; },
  getMonth: function() { return this.month; },
  getYear: function() { return this.year; },
  setDate: function(n) { 
    this.setAttribute('date', n); 
  },
  setFullYear: function(n) { 
    this.setAttribute('year', n); 
  },
  setMonth: function(n) { this.setAttribute('month', n); },
  setYear: function(n) { this.setUTCAttribute('year', n); },
  toGMTString: function() {},
  toLocaleString: function() {},
  toLocaleDateString: function() {},
  toLocaleTimeString: function() {},
  toSource: function() {},
  toString: function() {
    // Get a quick looky at what's in there
    var str = this.getFullYear() + '-' + (this.getMonth()+1) + '-' + this.getDate();
    return str;
  },
  setFromDateObjProxy: function(dt, fromUTC) {
    this.year = fromUTC ? dt.getUTCFullYear() : dt.getFullYear();
    this.month = fromUTC ? dt.getUTCMonth() : dt.getMonth();
    this.date = fromUTC ? dt.getUTCDate() : dt.getDate();
  },
  setAttribute: function(unit, n) {
    if (isNaN(n)) { throw('Units must be a number.'); }
    var dt = new Date(this.year, this.month, this.date,
      this.hours, this.minutes, this.seconds, this.milliseconds);
    var meth = unit == 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() +
      unit.substr(1);
    dt['set' + meth](n);
    this.setFromDateObjProxy(dt);
  },
  clone: function() {
    return new fleegix.date.XDate(this.year, this.month, this.date);
  },
  civilToJulianDayNumber: function(y, m, d) {
    // Adjust for zero-based JS-style array
    m++;
    if (m > 12) {
      var a = parseInt(m/12);
      m = m % 12;
      y += a;
    }
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    var a = Math.floor(y / 100);
    var b = 2 - a + Math.floor(a / 4);
    jDt = Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      d + b - 1524;
    return jDt;
  }
}

fleegix.date.XDateTime = function() {
  var a = [];
  var dt = null;
   
  // Use Date obj proxy for instantiation
  if (arguments.length == 1) {
    if (typeof arguments[0] == 'string') {
      dt = new Date(arguments[0]);
    }
    else {
      // Create the UTC date for the timestamp
      dt = new Date(0);
      dt.setMilliseconds(arguments[0] + (dt.getTimezoneOffset()*60*1000));
    }
  }
  else if (arguments.length == 2 && typeof arguments[1] == 'string') {
    var tz = arguments[1];
    if (typeof arguments[0] == 'number') {
      // Use UTC date to calculate the offset
      // FIXME: This causes DST leap to happen som hours off in
      // one direction or the other
      dt = new Date(0);
      dt.setMilliseconds(arguments[0] + (dt.getTimezoneOffset()*60*1000));
      dt = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
      var o = fleegix.date.timezone.getOffset(dt, arguments[1]);
      dt = new Date(0);
      dt.setMilliseconds(arguments[0] + (dt.getTimezoneOffset()*60*1000) - (o *60*1000));
    }
    else{
      dt = new Date(arguments[0]);
    }
  }
  else {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    if (typeof args[args.length -1] == 'string') {
      var tz = args.pop();
    }
    for (var i = 0; i < 8; i++) {
      a[i] = args[i] || 0;
    }
    dt = new Date(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
  }
  
  this.year = 0;
  this.month = 0;
  this.date = 0;
  this.hours = 0;
  this.minutes = 0; 
  this.seconds = 0;
  this.milliseconds = 0;
  this.timezone = '';
  this.utc = false;
  this.isXDateTime = true;
  
  this.setFromDateObjProxy(dt);
  this.setTimezone(tz);
  return this;
}

fleegix.date.XDateTime.prototype = new fleegix.date.XDate();

fleegix.date.XDateTime.prototype.getHours = function() { 
  return this.hours; 
};
fleegix.date.XDateTime.prototype.getMilliseconds = function() { 
  return this.milliseconds; 
};
fleegix.date.XDateTime.prototype.getMinutes = function() { 
  return this.minutes; 
};
fleegix.date.XDateTime.prototype.getSeconds = function() { 
  return this.seconds; 
};
fleegix.date.XDateTime.prototype.getTime = function() {
  var dt = Date.UTC(this.year, this.month, this.date,
    this.hours, this.minutes, this.seconds, this.milliseconds);
  return dt + (this.getTimezoneOffset()*60*1000);
};
fleegix.date.XDateTime.prototype.getTimezone = function() {
  return this.timezone;
};
fleegix.date.XDateTime.prototype.getTimezoneOffset = function() {
  if (this.utc) {
    offset= 0;
  }
  else {
    var dt = new Date(Date.UTC(this.year, this.month, this.date, 
      this.hours, this.minutes, this.seconds, this.milliseconds));
    var tz = this.timezone;
    offset = fleegix.date.timezone.getOffset(dt, tz);
  }
  return offset;
};
fleegix.date.XDateTime.prototype.getUTCDate = function() { 
  return this.getUTCDateProxy().getUTCDate(); 
};
fleegix.date.XDateTime.prototype.getUTCDay = function() { 
  return this.getUTCDateProxy().getUTCDay(); 
};
fleegix.date.XDateTime.prototype.getUTCFullYear = function() { 
  return this.getUTCDateProxy().getUTCFullYear(); 
};
fleegix.date.XDateTime.prototype.getUTCHours = function() { 
  return this.getUTCDateProxy().getUTCHours(); 
};
fleegix.date.XDateTime.prototype.getUTCMilliseconds = function() { 
  return this.getUTCDateProxy().getUTCMilliseconds(); 
};
fleegix.date.XDateTime.prototype.getUTCMinutes = function() { 
  return this.getUTCDateProxy().getUTCMinutes(); 
};
fleegix.date.XDateTime.prototype.getUTCMonth = function() { 
  return this.getUTCDateProxy().getUTCMonth(); 
};
fleegix.date.XDateTime.prototype.getUTCSeconds = function() { 
  return this.getUTCDateProxy().getUTCSeconds(); 
};
fleegix.date.XDateTime.prototype.setHours = function(n) { 
  this.setAttribute('hours', n); 
};
fleegix.date.XDateTime.prototype.setMilliseconds = function(n) { 
  this.setAttribute('milliseconds', n); 
};
fleegix.date.XDateTime.prototype.setMinutes = function(n) { 
  this.setAttribute('minutes', n); 
};
fleegix.date.XDateTime.prototype.setSeconds = function(n) { 
  this.setAttribute('seconds', n); 
};
fleegix.date.XDateTime.prototype.setTime = function(n) {
  if (isNaN(n)) { throw('Units must be a number.'); }
  var dt = new Date(0);
  dt.setUTCMilliseconds(n - (this.getTimezoneOffset()*60*1000));
  this.setFromDateObjProxy(dt, true);
};
fleegix.date.XDateTime.prototype.setTimezone = function(str) {
  this.timezone = str || 'Etc/UTC';
  if (this.timezone == 'Etc/UTC' || this.timezone == 'Etc/GMT') {
    this.utc = true;
  }
  else {
    this.utc = false;
  }
};
fleegix.date.XDateTime.prototype.setUTCDate = function(n) { 
  this.setUTCAttribute('date', n); 
};
fleegix.date.XDateTime.prototype.setUTCFullYear = function(n) { 
  this.setUTCAttribute('year', n); 
};
fleegix.date.XDateTime.prototype.setUTCHours = function(n) { 
  this.setUTCAttribute('hours', n); 
};
fleegix.date.XDateTime.prototype.setUTCMilliseconds = function(n) { 
  this.setUTCAttribute('milliseconds', n); 
};
fleegix.date.XDateTime.prototype.setUTCMinutes = function(n) { 
  this.setUTCAttribute('minutes', n); 
};
fleegix.date.XDateTime.prototype.setUTCMonth = function(n) { 
  this.setUTCAttribute('month', n); 
};
fleegix.date.XDateTime.prototype.setUTCSeconds = function(n) { 
  this.setUTCAttribute('seconds', n); 
};
fleegix.date.XDateTime.prototype.toGMTString = function() {};
fleegix.date.XDateTime.prototype.toLocaleString = function() {};
fleegix.date.XDateTime.prototype.toLocaleDateString = function() {};
fleegix.date.XDateTime.prototype.toLocaleTimeString = function() {};
fleegix.date.XDateTime.prototype.toSource = function() {};
fleegix.date.XDateTime.prototype.toString = function() {
  // Get a quick looky at what's in there
  var str = this.getFullYear() + '-' + (this.getMonth()+1) + '-' + this.getDate();
  var hou = this.getHours() || 12;
  hou = String(hou);
  var min = String(this.getMinutes());
  if (min.length == 1) { min = '0' + min; }
  var sec = String(this.getSeconds());
  if (sec.length == 1) { sec = '0' + sec; }
  str += ' ' + hou;
  str += ':' + min;
  str += ':' + min;
  return str;
};
fleegix.date.XDateTime.prototype.toUTCString = function() {};
fleegix.date.XDateTime.prototype.valueOf = function() { 
  return this.getTime(); 
};
fleegix.date.XDateTime.prototype.clone = function() {
  return new fleegix.date.XDateTime(this.year, this.month, this.date,
    this.hours, this.minutes, this.seconds, this.milliseconds,
    this.timezone);  
}
fleegix.date.XDateTime.prototype.setFromDateObjProxy = function(dt, fromUTC) {
  this.year = fromUTC ? dt.getUTCFullYear() : dt.getFullYear();
  this.month = fromUTC ? dt.getUTCMonth() : dt.getMonth();
  this.date = fromUTC ? dt.getUTCDate() : dt.getDate();
  this.hours = fromUTC ? dt.getUTCHours() : dt.getHours();
  this.minutes = fromUTC ? dt.getUTCMinutes() : dt.getMinutes();
  this.seconds = fromUTC ? dt.getUTCSeconds() : dt.getSeconds();
  this.milliseconds = fromUTC ? dt.getUTCMilliseconds() : dt.getMilliseconds();
};
fleegix.date.XDateTime.prototype.getUTCDateProxy = function() {
  var dt = new Date(Date.UTC(this.year, this.month, this.date, 
    this.hours, this.minutes, this.seconds, this.milliseconds));
  dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
  return dt;
};
fleegix.date.XDateTime.prototype.setUTCAttribute = function(unit, n) {
  if (isNaN(n)) { throw('Units must be a number.'); }
  var meth = unit == 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() +
    unit.substr(1);
  var dt = this.getUTCDateProxy();
  dt['setUTC' + meth](n);
  dt.setUTCMinutes(dt.getUTCMinutes() - this.getTimezoneOffset());
  this.setFromDateObjProxy(dt, true);
};
fleegix.date.XDateTime.prototype.getAstronomicalJulianDate = function() {
  var jd = this.civilToJulianDayNumber(this.year, this.month, this.date);
  var fr = this.timeToDayFraction(this.hour, this.minutes, this.seconds);
  var of = this.offsetToDayFraction(this.offset);
  return this.jDNToAJD(jd, fr, of); 
};
fleegix.date.XDateTime.prototype.timeToDayFraction = function(h, m, s) {
  return (h / 24) + (m / 1440) + (s / 86400);
};
fleegix.date.XDateTime.prototype.offsetToDayFraction = function(o) {
  return (o / 1440);
};
fleegix.date.XDateTime.prototype.jDNToAJD = function(jd, fr, of) {
  var offset = of || 0;
  return jd + fr - offset - (1 / 2);
}

