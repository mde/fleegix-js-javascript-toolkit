/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
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
if (typeof fleegix.date == 'undefined') { fleegix.date = {}; }

fleegix.date.supportedFormats = {
  // abbreviated weekday name according to the current locale
  'a': function (dt) { return fleegix.date.weekdayShort[dt.getDay()]; },
  // full weekday name according to the current locale
  'A': function (dt) { return fleegix.date.weekdayLong[dt.getDay()]; },
  // abbreviated month name according to the current locale
  'b': function (dt) { return fleegix.date.monthShort[dt.getMonth()]; },
  'h': function (dt) { return fleegix.date.strftime(dt, '%b'); },
  // full month name according to the current locale
  'B': function (dt) { return fleegix.date.monthLong[dt.getMonth()]; },
  // preferred date and time representation for the current locale 
  'c': function (dt) { return fleegix.date.strftime(dt, '%a %b %d %T %Y'); },
  // century number (the year divided by 100 and truncated 
  // to an integer, range 00 to 99)
  'C': function (dt) { return fleegix.date.calcCentury(dt.getFullYear());; },
  // day of the month as a decimal number (range 01 to 31)
  'd': function (dt) { return fleegix.date.leftPad(dt.getDate(), 2, '0'); },
  // same as %m/%d/%y
  'D': function (dt) { return fleegix.date.strftime(dt, '%m/%d/%y') },
  // day of the month as a decimal number, a single digit is
  // preceded by a space (range ' 1' to '31')
  'e': function (dt) { return fleegix.date.leftPad(dt.getDate(), 2, ' '); },
  // month as a decimal number, a single digit is
  // preceded by a space (range ' 1' to '12')
  'f': function () { return fleegix.date.strftimeNotImplemented('f'); },
  // same as %Y-%m-%d
  'F': function (dt) { return fleegix.date.strftime(dt, '%Y-%m-%d');  },
  // like %G, but without the century.
  'g': function () { return fleegix.date.strftimeNotImplemented('g'); },
  // The 4-digit year corresponding to the ISO week number
  // (see %V).  This has the same format and value as %Y,
  // except that if the ISO week number belongs to the
  // previous or next year, that year is used instead.
  'G': function () { return fleegix.date.strftimeNotImplemented('G'); },
  // hour as a decimal number using a 24-hour clock (range
  // 00 to 23)
  'H': function (dt) { return fleegix.date.leftPad(dt.getHours(), 2, '0'); },
  // hour as a decimal number using a 12-hour clock (range
  // 01 to 12)
  'I': function (dt) { return fleegix.date.leftPad(hrMil2Std(dt.getHours()), 2, '0'); },
  // day of the year as a decimal number (range 001 to 366)
  'j': function (dt) { return fleegix.date.leftPad(calcDays(dt), 3, '0'); },
  // Hour as a decimal number using a 24-hour clock (range
  // 0 to 23 (space-padded))
  'k': function (dt) { return fleegix.date.leftPad(dt.getHours(), 2, ' '); },
  // Hour as a decimal number using a 12-hour clock (range
  // 1 to 12 (space-padded))
  'l': function (dt) { return fleegix.date.leftPad(hrMil2Std(dt.getHours()), 2, ' '); },
  // month as a decimal number (range 01 to 12)
  'm': function (dt) { return fleegix.date.leftPad((dt.getMonth()+1), 2, '0'); },
  // minute as a decimal number
  'M': function (dt) { return fleegix.date.leftPad(dt.getMinutes(), 2, '0'); },
  // Linebreak
  'n': function () { return '\n'; },
  // either `am' or `pm' according to the given time value,
  // or the corresponding strings for the current locale
  'p': function (dt) { return fleegix.date.getMeridian(dt.getHours()); },
  // time in a.m. and p.m. notation
  'r': function (dt) { return fleegix.date.strftime(dt, '%I:%M:%S %p'); },
  // time in 24 hour notation
  'R': function (dt) { return fleegix.date.strftime(dt, '%H:%M'); },
  // second as a decimal number
  'S': function (dt) { return fleegix.date.leftPad(dt.getSeconds(), 2, '0'); },
  // Tab char
  't': function () { return '\t'; },
  // current time, equal to %H:%M:%S
  'T': function (dt) { return fleegix.date.strftime(dt, '%H:%M:%S'); },
  // weekday as a decimal number [1,7], with 1 representing
  // Monday
  'u': function (dt) { return fleegix.date.convertOneBase(dt.getDay()); },
  // week number of the current year as a decimal number,
  // starting with the first Sunday as the first day of the
  // first week
  'U': function () { return fleegix.date.strftimeNotImplemented('U'); },
  // week number of the year (Monday as the first day of the
  // week) as a decimal number [01,53]. If the week containing
  // 1 January has four or more days in the new year, then it 
  // is considered week 1. Otherwise, it is the last week of 
  // the previous year, and the next week is week 1.
  'V': function () { return fleegix.date.strftimeNotImplemented('V'); },
  // week number of the current year as a decimal number,
  // starting with the first Monday as the first day of the
  // first week
  'W': function () { return fleegix.date.strftimeNotImplemented('W'); },
  // day of the week as a decimal, Sunday being 0
  'w': function (dt) { return dt.getDay(); },
  // preferred date representation for the current locale
  // without the time
  'x': function (dt) { return fleegix.date.strftime(dt, '%D'); },
  // preferred time representation for the current locale
  // without the date
  'X': function (dt) { return fleegix.date.strftime(dt, '%T'); },
  // year as a decimal number without a century (range 00 to
  // 99)
  'y': function (dt) { return fleegix.date.getTwoDigitYear(dt.getFullYear()); },
  // year as a decimal number including the century
  'Y': function (dt) { return fleegix.date.leftPad(dt.getFullYear(), 4, '0'); },
  // time zone or name or abbreviation
  'z': function () { return fleegix.date.strftimeNotImplemented('z'); },
  'Z': function () { return fleegix.date.strftimeNotImplemented('Z'); },
  // Literal percent char
  '%': function (dt) { return '%'; }
};

