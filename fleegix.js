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
if(typeof _24[0]=="object"){
var _26=_24.shift();
for(var p in _26){
o[p]=_26[p];
}
}else{
o.responseFormat=_24.shift()||"text";
}
o.handleSuccess=_23;
o.url=url;
return this.doReq(o);
};
this.doPost=function(){
var o={};
var _29=null;
var _2a=Array.prototype.slice.apply(arguments);
if(typeof _2a[0]=="function"){
o.async=true;
_29=_2a.shift();
}else{
o.async=false;
}
var url=_2a.shift();
var _2c=_2a.shift();
if(typeof _2a[0]=="object"){
var _2d=_2a.shift();
for(var p in _2d){
o[p]=_2d[p];
}
}else{
o.responseFormat=_2a.shift()||"text";
}
o.handleSuccess=_29;
o.url=url;
o.dataPayload=_2c;
o.method="POST";
return this.doReq(o);
};
this.doReq=function(o){
var _30=o||{};
var req=new fleegix.xhr.Request();
var _32=null;
for(var p in _30){
req[p]=_30[p];
}
this.lastReqId++;
req.id=this.lastReqId;
if(req.async){
if(this.idleTransporters.length){
_32=this.idleTransporters.shift();
}else{
if(this.transporters.length<this.maxTransporters){
_32=spawnTransporter();
}
}
if(_32!=null){
this.processReq(_32,req);
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
var _36=this;
var _37=null;
var _38=null;
var url="";
var _3a=null;
function getResponseByType(){
switch(req.responseFormat){
case "text":
r=_38.responseText;
break;
case "xml":
r=_38.responseXML;
break;
case "object":
r=_38;
break;
}
return r;
}
if(req.async){
_37=t;
_38=this.transporters[_37];
this.processing[_37]=_38;
}else{
_38=t;
}
if(req.preventCache){
var dt=new Date.getTime();
url=req.url.indexOf("?")>-1?req.url+"&preventCache="+dt:req.url+"?preventCache="+dt;
}else{
url=req.url;
}
if(req.username&&req.password){
_38.open(req.method,url,req.async,req.username,req.password);
}else{
_38.open(req.method,url,req.async);
}
if(req.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_38.overrideMimeType(req.mimeType);
}
if(req.headers.length){
for(var i=0;i<req.headers.length;i++){
var _3d=req.headers[i].split(": ");
_38.setRequestHeader(_3d[i],_3d[1]);
}
}else{
if(req.method=="POST"){
_38.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_38.onreadystatechange=function(){
if(_38.readyState==4){
_3a=getResponseByType();
if(req.handleAll){
req.handleAll(_3a,req.id);
}else{
if(_38.status>199&&_38.status<300){
if(!req.handleSuccess){
throw ("No response handler defined "+"for this request");
return;
}else{
req.handleSuccess(_3a,req.id);
}
}else{
if(req.handleErr){
req.handleErr(_3a,req.id);
}else{
fleegix.xhr.handleErrDefault(_38);
}
}
}
if(req.async){
delete _36.processing[_37];
if(_36.requestQueue.length){
var _3e=_36.requestQueue.shift();
_36.processReq(_37,_3e);
}else{
_36.idleTransporters.push(_37);
}
}
}
};
_38.send(req.dataPayload);
if(!req.async){
_3a=getResponseByType();
return _3a;
}
};
this.abort=function(_3f){
var t=this.processing[_3f];
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
this.handleAll=null;
this.handleSuccess=null;
this.handleErr=null;
this.responseFormat="text",this.mimeType=null;
this.username="";
this.password="";
this.headers=[];
this.preventCache=false;
this.uber=false;
};
fleegix.xhr.Request.prototype.setRequestHeader=function(_41,_42){
this.headers.push(_41+": "+_42);
};
fleegix.xhr.handleErrDefault=function(r){
var _44;
try{
_44=window.open("","errorWin");
_44.document.body.innerHTML=r.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f);
var _48=o||{};
var str="";
var pat=null;
if(_48.stripTags){
pat=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_48.stripTags?v.replace(pat,""):v;
str+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_48.collapseMulti){
sep=",";
str+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_48.stripTags?v[j].replace(pat,""):v[j];
s=(!_48.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
str+=s+sep;
}
str=str.substr(0,str.length-1);
}
str+="&";
}else{
if(_48.includeEmpty){
str+=n+"=&";
}
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.toHash=function(f){
var h={};
function expandToArr(_52,val){
if(_52){
var r=null;
if(typeof _52=="string"){
r=[];
r.push(_52);
}else{
r=_52;
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
fleegix.form.restore=function(_57,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _5c=arr[i].split("=");
var _5d=_5c[0];
var val=_5c[1];
if(typeof d[_5d]=="undefined"){
d[_5d]=val;
}else{
if(!(d[_5d] instanceof Array)){
var t=d[_5d];
d[_5d]=[];
d[_5d].push(t);
}
d[_5d].push(val);
}
}
for(var i=0;i<_57.elements.length;i++){
elem=_57.elements[i];
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
return _57;
};
fleegix.form.Differ=function(){
this.count=0;
this.diffs={};
};
fleegix.form.Differ.prototype.hasKey=function(k){
return (typeof this.diffs[k]!="undefined");
};
fleegix.form.diff=function(_64,_65){
var hA=_64.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_64):_64;
var hB=_65.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_65):_65;
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
var _6a=this;
this.win=null;
this.open=function(url,_6c){
var _6d=_6c||{};
var str="";
var _6f={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _70 in _6f){
str+=_70+"=";
str+=_6d[_70]?_6d[_70]:_6f[_70];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_6a.win||_6a.win.closed){
_6a.win=window.open(url,"thePopupWin",str);
}else{
_6a.win.focus();
_6a.win.document.location=url;
}
};
this.close=function(){
if(_6a.win){
_6a.win.window.close();
_6a.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_6a.close();
};
};
fleegix.popup.constructor=null;
fleegix.event=new function(){
var _73=[];
var _74={};
this.listen=function(){
var _75=arguments[0];
var _76=arguments[1];
var _77=_75[_76]?_75[_76].listenReg:null;
if(!_77){
_77={};
_77.orig={};
_77.orig.obj=_75,_77.orig.methName=_76;
if(_75[_76]){
_77.orig.methCode=_75[_76];
}
_77.after=[];
_75[_76]=function(){
var _78=[];
for(var i=0;i<arguments.length;i++){
_78.push(arguments[i]);
}
fleegix.event.exec(_75[_76].listenReg,_78);
};
_75[_76].listenReg=_77;
_73.push(_75[_76].listenReg);
}
if(typeof arguments[2]=="function"){
_77.after.push(arguments[2]);
}else{
_77.after.push([arguments[2],arguments[3]]);
}
_75[_76].listenReg=_77;
};
this.exec=function(reg,_7b){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_7b);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_7b[0]=_7b[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _7e=ex;
_7e(_7b);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_7b);
}
}
};
this.unlisten=function(){
var _7f=arguments[0];
var _80=arguments[1];
var _81=_7f[_80]?_7f[_80].listenReg:null;
var _82=null;
if(!_81){
return false;
}
for(var i=0;i<_81.after.length;i++){
var ex=_81.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_81.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_81.after.splice(i,1);
}
}
}
_7f[_80].listenReg=_81;
};
this.flush=function(){
for(var i=0;i<_73.length;i++){
var reg=_73[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_87,obj,_89){
if(!obj){
return;
}
if(!_74[_87]){
_74[_87]={};
_74[_87].audience=[];
}else{
this.unsubscribe(_87,obj);
}
_74[_87].audience.push([obj,_89]);
};
this.unsubscribe=function(_8a,obj){
if(!obj){
_74[_8a]=null;
}else{
if(_74[_8a]){
var aud=_74[_8a].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_8f){
if(_74[pub]){
aud=_74[pub].audience;
for(var i=0;i<aud.length;i++){
var _91=aud[i][0];
var _92=aud[i][1];
_91[_92](_8f);
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
var _95=this;
this.params={};
this.getParamHash=function(str){
var q=str||_95.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _9b=arr[i].split("=");
var _9c=_9b[0];
var val=_9b[1];
if(typeof d[_9c]=="undefined"){
d[_9c]=val;
}else{
if(!(d[_9c] instanceof Array)){
var t=d[_9c];
d[_9c]=[];
d[_9c].push(t);
}
d[_9c].push(val);
}
}
}
return d;
};
this.getParam=function(_9f,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_9f];
}else{
p=this.params[_9f];
}
return p;
};
this.setParam=function(_a3,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_a3+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_a3+"="+val+arr[3]);
}else{
ret=str+"&"+_a3+"="+val;
}
}else{
ret=_a3+"="+val;
}
return ret;
};
this.getQuery=function(s){
var l=s?s:location.href;
return l.split("?")[1];
};
this.getBase=function(s){
var l=s?s:location.href;
return l.split("?")[0];
};
this.params=this.getParamHash();
};
fleegix.uri.constructor=null;
fleegix.ui=new function(){
this.getViewportWidth=function(){
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
this.getWindowWidth=this.getViewportWidth;
this.getViewportHeight=function(){
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
this.getWindowHeight=this.getViewportHeight;
this.setCSSProp=function(_ad,p,v){
if(p=="opacity"){
if(document.all){
_ad.style.filter="alpha(opacity="+v+")";
}else{
var d=v/100;
_ad.style.opacity=d;
}
}else{
_ad.style[p]=document.all?parseInt(v)+"px":v+"px";
}
return true;
};
this.fadeOut=function(_b1,_b2){
var o={startVal:100,endVal:0,prop:"opacity"};
for(p in _b2){
o[p]=_b2[p];
}
var f=new fleegix.ui.Fx(_b1,o);
};
this.fadeIn=function(_b5,_b6){
var o={startVal:0,endVal:100,prop:"opacity"};
for(p in _b6){
o[p]=_b6[p];
}
var f=new fleegix.ui.Fx(_b5,o);
};
};
fleegix.ui.Fx=function(_b9,_ba){
var _bb=this;
this.prop=_ba.prop;
this.duration=_ba.duration||500;
this.fps=30;
this.startVal=_ba.startVal;
this.endVal=_ba.endVal;
this.currVal=this.startVal;
this.startTime=new Date().getTime();
this.timeSpent=0;
this.doAfter=_ba.doAfter||null;
this.id=setInterval(function(){
_bb.doStep.apply(_bb,[_b9]);
},Math.round(1000/this.fps));
if(typeof _ba.doOnStart=="function"){
_ba.doOnStart();
}
};
fleegix.ui.Fx.prototype.doStep=function(_bc){
var t=new Date().getTime();
if(t<(this.startTime+this.duration)){
this.timeSpent=t-this.startTime;
this.currVal=this.calcCurrVal();
fleegix.ui.setCSSProp(_bc,this.prop,this.currVal);
}else{
clearInterval(this.id);
if(typeof this.doAfterFinished=="function"){
this.doAfterFinished();
}
}
};
fleegix.ui.Fx.prototype.calcCurrVal=function(){
return this.trans(this.timeSpent,this.startVal,(this.endVal-this.startVal),this.duration);
};
fleegix.ui.Fx.prototype.trans=function(_be,_bf,_c0,_c1){
return _c0*(_be/_c1)+_bf;
};
fleegix.cookie=new function(){
this.set=function(_c2,_c3,_c4){
var _c5=_c4||{};
var exp="";
var t=0;
if(typeof _c4=="object"){
var _c8=_c5.path||"/";
var _c9=_c5.days||0;
var _ca=_c5.hours||0;
var _cb=_c5.minutes||0;
}else{
var _c8=optsParam||"/";
}
t+=_c9?_c9*24*60*60*1000:0;
t+=_ca?_ca*60*60*1000:0;
t+=_cb?_cb*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_c2+"="+_c3+exp+"; path="+_c8;
};
this.get=function(_cd){
var _ce=_cd+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_ce)==0){
return c.substring(_ce.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_d2,_d3){
var _d4={};
_d4.minutes=-1;
if(_d3){
_d4.path=_d3;
}
this.set(_d2,"",_d4);
};
};
fleegix.cookie.constructor=null;

