
function isKJS() {
  return this.exit != null;
}

function isWSN() {
  return this.WScript != null;
}
function isMozillaShell() {
  return this.quit != null;
}

function includeFile(fname) {
    var ret = "true";
    if (isMozillaShell() || isKJS()) {
        load(fname);
    }
    else if(isWSN()) {
        var fso = new ActiveXObject( "Scripting.FileSystemObject" );
        var file = fso.OpenTextFile(fname, 1);
        ret = file.ReadAll();
        file.Close();
    }
    return ret;
}

function readText(uri){
  var jf = new java.io.File(uri);
  var sb = new java.lang.StringBuffer();
  var input = new java.io.BufferedReader(new java.io.FileReader(jf));
  var line = "";
  var str = "";
  while((line = input.readLine()) != null){
  str += line + '\n';
  //sb.append(line);
  //sb.append(java.lang.System.getProperty("line.separator"));
  }
  //return sb.toString();
  return str;
}
function alert(str) {
  print(str);
}

eval(includeFile('date.js'));
eval(includeFile('../../src/json.js'));
var _tz = fleegix.date.timezone;
_tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;
var north = readText('tz/northamerica');
_tz.parseZones(north);
var asia = readText('tz/asia');
_tz.parseZones(asia);

//for (var prop in _tz.zones) {
//  print(_tz.zones[prop] + "\n");
//}
var serial = fleegix.json.serialize;
var result = {};
var zones = {};
var rules = {};
var cities = 'Asia/Tokyo,America/New_York,America/Chicago';
cities = cities.split(',');
for (var i = 0; i < cities.length; i++) {
  var city = cities[i];
  zones[city] = _tz.zones[city];
}
for (var n in zones) {
  var zList = zones[n];
  for (var i = 0; i < zList.length; i++) {
    var ruleKey = zList[i][1];
    rules[ruleKey] = _tz.rules[ruleKey];
  }
}
result.zones = zones;
result.rules = rules;
print(serial(result));


