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

