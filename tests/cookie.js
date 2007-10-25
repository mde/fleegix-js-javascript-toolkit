
fleegixTest.test_cookieSetGet = function () {
  fleegix.cookie.set('fooCookie', 'foo');
  var val = fleegix.cookie.get('fooCookie');
  jum.assertEquals(val, 'foo');
};

fleegixTest.test_cookieSetDestroy = function () {
  fleegix.cookie.set('fooCookie', 'foo');
  var val = fleegix.cookie.destroy('fooCookie');
  jum.assertEquals(val, undefined);
};


