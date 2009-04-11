windmill.jsTest.require('cookie.js');
windmill.jsTest.require('css.js');
windmill.jsTest.require('date_date.js');
windmill.jsTest.require('date_util.js');
windmill.jsTest.require('event.js');
windmill.jsTest.require('xhr.js');
windmill.jsTest.require('url.js');
windmill.jsTest.require('string.js');
windmill.jsTest.require('string_auto_hyperlink.js');

var test_main = new function () {
  this.test_fleegixCookie = fleegixMain.test_fleegixCookie;
  this.test_fleegixCss = fleegixMain.test_fleegixCss;
  this.test_fleegixDateDate = fleegixMain.test_fleegixDateDate;
  this.test_fleegixDateUtil = fleegixMain.test_fleegixDateUtil;
  this.test_fleegixEvent = fleegixMain.test_fleegixEvent;
  this.test_fleegixUrl = fleegixMain.test_fleegixUrl;
  this.test_fleegixString = fleegixMain.test_fleegixString;
  this.test_fleegixStringAutoHyperlink = fleegixMain.test_fleegixStringAutoHyperlink;
};
