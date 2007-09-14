
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
    sb.append(line);
    sb.append(java.lang.System.getProperty("line.separator"));
  }
  // Cast to real JS String
  str += sb.toString();
  return str;
}
function alert(str) {
  throw(str);
}

function main(args) {
  // Upgrade passed script args to real Array
  if (!args.length) {
    print('Usage: rhino preparse.js zoneFileDirectory exemplarCities > outputfile.json');
    print('Ex. >>> rhino preparse.js olson_files "Asia/Tokyo, America/New_York, Europe/London" > major_cities.json');
    return;
  }
  var baseDir = args[0];
  var cities = args[1].replace(/ /g, '');
  cities = cities.split(',');
  eval(includeFile('date.js'));
  eval(includeFile('../../src/json.js'));
  var _tz = fleegix.date.timezone;
  _tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;
  for (var i = 0; i < _tz.zoneFiles.length; i++) {
    var zoneFile = _tz.zoneFiles[i];
    var zoneData = readText(baseDir + '/' + zoneFile);
    _tz.parseZones(zoneData);
  }
  var serial = fleegix.json.serialize;
  var result = {};
  var zones = {};
  var rules = {};
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
}

main(arguments);


