
var test_fleegixDateDate = new function () {
    this.test_americaChicagoDST = function () {
      var dt;
      // 2004
      dt = new fleegix.date.Date('04/04/2004', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('04/05/2004', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('10/31/2004', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/01/2004', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2005
      dt = new fleegix.date.Date('04/03/2005', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('04/04/2005', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('10/30/2005', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('10/31/2005', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2006
      dt = new fleegix.date.Date('04/02/2006', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('04/03/2006', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('10/29/2006', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('10/30/2006', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2007 -- new DST rules start here
      dt = new fleegix.date.Date('03/11/2007', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('03/12/2007', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/04/2007', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/05/2007', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2008
      dt = new fleegix.date.Date('03/09/2008', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('03/10/2008', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/02/2008', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/03/2008', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2009
      dt = new fleegix.date.Date('03/08/2009', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('03/09/2009', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/01/2009', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/02/2009', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2010
      dt = new fleegix.date.Date('03/14/2010', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('03/15/2010', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/07/2010', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/08/2010', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      // 2011
      dt = new fleegix.date.Date('03/13/2011', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
      dt = new fleegix.date.Date('03/14/2011', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/06/2011', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 300);
      dt = new fleegix.date.Date('11/07/2011', 'America/Chicago');
      jum.assertEquals(dt.getTimezoneOffset(), 360);
  };
};

