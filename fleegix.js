if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.json=new function(){
this.serialize=function(_1){
var _2="";
switch(typeof _1){
case "object":
if(_1==null){
return "null";
}else{
if(_1 instanceof Array){
for(var i=0;i<_1.length;i++){
if(_2){
_2+=",";
}
_2+=fleegix.json.serialize(_1[i]);
}
return "["+_2+"]";
}else{
if(typeof _1.toString!="undefined"){
for(var i in _1){
if(_2){
_2+=",";
}
_2+="\""+i+"\":";
_2+=(_1[i]==undefined)?"\"undefined\"":fleegix.json.serialize(_1[i]);
}
return "{"+_2+"}";
}
}
}
return _2;
break;
case "unknown":
case "undefined":
case "function":
return "\"undefined\"";
break;
case "string":
_2+="\""+_1.replace(/(["\\])/g,"\\$1").replace(/\r/g,"").replace(/\n/g,"\\n")+"\"";
return _2;
break;
default:
return String(_1);
break;
}
};
};
fleegix.json.constructor=null;
fleegix.xml=new function(){
var _4=this;
this.parse=function(_5,_6){
var _7=new Array;
var _8;
var _9=[];
if(_5.hasChildNodes()){
_7=_5.getElementsByTagName(_6);
_8=_7[0];
for(var j=0;j<_7.length;j++){
_8=_7[j];
_9[j]=_4.xmlElem2Obj(_7[j]);
}
}
return _9;
};
this.xmlElem2Obj=function(_b){
var _c=new Object();
_4.setPropertiesRecursive(_c,_b);
return _c;
};
this.setPropertiesRecursive=function(_d,_e){
if(_e.childNodes.length>0){
for(var i=0;i<_e.childNodes.length;i++){
if(_e.childNodes[i].nodeType==1&&_e.childNodes[i].firstChild){
if(_e.childNodes[i].childNodes.length==1){
_d[_e.childNodes[i].tagName]=_e.childNodes[i].firstChild.nodeValue;
}else{
_d[_e.childNodes[i].tagName]=[];
_4.setPropertiesRecursive(_d[_e.childNodes[i].tagName],_e.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_10){
var _11=_10;
for(var _12 in _11){
_11[_12]=cleanText(_11[_12]);
}
return _11;
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
var _16=str;
_16=_16.replace(/</g,"&lt;");
_16=_16.replace(/>/g,"&gt;");
return "<pre>"+_16+"</pre>";
};
this.getXMLDocElem=function(_17,_18){
var _19=[];
var _1a=null;
if(document.all){
var _1b=document.getElementById(_17).innerHTML;
var _1c=new ActiveXObject("Microsoft.XMLDOM");
_1c.loadXML(_1b);
_1a=_1c.documentElement;
}else{
_19=window.document.body.getElementsByTagName(_18);
_1a=_19[0];
}
return _1a;
};
};
fleegix.xml.constructor=null;
fleegix.xhr=new function(){
var i=0;
var t=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
this.trans=null;
this.lastReqId=0;
while(!this.trans&&(i<t.length)){
try{
this.trans=t[i++]();
}
catch(e){
}
}
if(!this.trans){
throw ("Could not create XMLHttpRequest object.");
}
this.doGet=function(){
var o={};
var _20=null;
var _21=Array.prototype.slice.apply(arguments);
if(typeof _21[0]=="function"){
o.async=true;
_20=_21.shift();
}else{
o.async=false;
}
var url=_21.shift();
var _23=_21.shift()||"text";
o.handleResp=_20;
o.url=url;
o.responseFormat=_23;
return this.doReq(o);
};
this.doPost=function(){
var o={};
var _25=null;
var _26=Array.prototype.slice.apply(arguments);
if(typeof _26[0]=="function"){
o.async=true;
_25=_26.shift();
}else{
o.async=false;
}
var url=_26.shift();
var _28=_26.shift();
var _29=_26.shift()||"text";
o.handleResp=_25;
o.url=url;
o.dataPayload=_28;
o.responseFormat=_29;
o.method="POST";
return this.doReq(o);
};
this.doReq=function(o){
var _2b=o||{};
var req=new fleegix.xhr.Request();
var _2d=this.trans;
var _2e=null;
function handleErrDefault(r){
var _30;
try{
_30=window.open("","errorWin");
_30.document.body.innerHTML=r.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
}
for(var p in _2b){
req[p]=_2b[p];
}
this.lastReqId++;
req.id=this.lastReqId;
if(req.username&&req.password){
_2d.open(req.method,req.url,req.async,req.username,req.password);
}else{
_2d.open(req.method,req.url,req.async);
}
if(req.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_2d.overrideMimeType(req.mimeType);
}
if(req.headers.length){
for(var i=0;i<req.headers.length;i++){
var _33=req.headers[i].split(": ");
_2d.setRequestHeader(_33[i],_33[1]);
}
}else{
if(req.method=="POST"){
_2d.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_2d.onreadystatechange=function(){
if(_2d.readyState==4){
switch(req.responseFormat){
case "text":
_2e=_2d.responseText;
break;
case "xml":
_2e=_2d.responseXML;
break;
case "object":
_2e=_2d;
break;
}
if(_2d.status>199&&_2d.status<300){
if(req.async){
if(!req.handleResp){
throw ("No response handler defined "+"for this request");
return;
}else{
req.handleResp(_2e,req.id);
}
}
}else{
if(req.handleErr){
req.handleErr(_2e);
}else{
handleErrDefault(_2d);
}
}
}
};
_2d.send(req.dataPayload);
if(req.async){
return req.id;
}else{
return _2e;
}
};
this.abort=function(){
if(this.trans){
this.trans.onreadystatechange=function(){
};
this.trans.abort();
}
};
this.handleErrDefault=function(r){
};
};
fleegix.xhr.constructor=null;
fleegix.xhr.Request=function(){
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
};
fleegix.xhr.Request.prototype.setRequestHeader=function(_35,_36){
this.headers.push(_35+": "+_36);
};
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f);
var _3a=o||{};
var str="";
var pat=null;
if(_3a.stripTags){
pat=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_3a.stripTags?v.replace(pat,""):v;
str+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_3a.collapseMulti){
sep=",";
str+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_3a.stripTags?v[j].replace(pat,""):v[j];
s=(!_3a.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
str+=s+sep;
}
str=str.substr(0,str.length-1);
}
str+="&";
}else{
if(_3a.includeEmpty){
str+=n+"=&";
}
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.toHash=function(f){
var h={};
function expandToArr(_44,val){
if(_44){
var r=null;
if(typeof _44=="string"){
r=[];
r.push(_44);
}else{
r=_44;
}
r.push(val);
return r;
}else{
return val;
}
}
for(i=0;i<f.elements.length;i++){
elem=f.elements[i];
switch(elem.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
h[elem.name]=elem.value;
break;
case "select-multiple":
h[elem.name]=null;
for(var j=0;j<elem.options.length;j++){
var o=elem.options[j];
if(o.selected){
h[elem.name]=expandToArr(h[elem.name],o.value);
}
}
break;
case "radio":
if(typeof h[elem.name]=="undefined"){
h[elem.name]=null;
}
if(elem.checked){
h[elem.name]=elem.value;
}
break;
case "checkbox":
if(typeof h[elem.name]=="undefined"){
h[elem.name]=null;
}
if(elem.checked){
h[elem.name]=expandToArr(h[elem.name],elem.value);
}
break;
}
}
return h;
};
fleegix.form.restore=function(_49,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _4e=arr[i].split("=");
var _4f=_4e[0];
var val=_4e[1];
if(typeof d[_4f]=="undefined"){
d[_4f]=val;
}else{
if(!(d[_4f] instanceof Array)){
var t=d[_4f];
d[_4f]=[];
d[_4f].push(t);
}
d[_4f].push(val);
}
}
for(var i=0;i<_49.elements.length;i++){
elem=_49.elements[i];
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
return _49;
};
fleegix.form.Differ=function(){
this.count=0;
this.diffs={};
};
fleegix.form.Differ.prototype.hasKey=function(k){
return (typeof this.diffs[k]!="undefined");
};
fleegix.form.diff=function(_56,_57){
var hA=_56.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_56):_56;
var hB=_57.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_57):_57;
var ret=new fleegix.form.Differ();
function addDiff(n){
ret.count++;
ret.diffs[n]=[hA[n],hB[n]];
}
for(n in hA){
if(typeof hB[n]=="undefined"){
addDiff(n);
}else{
v=hA[n];
if(v instanceof Array){
if(!hB[n]||(hB[n].toString()!=v.toString())){
addDiff(n);
}
}else{
if(hB[n]!=v){
addDiff(n);
}
}
}
}
return ret;
};
fleegix.popup=new function(){
var _5c=this;
this.win=null;
this.open=function(url,_5e){
var _5f=_5e||{};
var str="";
var _61={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _62 in _61){
str+=_62+"=";
str+=_5f[_62]?_5f[_62]:_61[_62];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_5c.win||_5c.win.closed){
_5c.win=window.open(url,"thePopupWin",str);
}else{
_5c.win.focus();
_5c.win.document.location=url;
}
};
this.close=function(){
if(_5c.win){
_5c.win.window.close();
_5c.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_5c.close();
};
};
fleegix.popup.constructor=null;
fleegix.event=new function(){
var _65=[];
var _66={};
this.listen=function(){
var _67=arguments[0];
var _68=arguments[1];
var _69=_67[_68]?_67[_68].listenReg:null;
if(!_69){
_69={};
_69.orig={};
_69.orig.obj=_67,_69.orig.methName=_68;
if(_67[_68]){
_69.orig.methCode=_67[_68];
}
_69.after=[];
_67[_68]=function(){
var _6a=[];
for(var i=0;i<arguments.length;i++){
_6a.push(arguments[i]);
}
fleegix.event.exec(_67[_68].listenReg,_6a);
};
_67[_68].listenReg=_69;
_65.push(_67[_68].listenReg);
}
if(typeof arguments[2]=="function"){
_69.after.push(arguments[2]);
}else{
_69.after.push([arguments[2],arguments[3]]);
}
_67[_68].listenReg=_69;
};
this.exec=function(reg,_6d){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_6d);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_6d[0]=_6d[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _70=ex;
_70(_6d);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_6d);
}
}
};
this.unlisten=function(){
var _71=arguments[0];
var _72=arguments[1];
var _73=_71[_72]?_71[_72].listenReg:null;
var _74=null;
if(!_73){
return false;
}
for(var i=0;i<_73.after.length;i++){
var ex=_73.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_73.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_73.after.splice(i,1);
}
}
}
_71[_72].listenReg=_73;
};
this.flush=function(){
for(var i=0;i<_65.length;i++){
var reg=_65[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_79,obj,_7b){
if(!obj){
return;
}
if(!_66[_79]){
_66[_79]={};
_66[_79].audience=[];
}else{
this.unsubscribe(_79,obj);
}
_66[_79].audience.push([obj,_7b]);
};
this.unsubscribe=function(_7c,obj){
if(!obj){
_66[_7c]=null;
}else{
if(_66[_7c]){
var aud=_66[_7c].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_81){
if(_66[pub]){
aud=_66[pub].audience;
for(var i=0;i<aud.length;i++){
var _83=aud[i][0];
var _84=aud[i][1];
_83[_84](_81);
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
var _89=[];
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
},setFromDateObjProxy:function(dt,_91){
this.year=_91?dt.getUTCFullYear():dt.getFullYear();
this.month=_91?dt.getUTCMonth():dt.getMonth();
this.date=_91?dt.getUTCDate():dt.getDate();
},setAttribute:function(_92,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(this.year,this.month,this.date);
var _95=_92=="year"?"FullYear":_92.substr(0,1).toUpperCase()+_92.substr(1);
dt["set"+_95](n);
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
var _9f=[];
for(var i=0;i<arguments.length;i++){
_9f.push(arguments[i]);
}
if(typeof _9f[_9f.length-1]=="string"){
var tz=_9f.pop();
}
for(var i=0;i<8;i++){
a[i]=_9f[i]||0;
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
fleegix.date.XDateTime.prototype.setFromDateObjProxy=function(dt,_b7){
this.year=_b7?dt.getUTCFullYear():dt.getFullYear();
this.month=_b7?dt.getUTCMonth():dt.getMonth();
this.date=_b7?dt.getUTCDate():dt.getDate();
this.hours=_b7?dt.getUTCHours():dt.getHours();
this.minutes=_b7?dt.getUTCMinutes():dt.getMinutes();
this.seconds=_b7?dt.getUTCSeconds():dt.getSeconds();
this.milliseconds=_b7?dt.getUTCMilliseconds():dt.getMilliseconds();
};
fleegix.date.XDateTime.prototype.setAttribute=function(_b8,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds);
var _bb=_b8=="year"?"FullYear":_b8.substr(0,1).toUpperCase()+_b8.substr(1);
dt["set"+_bb](n);
this.setFromDateObjProxy(dt);
};
fleegix.date.XDateTime.prototype.getUTCDateProxy=function(){
var dt=new Date(Date.UTC(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds));
dt.setUTCMinutes(dt.getUTCMinutes()+this.getTimezoneOffset());
return dt;
};
fleegix.date.XDateTime.prototype.setUTCAttribute=function(_bd,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var _bf=_bd=="year"?"FullYear":_bd.substr(0,1).toUpperCase()+_bd.substr(1);
var dt=this.getUTCDateProxy();
dt["setUTC"+_bf](n);
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
var _cb=of||0;
return jd+fr-_cb-(1/2);
};
fleegix.uri=new function(){
var _cc=this;
this.params={};
this.getParamHash=function(){
var _cd=_cc.getQuery();
var arr=[];
var _cf=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_cd){
_cd+="&";
while(arr=pat.exec(_cd)){
_cf[arr[1]]=arr[2];
}
}
return _cf;
};
this.getParam=function(_d2){
return _cc.params[_d2];
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
fleegix.cookie=new function(){
this.set=function(_d3,_d4,_d5){
var _d6=_d5||{};
var exp="";
var t=0;
var _d9=_d6.path||"/";
var _da=_d6.days||0;
var _db=_d6.hours||0;
var _dc=_d6.minutes||0;
t+=_da?_da*24*60*60*1000:0;
t+=_db?_db*60*60*1000:0;
t+=_dc?_dc*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_d3+"="+_d4+exp+"; path="+_d9;
};
this.get=function(_de){
var _df=_de+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_df)==0){
return c.substring(_df.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_e3,_e4){
var _e5={};
_e5.minutes=-1;
if(_e4){
_e5.path=_e4;
}
this.set(_e3,"",_e5);
};
};
fleegix.cookie.constructor=null;
if(typeof fleegix.date=="undefined"){
fleegix.date={};
}
fleegix.date.timezone=new function(){
this.zoneAreas={AFRICA:"africa",ANTARCTICA:"antarctica",ASIA:"asia",AUSTRALASIA:"australasia",BACKWARD:"backward",ETCETERA:"etcetera",EUROPE:"europe",NORTHAMERICA:"northamerica",PACIFICNEW:"pacificnew",SOUTHAMERICA:"southamerica",SYSTEMV:"systemv"};
var _e6=this;
var _e7={"jan":0,"feb":1,"mar":2,"apr":3,"may":4,"jun":5,"jul":6,"aug":7,"sep":8,"oct":9,"nov":10,"dec":11};
var _e8={"sun":0,"mon":1,"tue":2,"wed":3,"thu":4,"fri":5,"sat":6};
var _e9={"Africa":this.zoneAreas.AFRICA,"Indian":this.zoneAreas.AFRICA,"Antarctica":this.zoneAreas.ANTARCTICA,"Asia":this.zoneAreas.ASIA,"Pacific":this.zoneAreas.AUSTRALASIA,"Australia":this.zoneAreas.AUSTRALASIA,"Etc":this.zoneAreas.ETCETERA,"EST":this.zoneAreas.NORTHAMERICA,"MST":this.zoneAreas.NORTHAMERICA,"HST":this.zoneAreas.NORTHAMERICA,"EST5EDT":this.zoneAreas.NORTHAMERICA,"CST6CDT":this.zoneAreas.NORTHAMERICA,"MST7MDT":this.zoneAreas.NORTHAMERICA,"PST8PDT":this.zoneAreas.NORTHAMERICA,"America":function(){
var ret=[];
if(!this.loadedZoneAreas[this.zoneAreas.NORTHAMERICA]){
ret.push(this.zoneAreas.NORTHAMERICA);
}
if(!this.loadedZoneAreas[this.zoneAreas.SOUTHAMERICA]){
ret.push(this.zoneAreas.SOUTHAMERICA);
u;
}
return ret;
},"WET":this.zoneAreas.EUROPE,"CET":this.zoneAreas.EUROPE,"MET":this.zoneAreas.EUROPE,"EET":this.zoneAreas.EUROPE,"Europe":this.zoneAreas.EUROPE,"SystemV":this.zoneAreas.SYSTEMV};
var _eb={"Pacific/Honolulu":this.zoneAreas.NORTHAMERICA,"Pacific/Easter":this.zoneAreas.SOUTHAMERICA,"Pacific/Galapagos":this.zoneAreas.SOUTHAMERICA,"America/Danmarkshavn":this.zoneAreas.EUROPE,"America/Scoresbysund":this.zoneAreas.EUROPE,"America/Godthab":this.zoneAreas.EUROPE,"America/Thule":this.zoneAreas.EUROPE,"Indian/Kerguelen":this.zoneAreas.ANTARCTICA,"Indian/Chagos":this.zoneAreas.ASIA,"Indian/Maldives":this.zoneAreas.ASIA,"Indian/Christmas":this.zoneAreas.AUSTRALASIA,"Indian/Cocos":this.zoneAreas.AUSTRALASIA,"Europe/Nicosia":this.zoneAreas.ASIA,"Pacific/Easter":this.zoneAreas.SOUTHAMERICA,"Africa/Ceuta":this.zoneAreas.EUROPE,"Asia/Yekaterinburg":this.zoneAreas.EUROPE,"Asia/Omsk":this.zoneAreas.EUROPE,"Asia/Novosibirsk":this.zoneAreas.EUROPE,"Asia/Krasnoyarsk":this.zoneAreas.EUROPE,"Asia/Irkutsk":this.zoneAreas.EUROPE,"Asia/Yakutsk":this.zoneAreas.EUROPE,"Asia/Vladivostok":this.zoneAreas.EUROPE,"Asia/Sakhalin":this.zoneAreas.EUROPE,"Asia/Magadan":this.zoneAreas.EUROPE,"Asia/Kamchatka":this.zoneAreas.EUROPE,"Asia/Anadyr":this.zoneAreas.EUROPE,"Asia/Istanbul":this.zoneAreas.EUROPE};
var _ec={};
function parseTimeString(str){
var pat=/(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
var hms=str.match(pat);
hms[1]=parseInt(hms[1]);
hms[2]=hms[2]?parseInt(hms[2]):0;
hms[3]=hms[3]?parseInt(hms[3]):0;
return hms;
}
function getZone(dt,tz){
var _f2=tz;
var _f3=_e6.zones[_f2];
while(typeof (_f3)=="string"){
_f2=_f3;
_f3=_e6.zones[_f2];
if(!_f3){
alert("Cannot figure out the timezone "+_f2);
}
}
for(var i=0;i<_f3.length;i++){
var z=_f3[i];
if(!z[3]){
break;
}
var yea=parseInt(z[3]);
var mon=11;
var dat=31;
if(z[4]){
mon=_e7[z[4].substr(0,3).toLowerCase()];
dat=parseInt(z[5]);
}
var t=z[6]?z[6]:"23:59:59";
t=parseTimeString(t);
var d=Date.UTC(yea,mon,dat,t[1],t[2],t[3]);
if(dt.getTime()<d){
break;
}
}
if(i==_f3.length){
alert("No DST for "+_f2);
}else{
return _f3[i];
}
}
function getBasicOffset(z){
var off=parseTimeString(z[0]);
var adj=z[0].indexOf("-")==0?-1:1;
off=adj*(((off[1]*60+off[2])*60+off[3])*1000);
return -off/60/1000;
}
function getRule(dt,str){
var _100=null;
var year=dt.getUTCFullYear();
var _102=_e6.rules[str];
var _103=[];
if(!_102){
return null;
}
for(var i=0;i<_102.length;i++){
r=_102[i];
if((r[1]<(year-1))||(r[0]<(year-1)&&r[1]=="only")||(r[0]>year)){
continue;
}
var mon=_e7[r[3].substr(0,3).toLowerCase()];
var day=r[4];
if(isNaN(day)){
if(day.substr(0,4)=="last"){
var day=_e8[day.substr(4,3).toLowerCase()];
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon+1,1,t[1]-24,t[2],t[3]));
var _109=d.getUTCDay();
var diff=(day>_109)?(day-_109-7):(day-_109);
d.setUTCDate(d.getUTCDate()+diff);
if(dt<d){
if(r[0]<year){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_103.push({"rule":r,"date":d});
}
}
}else{
_103.push({"rule":r,"date":d});
}
}else{
day=_e8[day.substr(0,3).toLowerCase()];
if(day!="undefined"){
if(r[4].substr(3,2)==">="){
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,parseInt(r[4].substr(5)),t[1],t[2],t[3]));
var _109=d.getUTCDay();
var diff=(day<_109)?(day-_109+7):(day-_109);
d.setUTCDate(d.getUTCDate()+diff);
if(dt<d){
if(r[0]<year){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_103.push({"rule":r,"date":d});
}
}
}else{
_103.push({"rule":r,"date":d});
}
}else{
if(day.substr(3,2)=="<="){
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,parseInt(r[4].substr(5)),t[1],t[2],t[3]));
var _109=d.getUTCDay();
var diff=(day>_109)?(day-_109-7):(day-_109);
d.setUTCDate(d.getUTCDate()+diff);
if(dt<d){
if(r[0]<year){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_103.push({"rule":r,"date":d});
}
}
}else{
_103.push({"rule":r,"date":d});
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
_103.push({"rule":r,"date":d});
}
}
}
f=function(a,b){
return (a.date.getTime()>=b.date.getTime())?1:-1;
};
_103.sort(f);
_100=_103.pop().rule;
return _100;
}
function getAdjustedOffset(off,rule){
var save=rule[6];
var t=parseTimeString(save);
var adj=save.indexOf("-")==0?-1:1;
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
var _115=str.split("\n");
var arr=[];
var _117="";
var zone=null;
var rule=null;
for(var i=0;i<_115.length;i++){
l=_115[i];
if(l.match(/^\s/)){
l="Zone "+zone+l;
}
l=l.split("#")[0];
if(l.length>3){
arr=l.split(/\s+/);
_117=arr.shift();
switch(_117){
case "Zone":
zone=arr.shift();
if(!_e6.zones[zone]){
_e6.zones[zone]=[];
}
_e6.zones[zone].push(arr);
break;
case "Rule":
rule=arr.shift();
if(!_e6.rules[rule]){
_e6.rules[rule]=[];
}
_e6.rules[rule].push(arr);
break;
case "Link":
if(_e6.zones[arr[1]]){
alert("Error with Link "+arr[1]);
}
_e6.zones[arr[1]]=arr[0];
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
var zone=getZone(dt,tz);
var off=getBasicOffset(zone);
var rule=getRule(dt,zone[1]);
if(rule){
off=getAdjustedOffset(off,rule);
}
return off;
};
};

