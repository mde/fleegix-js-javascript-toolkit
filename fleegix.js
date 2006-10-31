if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.json=new function(){
this.serialize=function(_1){
var _2="";
switch(typeof _1){
case "object":
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
_2+=(_1[i]==undefined)?"undefined":fleegix.json.serialize(_1[i]);
}
return "{"+_2+"}";
}
}
return _2;
break;
case "unknown":
case "undefined":
case "function":
return "undefined";
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
var _1e=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
while(!this.req&&(i<_1e.length)){
try{
this.req=_1e[i++]();
}
catch(e){
}
}
if(this.req){
this.reqId=0;
}else{
alert("Could not create XMLHttpRequest object.");
}
this.doGet=function(_1f,url,_21){
this.handleResp=_1f;
this.url=url;
this.responseFormat=_21||"text";
return this.doReq();
};
this.doPost=function(_22,url,_24,_25){
this.handleResp=_22;
this.url=url;
this.dataPayload=_24;
this.responseFormat=_25||"text";
this.method="POST";
return this.doReq();
};
this.doReq=function(){
var _26=null;
var req=null;
var id=null;
var _29=[];
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
_29=this.headers[i].split(": ");
req.setRequestHeader(_29[i],_29[1]);
}
this.headers=[];
}else{
if(this.method=="POST"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_26=this;
req.onreadystatechange=function(){
var _2b=null;
_26.readyState=req.readyState;
if(req.readyState==4){
_26.status=req.status;
_26.statusText=req.statusText;
_26.responseText=req.responseText;
_26.responseXML=req.responseXML;
switch(_26.responseFormat){
case "text":
_2b=_26.responseText;
break;
case "xml":
_2b=_26.responseXML;
break;
case "object":
_2b=req;
break;
}
if(_26.status>199&&_26.status<300){
if(_26.async){
if(!_26.handleResp){
alert("No response handler defined "+"for this XMLHttpRequest object.");
return;
}else{
_26.handleResp(_2b,id);
}
}
}else{
_26.handleErr(_2b);
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
var _2c;
try{
_2c=window.open("","errorWin");
_2c.document.body.innerHTML=this.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
this.setMimeType=function(_2d){
this.mimeType=_2d;
};
this.setHandlerResp=function(_2e){
this.handleResp=_2e;
};
this.setHandlerErr=function(_2f){
this.handleErr=_2f;
};
this.setHandlerBoth=function(_30){
this.handleResp=_30;
this.handleErr=_30;
};
this.setRequestHeader=function(_31,_32){
this.headers.push(_31+": "+_32);
};
};
fleegix.xhr.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(_33,_34){
var _35=_34||{};
var s="";
var str="";
var _38;
var _39="";
var pat=null;
if(_35.stripTags){
pat=/<[^>]*>/g;
}
for(i=0;i<_33.elements.length;i++){
_38=_33.elements[i];
switch(_38.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
s=_35.stripTags?_38.value.replace(pat,""):_38.value;
str+=_38.name+"="+encodeURIComponent(s)+"&";
break;
case "select-multiple":
var _3b=false;
for(var j=0;j<_38.options.length;j++){
var _3d=_38.options[j];
if(_3d.selected){
if(_35.collapseMulti){
if(_3b){
s=_35.stripTags?_3d.value.replace(pat,""):_3d.value;
str+=","+encodeURIComponent(s);
}else{
s=_35.stripTags?_3d.value.replace(pat,""):_3d.value;
str+=_38.name+"="+encodeURIComponent(s);
_3b=true;
}
}else{
s=_35.stripTags?_3d.value.replace(pat,""):_3d.value;
str+=_38.name+"="+encodeURIComponent(_3d.value)+"&";
}
}
}
if(_35.collapseMulti){
str+="&";
}
break;
case "radio":
if(_38.checked){
s=_35.stripTags?_38.value.replace(pat,""):_38.value;
str+=_38.name+"="+encodeURIComponent(_38.value)+"&";
}
break;
case "checkbox":
if(_38.checked){
if(_35.collapseMulti&&(_38.name==_39)){
if(str.lastIndexOf("&")==str.length-1){
str=str.substr(0,str.length-1);
}
s=_35.stripTags?_38.value.replace(pat,""):_38.value;
str+=","+encodeURIComponent(s);
}else{
s=_35.stripTags?_38.value.replace(pat,""):_38.value;
str+=_38.name+"="+encodeURIComponent(s);
}
str+="&";
_39=_38.name;
}
break;
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.popup=new function(){
var _3e=this;
this.win=null;
this.open=function(url,_40){
var _41=_40||{};
var str="";
var _43={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _44 in _43){
str+=_44+"=";
str+=_41[_44]?_41[_44]:_43[_44];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_3e.win||_3e.win.closed){
_3e.win=null;
_3e.win=window.open(url,"thePopupWin",str);
}else{
_3e.win.focus();
_3e.win.document.location=url;
}
};
this.close=function(){
if(_3e.win){
_3e.win.window.close();
_3e.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_3e.close();
};
};
fleegix.popup.constructor=null;
fleegix.event=new function(){
var _47=[];
var _48={};
this.listen=function(){
var _49=arguments[0];
var _4a=arguments[1];
var _4b=_49[_4a]?_49[_4a].listenReg:null;
if(!_4b){
_4b={};
_4b.orig={};
_4b.orig.obj=_49,_4b.orig.methName=_4a;
if(_49[_4a]){
_4b.orig.methCode=eval(_49[_4a].valueOf());
}
_4b.after=[];
_49[_4a]=function(){
var _4c=[];
for(var i=0;i<arguments.length;i++){
_4c.push(arguments[i]);
}
fleegix.event.exec(_49[_4a].listenReg,_4c);
};
_49[_4a].listenReg=_4b;
_47.push(_49[_4a].listenReg);
}
if(typeof arguments[2]=="function"){
_4b.after.push(arguments[2]);
}else{
_4b.after.push([arguments[2],arguments[3]]);
}
_49[_4a].listenReg=_4b;
};
this.exec=function(reg,_4f){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_4f);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_4f[0]=_4f[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _52=ex;
_52(_4f);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_4f);
}
}
};
this.unlisten=function(){
var _53=arguments[0];
var _54=arguments[1];
var _55=_53[_54]?_53[_54].listenReg:null;
var _56=null;
if(!_55){
return false;
}
for(var i=0;i<_55.after.length;i++){
var ex=_55.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_55.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_55.after.splice(i,1);
}
}
}
_53[_54].listenReg=_55;
};
this.flush=function(){
for(var i=0;i<_47.length;i++){
var reg=_47[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_5b,obj,_5d){
if(!obj){
return;
}
if(!_48[_5b]){
_48[_5b]={};
_48[_5b].audience=[];
}else{
this.unsubscribe(_5b,obj);
}
_48[_5b].audience.push([obj,_5d]);
};
this.unsubscribe=function(_5e,obj){
if(!obj){
_48[_5e]=null;
}else{
if(_48[_5e]){
var aud=_48[_5e].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_63){
if(_48[pub]){
aud=_48[pub].audience;
for(var i=0;i<aud.length;i++){
var _65=aud[i][0];
var _66=aud[i][1];
_65[_66](_63);
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
var _6b=[];
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
},setFromDateObjProxy:function(dt,_73){
this.year=_73?dt.getUTCFullYear():dt.getFullYear();
this.month=_73?dt.getUTCMonth():dt.getMonth();
this.date=_73?dt.getUTCDate():dt.getDate();
},setAttribute:function(_74,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(this.year,this.month,this.date);
var _77=_74=="year"?"FullYear":_74.substr(0,1).toUpperCase()+_74.substr(1);
dt["set"+_77](n);
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
var _81=[];
for(var i=0;i<arguments.length;i++){
_81.push(arguments[i]);
}
if(typeof _81[_81.length-1]=="string"){
var tz=_81.pop();
}
for(var i=0;i<8;i++){
a[i]=_81[i]||0;
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
fleegix.date.XDateTime.prototype.setFromDateObjProxy=function(dt,_99){
this.year=_99?dt.getUTCFullYear():dt.getFullYear();
this.month=_99?dt.getUTCMonth():dt.getMonth();
this.date=_99?dt.getUTCDate():dt.getDate();
this.hours=_99?dt.getUTCHours():dt.getHours();
this.minutes=_99?dt.getUTCMinutes():dt.getMinutes();
this.seconds=_99?dt.getUTCSeconds():dt.getSeconds();
this.milliseconds=_99?dt.getUTCMilliseconds():dt.getMilliseconds();
};
fleegix.date.XDateTime.prototype.setAttribute=function(_9a,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var dt=new Date(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds);
var _9d=_9a=="year"?"FullYear":_9a.substr(0,1).toUpperCase()+_9a.substr(1);
dt["set"+_9d](n);
this.setFromDateObjProxy(dt);
};
fleegix.date.XDateTime.prototype.getUTCDateProxy=function(){
var dt=new Date(Date.UTC(this.year,this.month,this.date,this.hours,this.minutes,this.seconds,this.milliseconds));
dt.setUTCMinutes(dt.getUTCMinutes()+this.getTimezoneOffset());
return dt;
};
fleegix.date.XDateTime.prototype.setUTCAttribute=function(_9f,n){
if(isNaN(n)){
throw ("Units must be a number.");
}
var _a1=_9f=="year"?"FullYear":_9f.substr(0,1).toUpperCase()+_9f.substr(1);
var dt=this.getUTCDateProxy();
dt["setUTC"+_a1](n);
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
var _ad=of||0;
return jd+fr-_ad-(1/2);
};
fleegix.uri=new function(){
var _ae=this;
this.params={};
this.getParamHash=function(){
var _af=_ae.getQuery();
var arr=[];
var _b1=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_af){
_af+="&";
while(arr=pat.exec(_af)){
_b1[arr[1]]=arr[2];
}
}
return _b1;
};
this.getParam=function(_b4){
return _ae.params[_b4];
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
this.set=function(_b5,_b6,_b7){
var _b8=_b7||{};
var exp="";
var t=0;
var _bb=_b8.path||"/";
var _bc=_b8.days||0;
var _bd=_b8.hours||0;
var _be=_b8.minutes||0;
t+=_bc?_bc*24*60*60*1000:0;
t+=_bd?_bd*60*60*1000:0;
t+=_be?_be*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_b5+"="+_b6+exp+"; path="+_bb;
};
this.get=function(_c0){
var _c1=_c0+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_c1)==0){
return c.substring(_c1.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_c5,_c6){
var _c7={};
_c7.minutes=-1;
if(_c6){
_c7.path=_c6;
}
this.set(_c5,"",_c7);
};
};
fleegix.cookie.constructor=null;
if(typeof fleegix.date=="undefined"){
fleegix.date={};
}
fleegix.date.timezone=new function(){
this.zoneAreas={AFRICA:"africa",ANTARCTICA:"antarctica",ASIA:"asia",AUSTRALASIA:"australasia",BACKWARD:"backward",ETCETERA:"etcetera",EUROPE:"europe",NORTHAMERICA:"northamerica",PACIFICNEW:"pacificnew",SOUTHAMERICA:"southamerica",SYSTEMV:"systemv"};
var _c8=this;
var _c9={"jan":0,"feb":1,"mar":2,"apr":3,"may":4,"jun":5,"jul":6,"aug":7,"sep":8,"oct":9,"nov":10,"dec":11};
var _ca={"sun":0,"mon":1,"tue":2,"wed":3,"thu":4,"fri":5,"sat":6};
var _cb={"Africa":this.zoneAreas.AFRICA,"Indian":this.zoneAreas.AFRICA,"Antarctica":this.zoneAreas.ANTARCTICA,"Asia":this.zoneAreas.ASIA,"Pacific":this.zoneAreas.AUSTRALASIA,"Australia":this.zoneAreas.AUSTRALASIA,"Etc":this.zoneAreas.ETCETERA,"EST":this.zoneAreas.NORTHAMERICA,"MST":this.zoneAreas.NORTHAMERICA,"HST":this.zoneAreas.NORTHAMERICA,"EST5EDT":this.zoneAreas.NORTHAMERICA,"CST6CDT":this.zoneAreas.NORTHAMERICA,"MST7MDT":this.zoneAreas.NORTHAMERICA,"PST8PDT":this.zoneAreas.NORTHAMERICA,"America":function(){
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
var _cd={"Pacific/Honolulu":this.zoneAreas.NORTHAMERICA,"Pacific/Easter":this.zoneAreas.SOUTHAMERICA,"Pacific/Galapagos":this.zoneAreas.SOUTHAMERICA,"America/Danmarkshavn":this.zoneAreas.EUROPE,"America/Scoresbysund":this.zoneAreas.EUROPE,"America/Godthab":this.zoneAreas.EUROPE,"America/Thule":this.zoneAreas.EUROPE,"Indian/Kerguelen":this.zoneAreas.ANTARCTICA,"Indian/Chagos":this.zoneAreas.ASIA,"Indian/Maldives":this.zoneAreas.ASIA,"Indian/Christmas":this.zoneAreas.AUSTRALASIA,"Indian/Cocos":this.zoneAreas.AUSTRALASIA,"Europe/Nicosia":this.zoneAreas.ASIA,"Pacific/Easter":this.zoneAreas.SOUTHAMERICA,"Africa/Ceuta":this.zoneAreas.EUROPE,"Asia/Yekaterinburg":this.zoneAreas.EUROPE,"Asia/Omsk":this.zoneAreas.EUROPE,"Asia/Novosibirsk":this.zoneAreas.EUROPE,"Asia/Krasnoyarsk":this.zoneAreas.EUROPE,"Asia/Irkutsk":this.zoneAreas.EUROPE,"Asia/Yakutsk":this.zoneAreas.EUROPE,"Asia/Vladivostok":this.zoneAreas.EUROPE,"Asia/Sakhalin":this.zoneAreas.EUROPE,"Asia/Magadan":this.zoneAreas.EUROPE,"Asia/Kamchatka":this.zoneAreas.EUROPE,"Asia/Anadyr":this.zoneAreas.EUROPE,"Asia/Istanbul":this.zoneAreas.EUROPE};
var _ce={};
function parseTimeString(str){
var pat=/(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
var hms=str.match(pat);
hms[1]=parseInt(hms[1]);
hms[2]=hms[2]?parseInt(hms[2]):0;
hms[3]=hms[3]?parseInt(hms[3]):0;
return hms;
}
function getZone(dt,tz){
var _d4=tz;
var _d5=_c8.zones[_d4];
while(typeof (_d5)=="string"){
_d4=_d5;
_d5=_c8.zones[_d4];
if(!_d5){
alert("Cannot figure out the timezone "+_d4);
}
}
for(var i=0;i<_d5.length;i++){
var z=_d5[i];
if(!z[3]){
break;
}
var yea=parseInt(z[3]);
var mon=11;
var dat=31;
if(z[4]){
mon=_c9[z[4].substr(0,3).toLowerCase()];
dat=parseInt(z[5]);
}
var t=z[6]?z[6]:"23:59:59";
t=parseTimeString(t);
var d=Date.UTC(yea,mon,dat,t[1],t[2],t[3]);
if(dt.getTime()<d){
break;
}
}
if(i==_d5.length){
alert("No DST for "+_d4);
}else{
return _d5[i];
}
}
function getBasicOffset(z){
var off=parseTimeString(z[0]);
var adj=z[0].indexOf("-")==0?-1:1;
off=adj*(((off[1]*60+off[2])*60+off[3])*1000);
return -off/60/1000;
}
function getRule(dt,str){
var _e2=null;
var _e3=dt.getUTCFullYear();
var _e4=_c8.rules[str];
var _e5=[];
if(!_e4){
return null;
}
for(var i=0;i<_e4.length;i++){
r=_e4[i];
if((r[1]<(_e3-1))||(r[0]<(_e3-1)&&r[1]=="only")||(r[0]>_e3)){
continue;
}
var mon=_c9[r[3].substr(0,3).toLowerCase()];
var day=r[4];
if(isNaN(day)){
if(day.substr(0,4)=="last"){
var day=_ca[day.substr(4,3).toLowerCase()];
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon+1,1,t[1]-24,t[2],t[3]));
var _eb=d.getUTCDay();
var _ec=(day>_eb)?(day-_eb-7):(day-_eb);
d.setUTCDate(d.getUTCDate()+_ec);
if(dt<d){
if(r[0]<_e3){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_e5.push({"rule":r,"date":d});
}
}
}else{
_e5.push({"rule":r,"date":d});
}
}else{
day=_ca[day.substr(0,3).toLowerCase()];
if(day!="undefined"){
if(r[4].substr(3,2)==">="){
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,parseInt(r[4].substr(5)),t[1],t[2],t[3]));
var _eb=d.getUTCDay();
var _ec=(day<_eb)?(day-_eb+7):(day-_eb);
d.setUTCDate(d.getUTCDate()+_ec);
if(dt<d){
if(r[0]<_e3){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_e5.push({"rule":r,"date":d});
}
}
}else{
_e5.push({"rule":r,"date":d});
}
}else{
if(day.substr(3,2)=="<="){
var t=parseTimeString(r[5]);
var d=new Date(Date.UTC(dt.getUTCFullYear(),mon,parseInt(r[4].substr(5)),t[1],t[2],t[3]));
var _eb=d.getUTCDay();
var _ec=(day>_eb)?(day-_eb-7):(day-_eb);
d.setUTCDate(d.getUTCDate()+_ec);
if(dt<d){
if(r[0]<_e3){
d.setUTCFullYear(d.getUTCFullYear()-1);
if(dt>=d){
_e5.push({"rule":r,"date":d});
}
}
}else{
_e5.push({"rule":r,"date":d});
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
_e5.push({"rule":r,"date":d});
}
}
}
f=function(a,b){
return (a.date.getTime()>=b.date.getTime())?1:-1;
};
_e5.sort(f);
_e2=_e5.pop().rule;
return _e2;
}
function getAdjustedOffset(off,_f0){
var _f1=_f0[6];
var t=parseTimeString(_f1);
var adj=_f1.indexOf("-")==0?-1:1;
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
var _f7=str.split("\n");
var arr=[];
var _f9="";
var _fa=null;
var _fb=null;
for(var i=0;i<_f7.length;i++){
l=_f7[i];
if(l.match(/^\s/)){
l="Zone "+_fa+l;
}
l=l.split("#")[0];
if(l.length>3){
arr=l.split(/\s+/);
_f9=arr.shift();
switch(_f9){
case "Zone":
_fa=arr.shift();
if(!_c8.zones[_fa]){
_c8.zones[_fa]=[];
}
_c8.zones[_fa].push(arr);
break;
case "Rule":
_fb=arr.shift();
if(!_c8.rules[_fb]){
_c8.rules[_fb]=[];
}
_c8.rules[_fb].push(arr);
break;
case "Link":
if(_c8.zones[arr[1]]){
alert("Error with Link "+arr[1]);
}
_c8.zones[arr[1]]=arr[0];
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
var _ff=getZone(dt,tz);
var off=getBasicOffset(_ff);
var rule=getRule(dt,_ff[1]);
if(rule){
off=getAdjustedOffset(off,rule);
}
return off;
};
};

