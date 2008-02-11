
var test_fleegixDateUtils = new function () {
    this.test_diffWeekday = function () {
      var interv = fleegix.date.util.dateParts.WEEKDAY;
      var diff = function () {
        return fleegix.date.util.diff(dtA, dtB, interv);
      }
      var add = fleegix.date.util.add;
      var dtA = null;
      var dtB = null;
      dtA = new Date(2000, 0, 1);
      dtB = add(dtA, interv, 1);
      jum.assertEquals(1, diff());
      dtA = new Date(2000, 0, 2);
      dtB = add(dtA, interv, 1);
      jum.assertEquals(1, diff());
      dtA = new Date(2000, 0, 2);
      dtB = add(dtA, interv, 5);
      jum.assertEquals(5, diff());
      dtA = new Date(2000, 0, 2);
      dtB = add(dtA, interv, 6);
      jum.assertEquals(6, diff());
      dtA = new Date(2000, 0, 3);
      dtB = add(dtA, interv, 10);
      jum.assertEquals(10, diff());
      dtA = new Date(2000, 0, 8);
      dtB = add(dtA, interv, -5);
      jum.assertEquals(-5, diff());
      dtA = new Date(2000, 0, 9);
      dtB = add(dtA, interv, -3);
      jum.assertEquals(-3, diff());
      dtA = new Date(2000, 0, 23);
      dtB = add(dtA, interv, -11);
      jum.assertEquals(-11, diff());
  };
};
