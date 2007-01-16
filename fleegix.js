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
function spawnTransporter(_1d){
var i=0;
var t=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
var _20=null;
while(!_20&&(i<t.length)){
try{
_20=t[i++]();
}
catch(e){
}
}
if(_20){
if(_1d){
return _20;
}else{
fleegix.xhr.transporters.push(_20);
var _21=fleegix.xhr.transporters.length-1;
return _21;
}
}else{
throw ("Could not create XMLHttpRequest object.");
}
}
this.transporters=[];
this.maxTransporters=document.all?500:5;
this.lastReqId=0;
this.requestQueue=[];
this.idleTransporters=[];
this.processing={};
this.syncTransporter=spawnTransporter(true);
this.doGet=function(){
var o={};
var _23=null;
var _24=Array.prototype.slice.apply(arguments);
if(typeof _24[0]=="function"){
o.async=true;
_23=_24.shift();
}else{
o.async=false;
}
var url=_24.shift();
var _26=_24.shift()||"text";
o.handleResp=_23;
o.url=url;
o.responseFormat=_26;
return this.doReq(o);
};
this.doPost=function(){
var o={};
var _28=null;
var _29=Array.prototype.slice.apply(arguments);
if(typeof _29[0]=="function"){
o.async=true;
_28=_29.shift();
}else{
o.async=false;
}
var url=_29.shift();
var _2b=_29.shift();
var _2c=_29.shift()||"text";
o.handleResp=_28;
o.url=url;
o.dataPayload=_2b;
o.responseFormat=_2c;
o.method="POST";
return this.doReq(o);
};
this.doReq=function(o){
var _2e=o||{};
var req=new fleegix.xhr.Request();
var _30=null;
for(var p in _2e){
req[p]=_2e[p];
}
this.lastReqId++;
req.id=this.lastReqId;
if(req.async){
if(this.idleTransporters.length){
_30=this.idleTransporters.shift();
}else{
if(this.transporters.length<this.maxTransporters){
_30=spawnTransporter();
}
}
if(_30!=null){
this.processReq(_30,req);
}else{
if(req.uber){
this.requestQueue.unshift(req);
}else{
this.requestQueue.push(req);
}
}
return req.id;
}else{
return this.processReq(this.syncTransporter,req);
}
};
this.processReq=function(t,req){
var _34=null;
var _35=null;
var _36=this;
var _37=null;
function handleErrDefault(r){
var _39;
try{
_39=window.open("","errorWin");
_39.document.body.innerHTML=r.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
}
function getResponseByType(){
switch(req.responseFormat){
case "text":
r=_35.responseText;
break;
case "xml":
r=_35.responseXML;
break;
case "object":
r=_35;
break;
}
return r;
}
if(req.async){
_34=t;
_35=this.transporters[_34];
this.processing[_34]=_35;
}else{
_35=t;
}
if(req.username&&req.password){
_35.open(req.method,req.url,req.async,req.username,req.password);
}else{
_35.open(req.method,req.url,req.async);
}
if(req.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_35.overrideMimeType(req.mimeType);
}
if(req.headers.length){
for(var i=0;i<req.headers.length;i++){
var _3b=req.headers[i].split(": ");
_35.setRequestHeader(_3b[i],_3b[1]);
}
}else{
if(req.method=="POST"){
_35.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_35.onreadystatechange=function(){
if(_35.readyState==4){
_37=getResponseByType();
if(_35.status>199&&_35.status<300){
if(req.async){
if(!req.handleResp){
throw ("No response handler defined "+"for this request");
return;
}else{
req.handleResp(_37,req.id);
}
}
}else{
if(req.handleErr){
req.handleErr(_37);
}else{
handleErrDefault(_35);
}
}
if(req.async){
delete _36.processing[_34];
if(_36.requestQueue.length){
var _3c=_36.requestQueue.shift();
_36.processReq(_34,_3c);
}else{
_36.idleTransporters.push(_34);
}
}
}
};
_35.send(req.dataPayload);
if(!req.async){
_37=getResponseByType();
return _37;
}
};
this.abort=function(_3d){
var t=this.processing[_3d];
if(t){
t.onreadystatechange=function(){
};
t.abort();
return true;
}else{
return false;
}
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
this.uber=false;
};
fleegix.xhr.Request.prototype.setRequestHeader=function(_3f,_40){
this.headers.push(_3f+": "+_40);
};
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f);
var _44=o||{};
var str="";
var pat=null;
if(_44.stripTags){
pat=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_44.stripTags?v.replace(pat,""):v;
str+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_44.collapseMulti){
sep=",";
str+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_44.stripTags?v[j].replace(pat,""):v[j];
s=(!_44.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
str+=s+sep;
}
str=str.substr(0,str.length-1);
}
str+="&";
}else{
if(_44.includeEmpty){
str+=n+"=&";
}
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.toHash=function(f){
var h={};
function expandToArr(_4e,val){
if(_4e){
var r=null;
if(typeof _4e=="string"){
r=[];
r.push(_4e);
}else{
r=_4e;
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
fleegix.form.restore=function(_53,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _58=arr[i].split("=");
var _59=_58[0];
var val=_58[1];
if(typeof d[_59]=="undefined"){
d[_59]=val;
}else{
if(!(d[_59] instanceof Array)){
var t=d[_59];
d[_59]=[];
d[_59].push(t);
}
d[_59].push(val);
}
}
for(var i=0;i<_53.elements.length;i++){
elem=_53.elements[i];
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
return _53;
};
fleegix.form.Differ=function(){
this.count=0;
this.diffs={};
};
fleegix.form.Differ.prototype.hasKey=function(k){
return (typeof this.diffs[k]!="undefined");
};
fleegix.form.diff=function(_60,_61){
var hA=_60.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_60):_60;
var hB=_61.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_61):_61;
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
var _66=this;
this.win=null;
this.open=function(url,_68){
var _69=_68||{};
var str="";
var _6b={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _6c in _6b){
str+=_6c+"=";
str+=_69[_6c]?_69[_6c]:_6b[_6c];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_66.win||_66.win.closed){
_66.win=window.open(url,"thePopupWin",str);
}else{
_66.win.focus();
_66.win.document.location=url;
}
};
this.close=function(){
if(_66.win){
_66.win.window.close();
_66.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_66.close();
};
};
fleegix.popup.constructor=null;
fleegix.event=new function(){
var _6f=[];
var _70={};
this.listen=function(){
var _71=arguments[0];
var _72=arguments[1];
var _73=_71[_72]?_71[_72].listenReg:null;
if(!_73){
_73={};
_73.orig={};
_73.orig.obj=_71,_73.orig.methName=_72;
if(_71[_72]){
_73.orig.methCode=_71[_72];
}
_73.after=[];
_71[_72]=function(){
var _74=[];
for(var i=0;i<arguments.length;i++){
_74.push(arguments[i]);
}
fleegix.event.exec(_71[_72].listenReg,_74);
};
_71[_72].listenReg=_73;
_6f.push(_71[_72].listenReg);
}
if(typeof arguments[2]=="function"){
_73.after.push(arguments[2]);
}else{
_73.after.push([arguments[2],arguments[3]]);
}
_71[_72].listenReg=_73;
};
this.exec=function(reg,_77){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_77);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_77[0]=_77[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _7a=ex;
_7a(_77);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_77);
}
}
};
this.unlisten=function(){
var _7b=arguments[0];
var _7c=arguments[1];
var _7d=_7b[_7c]?_7b[_7c].listenReg:null;
var _7e=null;
if(!_7d){
return false;
}
for(var i=0;i<_7d.after.length;i++){
var ex=_7d.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_7d.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_7d.after.splice(i,1);
}
}
}
_7b[_7c].listenReg=_7d;
};
this.flush=function(){
for(var i=0;i<_6f.length;i++){
var reg=_6f[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_83,obj,_85){
if(!obj){
return;
}
if(!_70[_83]){
_70[_83]={};
_70[_83].audience=[];
}else{
this.unsubscribe(_83,obj);
}
_70[_83].audience.push([obj,_85]);
};
this.unsubscribe=function(_86,obj){
if(!obj){
_70[_86]=null;
}else{
if(_70[_86]){
var aud=_70[_86].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_8b){
if(_70[pub]){
aud=_70[pub].audience;
for(var i=0;i<aud.length;i++){
var _8d=aud[i][0];
var _8e=aud[i][1];
_8d[_8e](_8b);
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
fleegix.uri=new function(){
var _91=this;
this.params={};
this.getParamHash=function(str){
var q=str||_91.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _97=arr[i].split("=");
var _98=_97[0];
var val=_97[1];
if(typeof d[_98]=="undefined"){
d[_98]=val;
}else{
if(!(d[_98] instanceof Array)){
var t=d[_98];
d[_98]=[];
d[_98].push(t);
}
d[_98].push(val);
}
}
}
return d;
};
this.getParam=function(_9b,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_9b];
}else{
p=this.params[_9b];
}
return p;
};
this.setParam=function(_9f,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_9f+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_9f+"="+val+arr[3]);
}
}else{
ret=_9f+"="+val;
}
return ret;
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
this.set=function(_a5,_a6,_a7){
var _a8=_a7||{};
var exp="";
var t=0;
var _ab=_a8.path||"/";
var _ac=_a8.days||0;
var _ad=_a8.hours||0;
var _ae=_a8.minutes||0;
t+=_ac?_ac*24*60*60*1000:0;
t+=_ad?_ad*60*60*1000:0;
t+=_ae?_ae*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_a5+"="+_a6+exp+"; path="+_ab;
};
this.get=function(_b0){
var _b1=_b0+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_b1)==0){
return c.substring(_b1.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_b5,_b6){
var _b7={};
_b7.minutes=-1;
if(_b6){
_b7.path=_b6;
}
this.set(_b5,"",_b7);
};
};
fleegix.cookie.constructor=null;

