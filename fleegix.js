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
fleegix.uri=new function(){
var _37=this;
this.params={};
this.getParamHash=function(str){
var q=str||_37.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _3d=arr[i].split("=");
var _3e=_3d[0];
var val=_3d[1];
if(typeof d[_3e]=="undefined"){
d[_3e]=val;
}else{
if(!(d[_3e] instanceof Array)){
var t=d[_3e];
d[_3e]=[];
d[_3e].push(t);
}
d[_3e].push(val);
}
}
}
return d;
};
this.getParam=function(_41,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_41];
}else{
p=this.params[_41];
}
return p;
};
this.setParam=function(_45,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_45+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_45+"="+val+arr[3]);
}
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
fleegix.popup=new function(){
var _4b=this;
this.win=null;
this.open=function(url,_4d){
var _4e=_4d||{};
var str="";
var _50={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _51 in _50){
str+=_51+"=";
str+=_4e[_51]?_4e[_51]:_50[_51];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_4b.win||_4b.win.closed){
_4b.win=window.open(url,"thePopupWin",str);
}else{
_4b.win.focus();
_4b.win.document.location=url;
}
};
this.close=function(){
if(_4b.win){
_4b.win.window.close();
_4b.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_4b.close();
};
};
fleegix.popup.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f);
var _57=o||{};
var str="";
var pat=null;
if(_57.stripTags){
pat=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_57.stripTags?v.replace(pat,""):v;
str+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_57.collapseMulti){
sep=",";
str+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_57.stripTags?v[j].replace(pat,""):v[j];
s=(!_57.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
str+=s+sep;
}
str=str.substr(0,str.length-1);
}
str+="&";
}else{
if(_57.includeEmpty){
str+=n+"=&";
}
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.toHash=function(f){
var h={};
function expandToArr(_61,val){
if(_61){
var r=null;
if(typeof _61=="string"){
r=[];
r.push(_61);
}else{
r=_61;
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
fleegix.form.restore=function(_66,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _6b=arr[i].split("=");
var _6c=_6b[0];
var val=_6b[1];
if(typeof d[_6c]=="undefined"){
d[_6c]=val;
}else{
if(!(d[_6c] instanceof Array)){
var t=d[_6c];
d[_6c]=[];
d[_6c].push(t);
}
d[_6c].push(val);
}
}
for(var i=0;i<_66.elements.length;i++){
elem=_66.elements[i];
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
return _66;
};
fleegix.form.Differ=function(){
this.count=0;
this.diffs={};
};
fleegix.form.Differ.prototype.hasKey=function(k){
return (typeof this.diffs[k]!="undefined");
};
fleegix.form.diff=function(_73,_74){
var hA=_73.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_73):_73;
var hB=_74.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_74):_74;
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
fleegix.event=new function(){
var _79=[];
var _7a={};
this.listen=function(){
var _7b=arguments[0];
var _7c=arguments[1];
var _7d=_7b[_7c]?_7b[_7c].listenReg:null;
if(!_7d){
_7d={};
_7d.orig={};
_7d.orig.obj=_7b,_7d.orig.methName=_7c;
if(_7b[_7c]){
_7d.orig.methCode=_7b[_7c];
}
_7d.after=[];
_7b[_7c]=function(){
var _7e=[];
for(var i=0;i<arguments.length;i++){
_7e.push(arguments[i]);
}
fleegix.event.exec(_7b[_7c].listenReg,_7e);
};
_7b[_7c].listenReg=_7d;
_79.push(_7b[_7c].listenReg);
}
if(typeof arguments[2]=="function"){
_7d.after.push(arguments[2]);
}else{
_7d.after.push([arguments[2],arguments[3]]);
}
_7b[_7c].listenReg=_7d;
};
this.exec=function(reg,_81){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_81);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_81[0]=_81[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _84=ex;
_84(_81);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_81);
}
}
};
this.unlisten=function(){
var _85=arguments[0];
var _86=arguments[1];
var _87=_85[_86]?_85[_86].listenReg:null;
var _88=null;
if(!_87){
return false;
}
for(var i=0;i<_87.after.length;i++){
var ex=_87.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_87.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_87.after.splice(i,1);
}
}
}
_85[_86].listenReg=_87;
};
this.flush=function(){
for(var i=0;i<_79.length;i++){
var reg=_79[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_8d,obj,_8f){
if(!obj){
return;
}
if(!_7a[_8d]){
_7a[_8d]={};
_7a[_8d].audience=[];
}else{
this.unsubscribe(_8d,obj);
}
_7a[_8d].audience.push([obj,_8f]);
};
this.unsubscribe=function(_90,obj){
if(!obj){
_7a[_90]=null;
}else{
if(_7a[_90]){
var aud=_7a[_90].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_95){
if(_7a[pub]){
aud=_7a[pub].audience;
for(var i=0;i<aud.length;i++){
var _97=aud[i][0];
var _98=aud[i][1];
_97[_98](_95);
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
this.set=function(_9b,_9c,_9d){
var _9e=_9d||{};
var exp="";
var t=0;
var _a1=_9e.path||"/";
var _a2=_9e.days||0;
var _a3=_9e.hours||0;
var _a4=_9e.minutes||0;
t+=_a2?_a2*24*60*60*1000:0;
t+=_a3?_a3*60*60*1000:0;
t+=_a4?_a4*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_9b+"="+_9c+exp+"; path="+_a1;
};
this.get=function(_a6){
var _a7=_a6+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_a7)==0){
return c.substring(_a7.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_ab,_ac){
var _ad={};
_ad.minutes=-1;
if(_ac){
_ad.path=_ac;
}
this.set(_ab,"",_ad);
};
};
fleegix.cookie.constructor=null;

