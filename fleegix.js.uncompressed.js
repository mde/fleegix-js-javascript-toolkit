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


if (typeof fleegix.date == 'undefined') { fleegix.date = {}; }
fleegix.date.timezone = new function() {
  
  this.zoneAreas = { AFRICA: 'africa', ANTARCTICA: 'antarctica', 
    ASIA: 'asia', AUSTRALASIA: 'australasia', BACKWARD: 'backward', 
    ETCETERA: 'etcetera', EUROPE: 'europe', NORTHAMERICA: 'northamerica', 
    PACIFICNEW: 'pacificnew', SOUTHAMERICA: 'southamerica', 
    SYSTEMV: 'systemv' };
  
  var self = this;
  var monthMap = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,'may': 4, 'jun': 5, 
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 } 
  var dayMap = {'sun': 0,'mon' :1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6 }
  var zoneKeys = {
    'Africa': this.zoneAreas.AFRICA,
    'Indian': this.zoneAreas.AFRICA,
    'Antarctica': this.zoneAreas.ANTARCTICA,
    'Asia': this.zoneAreas.ASIA,
    'Pacific': this.zoneAreas.AUSTRALASIA,
    'Australia': this.zoneAreas.AUSTRALASIA,
    'Etc': this.zoneAreas.ETCETERA,
    'EST': this.zoneAreas.NORTHAMERICA,
    'MST': this.zoneAreas.NORTHAMERICA,
    'HST':this.zoneAreas.NORTHAMERICA,
    'EST5EDT': this.zoneAreas.NORTHAMERICA,
    'CST6CDT': this.zoneAreas.NORTHAMERICA,
    'MST7MDT': this.zoneAreas.NORTHAMERICA,
    'PST8PDT': this.zoneAreas.NORTHAMERICA,
    'America': function() {
      var ret = [];
      if (!this.loadedZoneAreas[this.zoneAreas.NORTHAMERICA]) {
        ret.push(this.zoneAreas.NORTHAMERICA);
      }
      if (!this.loadedZoneAreas[this.zoneAreas.SOUTHAMERICA]) {
        ret.push(this.zoneAreas.SOUTHAMERICA);
      u}
      return ret;
    },
    'WET': this.zoneAreas.EUROPE,
    'CET': this.zoneAreas.EUROPE,
    'MET': this.zoneAreas.EUROPE,
    'EET': this.zoneAreas.EUROPE,
    'Europe': this.zoneAreas.EUROPE,
    'SystemV': this.zoneAreas.SYSTEMV
  };
  var zoneExceptions = {
    'Pacific/Honolulu': this.zoneAreas.NORTHAMERICA,
    'Pacific/Easter': this.zoneAreas.SOUTHAMERICA,
    'Pacific/Galapagos': this.zoneAreas.SOUTHAMERICA,
    'America/Danmarkshavn': this.zoneAreas.EUROPE,
    'America/Scoresbysund': this.zoneAreas.EUROPE,
    'America/Godthab': this.zoneAreas.EUROPE,
    'America/Thule': this.zoneAreas.EUROPE,
    'Indian/Kerguelen': this.zoneAreas.ANTARCTICA,
    'Indian/Chagos': this.zoneAreas.ASIA,
    'Indian/Maldives': this.zoneAreas.ASIA,
    'Indian/Christmas': this.zoneAreas.AUSTRALASIA,
    'Indian/Cocos': this.zoneAreas.AUSTRALASIA,
    'Europe/Nicosia': this.zoneAreas.ASIA,
    'Pacific/Easter': this.zoneAreas.SOUTHAMERICA,
    'Africa/Ceuta': this.zoneAreas.EUROPE,
    'Asia/Yekaterinburg': this.zoneAreas.EUROPE,
    'Asia/Omsk': this.zoneAreas.EUROPE,
    'Asia/Novosibirsk': this.zoneAreas.EUROPE,
    'Asia/Krasnoyarsk': this.zoneAreas.EUROPE,
    'Asia/Irkutsk': this.zoneAreas.EUROPE,
    'Asia/Yakutsk': this.zoneAreas.EUROPE,
    'Asia/Vladivostok': this.zoneAreas.EUROPE,
    'Asia/Sakhalin': this.zoneAreas.EUROPE,
    'Asia/Magadan': this.zoneAreas.EUROPE,
    'Asia/Kamchatka': this.zoneAreas.EUROPE,
    'Asia/Anadyr': this.zoneAreas.EUROPE,
    'Asia/Istanbul': this.zoneAreas.EUROPE
  };
  var loadedZoneAreas = {};
  
  function parseTimeString(str) {
    var pat = /(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
    var hms = str.match(pat);
    hms[1] = parseInt(hms[1]);
    hms[2] = hms[2] ? parseInt(hms[2]) : 0;
    hms[3] = hms[3] ? parseInt(hms[3]) : 0;
    return hms;
  }
  function getZone(dt, tz) {
    var timezone = tz;
    var zones = self.zones[timezone];
    while (typeof(zones) == "string") {
      timezone = zones;
      zones = self.zones[timezone];
      if (!zones) {
        alert('Cannot figure out the timezone ' + timezone);
      }
    }
    for(var i = 0; i < zones.length; i++) {
      var z = zones[i];
      if (!z[3]) { break; }
      var yea = parseInt(z[3]);
      var mon = 11;
      var dat = 31;
      if (z[4]) {
        mon = monthMap[z[4].substr(0, 3).toLowerCase()];
        dat = parseInt(z[5]);
      }
      var t = z[6] ? z[6] : '23:59:59';
      t = parseTimeString(t);
      var d = Date.UTC(yea, mon, dat, t[1], t[2], t[3]);
      if (dt.getTime() < d) { break; }
    }
    if (i == zones.length) {
       alert('No DST for ' + timezone); 
    }
    // Get basic offset
    else {
      return zones[i]; 
    }
    
  }
  function getBasicOffset(z) {
    var off = parseTimeString(z[0]);
    var adj = z[0].indexOf('-') == 0 ? -1 : 1
    off = adj * (((off[1] * 60 + off[2]) *60 + off[3]) * 1000);
    return -off/60/1000;
  }
  function getRule(dt, str) {
    var currRule = null;
    var year = dt.getUTCFullYear();
    var rules = self.rules[str];
    var ruleHits = [];
    if (!rules) { return null; }
    for (var i = 0; i < rules.length; i++) {
      r = rules[i];
      if ((r[1] < (year - 1)) || 
        (r[0] < (year - 1) && r[1] == 'only') ||
        (r[0] > year)) { 
        continue; 
      };
      var mon = monthMap[r[3].substr(0, 3).toLowerCase()];
      var day = r[4];
      
      if (isNaN(day)) {
        if (day.substr(0, 4) == 'last') {
          var day = dayMap[day.substr(4,3).toLowerCase()];
          var t = parseTimeString(r[5]);
          // Last day of the month at the desired time of day
          var d = new Date(Date.UTC(dt.getUTCFullYear(), mon+1, 1, t[1]-24, t[2], t[3]));
          var dtDay = d.getUTCDay();
          var diff = (day > dtDay) ? (day - dtDay - 7) : (day - dtDay);
          // Set it to the final day of the correct weekday that month
          d.setUTCDate(d.getUTCDate() + diff);
          if (dt < d) {
            // If no match found, check the previous year if rule allows
            if (r[0] < year) {
              d.setUTCFullYear(d.getUTCFullYear()-1);
              if (dt >= d) {
                ruleHits.push({ 'rule': r, 'date': d });
              }
            }
          }
          else {
            ruleHits.push({ 'rule': r, 'date': d });
          }
        }
        else {
          day = dayMap[day.substr(0, 3).toLowerCase()];
          if (day != 'undefined') {
            if(r[4].substr(3, 2) == '>=') {
              var t = parseTimeString(r[5]);
              // The stated date of the month
              var d = new Date(Date.UTC(dt.getUTCFullYear(), mon, 
                parseInt(r[4].substr(5)), t[1], t[2], t[3]));
              var dtDay = d.getUTCDay();
              var diff = (day < dtDay) ? (day - dtDay + 7) : (day - dtDay);
              // Set to the first correct weekday after the stated date
              d.setUTCDate(d.getUTCDate() + diff);
              if (dt < d) {
                // If no match found, check the previous year if rule allows
                if (r[0] < year) {
                  d.setUTCFullYear(d.getUTCFullYear()-1);
                  if (dt >= d) {
                    ruleHits.push({ 'rule': r, 'date': d });
                  }
                }
              }
              else {
                ruleHits.push({ 'rule': r, 'date': d });
              }
            }
            else if (day.substr(3, 2) == '<=') {
              var t = parseTimeString(r[5]);
              // The stated date of the month
              var d = new Date(Date.UTC(dt.getUTCFullYear(), mon, 
                parseInt(r[4].substr(5)), t[1], t[2], t[3]));
              var dtDay = d.getUTCDay();
              var diff = (day > dtDay) ? (day - dtDay - 7) : (day - dtDay);
              // Set to first correct weekday before the stated date
              d.setUTCDate(d.getUTCDate() + diff);
              if (dt < d) {
                // If no match found, check the previous year if rule allows
                if (r[0] < year) {
                  d.setUTCFullYear(d.getUTCFullYear()-1);
                  if (dt >= d) {
                    ruleHits.push({ 'rule': r, 'date': d });
                  }
                }
              }
              else {
                ruleHits.push({ 'rule': r, 'date': d });
              }
            }
          }
        }
      }
      else {
        var t = parseTimeString(r[5]);
        var d = new Date(Date.UTC(dt.getUTCFullYear(), mon, day, t[1], t[2], t[3]));
        d.setUTCHours(d.getUTCHours() - 24*((7 - day + d.getUTCDay()) % 7));
        if (dt < d) { 
          continue; 
        }
        else {
          ruleHits.push({ 'rule': r, 'date': d });
        }
      }
    }
    f = function(a, b) { return (a.date.getTime() >= b.date.getTime()) ?  1 : -1; }
    ruleHits.sort(f);
    currRule = ruleHits.pop().rule;
    return currRule;
  }
  function getAdjustedOffset(off, rule) {
    var save = rule[6];
    var t = parseTimeString(save);
    var adj = save.indexOf('-') == 0 ? -1 : 1;
    var ret = (adj*(((t[1] *60 + t[2]) * 60 + t[3]) * 1000));
    ret = ret/60/1000;
    ret -= off
    ret = -Math.ceil(ret);
    return ret;
  }
  
  this.defaultZoneArea = this.zoneAreas.NORTHAMERICA;
  this.zones = {};
  this.rules = {};
  this.parseZones = function(str) {
    var s = '';
    var lines = str.split('\n');
    var arr = [];
    var chunk = '';
    var zone = null;
    var rule = null;
    for (var i = 0; i < lines.length; i++) {
      l = lines[i];
      if (l.match(/^\s/)) {
        l = "Zone " + zone + l;
      }
      l = l.split("#")[0];
      if (l.length > 3) {
        arr = l.split(/\s+/);
        chunk = arr.shift();
        switch(chunk) {
          case 'Zone':
            zone = arr.shift();
            if (!self.zones[zone]) { self.zones[zone] = [] }
            self.zones[zone].push(arr);
            break;
          case 'Rule':
            rule = arr.shift();
            if (!self.rules[rule]) { self.rules[rule] = [] }
            self.rules[rule].push(arr);
            break;
          case 'Link':
            // Shouldn't exist
            if (self.zones[arr[1]]) { alert('Error with Link ' + arr[1]); }
            self.zones[arr[1]] = arr[0];
            break;
          case 'Leap':
            break;
          default:
            // Fail silently
            break;
        }
      }
    }
    return true;
  };
  this.getOffset = function(dt, tz) {
    var zone = getZone(dt, tz);
    var off = getBasicOffset(zone);
    var rule = getRule(dt, zone[1]);
    if (rule) {
      off = getAdjustedOffset(off, rule);
    }
    return off;
  }
}


