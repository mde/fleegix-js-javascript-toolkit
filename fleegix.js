if(typeof fleegix=="undefined"){
var fleegix={};
}
if(typeof fleegix.date=="undefined"){
fleegix.date={};
}
fleegix.date.timezone=new function(){
this.zoneAreas={AFRICA:"africa",ANTARCTICA:"antarctica",ASIA:"asia",AUSTRALASIA:"australasia",BACKWARD:"backward",ETCETERA:"etcetera",EUROPE:"europe",NORTHAMERICA:"northamerica",PACIFICNEW:"pacificnew",SOUTHAMERICA:"southamerica",SYSTEMV:"systemv"};
var _1=this;
var _2={"jan":0,"feb":1,"mar":2,"apr":3,"may":4,"jun":5,"jul":6,"aug":7,"sep":8,"oct":9,"nov":10,"dec":11};
var _3={"sun":0,"mon":1,"tue":2,"wed":3,"thu":4,"fri":5,"sat":6};
var _4={"Africa":this.zoneAreas.AFRICA,"Indian":this.zoneAreas.AFRICA,"Antarctica":this.zoneAreas.ANTARCTICA,"Asia":this.zoneAreas.ASIA,"Pacific":this.zoneAreas.AUSTRALASIA,"Australia":this.zoneAreas.AUSTRALASIA,"Etc":this.zoneAreas.ETCETERA,"EST":this.zoneAreas.NORTHAMERICA,"MST":this.zoneAreas.NORTHAMERICA,"HST":this.zoneAreas.NORTHAMERICA,"EST5EDT":this.zoneAreas.NORTHAMERICA,"CST6CDT":this.zoneAreas.NORTHAMERICA,"MST7MDT":this.zoneAreas.NORTHAMERICA,"PST8PDT":this.zoneAreas.NORTHAMERICA,"America":function(){
var _5=[];
if(!this.loadedZoneAreas[this.zoneAreas.NORTHAMERICA]){
_5.push(this.zoneAreas.NORTHAMERICA);
}
if(!this.loadedZoneAreas[this.zoneAreas.SOUTHAMERICA]){
_5.push(this.zoneAreas.SOUTHAMERICA);
u;
}
return _5;
},"WET":this.zoneAreas.EUROPE,"CET":this.zoneAreas.EUROPE,"MET":this.zoneAreas.EUROPE,"EET":this.zoneAreas.EUROPE,"Europe":this.zoneAreas.EUROPE,"SystemV":this.zoneAreas.SYSTEMV};
var _6={"Pacific/Honolulu":this.zoneAreas.NORTHAMERICA,"Pacific/Easter":this.zoneAreas.SOUTHAMERICA,"Pacific/Galapagos":this.zoneAreas.SOUTHAMERICA,"America/Danmarkshavn":this.zoneAreas.EUROPE,"America/Scoresbysund":this.zoneAreas.EUROPE,"America/Godthab":this.zoneAreas.EUROPE,"America/Thule":this.zoneAreas.EUROPE,"Indian/Kerguelen":this.zoneAreas.ANTARCTICA,"Indian/Chagos":this.zoneAreas.ASIA,"Indian/Maldives":this.zoneAreas.ASIA,"Indian/Christmas":this.zoneAreas.AUSTRALASIA,"Indian/Cocos":this.zoneAreas.AUSTRALASIA,"Europe/Nicosia":this.zoneAreas.ASIA,"Pacific/Easter":this.zoneAreas.SOUTHAMERICA,"Africa/Ceuta":this.zoneAreas.EUROPE,"Asia/Yekaterinburg":this.zoneAreas.EUROPE,"Asia/Omsk":this.zoneAreas.EUROPE,"Asia/Novosibirsk":this.zoneAreas.EUROPE,"Asia/Krasnoyarsk":this.zoneAreas.EUROPE,"Asia/Irkutsk":this.zoneAreas.EUROPE,"Asia/Yakutsk":this.zoneAreas.EUROPE,"Asia/Vladivostok":this.zoneAreas.EUROPE,"Asia/Sakhalin":this.zoneAreas.EUROPE,"Asia/Magadan":this.zoneAreas.EUROPE,"Asia/Kamchatka":this.zoneAreas.EUROPE,"Asia/Anadyr":this.zoneAreas.EUROPE,"Asia/Istanbul":this.zoneAreas.EUROPE};
var _7={};
function parseTimeString(_8){
var _9=/(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
var _a=_8.match(_9);
_a[1]=parseInt(_a[1]);
_a[2]=_a[2]?parseInt(_a[2]):0;
_a[3]=_a[3]?parseInt(_a[3]):0;
return _a;
}
function getZone(dt,tz){
var _d=tz;
var _e=_1.zones[_d];
while(typeof (_e)=="string"){
_d=_e;
_e=_1.zones[_d];
if(!_e){
alert("Cannot figure out the timezone "+_d);
}
}
for(var i=0;i<_e.length;i++){
var z=_e[i];
if(!z[3]){
break;
}
var yea=parseInt(z[3]);
var mon=11;
var dat=31;
if(z[4]){
mon=_2[z[4].substr(0,3).toLowerCase()];
dat=parseInt(z[5]);
}
var t=z[6]?z[6]:"23:59:59";
t=parseTimeString(t);
var d=Date.UTC(yea,mon,dat,t[1],t[2],t[3]);
if(dt.getTime()<d){
break;
}
}
if(i==_e.length){
alert("No DST for "+_d);
}else{
return _e[i];
}
}
function getBasicOffset(z){
var off=parseTimeString(z[0]);
var adj=z[0].indexOf("-")==0?-1:1;
off=adj*(((off[1]*60+off[2])*60+off[3])*1000);
return -off/60/1000;
}
function getRule(dt,str){
var _1b=null;
var _1c=dt.getUTCFullYear();
var _1d=_1.rules[str];
var _1e=[];
if(!_1d){
return null;
}
for(var i=0;i<_1d.length;i++){
r=_1d[i];
if((r[1]<(_1c-1))||(r[0]<(_1c-1)&&r[1]=="only")||(r[0]>_1c)){
continue;
}
var mon=_2[r[3].substr(0,3).toLowerCase()];
var day=r[4];
if(isNaN(day)){
if(day.substr(0,4)=="last"){
var day=_3[day.substr(4,3).toLowerCase()];
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon+1,1,t[1]-24,t[2],t[3]));
var _24=d.getUTCDay();
var _25=(day>_24)?(day-_24-7):(day-_24);
d.setUTCDate(d.getUTCDate()+_25);
if(dt<d){
if(r[0]<_1c){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_1e.push({"rule":r,"date":d});
}
}
}else{
_1e.push({"rule":r,"date":d});
}
}else{
day=_3[day.substr(0,3).toLowerCase()];
if(day!="undefined"){
if(r[4].substr(3,2)==">="){
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,parseInt(r[4].substr(5)),t[1],t[2],t[3]));
var _24=d.getUTCDay();
var _25=(day<_24)?(day-_24+7):(day-_24);
d.setUTCDate(d.getUTCDate()+_25);
if(dt<d){
if(r[0]<_1c){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_1e.push({"rule":r,"date":d});
}
}
}else{
_1e.push({"rule":r,"date":d});
}
}else{
if(day.substr(3,2)=="<="){
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,parseInt(r[4].substr(5)),t[1],t[2],t[3]));
var _24=d.getUTCDay();
var _25=(day>_24)?(day-_24-7):(day-_24);
d.setUTCDate(d.getUTCDate()+_25);
if(dt<d){
if(r[0]<_1c){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_1e.push({"rule":r,"date":d});
}
}
}else{
_1e.push({"rule":r,"date":d});
}
}
}
}
}
}else{
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,day,t[1],t[2],t[3]));
d.setUTCHours(d.getUTCHours()-24*((7-day+d.getUTCDay())%7));
if(dt<d){
continue;
}else{
_1e.push({"rule":r,"date":d});
}
}
}
f=function(a,b){
return (a.date.getTime()>=b.date.getTime())?1:-1;
};
_1e.sort(f);
_1b=_1e.pop().rule;
return _1b;
}
function getAdjustedOffset(off,_29){
var _2a=_29[6];
var t=parseTimeString(_2a);
var adj=_2a.indexOf("-")==0?-1:1;
var ret=(adj*(((t[1]*60+t[2])*60+t[3])*1000));
ret=ret/60/1000;
ret-=off;
ret=-Math.ceil(ret);
return ret;
}
this.defaultZoneArea=this.zoneAreas.NORTHAMERICA;
this.zones={};
this.rules={};
this.parseZones=function(str){
var s="";
var _30=str.split("\n");
var arr=[];
var _32="";
var _33=null;
var _34=null;
for(var i=0;i<_30.length;i++){
l=_30[i];
if(l.match(/^\s/)){
l="Zone "+_33+l;
}
l=l.split("#")[0];
if(l.length>3){
arr=l.split(/\s+/);
_32=arr.shift();
switch(_32){
case "Zone":
_33=arr.shift();
if(!_1.zones[_33]){
_1.zones[_33]=[];
}
_1.zones[_33].push(arr);
break;
case "Rule":
_34=arr.shift();
if(!_1.rules[_34]){
_1.rules[_34]=[];
}
_1.rules[_34].push(arr);
break;
case "Link":
if(_1.zones[arr[1]]){
alert("Error with Link "+arr[1]);
}
_1.zones[arr[1]]=arr[0];
break;
case "Leap":
break;
default:
break;
}
}
}
return true;
};
this.getOffset=function(dt,tz){
var _38=getZone(dt,tz);
var off=getBasicOffset(_38);
var _3a=getRule(dt,_38[1]);
if(_3a){
off=getAdjustedOffset(off,_3a);
}
return off;
};
};
fleegix.json=new function(){
this.serialize=function(obj){
var str="";
switch(typeof obj){
case "object":
if(obj==null){
return "null";
}else{
if(obj instanceof Array){
for(var i=0;i<obj.length;i++){
if(str){
str+=",";
}
str+=fleegix.json.serialize(obj[i]);
}
return "["+str+"]";
}else{
if(typeof obj.toString!="undefined"){
for(var i in obj){
if(str){
str+=",";
}
str+="\""+i+"\":";
str+=(obj[i]==undefined)?"\"undefined\"":fleegix.json.serialize(obj[i]);
}
return "{"+str+"}";
}
}
}
return str;
break;
case "unknown":
case "undefined":
case "function":
return "\"undefined\"";
break;
case "string":
str+="\""+obj.replace(/(["\\])/g,"\\$1").replace(/\r/g,"").replace(/\n/g,"\\n")+"\"";
return str;
break;
default:
return String(obj);
break;
}
};
};
fleegix.json.constructor=null;
if(typeof fleegix.date=="undefined"){
fleegix.date={};
}
fleegix.date.XDate=function(){
var a=[];
var dt=null;
if(!arguments.length){
dt=new Date();
}else{
if(arguments.length==1){
if(typeof arguments[0]=="string"){
dt=new Date(arguments[0]);
}else{
dt=new Date(0);
dt.setMilliseconds(arguments[0]+(dt.getTimezoneOffset()*60*1000));
}
}else{
var _40=[];
for(var i=0;i<3;i++){
a[i]=arguments[i]||0;
}
dt=new Date(a[0],a[1],a[2]);
}
}
this.year=0;
this.month=0;
this.date=0;
this.isXDate=true;
this.setFromDateObjProxy(dt);
return this;
};
fleegix.date.XDate.prototype={getDate:function(){
return this.date;
},getDay:function(){
},getFullYear:function(){
return this.year;
},getMonth:function(){
return this.month;
},getYear:function(){
return this.year;
},setDate:function(n){
this.setAttribute("date",n);
},setFullYear:function(n){
this.setAttribute("year",n);
},setMonth:function(n){
this.setAttribute("month",n);
},setYear:function(n){
this.setUTCAttribute("year",n);
},toGMTString:function(){
},toLocaleString:function(){
},toLocaleDateString:function(){
},toLocaleTimeString:function(){
},toSource:function(){
},toString:function(){
var str=this.getFullYear()+"-"+(this.getMonth()+1)+"-"+this.getDate();
return str;
},setFromDateObjProxy:function(dt,_48){
this.year=_48?dt.getUTCFullYear():dt.getFullYear();
this.month=_48?dt.getUTCMonth():dt.getMonth();
this.date=_48?dt.getUTCDate():dt.getDate();
},setAttribute:function(_49,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(this.year,this.month,this.date);
var _4c=_49=="year"?"FullYear":_49.substr(0,1).toUpperCase()+_49.substr(1);
dt["set"+_4c](n);
this.setFromDateObjProxy(dt);
},clone:function(){
return new fleegix.date.XDate(this.year,this.month,this.date);
},civilToJulianDayNumber:function(y,m,d){
m++;
if(m>12){
var a=parseInt(m/12);
m=m%12;
y+=a;
}
if(m<=2){
y-=1;
m+=12;
}
var a=Math.floor(y/100);
var b=2-a+Math.floor(a/4);
jDt=Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524;
return jDt;
}};
fleegix.date.XDateTime=function(){
var a=[];
var dt=null;
if(!arguments.length){
dt=new Date();
}else{
if(arguments.length==1){
if(typeof arguments[0]=="string"){
dt=new Date(arguments[0]);
}else{
dt=new Date(0);
dt.setMilliseconds(arguments[0]+(dt.getTimezoneOffset()*60*1000));
}
}else{
if(arguments.length==2&&typeof arguments[1]=="string"){
var tz=arguments[1];
if(typeof arguments[0]=="number"){
dt=new Date(0);
dt.setMilliseconds(arguments[0]+(dt.getTimezoneOffset()*60*1000));
dt=new Date(dt.getUTCFullYear(),dt.getUTCMonth(),dt.getUTCDate());
var o=fleegix.date.timezone.getOffset(dt,arguments[1]);
dt=new Date(0);
dt.setMilliseconds(arguments[0]+(dt.getTimezoneOffset()*60*1000)-(o*60*1000));
}else{
dt=new Date(arguments[0]);
}
}else{
var _56=[];
for(var i=0;i<arguments.length;i++){
_56.push(arguments[i]);
}
if(typeof _56[_56.length-1]=="string"){
var tz=_56.pop();
}
for(var i=0;i<8;i++){
a[i]=_56[i]||0;
}
dt=new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7]);
}
}
}
this.year=0;
this.month=0;
this.date=0;
this.hours=0;
this.minutes=0;
this.seconds=0;
this.milliseconds=0;
this.timezone="";
this.utc=false;
this.isXDateTime=true;
this.setFromDateObjProxy(dt);
this.setTimezone(tz);
return this;
};
fleegix.date.XDateTime.prototype=new fleegix.date.XDate();
fleegix.date.XDateTime.prototype.getHours=function(){
return this.hours;
};
fleegix.date.XDateTime.prototype.getMilliseconds=function(){
return this.milliseconds;
};
fleegix.date.XDateTime.prototype.getMinutes=function(){
return this.minutes;
};
fleegix.date.XDateTime.prototype.getSeconds=function(){
return this.seconds;
};
fleegix.date.XDateTime.prototype.getTime=function(){
var dt=Date.UTC(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds);
return dt+(this.getTimezoneOffset()*60*1000);
};
fleegix.date.XDateTime.prototype.getTimezone=function(){
return this.timezone;
};
fleegix.date.XDateTime.prototype.getTimezoneOffset=function(){
if(this.utc){
offset=0;
}else{
var dt=new Date(Date.UTC(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds));
var tz=this.timezone;
offset=fleegix.date.timezone.getOffset(dt,tz);
}
return offset;
};
fleegix.date.XDateTime.prototype.getUTCDate=function(){
return this.getUTCDateProxy().getUTCDate();
};
fleegix.date.XDateTime.prototype.getUTCDay=function(){
return this.getUTCDateProxy().getUTCDay();
};
fleegix.date.XDateTime.prototype.getUTCFullYear=function(){
return this.getUTCDateProxy().getUTCFullYear();
};
fleegix.date.XDateTime.prototype.getUTCHours=function(){
return this.getUTCDateProxy().getUTCHours();
};
fleegix.date.XDateTime.prototype.getUTCMilliseconds=function(){
return this.getUTCDateProxy().getUTCMilliseconds();
};
fleegix.date.XDateTime.prototype.getUTCMinutes=function(){
return this.getUTCDateProxy().getUTCMinutes();
};
fleegix.date.XDateTime.prototype.getUTCMonth=function(){
return this.getUTCDateProxy().getUTCMonth();
};
fleegix.date.XDateTime.prototype.getUTCSeconds=function(){
return this.getUTCDateProxy().getUTCSeconds();
};
fleegix.date.XDateTime.prototype.setHours=function(n){
this.setAttribute("hours",n);
};
fleegix.date.XDateTime.prototype.setMilliseconds=function(n){
this.setAttribute("milliseconds",n);
};
fleegix.date.XDateTime.prototype.setMinutes=function(n){
this.setAttribute("minutes",n);
};
fleegix.date.XDateTime.prototype.setSeconds=function(n){
this.setAttribute("seconds",n);
};
fleegix.date.XDateTime.prototype.setTime=function(n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(0);
dt.setUTCMilliseconds(n-(this.getTimezoneOffset()*60*1000));
this.setFromDateObjProxy(dt,true);
};
fleegix.date.XDateTime.prototype.setTimezone=function(str){
this.timezone=str||"Etc/UTC";
if(this.timezone=="Etc/UTC"||this.timezone=="Etc/GMT"){
this.utc=true;
}else{
this.utc=false;
}
};
fleegix.date.XDateTime.prototype.setUTCDate=function(n){
this.setUTCAttribute("date",n);
};
fleegix.date.XDateTime.prototype.setUTCFullYear=function(n){
this.setUTCAttribute("year",n);
};
fleegix.date.XDateTime.prototype.setUTCHours=function(n){
this.setUTCAttribute("hours",n);
};
fleegix.date.XDateTime.prototype.setUTCMilliseconds=function(n){
this.setUTCAttribute("milliseconds",n);
};
fleegix.date.XDateTime.prototype.setUTCMinutes=function(n){
this.setUTCAttribute("minutes",n);
};
fleegix.date.XDateTime.prototype.setUTCMonth=function(n){
this.setUTCAttribute("month",n);
};
fleegix.date.XDateTime.prototype.setUTCSeconds=function(n){
this.setUTCAttribute("seconds",n);
};
fleegix.date.XDateTime.prototype.toGMTString=function(){
};
fleegix.date.XDateTime.prototype.toLocaleString=function(){
};
fleegix.date.XDateTime.prototype.toLocaleDateString=function(){
};
fleegix.date.XDateTime.prototype.toLocaleTimeString=function(){
};
fleegix.date.XDateTime.prototype.toSource=function(){
};
fleegix.date.XDateTime.prototype.toString=function(){
var str=this.getFullYear()+"-"+(this.getMonth()+1)+"-"+this.getDate();
var hou=this.getHours()||12;
hou=String(hou);
var min=String(this.getMinutes());
if(min.length==1){
min="0"+min;
}
var sec=String(this.getSeconds());
if(sec.length==1){
sec="0"+sec;
}
str+=" "+hou;
str+=":"+min;
str+=":"+min;
return str;
};
fleegix.date.XDateTime.prototype.toUTCString=function(){
};
fleegix.date.XDateTime.prototype.valueOf=function(){
return this.getTime();
};
fleegix.date.XDateTime.prototype.clone=function(){
return new fleegix.date.XDateTime(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds,this.timezone);
};
fleegix.date.XDateTime.prototype.setFromDateObjProxy=function(dt,_6e){
this.year=_6e?dt.getUTCFullYear():dt.getFullYear();
this.month=_6e?dt.getUTCMonth():dt.getMonth();
this.date=_6e?dt.getUTCDate():dt.getDate();
this.hours=_6e?dt.getUTCHours():dt.getHours();
this.minutes=_6e?dt.getUTCMinutes():dt.getMinutes();
this.seconds=_6e?dt.getUTCSeconds():dt.getSeconds();
this.milliseconds=_6e?dt.getUTCMilliseconds():dt.getMilliseconds();
};
fleegix.date.XDateTime.prototype.setAttribute=function(_6f,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds);
var _72=_6f=="year"?"FullYear":_6f.substr(0,1).toUpperCase()+_6f.substr(1);
dt["set"+_72](n);
this.setFromDateObjProxy(dt);
};
fleegix.date.XDateTime.prototype.getUTCDateProxy=function(){
var dt=new Date(Date.UTC(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds));
dt.setUTCMinutes(dt.getUTCMinutes()+this.getTimezoneOffset());
return dt;
};
fleegix.date.XDateTime.prototype.setUTCAttribute=function(_74,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var _76=_74=="year"?"FullYear":_74.substr(0,1).toUpperCase()+_74.substr(1);
var dt=this.getUTCDateProxy();
dt["setUTC"+_76](n);
dt.setUTCMinutes(dt.getUTCMinutes()-this.getTimezoneOffset());
this.setFromDateObjProxy(dt,true);
};
fleegix.date.XDateTime.prototype.getAstronomicalJulianDate=function(){
var jd=this.civilToJulianDayNumber(this.year,this.month,this.date);
var fr=this.timeToDayFraction(this.hour,this.minutes,this.seconds);
var of=this.offsetToDayFraction(this.offset);
return this.jDNToAJD(jd,fr,of);
};
fleegix.date.XDateTime.prototype.timeToDayFraction=function(h,m,s){
return (h/24)+(m/1440)+(s/86400);
};
fleegix.date.XDateTime.prototype.offsetToDayFraction=function(o){
return (o/1440);
};
fleegix.date.XDateTime.prototype.jDNToAJD=function(jd,fr,of){
var _82=of||0;
return jd+fr-_82-(1/2);
};
fleegix.xml=new function(){
var _83=this;
this.parse=function(_84,_85){
var _86=new Array;
var _87;
var _88=[];
if(_84.hasChildNodes()){
_86=_84.getElementsByTagName(_85);
_87=_86[0];
for(var j=0;j<_86.length;j++){
_87=_86[j];
_88[j]=_83.xmlElem2Obj(_86[j]);
}
}
return _88;
};
this.xmlElem2Obj=function(_8a){
var ret=new Object();
_83.setPropertiesRecursive(ret,_8a);
return ret;
};
this.setPropertiesRecursive=function(obj,_8d){
if(_8d.childNodes.length>0){
for(var i=0;i<_8d.childNodes.length;i++){
if(_8d.childNodes[i].nodeType==1&&_8d.childNodes[i].firstChild){
if(_8d.childNodes[i].childNodes.length==1){
obj[_8d.childNodes[i].tagName]=_8d.childNodes[i].firstChild.nodeValue;
}else{
obj[_8d.childNodes[i].tagName]=[];
_83.setPropertiesRecursive(obj[_8d.childNodes[i].tagName],_8d.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_8f){
var _90=_8f;
for(var _91 in _90){
_90[_91]=cleanText(_90[_91]);
}
return _90;
};
this.cleanText=function(str){
var ret=str;
ret=ret.replace(/\n/g,"");
ret=ret.replace(/\r/g,"");
ret=ret.replace(/\'/g,"\\'");
ret=ret.replace(/\[CDATA\[/g,"");
ret=ret.replace(/\]]/g,"");
return ret;
};
this.rendered2Source=function(str){
var _95=str;
_95=_95.replace(/</g,"&lt;");
_95=_95.replace(/>/g,"&gt;");
return "<pre>"+_95+"</pre>";
};
this.getXMLDocElem=function(_96,_97){
var _98=[];
var _99=null;
if(document.all){
var _9a=document.getElementById(_96).innerHTML;
var _9b=new ActiveXObject("Microsoft.XMLDOM");
_9b.loadXML(_9a);
_99=_9b.documentElement;
}else{
_98=window.document.body.getElementsByTagName(_97);
_99=_98[0];
}
return _99;
};
};
fleegix.xml.constructor=null;
fleegix.xhr=new function(){
this.req=null;
this.reqId=0;
this.url=null;
this.status=null;
this.statusText="";
this.method="GET";
this.async=true;
this.dataPayload=null;
this.readyState=null;
this.responseText=null;
this.responseXML=null;
this.handleResp=null;
this.responseFormat="text",this.mimeType=null;
this.username="";
this.password="";
this.headers=[];
var i=0;
var _9d=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
while(!this.req&&(i<_9d.length)){
try{
this.req=_9d[i++]();
}
catch(e){
}
}
if(this.req){
this.reqId=0;
}else{
alert("Could not create XMLHttpRequest object.");
}
this.doGet=function(_9e,url,_a0){
this.handleResp=_9e;
this.url=url;
this.responseFormat=_a0||"text";
return this.doReq();
};
this.doPost=function(_a1,url,_a3,_a4){
this.handleResp=_a1;
this.url=url;
this.dataPayload=_a3;
this.responseFormat=_a4||"text";
this.method="POST";
return this.doReq();
};
this.doReq=function(){
var _a5=null;
var req=null;
var id=null;
var _a8=[];
req=this.req;
this.reqId++;
id=this.reqId;
if(this.username&&this.password){
req.open(this.method,this.url,this.async,this.username,this.password);
}else{
req.open(this.method,this.url,this.async);
}
if(this.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
req.overrideMimeType(this.mimeType);
}
if(this.headers.length){
for(var i=0;i<this.headers.length;i++){
_a8=this.headers[i].split(": ");
req.setRequestHeader(_a8[i],_a8[1]);
}
this.headers=[];
}else{
if(this.method=="POST"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_a5=this;
req.onreadystatechange=function(){
var _aa=null;
_a5.readyState=req.readyState;
if(req.readyState==4){
_a5.status=req.status;
_a5.statusText=req.statusText;
_a5.responseText=req.responseText;
_a5.responseXML=req.responseXML;
switch(_a5.responseFormat){
case "text":
_aa=_a5.responseText;
break;
case "xml":
_aa=_a5.responseXML;
break;
case "object":
_aa=req;
break;
}
if(_a5.status>199&&_a5.status<300){
if(_a5.async){
if(!_a5.handleResp){
alert("No response handler defined "+"for this XMLHttpRequest object.");
return;
}else{
_a5.handleResp(_aa,id);
}
}
}else{
_a5.handleErr(_aa);
}
}
};
req.send(this.dataPayload);
if(this.async){
return id;
}else{
return req;
}
};
this.abort=function(){
if(this.req){
this.req.onreadystatechange=function(){
};
this.req.abort();
this.req=null;
}
};
this.handleErr=function(){
var _ab;
try{
_ab=window.open("","errorWin");
_ab.document.body.innerHTML=this.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
this.setMimeType=function(_ac){
this.mimeType=_ac;
};
this.setHandlerResp=function(_ad){
this.handleResp=_ad;
};
this.setHandlerErr=function(_ae){
this.handleErr=_ae;
};
this.setHandlerBoth=function(_af){
this.handleResp=_af;
this.handleErr=_af;
};
this.setRequestHeader=function(_b0,_b1){
this.headers.push(_b0+": "+_b1);
};
};
fleegix.xhr.constructor=null;
fleegix.uri=new function(){
var _b2=this;
this.params={};
this.getParamHash=function(){
var _b3=_b2.getQuery();
var arr=[];
var _b5=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_b3){
_b3+="&";
while(arr=pat.exec(_b3)){
_b5[arr[1]]=arr[2];
}
}
return _b5;
};
this.getParam=function(_b8){
return _b2.params[_b8];
};
this.getQuery=function(){
return location.href.split("?")[1];
};
this.params=this.getParamHash();
};
fleegix.uri.constructor=null;
fleegix.ui=new function(){
this.getWindowHeight=function(){
if(document.all){
if(document.documentElement&&document.documentElement.clientHeight){
return document.documentElement.clientHeight;
}else{
return document.body.clientHeight;
}
}else{
return window.innerHeight;
}
};
this.getWindowWidth=function(){
if(document.all){
if(document.documentElement&&document.documentElement.clientWidth){
return document.documentElement.clientWidth;
}else{
return document.body.clientWidth;
}
}else{
return window.innerWidth;
}
};
};
fleegix.ui.constructor=null;
fleegix.popup=new function(){
var _b9=this;
this.win=null;
this.open=function(url,_bb){
var _bc=_bb||{};
var str="";
var _be={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _bf in _be){
str+=_bf+"=";
str+=_bc[_bf]?_bc[_bf]:_be[_bf];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_b9.win||_b9.win.closed){
_b9.win=null;
_b9.win=window.open(url,"thePopupWin",str);
}else{
_b9.win.focus();
_b9.win.document.location=url;
}
};
this.close=function(){
if(_b9.win){
_b9.win.window.close();
_b9.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_b9.close();
};
};
fleegix.popup.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(_c2,_c3){
var _c4=_c3||{};
var s="";
var str="";
var _c7;
var _c8="";
var pat=null;
if(_c4.stripTags){
pat=/<[^>]*>/g;
}
for(i=0;i<_c2.elements.length;i++){
_c7=_c2.elements[i];
switch(_c7.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
s=_c4.stripTags?_c7.value.replace(pat,""):_c7.value;
if(s){
str+=_c7.name+"="+encodeURIComponent(s)+"&";
}
break;
case "select-multiple":
var _ca=false;
for(var j=0;j<_c7.options.length;j++){
var _cc=_c7.options[j];
if(_cc.selected){
if(_c4.collapseMulti){
if(_ca){
s=_c4.stripTags?_cc.value.replace(pat,""):_cc.value;
str+=","+encodeURIComponent(s);
}else{
s=_c4.stripTags?_cc.value.replace(pat,""):_cc.value;
str+=_c7.name+"="+encodeURIComponent(s);
_ca=true;
}
}else{
s=_c4.stripTags?_cc.value.replace(pat,""):_cc.value;
str+=_c7.name+"="+encodeURIComponent(_cc.value)+"&";
}
}
}
if(_c4.collapseMulti){
str+="&";
}
break;
case "radio":
if(_c7.checked){
s=_c4.stripTags?_c7.value.replace(pat,""):_c7.value;
str+=_c7.name+"="+encodeURIComponent(_c7.value)+"&";
}
break;
case "checkbox":
if(_c7.checked){
if(_c4.collapseMulti&&(_c7.name==_c8)){
if(str.lastIndexOf("&")==str.length-1){
str=str.substr(0,str.length-1);
}
s=_c4.stripTags?_c7.value.replace(pat,""):_c7.value;
str+=","+encodeURIComponent(s);
}else{
s=_c4.stripTags?_c7.value.replace(pat,""):_c7.value;
str+=_c7.name+"="+encodeURIComponent(s);
}
str+="&";
_c8=_c7.name;
}
break;
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.restore=function(_cd,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _d2=arr[i].split("=");
var _d3=_d2[0];
var val=_d2[1];
if(typeof d[_d3]=="undefined"){
d[_d3]=val;
}else{
if(!(d[_d3] instanceof Array)){
var t=d[_d3];
d[_d3]=[];
d[_d3].push(t);
}
d[_d3].push(val);
}
}
for(var i=0;i<_cd.elements.length;i++){
elem=_cd.elements[i];
if(typeof d[elem.name]!="undefined"){
val=d[elem.name];
switch(elem.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
elem.value=decodeURIComponent(val);
break;
case "radio":
if(encodeURIComponent(elem.value)==val){
elem.checked=true;
}
break;
case "checkbox":
for(var j=0;j<val.length;j++){
if(encodeURIComponent(elem.value)==val[j]){
elem.checked=true;
}
}
break;
case "select-multiple":
for(var h=0;h<elem.options.length;h++){
var opt=elem.options[h];
for(var j=0;j<val.length;j++){
if(encodeURIComponent(opt.value)==val[j]){
opt.selected=true;
}
}
}
break;
}
}
}
return _cd;
};
fleegix.event=new function(){
var _d9=[];
var _da={};
this.listen=function(){
var _db=arguments[0];
var _dc=arguments[1];
var _dd=_db[_dc]?_db[_dc].listenReg:null;
if(!_dd){
_dd={};
_dd.orig={};
_dd.orig.obj=_db,_dd.orig.methName=_dc;
if(_db[_dc]){
_dd.orig.methCode=eval(_db[_dc].valueOf());
}
_dd.after=[];
_db[_dc]=function(){
var _de=[];
for(var i=0;i<arguments.length;i++){
_de.push(arguments[i]);
}
fleegix.event.exec(_db[_dc].listenReg,_de);
};
_db[_dc].listenReg=_dd;
_d9.push(_db[_dc].listenReg);
}
if(typeof arguments[2]=="function"){
_dd.after.push(arguments[2]);
}else{
_dd.after.push([arguments[2],arguments[3]]);
}
_db[_dc].listenReg=_dd;
};
this.exec=function(reg,_e1){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_e1);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_e1[0]=_e1[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _e4=ex;
_e4(_e1);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_e1);
}
}
};
this.unlisten=function(){
var _e5=arguments[0];
var _e6=arguments[1];
var _e7=_e5[_e6]?_e5[_e6].listenReg:null;
var _e8=null;
if(!_e7){
return false;
}
for(var i=0;i<_e7.after.length;i++){
var ex=_e7.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_e7.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_e7.after.splice(i,1);
}
}
}
_e5[_e6].listenReg=_e7;
};
this.flush=function(){
for(var i=0;i<_d9.length;i++){
var reg=_d9[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_ed,obj,_ef){
if(!obj){
return;
}
if(!_da[_ed]){
_da[_ed]={};
_da[_ed].audience=[];
}else{
this.unsubscribe(_ed,obj);
}
_da[_ed].audience.push([obj,_ef]);
};
this.unsubscribe=function(_f0,obj){
if(!obj){
_da[_f0]=null;
}else{
if(_da[_f0]){
var aud=_da[_f0].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_f5){
if(_da[pub]){
aud=_da[pub].audience;
for(var i=0;i<aud.length;i++){
var _f7=aud[i][0];
var _f8=aud[i][1];
_f7[_f8](_f5);
}
}
};
this.getSrcElementId=function(e){
var ret=null;
if(e.srcElement){
ret=e.srcElement;
}else{
if(e.target){
ret=e.target;
}
}
if(typeof ret.id=="undefined"){
return null;
}else{
while(!ret.id||ret.nodeType==3){
if(ret.parentNode){
ret=ret.parentNode;
}else{
return null;
}
}
}
return ret.id;
};
};
fleegix.event.constructor=null;
fleegix.event.listen(window,"onunload",fleegix.event,"flush");
fleegix.cookie=new function(){
this.set=function(_fb,_fc,_fd){
var _fe=_fd||{};
var exp="";
var t=0;
var path=_fe.path||"/";
var days=_fe.days||0;
var _103=_fe.hours||0;
var _104=_fe.minutes||0;
t+=days?days*24*60*60*1000:0;
t+=_103?_103*60*60*1000:0;
t+=_104?_104*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_fb+"="+_fc+exp+"; path="+path;
};
this.get=function(name){
var _107=name+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_107)==0){
return c.substring(_107.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(name,path){
var opts={};
opts.minutes=-1;
if(path){
opts.path=path;
}
this.set(name,"",opts);
};
};
fleegix.cookie.constructor=null;

