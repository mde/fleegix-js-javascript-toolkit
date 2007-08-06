/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003,2006 Joerg Schaible

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation in version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

Test suites built with JsUnit are derivative works derived from tested
classes and functions in their production; they are not affected by this
license.
*/

var hasExceptions = "false";
var exceptionsWorking = "false";
var i;

function throwEx()
{
    throw new Object();
}
function testEx()
{
    var me = this;
    try { hasExceptions = "true"; new throwEx(); }
    catch( ex ) { exceptionsWorking = this == me; }
}
new testEx();

if( !this.JsUtil )
{
    if( this.WScript )
    {
        var fso = new ActiveXObject( "Scripting.FileSystemObject" );
        var file = fso.OpenTextFile( "../lib/jsunit/lib/JsUtil.js", 1 );
        var all = file.ReadAll();
        file.Close();
        eval( all );
    }
    else
        load( "../lib/jsunit/lib/JsUtil.js" );
}
if( !JsUtil.prototype.isBrowser )
{
    var writer = JsUtil.prototype.getSystemWriter();
    /*
    // o = this.Environment;
    o = this;
    writer.println( "Object: " + o );
    for( i in o )
        writer.println( " i is " + i );
    JsUtil.ptototype.quit(0);
    */
    writer.println( "\nJavaScript compatibility:" );
    writer.println( "\thas exceptions: " + hasExceptions );
    writer.println( "\texceptions working: " + exceptionsWorking );

    writer.println( "\nJavaScript engine detection:" );
    for( i in JsUtil.prototype )
        if( typeof JsUtil.prototype[i] != "function" && i.match( /^(is|has)/ ))
            writer.println( "\t" + i + ": " + JsUtil.prototype[i] );

    writer.println( "\nJsUnit Test Suite:\n" );
}
if( exceptionsWorking )
{
    eval( JsUtil.prototype.include( "../lib/jsunit/lib/JsUnit.js" ));
    eval( JsUtil.prototype.include( "../plugins/hash/hash.js" ));
    eval( JsUtil.prototype.include( "HashTest.js" ));

    function AllTests()
    {
        TestSuite.call( this, "AllTests" );
    }
    function AllTests_suite()
    {
        var suite = new AllTests();
        suite.addTest( JsUtilTestSuite.prototype.suite());
        return suite;
    }
    AllTests.prototype = new TestSuite();
    AllTests.prototype.suite = AllTests_suite;
}
if( JsUtil.prototype.isShell )
{
    if( !exceptionsWorking )
    {
        writer.println( "\tSorry, exceptions not working!\n" );
        JsUtil.prototype.quit( -1 );
    }
    var args;
    if( this.WScript )
    {
        args = new Array();
        for( i = 0; i < WScript.Arguments.Count(); ++i )
            args[i] = WScript.Arguments( i );
    }
    else if( this.arguments )
        args = arguments;
    else
        args = new Array();

    var result = TextTestRunner.prototype.main( args );
    JsUtil.prototype.quit( result );
}

