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
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
if (typeof fleegix == 'undefined') { var fleegix = {}; }
if (typeof fleegix.date == 'undefined') { fleegix.date = {}; }

fleegix.date.Date = function () {
  var args = Array.prototype.slice.apply(arguments);
  var t = null;
  var dt = null;
  var tz = null;
  var utc = false;

  // No args -- create a floating date based on the current local offset
  if (args.length == 0) {
    dt = new Date();
  }
  // Date string or timestamp -- assumes floating
  else if (args.length == 1) {
    dt = new Date(args[0]);
  }
  // year, month, [date,] [hours,] [minutes,] [seconds,] [milliseconds,] [tzId,] [utc]
  else {
    t = args[args.length-1];
    // Last arg is utc
    if (typeof t == 'boolean') {
      utc = args.pop();
      tz = args.pop();
    }
    // Last arg is tzId
    else if (typeof t == 'string') {
      tz = args.pop();
      if (tz == 'Etc/UTC' || tz == 'Etc/GMT') {
        utc = true;
      }
    }

    // Date string (e.g., '12/27/2006')
    t = args[args.length-1];
    if (typeof t == 'string') {
      dt = new Date(args[0]);
    }
    // Date part numbers
    else {
      var a = [];
      for (var i = 0; i < 8; i++) {
        a[i] = args[i] || 0;
      }
      dt = new Date(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
    }
  }
  this.year = 0;
  this.month = 0;
  this.date = 0;
  this.hours= 0;
  this.minutes = 0;
  this.seconds = 0;
  this.milliseconds = 0;
  this.timezone = tz || null;
  this.utc = utc || false;
  this.setFromDateObjProxy(dt);
}

fleegix.date.Date.prototype = {
  getDate: function () { return this.date; },
  getDay: function () {},
  getFullYear: function () { return this.year; },
  getMonth: function () { return this.month; },
  getYear: function () { return this.year; },
  getHours: function () {
    return this.hours;
  },
  getMilliseconds: function () {
    return this.milliseconds;
  },
  getMinutes: function () {
    return this.minutes;
  },
  getSeconds: function () {
    return this.seconds;
  },
  getTime: function () {
    var dt = Date.UTC(this.year, this.month, this.date,
      this.hours, this.minutes, this.seconds, this.milliseconds);
    return dt + (this.getTimezoneOffset()*60*1000);
  },
  getTimezone: function () {
    return this.timezone;
  },
  getTimezoneOffset: function () {
    if (this.utc) {
      off = 0;
    }
    else {
      if (this.timezone) {
        var dt = new Date(Date.UTC(this.year, this.month, this.date,
          this.hours, this.minutes, this.seconds, this.milliseconds));
        var tz = this.timezone;
        off = fleegix.date.timezone.getOffset(dt, tz);
      }
      // Floating -- use local offset
      else {
        off = this.getLocalOffset();
      }
    }
    return off;
  },
  getUTCDate: function () {
    return this.getUTCDateProxy().getUTCDate();
  },
  getUTCDay: function () {
    return this.getUTCDateProxy().getUTCDay();
  },
  getUTCFullYear: function () {
    return this.getUTCDateProxy().getUTCFullYear();
  },
  getUTCHours: function () {
    return this.getUTCDateProxy().getUTCHours();
  },
  getUTCMilliseconds: function () {
    return this.getUTCDateProxy().getUTCMilliseconds();
  },
  getUTCMinutes: function () {
    return this.getUTCDateProxy().getUTCMinutes();
  },
  getUTCMonth: function () {
    return this.getUTCDateProxy().getUTCMonth();
  },
  getUTCSeconds: function () {
    return this.getUTCDateProxy().getUTCSeconds();
  },
  setDate: function (n) {
    this.setAttribute('date', n);
  },
  setFullYear: function (n) {
    this.setAttribute('year', n);
  },
  setMonth: function (n) {
    this.setAttribute('month', n);
  },
  setYear: function (n) {
    this.setUTCAttribute('year', n);
  },
  setHours: function (n) {
    this.setAttribute('hours', n);
  },
  setMilliseconds: function (n) {
    this.setAttribute('milliseconds', n);
  },
  setMinutes: function (n) {
    this.setAttribute('minutes', n);
  },
  setSeconds: function (n) {
    this.setAttribute('seconds', n);
  },
  setTime: function (n) {
    if (isNaN(n)) { throw('Units must be a number.'); }
    var dt = new Date(0);
    dt.setUTCMilliseconds(n - (this.getTimezoneOffset()*60*1000));
    this.setFromDateObjProxy(dt, true);
  },
  setUTCDate: function (n) {
    this.setUTCAttribute('date', n);
  },
  setUTCFullYear: function (n) {
    this.setUTCAttribute('year', n);
  },
  setUTCHours: function (n) {
    this.setUTCAttribute('hours', n);
  },
  setUTCMilliseconds: function (n) {
    this.setUTCAttribute('milliseconds', n);
  },
  setUTCMinutes: function (n) {
    this.setUTCAttribute('minutes', n);
  },
  setUTCMonth: function (n) {
    this.setUTCAttribute('month', n);
  },
  setUTCSeconds: function (n) {
    this.setUTCAttribute('seconds', n);
  },
  toGMTString: function () {},
  toLocaleString: function () {},
  toLocaleDateString: function () {},
  toLocaleTimeString: function () {},
  toSource: function () {},
  toString: function () {
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
    str += ':' + sec;
    return str;
  },
  toUTCString: function () {},
  valueOf: function () {
    return this.getTime();
  },
  clone: function () {
    return new fleegix.date.Date(this.year, this.month, this.date,
      this.hours, this.minutes, this.seconds, this.milliseconds,
      this.timezone);
  },
  setFromDateObjProxy: function (dt, fromUTC) {
    this.year = fromUTC ? dt.getUTCFullYear() : dt.getFullYear();
    this.month = fromUTC ? dt.getUTCMonth() : dt.getMonth();
    this.date = fromUTC ? dt.getUTCDate() : dt.getDate();
    this.hours = fromUTC ? dt.getUTCHours() : dt.getHours();
    this.minutes = fromUTC ? dt.getUTCMinutes() : dt.getMinutes();
    this.seconds = fromUTC ? dt.getUTCSeconds() : dt.getSeconds();
    this.milliseconds = fromUTC ? dt.getUTCMilliseconds() : dt.getMilliseconds();
  },
  getUTCDateProxy: function () {
    var dt = new Date(Date.UTC(this.year, this.month, this.date,
      this.hours, this.minutes, this.seconds, this.milliseconds));
    dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
    return dt;
  },
  setAttribute: function (unit, n) {
    if (isNaN(n)) { throw('Units must be a number.'); }
    var dt = new Date(this.year, this.month, this.date,
      this.hours, this.minutes, this.seconds, this.milliseconds);
    var meth = unit == 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() +
      unit.substr(1);
    dt['set' + meth](n);
    this.setFromDateObjProxy(dt);
  },
  setUTCAttribute: function (unit, n) {
    if (isNaN(n)) { throw('Units must be a number.'); }
    var meth = unit == 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() +
      unit.substr(1);
    var dt = this.getUTCDateProxy();
    dt['setUTC' + meth](n);
    dt.setUTCMinutes(dt.getUTCMinutes() - this.getTimezoneOffset());
    this.setFromDateObjProxy(dt, true);
  },
  setTimezone: function (tz) {
    if (tz == 'Etc/UTC' || tz == 'Etc/GMT') {
      this.utc = true;
    }
    this.timezone = tz;
  },
  civilToJulianDayNumber: function (y, m, d) {
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
  },
  getLocalOffset: function () {
    var dt = this;
    var d = new Date(dt.getYear(), dt.getMonth(), dt.getDate(),
      dt.getHours(), dt.getMinutes(), dt.getSeconds());
    return d.getTimezoneOffset();
  }
}


fleegix.date.timezone = new function() {
  var _this = this;
  var monthMap = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 }
  var dayMap = {'sun': 0,'mon' :1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6 }
  var regionMap = {'EST':'northamerica','MST':'northamerica','HST':'northamerica','EST5EDT':'northamerica','CST6CDT':'northamerica','MST7MDT':'northamerica','PST8PDT':'northamerica','America':'northamerica','Pacific':'australasia','Atlantic':'europe','Africa':'africa','Indian':'africa','Antarctica':'antarctica','Asia':'asia','Australia':'australasia','Europe':'europe','WET':'europe','CET':'europe','MET':'europe','EET':'europe'}
  var regionExceptions = {'Pacific/Honolulu':'northamerica','Atlantic/Bermuda':'northamerica','Atlantic/Cape_Verde':'africa','Atlantic/St_Helena':'africa','Indian/Kerguelen':'antarctica','Indian/Chagos':'asia','Indian/Maldives':'asia','Indian/Christmas':'australasia','Indian/Cocos':'australasia','America/Danmarkshavn':'europe','America/Scoresbysund':'europe','America/Godthab':'europe','America/Thule':'europe','Asia/Yekaterinburg':'europe','Asia/Omsk':'europe','Asia/Novosibirsk':'europe','Asia/Krasnoyarsk':'europe','Asia/Irkutsk':'europe','Asia/Yakutsk':'europe','Asia/Vladivostok':'europe','Asia/Sakhalin':'europe','Asia/Magadan':'europe','Asia/Kamchatka':'europe','Asia/Anadyr':'europe','Africa/Ceuta':'europe','America/Argentina/Buenos_Aires':'southamerica','America/Argentina/Cordoba':'southamerica','America/Argentina/Tucuman':'southamerica','America/Argentina/La_Rioja':'southamerica','America/Argentina/San_Juan':'southamerica','America/Argentina/Jujuy':'southamerica','America/Argentina/Catamarca':'southamerica','America/Argentina/Mendoza':'southamerica','America/Argentina/Rio_Gallegos':'southamerica','America/Argentina/Ushuaia':'southamerica','America/Aruba':'southamerica','America/La_Paz':'southamerica','America/Noronha':'southamerica','America/Belem':'southamerica','America/Fortaleza':'southamerica','America/Recife':'southamerica','America/Araguaina':'southamerica','America/Maceio':'southamerica','America/Bahia':'southamerica','America/Sao_Paulo':'southamerica','America/Campo_Grande':'southamerica','America/Cuiaba':'southamerica','America/Porto_Velho':'southamerica','America/Boa_Vista':'southamerica','America/Manaus':'southamerica','America/Eirunepe':'southamerica','America/Rio_Branco':'southamerica','America/Santiago':'southamerica','Pacific/Easter':'southamerica','America/Bogota':'southamerica','America/Curacao':'southamerica','America/Guayaquil':'southamerica','Pacific/Galapagos':'southamerica','Atlantic/Stanley':'southamerica','America/Cayenne':'southamerica','America/Guyana':'southamerica','America/Asuncion':'southamerica','America/Lima':'southamerica','Atlantic/South_Georgia':'southamerica','America/Paramaribo':'southamerica','America/Port_of_Spain':'southamerica','America/Montevideo':'southamerica','America/Caracas':'southamerica'};

  function builtInLoadZoneFile(fileName, sync) {
    if (typeof fleegix.xhr == 'undefined') {
      throw('Please use the Fleegix.js XHR module, or define your own transport mechanism for downloading zone files.');
    }
    var url = _this.zoneFileBasePath + '/' + fileName;
    if (sync) {
      return fleegix.xhr.doReq({ 
        url: url,
        async: false
      });
    }
    else {
      return fleegix.xhr.doGet(_this.parseZones, url);
    }
  }
  function getRegionForTimezone(tz) {
    var exc = regionExceptions[tz];
    if (exc) {
      return exc;
    }
    else {
      reg = tz.split('/')[0];
      return regionMap[reg];
    }
  }
  function parseTimeString(str) {
    var pat = /(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
    var hms = str.match(pat);
    hms[1] = parseInt(hms[1]);
    hms[2] = hms[2] ? parseInt(hms[2]) : 0;
    hms[3] = hms[3] ? parseInt(hms[3]) : 0;
    return hms;
  }
  function getZone(dt, tz) {
    var t = tz;
    var zoneList = _this.zones[t];
    // Follow links to get to an acutal zone
    while (typeof(zones) == "string") {
      t = zoneList;
      zoneList = _this.zones[t];
    }
    if (!zoneList) {
      alert('"' + t + '" is either incorrect, or not loaded in the timezone registry.');
    }
    for(var i = 0; i < zoneList.length; i++) {
      var z = zoneList[i];
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
    if (i == zoneList.length) { throw('No Zone found for "' + timezone + '" on ' + dt); }
    return zoneList[i];

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
    var rules = _this.rules[str];
    var ruleHits = [];

    var checkForHits = function (diff, r, d, dt) {
      d.setUTCDate(d.getUTCDate() + diff);
      if (dt >= d) {
        ruleHits.push({ 'rule': r, 'date': d });
      }
      // Check against previous year if rule covers that period
      else if (r[0] < year) {
        d.setUTCFullYear(d.getUTCFullYear()-1);
        if (dt >= d) {
          ruleHits.push({ 'rule': r, 'date': d });
        }
      }
    };

    if (!rules) { return null; }
    for (var i = 0; i < rules.length; i++) {
      r = rules[i];
      // Only look at applicable rules -- throw out:
      // 1. Rules with a 'to' year earlier than the year previous
      // 2. Rules which are confined to the 'from' year, and are
      //  are earlier than the year previous
      // 3. Rules where the 'from' starts after
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
          // Set it to the final day of the correct weekday that month
          var diff = (day > dtDay) ? (day - dtDay - 7) : (day - dtDay);
          checkForHits(diff, r, d, dt);
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
              // Set to the first correct weekday after the stated date
              var diff = (day < dtDay) ? (day - dtDay + 7) : (day - dtDay);
              checkForHits(diff, r, d, dt);
            }
            else if (day.substr(3, 2) == '<=') {
              var t = parseTimeString(r[5]);
              // The stated date of the month
              var d = new Date(Date.UTC(dt.getUTCFullYear(), mon,
                parseInt(r[4].substr(5)), t[1], t[2], t[3]));
              var dtDay = d.getUTCDay();
              // Set to first correct weekday before the stated date
              var diff = (day > dtDay) ? (day - dtDay - 7) : (day - dtDay);
              checkForHits(diff, r, d, dt);
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
    if (ruleHits.length) {
      f = function(a, b) { return (a.date.getTime() >= b.date.getTime()) ?  1 : -1; }
      ruleHits.sort(f);
      currRule = ruleHits.pop().rule;
    }
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

  this.zoneFileBasePath;
  this.loadingSchemes = {
    PRELOAD_ALL: 'preloadAll',
    LAZY_LOAD: 'lazyLoad',
    MANUAL_LOAD: 'manualLoad'
  }
  this.loadingScheme = this.loadingSchemes.LAZY_LOAD;
  this.defaultZoneFile =
    this.loadingScheme == this.loadingSchemes.PRELOAD_ALL ?
    ['africa', 'antarctica', 'asia', 'australasia', 'backward',
    'etcetera', 'europe', 'northamerica', 'pacificnew',
    'southamerica']: 'northamerica';
  this.loadedZones = {};
  this.zones = {};
  this.rules = {};

  this.init = function () {
    var def = this.defaultZoneFile;
    if (typeof def == 'string') {
      this.loadZoneFile(this.defaultZoneFile);
    }
    else {
      for (var i = 0; i < def.length; i++) {
        this.loadZoneFile(def[i]);
      }
    }
  };
  // Get the zone files via XHR -- if the sync flag
  // is set to true, it's being called by the lazy-loading
  // mechanism, so the result needs to be returned inline
  this.loadZoneFile = function (fileName, sync) {
    if (typeof this.zoneFileBasePath == 'undefined') {
      throw('Please define a base path to your zone file directory -- fleegix.date.timezone.zoneFileBasePath.');
    }
    // ========================
    // Define your own transport mechanism here
    // and comment out the default below
    // ========================
    this.loadedZones[fileName] = true;
    return builtInLoadZoneFile(fileName, sync);
  }
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
            if (!_this.zones[zone]) { _this.zones[zone] = [] }
            _this.zones[zone].push(arr);
            break;
          case 'Rule':
            rule = arr.shift();
            if (!_this.rules[rule]) { _this.rules[rule] = [] }
            _this.rules[rule].push(arr);
            break;
          case 'Link':
            // Shouldn't exist
            if (_this.zones[arr[1]]) { throw('Error with Link ' + arr[1]); }
            _this.zones[arr[1]] = arr[0];
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
    // Lazy-load any zones not yet loaded
    if (this.loadingScheme == this.loadingSchemes.LAZY_LOAD) {
      // Get the correct region for the zone
      var zoneFile = getRegionForTimezone(tz);
      if (!this.loadedZones[zoneFile]) {
        // Get the file and parse it -- use synchronous XHR
        var res = this.loadZoneFile(zoneFile, true);
        this.parseZones(res);
      }
    }
    var zone = getZone(dt, tz);
    var off = getBasicOffset(zone);
    // See if the offset needs adjustment
    var rule = getRule(dt, zone[1]);
    if (rule) {
      off = getAdjustedOffset(off, rule);
    }
    return off;
  }
}