fleegix.json = new function() {
  this.serialize = function(obj) {
    var str = '';
    switch (typeof obj) {
      case 'object':
        // Null
        if (obj == null) {
           return 'null';
        }
        // Arrays
        else if (obj instanceof Array) {
          for (var i = 0; i < obj.length; i++) {
            if (str) { str += ',' }
            str += fleegix.json.serialize(obj[i]);
          }
          return '[' + str + ']';
        }
        // Objects
        else if (typeof obj.toString != 'undefined') {
          for (var i in obj) {
            if (str) { str += ',' }
            str += '"' + i + '":';
            str += (obj[i] == undefined) ? 
              '"undefined"' : fleegix.json.serialize(obj[i]); 
          }
          return '{' + str + '}';
        }
        return str;
        break;
      case 'unknown':
      case 'undefined':
      case 'function':
        return '"undefined"';
        break;
      case 'string':
        str += '"' + obj.replace(/(["\\])/g, '\\$1').replace(
          /\r/g, '').replace(/\n/g, '\\n') + '"';
        return str;
        break;
      default:
        return String(obj);
        break;
    }
  };
}

fleegix.json.constructor = null;


if (typeof fleegix.date == 'undefined') { fleegix.date = {}; }
fleegix.date.XDate = function() {
   
  var a = [];
  var dt = null;
   
  if (!arguments.length) {
    dt = new Date();
  }
  // Use Date obj proxy for instantiation
  else if (arguments.length == 1) {
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
    var dt = new Date(this.year, this.month, this.date);
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
   
  if (!arguments.length) {
    dt = new Date();
  }
  // Use Date obj proxy for instantiation
  else if (arguments.length == 1) {
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
fleegix.date.XDateTime.prototype.setAttribute = function(unit, n) {
  if (isNaN(n)) { throw('Units must be a number.'); }
  var dt = new Date(this.year, this.month, this.date,
    this.hours, this.minutes, this.seconds, this.milliseconds);
  var meth = unit == 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() +
    unit.substr(1);
  dt['set' + meth](n);
  this.setFromDateObjProxy(dt);
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


fleegix.xml = new function(){
    
    var self = this;
    
    // Takes an array of XML items, transforms into an array of JS objects
    // Call it like this: res = fleegix.xml.parse(xml, 'Item'); 
    this.parse = function(xmlDocElem, tagItemName) {
        var xmlElemArray = new Array;
        var xmlElemRow;
        var objArray = [];
        
        // Rows returned
        if (xmlDocElem.hasChildNodes()) {
            xmlElemArray = xmlDocElem.getElementsByTagName(tagItemName);
            xmlElemRow = xmlElemArray[0];
            // Create array of objects and set properties
            for (var j = 0; j < xmlElemArray.length; j++) {
                xmlElemRow = xmlElemArray[j];
                objArray[j] = self.xmlElem2Obj(xmlElemArray[j]);
            }
        }
        return objArray;
    };
    
    // Transforms an XML element into a JS object
    this.xmlElem2Obj = function(xmlElem) {
        var ret = new Object();
        self.setPropertiesRecursive(ret, xmlElem);
        return ret;
    };
    
    this.setPropertiesRecursive = function(obj, node) {
        if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType == 1 &&
                  node.childNodes[i].firstChild) {
                    // If node has only one child
                    // set the obj property to the value of the node
                    if(node.childNodes[i].childNodes.length == 1) {
                        obj[node.childNodes[i].tagName] = 
                        node.childNodes[i].firstChild.nodeValue;
                    }
                    // Otherwise this obj property is an array
                    // Recurse to set its multiple properties
                    else {
                        obj[node.childNodes[i].tagName] = [];
                        // Call recursively -- rinse and repeat
                        // ==============
                        self.setPropertiesRecursive(
                        obj[node.childNodes[i].tagName], 
                        node.childNodes[i]);
                    }
                }
            }
        }
    };
    
    this.cleanXMLObjText = function(xmlObj) {
        var cleanObj = xmlObj;
        for (var prop in cleanObj) {
            cleanObj[prop] = cleanText(cleanObj[prop]);
        }
        return cleanObj;
    };
    
    this.cleanText = function(str) {
        var ret = str;
        ret = ret.replace(/\n/g, '');
        ret = ret.replace(/\r/g, '');
        ret = ret.replace(/\'/g, "\\'");
        ret = ret.replace(/\[CDATA\[/g, '');
        ret = ret.replace(/\]]/g, '');
        return ret;
    };
    
    this.rendered2Source = function(str) {
        // =============
        // Convert string of markup into format which will display
        // markup in the browser instead of rendering it
        // =============
        var proc = str;    
        proc = proc.replace(/</g, '&lt;');
        proc = proc.replace(/>/g, '&gt;');
        return '<pre>' + proc + '</pre>';
    };
    
    /*
    Works with embedded XML document structured like this:
    =====================
    <div id="xmlThingDiv" style="display:none;">
        <xml>
            <thinglist>
                <thingsection sectionname="First Section o' Stuff">
                    <thingitem>
                        <thingproperty1>Foo</thingproperty1>
                        <thingproperty2>Bar</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                    <thingitem>
                        <thingproperty1>Free</thingproperty1>
                        <thingproperty2>Beer</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                </thingsection> 
                <thingsection sectionname="Second Section o' Stuff">
                    <thingitem>
                        <thingproperty1>Far</thingproperty1>
                        <thingproperty2>Boor</thingproperty2>
                        <thingproperty3>
                            <![CDATA[Blah blah ...]]>
                        </thingproperty3>
                    </thingitem>
                </thingsection>
            </thinglist>
        </xml>
    </div>
    
    Call the function like this:
    var xmlElem = getXMLDocElem('xmlThingDiv', 'thinglist');
    --------
    xmlDivId: For IE to pull using documentElement
    xmlNodeName: For Moz/compat to pull using getElementsByTagName
    */
    
    // Returns a single, top-level XML document node
    this.getXMLDocElem = function(xmlDivId, xmlNodeName) {
        var xmlElemArray = [];
        var xmlDocElem = null;
        if (document.all) {
                var xmlStr = document.getElementById(xmlDivId).innerHTML;
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.loadXML(xmlStr);    
                xmlDocElem = xmlDoc.documentElement;
          }
          // Moz/compat can access elements directly
          else {
            xmlElemArray = 
                window.document.body.getElementsByTagName(xmlNodeName);
            xmlDocElem = xmlElemArray[0]; ;
          }
          return xmlDocElem;
    };
}
fleegix.xml.constructor = null;

fleegix.xhr = new function() {

  // Properties
  // ================================
  this.req = null;
  this.reqId = 0;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.dataPayload = null;
  this.readyState = null;
  this.responseText = null;
  this.responseXML = null;
  this.handleResp = null;
  this.responseFormat = 'text', // 'text', 'xml', 'object'
  this.mimeType = null;
  this.username = '';
  this.password = '';
  this.headers = [];
  
  var i = 0;
  var reqTry = [ 
    function() { return new XMLHttpRequest(); },
    function() { return new ActiveXObject('Msxml2.XMLHTTP') },
    function() { return new ActiveXObject('Microsoft.XMLHTTP' )} ];
  
  while (!this.req && (i < reqTry.length)) {
    try { this.req = reqTry[i++](); } 
    catch(e) {}
  }
  if (this.req) {
    this.reqId = 0;
  }
  else {
    alert('Could not create XMLHttpRequest object.');
  }
  
  // Methods
  // ================================
  this.doGet = function(hand, url, format) {
    this.handleResp = hand;
    this.url = url;
    this.responseFormat = format || 'text';
    return this.doReq();
  };
  this.doPost = function(hand, url, dataPayload, format) {
    this.handleResp = hand;
    this.url = url;
    this.dataPayload = dataPayload;
    this.responseFormat = format || 'text';
    this.method = 'POST';
    return this.doReq();
  };
  this.doReq = function() {
    var self = null;
    var req = null;
    var id = null;
    var headArr = [];
     
    req = this.req;
    this.reqId++;
    id = this.reqId;
    // Set up the request
    // ==========================
    if (this.username && this.password) {
      req.open(this.method, this.url, this.async, this.username, this.password);
    }
    else {
      req.open(this.method, this.url, this.async);
    }
    // Override MIME type if necessary for Mozilla/Firefox & Safari
    if (this.mimeType && navigator.userAgent.indexOf('MSIE') == -1) {
      req.overrideMimeType(this.mimeType);
    }
    
    // Add any custom headers that are defined
    if (this.headers.length) {
      // Set any custom headers
      for (var i = 0; i < this.headers.length; i++) {
        headArr = this.headers[i].split(': ');
        req.setRequestHeader(headArr[i], headArr[1]);
      }
      this.headers = [];
    }
    // Otherwise set correct content-type for POST
    else {
      if (this.method == 'POST') {
        req.setRequestHeader('Content-Type', 
          'application/x-www-form-urlencoded');
      }
    }
    
    self = this; // Fix loss-of-scope in inner function
    req.onreadystatechange = function() {
      var resp = null;
      self.readyState = req.readyState;
      if (req.readyState == 4) {
        
        // Make these properties available to the Ajax object
        self.status = req.status;
        self.statusText = req.statusText;
        self.responseText = req.responseText;
        self.responseXML = req.responseXML;
        
        // Set the response according to the desired format
        switch(self.responseFormat) {
          // Text
          case 'text':
            resp = self.responseText;
            break;
          // XML
          case 'xml':
            resp = self.responseXML;
            break;
          // The object itself
          case 'object':
            resp = req;
            break;
        }
        
        // Request is successful -- pass off to response handler
        if (self.status > 199 && self.status < 300) {
          if (self.async) {
              // Make sure handler is defined
              if (!self.handleResp) {
                alert('No response handler defined ' +
                  'for this XMLHttpRequest object.');
                return;
              }
              else {
                self.handleResp(resp, id);
              }
          }
        }
        // Request fails -- pass to error handler
        else {
          self.handleErr(resp);
        }
      }
    }
    // Send the request, along with any data for POSTing
    // ==========================
    req.send(this.dataPayload);
    if (this.async) {
        return id;
    }
    else {
        return req;
    }
  };
  this.abort = function() {
    if (this.req) {
      this.req.onreadystatechange = function() { };
      this.req.abort();
      this.req = null;
    }
  };
  this.handleErr = function() {
    var errorWin;
    // Create new window and display error
    try {
      errorWin = window.open('', 'errorWin');
      errorWin.document.body.innerHTML = this.responseText;
    }
    // If pop-up gets blocked, inform user
    catch(e) {
      alert('An error occurred, but the error message cannot be' +
      ' displayed because of your browser\'s pop-up blocker.\n' +
      'Please allow pop-ups from this Web site.');
    }
  };
  this.setMimeType = function(mimeType) {
    this.mimeType = mimeType;
  };
  this.setHandlerResp = function(funcRef) {
    this.handleResp = funcRef;
  };
  this.setHandlerErr = function(funcRef) {
    this.handleErr = funcRef; 
  };
  this.setHandlerBoth = function(funcRef) {
    this.handleResp = funcRef;
    this.handleErr = funcRef;
  };
  this.setRequestHeader = function(headerName, headerValue) {
    this.headers.push(headerName + ': ' + headerValue);
  };
}

fleegix.xhr.constructor = null;

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
      self.win = null;  
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



/**
 * Serializes the data from all the inputs in a Web form
 * into a query-string style string.
 * @param docForm -- Reference to a DOM node of the form element
 * @param formatOpts -- JS object of options for how to format
 * the return string. Supported options:
 *    collapseMulti: (Boolean) take values from elements that
 *    can return multiple values (multi-select, checkbox groups)
 *    and collapse into a single, comman-delimited value
 *    (e.g., thisVar=asdf,qwer,zxcv)
 * @returns query-string style String of variable-value pairs
 */
fleegix.form = {};
fleegix.form.serialize = function (f, o) {
  var h = fleegix.form.toHash(f);
  var opts = o || {};
  var str = '';
  var pat = null;

  if (opts.stripTags) { pat = /<[^>]*>/g; }
  for (var n in h) {
    var s = '';
    var v = h[n];
    if (v) {
      // Single val -- string
      if (typeof v == 'string') {
        s = opts.stripTags ? v.replace(pat, '') : v;
        str += n + '=' + encodeURIComponent(s);
      }
      // Multiple vals -- array
      else {
        var sep = ''; 
        if (opts.collapseMulti) {
          sep = ',';
          str += n + '=';
        }
        else {
          sep = '&';
        }
        for (var j = 0; j < v.length; j++) {
          s = opts.stripTags ? v[j].replace(pat, '') : v[j];
          s = (!opts.collapseMulti) ? n + '=' + encodeURIComponent(s) : 
            encodeURIComponent(s);
          str += s + sep;
        }
        str = str.substr(0, str.length - 1);
      }
      str += '&'
    }
    else {
      if (opts.includeEmpty) { str += n + '=&'; }
    }
  }
  str = str.substr(0, str.length - 1);
  return str;
};

fleegix.form.toHash = function (f) { 
  var h = {};
  
  function expandToArr(orig, val) {
    if (orig) {
      var r = null;
      if (typeof orig == 'string') {
        r = [];
        r.push(orig);
      }
      else {
        r = orig;
      }
      r.push(val);
      return r;
    }
    else {
      return val;
    }
  }
  
  for (i = 0; i < f.elements.length; i++) {
    elem = f.elements[i];
    
    switch (elem.type) {
      // Text fields, hidden form elements
      case 'text':
      case 'hidden':
      case 'password':
      case 'textarea':
      case 'select-one':
        h[elem.name] = elem.value;
        break;
        
      // Multi-option select
      case 'select-multiple':
        h[elem.name] = null;
        for(var j = 0; j < elem.options.length; j++) {
          var o = elem.options[j];
          if(o.selected) {
            h[elem.name] = expandToArr(h[elem.name], o.value);
          }
        }
        break;
      
      // Radio buttons
      case 'radio':
        if (typeof h[elem.name] == 'undefined') { h[elem.name] = null; }
        if (elem.checked) {
          h[elem.name] = elem.value; 
        }
        break;
        
      // Checkboxes
      case 'checkbox':
        if (typeof h[elem.name] == 'undefined') { h[elem.name] = null; }
        if (elem.checked) {
          h[elem.name] = expandToArr(h[elem.name], elem.value);
        }
        break;
        
    }
  }
  return h;
};

fleegix.form.restore = function (form, str) {
  var arr = str.split('&');
  var d = {};
  for (var i = 0; i < arr.length; i++) {
    var pair = arr[i].split('=');
    var name = pair[0];
    var val = pair[1];
    if (typeof d[name] == 'undefined') {
      d[name] = val;
    }
    else {
      if (!(d[name] instanceof Array)) {
        var t = d[name];
        d[name] = [];
        d[name].push(t);
      }
      d[name].push(val);
    }
  }
  for (var i = 0; i < form.elements.length; i++) {
    elem = form.elements[i];
    if (typeof d[elem.name] != 'undefined') {
      val = d[elem.name];
      switch (elem.type) {
        case 'text':
          case 'hidden':
          case 'password':
          case 'textarea':
          case 'select-one':
          elem.value = decodeURIComponent(val);
          break;
        case 'radio':
          if (encodeURIComponent(elem.value) == val) {
            elem.checked = true; 
          }
          break;
        case 'checkbox':
          for (var j = 0; j < val.length; j++) {
            if (encodeURIComponent(elem.value) == val[j]) {
              elem.checked = true; 
            }
          }
          break;
        case 'select-multiple':
          for (var h = 0; h < elem.options.length; h++) {
            var opt = elem.options[h];
            for (var j = 0; j < val.length; j++) {
              if (encodeURIComponent(opt.value) == val[j]) {
                opt.selected = true; 
              }
            }
          }
          break;
      }
    }
  }
  return form;
};

fleegix.form.diff = function (formA, formB) {
  // Accept either form or hash-conversion of form
  hA = formA.toString() == '[object HTMLFormElement]' ? 
    fleegix.form.toHash(formA) : formA;
  hB = formB.toString() == '[object HTMLFormElement]' ? 
    fleegix.form.toHash(formB) : formB;
  var diff = [];

  for (n in hA) {
    // Elem doesn't exist in B
    if (typeof hB[n] == 'undefined') {
      diff.push(n);
    }
    // Elem exists in both
    else {
      v = hA[n];
      // Multi-value -- array
      if (v instanceof Array) {
        if (hB[n].toString() != v.toString()) {
          diff.push(n);
        }
      }
      // Single value -- null or string
      else {
        if (hB[n] != v) {
          diff.push(n);
        }
      }
    }
  }
  return diff;
}











fleegix.event = new function() {
  
  // List of handlers for event listeners
  var listenerCache = [];
  // List of channels being published to
  var channels = {};
  
  this.listen = function() {
    var tgtObj = arguments[0]; // Target object for the new listener
    var tgtMeth = arguments[1]; // Method to listen for
    // Look to see if there's already a registry of listeners
    var listenReg = tgtObj[tgtMeth] ? 
      tgtObj[tgtMeth].listenReg : null;
    
    // Create the registry of listeners if need be
    // -----------------
    if (!listenReg) {
      listenReg = {};
      // The original obj and method name 
      listenReg.orig = {}
      listenReg.orig.obj = tgtObj, 
      listenReg.orig.methName = tgtMeth;
      // Clone existing method code if it exists
      if (tgtObj[tgtMeth]) {
        listenReg.orig.methCode = 
          eval(tgtObj[tgtMeth].valueOf());
      }
      // Array of handlers to execute if the method fires
      listenReg.after = [];
      // Replace the original method with the exec proxy
      tgtObj[tgtMeth] = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        fleegix.event.exec(
          tgtObj[tgtMeth].listenReg, args);
      }
      tgtObj[tgtMeth].listenReg = listenReg;
      // Add to global cache -- so we can remove listeners
      // on unload to avoid memleak in IE6
      listenerCache.push(tgtObj[tgtMeth].listenReg);
    }
    
    // Add the new handler to the listener registry
    // -----------------
    // Simple function
    if (typeof arguments[2] == 'function') {
      listenReg.after.push(arguments[2]);
    }
    // Object and method
    else {
      listenReg.after.push([arguments[2], arguments[3]]);
    }
    
    tgtObj[tgtMeth].listenReg = listenReg;
  };
  this.exec = function(reg, args) {
    // Execute the original code for the trigger
    // method if there is any -- apply arguments
    // passed in the right execution context
    if (reg.orig.methCode) {
      reg.orig.methCode.apply(reg.orig.obj, args);
    }
    if (reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)) {
      args[0] = args[0] || window.event;
    }
    
    // Execute all the handler functions registered
    for (var i = 0; i < reg.after.length; i++) {
      var ex = reg.after[i];
      // Single functions
      if (ex.length == 0) {
        var execFunction = ex;
        execFunction(args);
      }
      // Methods of objects
      else {
        execObj = ex[0];
        execMethod = ex[1];
        // Pass args and exec in correct scope
        execObj[execMethod].apply(execObj, args);
      }
    }
  };
  this.unlisten = function() {
    var tgtObj = arguments[0]; // Obj from which to remove
    var tgtMeth = arguments[1]; // Trigger method
    var listenReg = tgtObj[tgtMeth] ? 
      tgtObj[tgtMeth].listenReg : null;
    var remove = null;
    
    // Bail out if no handlers
    if (!listenReg) {
      return false;
    }
    
    // Simple function
    // Remove the handler if it's in the list
    for (var i = 0; i < listenReg.after.length; i++) {
      var ex = listenReg.after[i];
      if (typeof arguments[2] == 'function') {
        if (ex == arguments[2]) {
          listenReg.after.splice(i, 1);
        }
      }
      // Object and method
      else {
        if (ex[0] == arguments[2] && ex[1] == 
          arguments[3]) {
          listenReg.after.splice(i, 1);
        }
      }
    }
     tgtObj[tgtMeth].listenReg = listenReg;
  };
  this.flush = function() {
    // Remove all the registered listeners to avoid
    // IE6 memleak
    for (var i = 0; i < listenerCache.length; i++) {
      var reg = listenerCache[i];
      removeObj = reg.orig.obj;
      removeMethod = reg.orig.methName;
      removeObj[removeMethod] = null;
    }
  };
  this.subscribe = function(subscr, obj, method) {
    // Make sure there's an obj param
    if (!obj) { return };
    // Create the channel if it doesn't exist
    if (!channels[subscr]) {
      channels[subscr] = {};
      channels[subscr].audience = [];
    }
    else {
      // Remove any previous listener method for the obj
      this.unsubscribe(subscr, obj);
    }
    // Add the object and its handler to the array
    // for the channel
    channels[subscr].audience.push([obj, method]);
  };
  this.unsubscribe = function(unsubscr, obj) {
    // If not listener obj specified, kill the
    // entire channel
    if (!obj) {
      channels[unsubscr] = null;
    }
    // Otherwise remove the object and its handler
    // from the array for the channel
    else {
      if (channels[unsubscr]) {
        var aud = channels[unsubscr].audience;
        for (var i = 0; i < aud.length; i++) {
          if (aud[i][0] == obj) {
             aud.splice(i, 1); 
          }
        }
      }
    }
  };
  this.publish = function(pub, data) {
    // Make sure the channel exists
    if (channels[pub]) {
      aud = channels[pub].audience;
      // Pass the published data to all the 
      // obj/methods listening to the channel
      for (var i = 0; i < aud.length; i++) {
        var listenerObject = aud[i][0];
        var handlerMethod = aud[i][1];
        listenerObject[handlerMethod](data);
      }
    }
  };
  this.getSrcElementId = function(e) {
    var ret = null;
    if (e.srcElement) ret = e.srcElement;
    else if (e.target) ret = e.target;
    // Avoid trying to use fake obj from IE on disabled
    // form elements
    if (typeof ret.id == 'undefined') {
      return null;
    }
    // Look up the id of the elem or its parent
    else {
      // Look for something with an id -- not a text node
      while (!ret.id || ret.nodeType == 3) {
        // Bail if we run out of parents
        if (ret.parentNode) {
          ret = ret.parentNode;
        }
        else {
          return null;
        }
      }
    }
    return ret.id;
  };
}
fleegix.event.constructor = null;
// Prevent memleak in IE6
fleegix.event.listen(window, 'onunload', fleegix.event, 'flush');




fleegix.cookie = new function() {
  this.set = function(name, value, optParam) {
    var opts = optParam || {}
    var exp = '';
    var t = 0;
    var path = opts.path || '/';
    var days = opts.days || 0;
    var hours = opts.hours || 0;
    var minutes = opts.minutes || 0;
    
    t += days ? days*24*60*60*1000 : 0;
    t += hours ? hours*60*60*1000 : 0;
    t += minutes ? minutes*60*1000 : 0;
    
    if (t) {
      var dt = new Date();
      dt.setTime(dt.getTime() + t);
      exp = '; expires=' + dt.toGMTString();
    }
    else {
      exp = '';
    }
    document.cookie = name + '=' + value + 
      exp + '; path=' + path;
  };
  this.get = function(name) {
    var nameEq = name + '=';
    var arr = document.cookie.split(';');
    for(var i = 0; i < arr.length; i++) {
      var c = arr[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEq) == 0) {
        return c.substring(nameEq.length, c.length);
      }
    }
    return null;
  };
  this.create = this.set;
  this.destroy = function(name, path) {
    var opts = {};
    opts.minutes = -1;
    if (path) { opts.path = path; }
    this.set(name, '', opts);
  };
}
fleegix.cookie.constructor = null; 

