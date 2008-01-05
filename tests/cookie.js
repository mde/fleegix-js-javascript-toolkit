
var test_fleegixCookie = new function () {
  this.test_setGet = function () {
    fleegix.cookie.set('fooCookie', 'foo');
    var val = fleegix.cookie.get('fooCookie');
    jum.assertEquals(val, 'foo');
  };

  this.test_setDestroy = function () {
    fleegix.cookie.set('fooCookie', 'foo');
    var val = fleegix.cookie.destroy('fooCookie');
    jum.assertEquals(val, undefined);
  };
};

