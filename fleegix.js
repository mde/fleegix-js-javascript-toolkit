if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.dom=new function(){
var _1=function(s){
if(document.all){
if(document.documentElement&&document.documentElement["client"+s]){
return document.documentElement["client"+s];
}else{
return document.body["client"+s];
}
}else{
return window["inner"+s];
}
};
this.getViewportWidth=function(){
return _1("Width");
};
this.getViewportHeight=function(){
return _1("Height");
};
this.center=function(_3){
var nW=_3.offsetWidth;
var nH=_3.offsetHeight;
var vW=fleegix.dom.getViewportWidth();
var vH=fleegix.dom.getViewportHeight();
_3.style.left=parseInt((vW/2)-(nW/2))+"px";
_3.style.top=parseInt((vH/2)-(nH/2))+"px";
return true;
};
};
fleegix.popup=new function(){
var _8=this;
this.win=null;
this.open=function(_9,_a){
var _b=_a||{};
var _c="";
var _d={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _e in _d){
_c+=_e+"=";
_c+=_b[_e]?_b[_e]:_d[_e];
_c+=",";
}
var _f=_c.length;
if(_f){
_c=_c.substr(0,_f-1);
}
if(!_8.win||_8.win.closed){
_8.win=window.open(_9,"thePopupWin",_c);
}else{
_8.win.focus();
_8.win.document.location=_9;
}
};
this.close=function(){
if(_8.win){
_8.win.window.close();
_8.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_8.close();
};
};
fleegix.popup.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f,o);
var _14=o||{};
var str="";
var pat=null;
if(_14.stripTags){
pat=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_14.stripTags?v.replace(pat,""):v;
str+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_14.collapseMulti){
sep=",";
str+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_14.stripTags?v[j].replace(pat,""):v[j];
s=(!_14.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
str+=s+sep;
}
str=str.substr(0,str.length-1);
}
str+="&";
}else{
if(_14.includeEmpty){
str+=n+"=&";
}
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.toHash=function(f,o){
var _1e=o||{};
var h={};
function expandToArr(_20,val){
if(_20){
var r=null;
if(typeof _20=="string"){
r=[];
r.push(_20);
}else{
r=_20;
}
r.push(val);
return r;
}else{
return val;
}
}
for(i=0;i<f.elements.length;i++){
elem=f.elements[i];
if(elem.name){
var st=elem.name.indexOf("[");
var sp=elem.name.indexOf("]");
var sb="";
var en="";
if(_1e.hierarchical&&(st>0)&&(sp>2)){
sb=elem.name.substring(0,st);
en=elem.name.substring(st+1,sp);
if(typeof h[sb]=="undefined"){
h[sb]={};
}
var c=h[sb];
var n=en;
}else{
var c=h;
var n=elem.name;
}
switch(elem.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
c[n]=elem.value||null;
break;
case "select-multiple":
c[n]=null;
for(var j=0;j<elem.options.length;j++){
var o=elem.options[j];
if(o.selected){
c[n]=expandToArr(c[n],o.value);
}
}
break;
case "radio":
if(typeof c[n]=="undefined"){
c[n]=null;
}
if(elem.checked){
c[n]=elem.value;
}
break;
case "checkbox":
if(typeof c[n]=="undefined"){
c[n]=null;
}
if(elem.checked){
c[n]=expandToArr(c[n],elem.value);
}
break;
case "submit":
case "reset":
case "file":
case "image":
case "button":
if(_1e.pedantic){
c[n]=elem.value||null;
}
break;
}
}
}
return h;
};
fleegix.form.restore=function(_2a,str,o){
var _2d=o||{};
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _31=arr[i].split("=");
var _32=_31[0];
var val=_31[1];
if(typeof d[_32]=="undefined"){
d[_32]=val;
}else{
if(!(d[_32] instanceof Array)){
var t=d[_32];
d[_32]=[];
d[_32].push(t);
}
d[_32].push(val);
}
}
for(var i=0;i<_2a.elements.length;i++){
elem=_2a.elements[i];
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
case "submit":
case "reset":
case "file":
case "image":
case "button":
if(_2d.pedantic){
elem.value=decodeURIComponent(val);
}
break;
}
}
}
return _2a;
};
fleegix.form.diff=function(_38,_39,_3a){
var o=_3a||{};
var _3c=_38.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_38):_38;
var _3d=_39.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_39):_39;
var _3e=[];
var _3f=0;
function addDiff(n,hA,hB,_43){
if(!_3e[n]){
_3f++;
_3e[n]=_43?[hB[n],hA[n]]:[hA[n],hB[n]];
}
}
function diffSweep(hA,hB,_46){
for(n in hA){
if(typeof hB[n]=="undefined"){
if(o.intersectionOnly){
continue;
}
addDiff(n,hA,hB,_46);
}else{
v=hA[n];
if(v instanceof Array){
if(!hB[n]||(hB[n].toString()!=v.toString())){
addDiff(n,hA,hB,_46);
}
}else{
if(hB[n]!=v){
addDiff(n,hA,hB,_46);
}
}
}
}
}
diffSweep(_3c,_3d,false);
diffSweep(_3d,_3c,true);
return {count:_3f,diffs:_3e};
};
fleegix.xhr=new function(){
var _47=null;
function spawnTransporter(_48){
var i=0;
var t=["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","Microsoft.XMLHTTP"];
var _4b=null;
if(window.XMLHttpRequest!=null){
_4b=new XMLHttpRequest();
}else{
if(window.ActiveXObject!=null){
if(_47){
_4b=new ActiveXObject(_47);
}else{
for(var i=0;i<t.length;i++){
try{
_4b=new ActiveXObject(t[i]);
_47=t[i];
break;
}
catch(e){
}
}
}
}
}
if(_4b){
if(_48){
return _4b;
}else{
fleegix.xhr.transporters.push(_4b);
var _4c=fleegix.xhr.transporters.length-1;
return _4c;
}
}else{
throw ("Could not create XMLHttpRequest object.");
}
}
this.transporters=[];
this.maxTransporters=5;
this.lastReqId=0;
this.requestQueue=[];
this.idleTransporters=[];
this.processingMap={};
this.processingArray=[];
this.syncTransporter=spawnTransporter(true);
this.syncRequest=null;
this.debug=false;
this.processingWatcherId=null;
this.doGet=function(){
var o={};
var _4e=null;
var _4f=Array.prototype.slice.apply(arguments);
if(typeof _4f[0]=="function"){
o.async=true;
_4e=_4f.shift();
}else{
o.async=false;
}
var url=_4f.shift();
if(typeof _4f[0]=="object"){
var _51=_4f.shift();
for(var p in _51){
o[p]=_51[p];
}
}else{
o.responseFormat=_4f.shift()||"text";
}
o.handleSuccess=_4e;
o.url=url;
return this.doReq(o);
};
this.doPost=function(){
var o={};
var _54=null;
var _55=Array.prototype.slice.apply(arguments);
if(typeof _55[0]=="function"){
o.async=true;
_54=_55.shift();
}else{
o.async=false;
}
var url=_55.shift();
var _57=_55.shift();
if(typeof _55[0]=="object"){
var _58=_55.shift();
for(var p in _58){
o[p]=_58[p];
}
}else{
o.responseFormat=_55.shift()||"text";
}
o.handleSuccess=_54;
o.url=url;
o.dataPayload=_57;
o.method="POST";
return this.doReq(o);
};
this.doReq=function(o){
var _5b=o||{};
var req=new fleegix.xhr.Request();
var _5d=null;
for(var p in _5b){
req[p]=_5b[p];
}
req.id=this.lastReqId;
this.lastReqId++;
if(req.async){
if(this.idleTransporters.length){
_5d=this.idleTransporters.shift();
}else{
if(this.transporters.length<this.maxTransporters){
_5d=spawnTransporter();
}
}
if(_5d!=null){
this.processReq(req,_5d);
}else{
if(req.uber){
this.requestQueue.unshift(req);
}else{
this.requestQueue.push(req);
}
}
return req.id;
}else{
return this.processReq(req);
}
};
this.processReq=function(req,t){
var _61=this;
var _62=null;
var _63=null;
var url="";
var _65=null;
if(req.async){
_62=t;
_63=this.transporters[_62];
this.processingMap[req.id]=req;
this.processingArray.unshift(req);
req.transporterId=_62;
}else{
_63=this.syncTransporter;
this.syncRequest=req;
}
if(req.preventCache){
var dt=new Date().getTime();
url=req.url.indexOf("?")>-1?req.url+"&preventCache="+dt:req.url+"?preventCache="+dt;
}else{
url=req.url;
}
if(document.all){
_63.abort();
}
if(req.username&&req.password){
_63.open(req.method,url,req.async,req.username,req.password);
}else{
_63.open(req.method,url,req.async);
}
if(req.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_63.overrideMimeType(req.mimeType);
}
if(req.headers.length){
for(var i=0;i<req.headers.length;i++){
var _68=req.headers[i].split(": ");
_63.setRequestHeader(_68[i],_68[1]);
}
}else{
if(req.method=="POST"){
_63.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_63.send(req.dataPayload);
if(this.processingWatcherId==null){
this.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}
if(!req.async){
var ret=this.handleResponse(_63,req);
this.syncRequest=null;
if(_61.processingArray.length){
_61.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}
return ret;
}
};
this.getResponseByType=function(_6a,req){
switch(req.responseFormat){
case "text":
r=_6a.responseText;
break;
case "xml":
r=_6a.responseXML;
break;
case "object":
r=_6a;
break;
}
return r;
};
this.watchProcessing=function(){
var _6c=fleegix.xhr;
var _6d=_6c.processingArray;
var d=new Date().getTime();
if(_6c.syncRequest!=null){
return;
}else{
for(var i=0;i<_6d.length;i++){
var req=_6d[i];
var _71=_6c.transporters[req.transporterId];
var _72=((d-req.startTime)>(req.timeoutSeconds*1000));
switch(true){
case (req.aborted||!_71.readyState):
_6c.processingArray.splice(i,1);
case _72:
_6c.processingArray.splice(i,1);
_6c.timeout(req);
break;
case (_71.readyState==4):
_6c.processingArray.splice(i,1);
_6c.handleResponse.apply(_6c,[_71,req]);
break;
}
}
}
clearTimeout(_6c.processingWatcherId);
if(_6c.processingArray.length){
_6c.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}else{
_6c.processingWatcherId=null;
}
};
this.abort=function(_73){
var r=this.processingMap[_73];
var t=this.transporters[r.transporterId];
if(t){
t.onreadystatechange=function(){
};
t.abort();
r.aborted=true;
this.cleanupAfterReq(r);
return true;
}else{
return false;
}
};
this.timeout=function(req){
if(fleegix.xhr.abort.apply(fleegix.xhr,[req.id])){
if(typeof req.handleTimeout=="function"){
req.handleTimeout();
}else{
alert("XMLHttpRequest to "+req.url+" timed out.");
}
}
};
this.handleResponse=function(_77,req){
var _79=this.getResponseByType(_77,req);
if(req.handleAll){
req.handleAll(_79,req.id);
}else{
try{
if((_77.status>199&&_77.status<300)||_77.status==304){
if(req.async){
if(!req.handleSuccess){
throw ("No response handler defined "+"for this request");
return;
}else{
req.handleSuccess(_79,req.id);
}
}else{
return _79;
}
}else{
if(!_77.status){
if(this.debug){
throw ("XMLHttpRequest HTTP status either zero or not set.");
}
}else{
if(req.handleErr){
req.handleErr(_79,req.id);
}else{
this.handleErrDefault(_77);
}
}
}
}
catch(e){
if(this.debug){
throw (e);
}
}
}
if(req.async){
this.cleanupAfterReq(req);
}
return true;
};
this.cleanupAfterReq=function(req){
delete this.processingMap[req.id];
if(this.requestQueue.length){
var _7b=this.requestQueue.shift();
_7b.startTime=new Date().getTime();
this.processReq(_7b,req.transporterId);
}else{
this.idleTransporters.push(req.transporterId);
}
};
this.handleErrDefault=function(r){
var _7d;
try{
_7d=window.open("","errorWin");
_7d.document.body.innerHTML=r.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
};
fleegix.xhr.constructor=null;
fleegix.xhr.Request=function(){
this.id=0;
this.transporterId=null;
this.url=null;
this.status=null;
this.statusText="";
this.method="GET";
this.async=true;
this.dataPayload=null;
this.readyState=null;
this.responseText=null;
this.responseXML=null;
this.handleSuccess=null;
this.handleErr=null;
this.handleAll=null;
this.handleTimeout=null;
this.responseFormat="text",this.mimeType=null;
this.username="";
this.password="";
this.headers=[];
this.preventCache=false;
this.startTime=new Date().getTime();
this.timeoutSeconds=30;
this.uber=false;
this.aborted=false;
};
fleegix.xhr.Request.prototype.setRequestHeader=function(_7e,_7f){
this.headers.push(_7e+": "+_7f);
};
fleegix.event=new function(){
var _80=[];
var _81={};
this.listen=function(){
var _82=arguments[0];
var _83=arguments[1];
if(!_82){
throw ("fleegix.listen called on an object that does not exist.");
}
if(_83=="onmousewheel"){
if(window.addEventListener&&typeof _82.onmousewheel=="undefined"){
_82.onmousewheel=null;
}
}
var _84=_82[_83]?_82[_83].listenReg:null;
if(!_84){
_84={};
_84.orig={};
_84.orig.obj=_82,_84.orig.methName=_83;
if(_82[_83]){
_84.orig.methCode=_82[_83];
}
_84.after=[];
_82[_83]=function(){
var reg=_82[_83].listenReg;
if(!reg){
throw ("Cannot execute handlers. Something"+" (likely another JavaScript library) has"+" removed the fleegix.event.listen handler registry.");
}
var _86=[];
for(var i=0;i<arguments.length;i++){
_86.push(arguments[i]);
}
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_86);
}
if(_82.attachEvent||_82.nodeType||_82.addEventListener){
var ev=null;
if(!_86.length){
try{
switch(true){
case !!(_82.ownerDocument):
ev=_82.ownerDocument.parentWindow.event;
break;
case !!(_82.documentElement):
ev=_82.documentElement.ownerDocument.parentWindow.event;
break;
case !!(_82.event):
ev=_82.event;
break;
default:
ev=window.event;
break;
}
}
catch(e){
ev=window.event;
}
}
if(ev){
if(typeof ev.target=="undefined"){
ev.target=ev.srcElement;
}
if(typeof ev.srcElement=="undefined"){
ev.srcElement=ev.target;
}
_86[0]=ev;
}
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
var f=null;
var c=null;
if(!ex.execObj){
f=ex.execMethod;
c=window;
}else{
f=ex.execObj[ex.execMethod];
c=ex.execObj;
}
if(typeof f!="function"){
throw (f+" is not an executable function.");
}else{
f.apply(c,_86);
}
ev=_86[0];
if(ex.stopPropagation){
if(ev.stopPropagation){
ev.stopPropagation();
}else{
ev.cancelBubble=true;
}
}
if(ex.preventDefault){
if(ev.preventDefault){
ev.preventDefault();
}else{
ev.returnValue=false;
}
}
}
};
_82[_83].listenReg=_84;
_80.push(_82[_83].listenReg);
if(_83=="onmousewheel"){
if(window.addEventListener){
_82.addEventListener("DOMMouseScroll",_82.onmousewheel,false);
}
}
}
var r={};
var o={};
if(typeof arguments[2]=="function"){
r.execMethod=arguments[2];
o=arguments[3]||{};
}else{
r.execObj=arguments[2];
r.execMethod=arguments[3];
o=arguments[4]||{};
}
for(var x in o){
r[x]=o[x];
}
_84.after.push(r);
_82[_83].listenReg=_84;
};
this.unlisten=function(){
var _8f=arguments[0];
var _90=arguments[1];
var _91=_8f[_90]?_8f[_90].listenReg:null;
var _92=null;
if(!_91){
return false;
}
for(var i=0;i<_91.after.length;i++){
var ex=_91.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_91.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_91.after.splice(i,1);
}
}
}
_8f[_90].listenReg=_91;
};
this.flush=function(){
for(var i=0;i<_80.length;i++){
var reg=_80[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_97,obj,_99){
if(!obj){
return;
}
if(!_81[_97]){
_81[_97]={};
_81[_97].audience=[];
}else{
this.unsubscribe(_97,obj);
}
_81[_97].audience.push([obj,_99]);
};
this.unsubscribe=function(_9a,obj){
if(!obj){
_81[_9a]=null;
}else{
if(_81[_9a]){
var aud=_81[_9a].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_9f){
if(_81[pub]){
aud=_81[pub].audience;
for(var i=0;i<aud.length;i++){
var _a1=aud[i][0];
var _a2=aud[i][1];
_a1[_a2](_9f);
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
fleegix.xml=new function(){
var _a5=this;
this.parse=function(_a6,_a7){
var _a8=new Array;
var _a9;
var _aa=[];
if(_a6.hasChildNodes()){
_a8=_a6.getElementsByTagName(_a7);
_a9=_a8[0];
for(var j=0;j<_a8.length;j++){
_a9=_a8[j];
_aa[j]=_a5.xmlElem2Obj(_a8[j]);
}
}
return _aa;
};
this.xmlElem2Obj=function(_ac){
var ret=new Object();
_a5.setPropertiesRecursive(ret,_ac);
return ret;
};
this.setPropertiesRecursive=function(obj,_af){
if(_af.childNodes.length>0){
for(var i=0;i<_af.childNodes.length;i++){
if(_af.childNodes[i].nodeType==1&&_af.childNodes[i].firstChild){
if(_af.childNodes[i].childNodes.length==1){
obj[_af.childNodes[i].tagName]=_af.childNodes[i].firstChild.nodeValue;
}else{
obj[_af.childNodes[i].tagName]=[];
_a5.setPropertiesRecursive(obj[_af.childNodes[i].tagName],_af.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_b1){
var _b2=_b1;
for(var _b3 in _b2){
_b2[_b3]=cleanText(_b2[_b3]);
}
return _b2;
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
var _b7=str;
_b7=_b7.replace(/</g,"&lt;");
_b7=_b7.replace(/>/g,"&gt;");
return "<pre>"+_b7+"</pre>";
};
this.getXMLDocElem=function(_b8,_b9){
var _ba=[];
var _bb=null;
if(document.all){
var _bc=document.getElementById(_b8).innerHTML;
var _bd=new ActiveXObject("Microsoft.XMLDOM");
_bd.loadXML(_bc);
_bb=_bd.documentElement;
}else{
_ba=window.document.body.getElementsByTagName(_b9);
_bb=_ba[0];
}
return _bb;
};
};
fleegix.xml.constructor=null;
fleegix.uri=new function(){
var _be=this;
this.params={};
this.getParamHash=function(str){
var q=str||_be.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _c4=arr[i].split("=");
var _c5=_c4[0];
var val=_c4[1];
if(typeof d[_c5]=="undefined"){
d[_c5]=val;
}else{
if(!(d[_c5] instanceof Array)){
var t=d[_c5];
d[_c5]=[];
d[_c5].push(t);
}
d[_c5].push(val);
}
}
}
return d;
};
this.getParam=function(_c8,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_c8];
}else{
p=this.params[_c8];
}
return p;
};
this.setParam=function(_cc,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_cc+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_cc+"="+val+arr[3]);
}else{
ret=str+"&"+_cc+"="+val;
}
}else{
ret=_cc+"="+val;
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
fleegix.fx=new function(){
this.fadeOut=function(_d6,_d7){
return doFade(_d6,_d7,"out");
};
this.fadeIn=function(_d8,_d9){
return doFade(_d8,_d9,"in");
};
this.blindUp=function(_da,_db){
var o=_db||{};
o.blindType=o.blindType||"height";
return doBlind(_da,o,"up");
};
this.blindDown=function(_dd,_de){
var o=_de||{};
o.blindType=o.blindType||"height";
return doBlind(_dd,o,"down");
};
this.setCSSProp=function(_e0,p,v){
if(p=="opacity"){
if(document.all){
_e0.style.filter="alpha(opacity="+v+")";
}else{
var d=v/100;
_e0.style.opacity=d;
}
}else{
if(p=="clip"||p.toLowerCase().indexOf("color")>-1){
_e0.style[p]=v;
}else{
_e0.style[p]=document.all?parseInt(v)+"px":v+"px";
}
}
return true;
};
this.hexPat=/^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
this.hex2rgb=function(str,_e5){
var rgb=[];
var h=str.match(this.hexPat);
if(h){
for(var i=1;i<h.length;i++){
var s=h[i];
s=s.length==1?s+s:s;
rgb.push(parseInt(s,16));
}
return _e5?rgb:"rgb("+rgb.join()+")";
}else{
throw ("\""+str+"\" not a valid hex value.");
}
};
this.hsv2rgb=function(h,s,v,_ed){
var rgb=[];
if(h==360){
h=0;
}
s/=100;
v/=100;
var r=null;
var g=null;
var b=null;
if(s==0){
r=v;
g=v;
b=v;
}else{
var _f2=h/60;
var i=Math.floor(_f2);
var f=_f2-i;
var p=v*(1-s);
var q=v*(1-(s*f));
var t=v*(1-(s*(1-f)));
switch(i){
case 0:
r=v;
g=t;
b=p;
break;
case 1:
r=q;
g=v;
b=p;
break;
case 2:
r=p;
g=v;
b=t;
break;
case 3:
r=p;
g=q;
b=v;
break;
case 4:
r=t;
g=p;
b=v;
break;
case 5:
r=v;
g=p;
b=q;
break;
}
}
r=Math.round(r*255);
g=Math.round(g*255);
b=Math.round(b*255);
rgb=[r,g,b];
return _ed?rgb:"rgb("+rgb.join()+")";
};
function doFade(_f8,_f9,dir){
var s=dir=="in"?0:100;
var e=dir=="in"?100:0;
var o={props:{opacity:[s,e]},trans:"lightEaseIn"};
for(p in _f9){
o[p]=_f9[p];
}
return new fleegix.fx.Effecter(_f8,o);
}
function doBlind(_fe,_ff,dir){
var o={};
var s=0;
var e=0;
if(_ff.blindType=="clip"){
s=dir=="down"?0:_fe.offsetHeight;
e=dir=="down"?_fe.offsetHeight:0;
s=[0,_fe.offsetWidth,s,0];
e=[0,_fe.offsetWidth,e,0];
o.props={clip:[s,e]};
}else{
if(dir=="down"){
if(_ff.endHeight){
e=_ff.endHeight;
}else{
_fe.style.height="";
var d=document.createElement("div");
d.position="absolute";
d.style.top="-9999999999px";
d.style.left="-9999999999px";
var par=_fe.parentNode;
var ch=par.removeChild(_fe);
d.appendChild(ch);
document.body.appendChild(d);
e=ch.offsetHeight;
_fe=d.removeChild(ch);
var x=document.body.removeChild(d);
_fe.style.height="0px";
par.appendChild(_fe);
}
s=0;
}else{
s=_fe.offsetHeight;
e=0;
}
o.props={height:[s,e]};
}
for(p in _ff){
o[p]=_ff[p];
}
o.trans="lightEaseIn";
return new fleegix.fx.Effecter(_fe,o);
}
};
fleegix.fx.Effecter=function(elem,opts){
var self=this;
this.props=opts.props;
this.trans=opts.trans||"lightEaseIn";
this.duration=opts.duration||500;
this.fps=30;
this.startTime=new Date().getTime();
this.timeSpent=0;
this.doOnStart=opts.doOnStart||null;
this.doAfterFinished=opts.doAfterFinished||null;
this.autoStart=opts.autoStart==false?false:true;
if(typeof this.transitions[this.trans]!="function"){
throw ("\""+this.trans+"\" is not a valid transition.");
}
this.start=function(){
self.id=setInterval(function(){
self.doStep.apply(self,[elem]);
},Math.round(1000/self.fps));
if(typeof opts.doOnStart=="function"){
self.doOnStart();
}
};
if(this.autoStart){
this.start();
}
return this;
};
fleegix.fx.Effecter.prototype.doStep=function(elem){
var t=new Date().getTime();
var p=this.props;
if(t<(this.startTime+this.duration)){
this.timeSpent=t-this.startTime;
for(var i in p){
fleegix.fx.setCSSProp(elem,i,this.calcCurrVal(i));
}
}else{
for(var i in p){
if(i=="clip"){
fleegix.fx.setCSSProp(elem,i,"rect("+p[i][1].join("px,")+"px)");
}else{
fleegix.fx.setCSSProp(elem,i,p[i][1]);
}
}
clearInterval(this.id);
if(typeof this.doAfterFinished=="function"){
this.doAfterFinished();
}
}
};
fleegix.fx.Effecter.prototype.calcCurrVal=function(key){
var _110=this.props[key][0];
var _111=this.props[key][1];
var _112=this.transitions[this.trans];
if(key.toLowerCase().indexOf("color")>-1){
var _113=fleegix.fx.hex2rgb(_110,true);
var _114=fleegix.fx.hex2rgb(_111,true);
var _115=[];
for(var i=0;i<_113.length;i++){
var s=_113[i];
var e=_114[i];
_115.push(parseInt(_112(this.timeSpent,s,(e-s),this.duration)));
}
return "rgb("+_115.join()+")";
}else{
if(key=="clip"){
var _113=_110;
var _114=_111;
var _115=[];
for(var i=0;i<_113.length;i++){
var s=_113[i];
var e=_114[i];
_115.push(parseInt(_112(this.timeSpent,s,(e-s),this.duration)));
}
return "rect("+_115.join("px,")+"px)";
}else{
return _112(this.timeSpent,_110,(_111-_110),this.duration);
}
}
};
fleegix.fx.Effecter.prototype.transitions={linear:function(t,b,c,d){
return c*(t/d)+b;
},lightEaseIn:function(t,b,c,d){
return c*(t/=d)*t+b;
},lightEaseOut:function(t,b,c,d){
return -c*(t/=d)*(t-2)+b;
},lightEaseInOut:function(t,b,c,d){
if((t/=d/2)<1){
return c/2*t*t+b;
}
return -c/2*((--t)*(t-2)-1)+b;
},heavyEaseIn:function(t,b,c,d){
return c*(t/=d)*t*t+b;
},heavyEaseOut:function(t,b,c,d){
return c*((t=t/d-1)*t*t+1)+b;
},heavyEaseInOut:function(t,b,c,d){
if((t/=d/2)<1){
return c/2*t*t*t+b;
}
return c/2*((t-=2)*t*t+2)+b;
}};
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
if(typeof obj[i]=="undefined"){
str+="\"undefined\"";
}else{
str+=fleegix.json.serialize(obj[i]);
}
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
fleegix.cookie=new function(){
this.set=function(name,_139,_13a){
var opts=_13a||{};
var exp="";
var t=0;
if(typeof _13a=="object"){
var path=opts.path||"/";
var days=opts.days||0;
var _140=opts.hours||0;
var _141=opts.minutes||0;
}else{
var path=optsParam||"/";
}
t+=days?days*24*60*60*1000:0;
t+=_140?_140*60*60*1000:0;
t+=_141?_141*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=name+"="+_139+exp+"; path="+path;
};
this.get=function(name){
var _144=name+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_144)==0){
return c.substring(_144.length,c.length);
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
fleegix.css=new function(){
this.addClass=function(elem,s){
fleegix.css.removeClass(elem,s);
var c=elem.className;
elem.className=c+=" "+s;
};
this.removeClass=function(elem,s){
var c=elem.className;
var pat="\\b"+s+"\\b";
pat=new RegExp(pat);
c=c.replace(pat,"");
elem.className=c;
};
};