fleegix.date.getSupportedFormats = function () {
  var str = '';
  for (var i in fleegix.date.supportedFormats) { str += i; }
  return str;
}
fleegix.date.supportedFormatsPat = new RegExp('%[' + 
  fleegix.date.getSupportedFormats() + ']{1}', 'g');

fleegix.date.weekdayLong = ['Sunday', 'Monday', 'Tuesday',
  'Wednesday', 'Thursday', 'Friday', 'Saturday'];
fleegix.date.weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed',
  'Thu', 'Fri', 'Sat'];
fleegix.date.monthLong = ['January', 'February', 'March',
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'];
fleegix.date.monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 
  'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
fleegix.date.meridian = {
  'AM': 'AM',
  'PM': 'PM'
}

fleegix.date.strftime = function (dt, format) {
  var d = null;
  var pats = [];
  var dts = [];
  var str = format;
  
  // If no dt, use current date
  d = dt ? dt : new Date();
  // Allow either Date obj or UTC stamp
  d = typeof dt == 'number' ? new Date(dt) : dt;
   
  // Grab all instances of expected formats into array
  while (pats = fleegix.date.supportedFormatsPat.exec(format)) {
    dts.push(pats[0]);
  }
  
  // Process any hits
  for (var i = 0; i < dts.length; i++) {
    key = dts[i].replace(/%/, '');
    str = str.replace('%' + key, 
      fleegix.date.supportedFormats[key](d));
  }
  return str;

};

fleegix.date.strftimeNotImplemented = function (s) {
  throw('fleegix.date.strftime format "' + s + '" not implemented.');
};

fleegix.date.calcCentury = function (y) {
  var ret = parseInt(y/100);
  ret = ret.toString();
  return fleegix.date.leftPad(ret);
};

fleegix.date.leftPad = function (instr, len, spacer) {
  var str = instr.toString();
  // spacer char optional, default to space
  var sp = spacer ? spacer : ' ';
  while (str.length < len) {
    str = sp + str;
  }
  return str;
};

fleegix.date.convertOneBase = function (d) {
  return d == 0 ? 7 : d;
};

fleegix.date.getTwoDigitYear = function () {
  // Add a millenium to take care of years before the year 1000, 
  // (e.g, the year 7) since we're only taking the last two digits
  var millenYear = yr + 1000;
  var str = millenYear.toString();
  str = str.substr(2); // Get the last two digits
  return str
};

fleegix.date.getMeridian = function (h) {
  return h > 11 ? fleegix.date.meridian.PM :
    fleegix.date.meridian.AM;
}



