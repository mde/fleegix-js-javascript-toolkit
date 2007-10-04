
function HashTest(name) {
  TestCase.call(this, name);
}

function HashTest_testNoDefault() {
  // Set up a Hash, no default value for new items
  var h = new fleegix.hash.Hash();
  // Add some items
  h.addItem('testA', 'AAAA');
  h.addItem('testB', 'BBBB');
  h.addItem('testC', 'CCCC');
  // Test count
  this.assertEquals(3, h.count);
  // Test getItem by string key
  var item = h.getItem('testC');
  this.assertEquals('CCCC', item);
  // Test getItem by index number
  var item = h.getItem(1);
  this.assertEquals('BBBB', item);
  // Test setItem by string key
  h.setItem('testA', 'aaaa');
  var item = h.getItem('testA');
  this.assertEquals('aaaa', item);
  // Test setItem by index number
  h.setItem(2, 'cccc');
  var item = h.getItem(2);
  this.assertEquals('cccc', item);
}

function HashTest_testDefaultValue() {
  // Set up a Hash, default value for new items is 'foo'
  var h = new fleegix.hash.Hash('foo');
  // Add an item with no value -- should get
  // default value
  h.addItem('testA');
  // Add some items with empty/falsey values --
  // should be set to desired values
  h.addItem('testB', null);
  h.addItem('testC', false);
  // Test getItem for default value
  var item = h.getItem('testA');
  this.assertEquals('foo', item);
  var item = h.getItem('testB');
  this.assertEquals(null, item);
  var item = h.getItem('testC');
  this.assertEquals(false, item);
}

function HashTest_testCreateKey() {
  // Set up a Hash
  var h = new fleegix.hash.Hash();
  // Add some items using auto-generated key
  var a = h.addItemCreateKey('AAAA');
  var b = h.addItemCreateKey('BBBB');
  var c = h.addItemCreateKey('CCCC');
  // Test count
  this.assertEquals(3, h.count);
  // Test getItem by auto-generated key
  var item = h.getItem(c);
  this.assertEquals('CCCC', item);
}

HashTest.prototype = new TestCase();
HashTest.prototype.testNoDefault = HashTest_testNoDefault;
HashTest.prototype.testCreateKey = HashTest_testCreateKey;
HashTest.prototype.testDefaultValue = HashTest_testDefaultValue;

function JsUtilTestSuite() {
  TestSuite.call(this, "JsUtilTest");
  this.addTestSuite(HashTest);
}

JsUtilTestSuite.prototype = new TestSuite();
JsUtilTestSuite.prototype.suite = function (){ return new JsUtilTestSuite(); }

