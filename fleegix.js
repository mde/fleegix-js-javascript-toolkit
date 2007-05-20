if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.dom=new function(){
this.getViewportWidth=function(){
return fleegix.dom.getViewportMeasure("Width");
};
this.getViewportHeight=function(){
return fleegix.dom.getViewportMeasure("Height");
};
this.getViewportMeasure=function(s){
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
this.center=function(_2){
var nW=_2.offsetWidth;
var nH=_2.offsetHeight;
var vW=fleegix.dom.getViewportWidth();
var vH=fleegix.dom.getViewportHeight();
_2.style.left=parseInt((vW/2)-(nW/2))+"px";
_2.style.top=parseInt((vH/2)-(nH/2))+"px";
return true;
};
};
fleegix.popup=new function(){
var _7=this;
this.win=null;
this.open=function(_8,_9){
var _a=_9||{};
var _b="";
var _c={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _d in _c){
_b+=_d+"=";
_b+=_a[_d]?_a[_d]:_c[_d];
_b+=",";
}
var _e=_b.length;
if(_e){
_b=_b.substr(0,_e-1);
}
if(!_7.win||_7.win.closed){
_7.win=window.open(_8,"thePopupWin",_b);
}else{
_7.win.focus();
_7.win.document.location=_8;
}
};
this.close=function(){
if(_7.win){
_7.win.window.close();
_7.win=null;
}
};
this.goURLMainWin=function(_f){
location=_f;
_7.close();
};
};
fleegix.popup.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f);
var _13=o||{};
var str="";
var pat=null;
if(_13.stripTags){
pat=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_13.stripTags?v.replace(pat,""):v;
str+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_13.collapseMulti){
sep=",";
str+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_13.stripTags?v[j].replace(pat,""):v[j];
s=(!_13.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
str+=s+sep;
}
str=str.substr(0,str.length-1);
}
str+="&";
}else{
if(_13.includeEmpty){
str+=n+"=&";
}
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.form.toHash=function(f){
var h={};
function expandToArr(_1d,val){
if(_1d){
var r=null;
if(typeof _1d=="string"){
r=[];
r.push(_1d);
}else{
r=_1d;
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
h[elem.name]=elem.value||null;
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
fleegix.form.restore=function(_22,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _27=arr[i].split("=");
var _28=_27[0];
var val=_27[1];
if(typeof d[_28]=="undefined"){
d[_28]=val;
}else{
if(!(d[_28] instanceof Array)){
var t=d[_28];
d[_28]=[];
d[_28].push(t);
}
d[_28].push(val);
}
}
for(var i=0;i<_22.elements.length;i++){
elem=_22.elements[i];
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
return _22;
};
fleegix.form.diff=function(_2e,_2f,_30){
var o=_30||{};
var _32=_2e.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_2e):_2e;
var _33=_2f.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_2f):_2f;
var _34=[];
var _35=0;
function addDiff(n,hA,hB,_39){
if(!_34[n]){
_35++;
_34[n]=_39?[hB[n],hA[n]]:[hA[n],hB[n]];
}
}
function diffSweep(hA,hB,_3c){
for(n in hA){
if(typeof hB[n]=="undefined"){
if(o.intersectionOnly){
continue;
}
addDiff(n,hA,hB,_3c);
}else{
v=hA[n];
if(v instanceof Array){
if(!hB[n]||(hB[n].toString()!=v.toString())){
addDiff(n,hA,hB,_3c);
}
}else{
if(hB[n]!=v){
addDiff(n,hA,hB,_3c);
}
}
}
}
}
diffSweep(_32,_33,false);
diffSweep(_33,_32,true);
return {count:_35,diffs:_34};
};
fleegix.xhr=new function(){
var _3d=null;
function spawnTransporter(_3e){
var i=0;
var t=["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","Microsoft.XMLHTTP"];
var _41=null;
if(window.XMLHttpRequest!=null){
_41=new XMLHttpRequest();
}else{
if(window.ActiveXObject!=null){
if(_3d){
_41=new ActiveXObject(_3d);
}else{
for(var i=0;i<t.length;i++){
try{
_41=new ActiveXObject(t[i]);
_3d=t[i];
break;
}
catch(e){
}
}
}
}
}
if(_41){
if(_3e){
return _41;
}else{
fleegix.xhr.transporters.push(_41);
var _42=fleegix.xhr.transporters.length-1;
return _42;
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
var _44=null;
var _45=Array.prototype.slice.apply(arguments);
if(typeof _45[0]=="function"){
o.async=true;
_44=_45.shift();
}else{
o.async=false;
}
var url=_45.shift();
if(typeof _45[0]=="object"){
var _47=_45.shift();
for(var p in _47){
o[p]=_47[p];
}
}else{
o.responseFormat=_45.shift()||"text";
}
o.handleSuccess=_44;
o.url=url;
return this.doReq(o);
};
this.doPost=function(){
var o={};
var _4a=null;
var _4b=Array.prototype.slice.apply(arguments);
if(typeof _4b[0]=="function"){
o.async=true;
_4a=_4b.shift();
}else{
o.async=false;
}
var url=_4b.shift();
var _4d=_4b.shift();
if(typeof _4b[0]=="object"){
var _4e=_4b.shift();
for(var p in _4e){
o[p]=_4e[p];
}
}else{
o.responseFormat=_4b.shift()||"text";
}
o.handleSuccess=_4a;
o.url=url;
o.dataPayload=_4d;
o.method="POST";
return this.doReq(o);
};
this.doReq=function(o){
var _51=o||{};
var req=new fleegix.xhr.Request();
var _53=null;
for(var p in _51){
req[p]=_51[p];
}
req.id=this.lastReqId;
this.lastReqId++;
if(req.async){
if(this.idleTransporters.length){
_53=this.idleTransporters.shift();
}else{
if(this.transporters.length<this.maxTransporters){
_53=spawnTransporter();
}
}
if(_53!=null){
this.processReq(req,_53);
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
var _57=this;
var _58=null;
var _59=null;
var url="";
var _5b=null;
if(req.async){
_58=t;
_59=this.transporters[_58];
this.processingMap[req.id]=req;
this.processingArray.unshift(req);
req.transporterId=_58;
}else{
_59=this.syncTransporter;
this.syncRequest=req;
}
if(req.preventCache){
var dt=new Date().getTime();
url=req.url.indexOf("?")>-1?req.url+"&preventCache="+dt:req.url+"?preventCache="+dt;
}else{
url=req.url;
}
if(document.all){
_59.abort();
}
if(req.username&&req.password){
_59.open(req.method,url,req.async,req.username,req.password);
}else{
_59.open(req.method,url,req.async);
}
if(req.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_59.overrideMimeType(req.mimeType);
}
if(req.headers.length){
for(var i=0;i<req.headers.length;i++){
var _5e=req.headers[i].split(": ");
_59.setRequestHeader(_5e[i],_5e[1]);
}
}else{
if(req.method=="POST"){
_59.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_59.send(req.dataPayload);
if(this.processingWatcherId==null){
this.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}
if(!req.async){
var ret=this.handleResponse(_59,req);
this.syncRequest=null;
if(_57.processingArray.length){
_57.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}
return ret;
}
};
this.getResponseByType=function(_60,req){
switch(req.responseFormat){
case "text":
r=_60.responseText;
break;
case "xml":
r=_60.responseXML;
break;
case "object":
r=_60;
break;
}
return r;
};
this.watchProcessing=function(){
var _62=fleegix.xhr;
var _63=_62.processingArray;
var d=new Date().getTime();
if(_62.syncRequest!=null){
return;
}else{
for(var i=0;i<_63.length;i++){
var req=_63[i];
var _67=_62.transporters[req.transporterId];
var _68=((d-req.startTime)>(req.timeoutSeconds*1000));
switch(true){
case (req.aborted||!_67.readyState):
_62.processingArray.splice(i,1);
case _68:
_62.processingArray.splice(i,1);
_62.timeout(req);
break;
case (_67.readyState==4):
_62.processingArray.splice(i,1);
_62.handleResponse.apply(_62,[_67,req]);
break;
}
}
}
clearTimeout(_62.processingWatcherId);
if(_62.processingArray.length){
_62.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}else{
_62.processingWatcherId=null;
}
};
this.abort=function(_69){
var r=this.processingMap[_69];
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
this.handleResponse=function(_6d,req){
var _6f=this.getResponseByType(_6d,req);
if(req.handleAll){
req.handleAll(_6f,req.id);
}else{
try{
if((_6d.status>199&&_6d.status<300)||_6d.status==304){
if(req.async){
if(!req.handleSuccess){
throw ("No response handler defined "+"for this request");
return;
}else{
req.handleSuccess(_6f,req.id);
}
}else{
return _6f;
}
}else{
if(!_6d.status){
if(this.debug){
throw ("XMLHttpRequest HTTP status either zero or not set.");
}
}else{
if(req.handleErr){
req.handleErr(_6f,req.id);
}else{
this.handleErrDefault(_6d);
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
var _71=this.requestQueue.shift();
_71.startTime=new Date().getTime();
this.processReq(_71,req.transporterId);
}else{
this.idleTransporters.push(req.transporterId);
}
};
this.handleErrDefault=function(r){
console.log(r);
var _73;
try{
_73=window.open("","errorWin");
_73.document.body.innerHTML=r.responseText;
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
fleegix.xhr.Request.prototype.setRequestHeader=function(_74,_75){
this.headers.push(_74+": "+_75);
};
fleegix.event=new function(){
var _76=[];
var _77={};
this.listen=function(){
var _78=arguments[0];
var _79=arguments[1];
var _7a=_78[_79]?_78[_79].listenReg:null;
if(!_7a){
_7a={};
_7a.orig={};
_7a.orig.obj=_78,_7a.orig.methName=_79;
if(_78[_79]){
_7a.orig.methCode=_78[_79];
}
_7a.after=[];
_78[_79]=function(){
var reg=_78[_79].listenReg;
var _7c=[];
for(var i=0;i<arguments.length;i++){
_7c.push(arguments[i]);
}
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_7c);
}
if(_78.attachEvent||_78.nodeType||_78.addEventListener){
var ev=null;
if(!_7c.length){
try{
switch(true){
case !!(_78.ownerDocument):
ev=_78.ownerDocument.parentWindow.event;
break;
case !!(_78.documentElement):
ev=_78.documentElement.ownerDocument.parentWindow.event;
break;
case !!(_78.event):
ev=_78.event;
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
_7c[0]=ev;
}
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(!ex.execObj){
var _80=ex.execMethod;
_80.apply(window,_7c);
}else{
execObj=ex.execObj;
execMethod=ex.execMethod;
execObj[execMethod].apply(execObj,_7c);
}
ev=_7c[0];
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
_78[_79].listenReg=_7a;
_76.push(_78[_79].listenReg);
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
_7a.after.push(r);
_78[_79].listenReg=_7a;
};
this.unlisten=function(){
var _84=arguments[0];
var _85=arguments[1];
var _86=_84[_85]?_84[_85].listenReg:null;
var _87=null;
if(!_86){
return false;
}
for(var i=0;i<_86.after.length;i++){
var ex=_86.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_86.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_86.after.splice(i,1);
}
}
}
_84[_85].listenReg=_86;
};
this.flush=function(){
for(var i=0;i<_76.length;i++){
var reg=_76[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_8c,obj,_8e){
if(!obj){
return;
}
if(!_77[_8c]){
_77[_8c]={};
_77[_8c].audience=[];
}else{
this.unsubscribe(_8c,obj);
}
_77[_8c].audience.push([obj,_8e]);
};
this.unsubscribe=function(_8f,obj){
if(!obj){
_77[_8f]=null;
}else{
if(_77[_8f]){
var aud=_77[_8f].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_94){
if(_77[pub]){
aud=_77[pub].audience;
for(var i=0;i<aud.length;i++){
var _96=aud[i][0];
var _97=aud[i][1];
_96[_97](_94);
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
var _9a=this;
this.parse=function(_9b,_9c){
var _9d=new Array;
var _9e;
var _9f=[];
if(_9b.hasChildNodes()){
_9d=_9b.getElementsByTagName(_9c);
_9e=_9d[0];
for(var j=0;j<_9d.length;j++){
_9e=_9d[j];
_9f[j]=_9a.xmlElem2Obj(_9d[j]);
}
}
return _9f;
};
this.xmlElem2Obj=function(_a1){
var ret=new Object();
_9a.setPropertiesRecursive(ret,_a1);
return ret;
};
this.setPropertiesRecursive=function(obj,_a4){
if(_a4.childNodes.length>0){
for(var i=0;i<_a4.childNodes.length;i++){
if(_a4.childNodes[i].nodeType==1&&_a4.childNodes[i].firstChild){
if(_a4.childNodes[i].childNodes.length==1){
obj[_a4.childNodes[i].tagName]=_a4.childNodes[i].firstChild.nodeValue;
}else{
obj[_a4.childNodes[i].tagName]=[];
_9a.setPropertiesRecursive(obj[_a4.childNodes[i].tagName],_a4.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_a6){
var _a7=_a6;
for(var _a8 in _a7){
_a7[_a8]=cleanText(_a7[_a8]);
}
return _a7;
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
var _ac=str;
_ac=_ac.replace(/</g,"&lt;");
_ac=_ac.replace(/>/g,"&gt;");
return "<pre>"+_ac+"</pre>";
};
this.getXMLDocElem=function(_ad,_ae){
var _af=[];
var _b0=null;
if(document.all){
var _b1=document.getElementById(_ad).innerHTML;
var _b2=new ActiveXObject("Microsoft.XMLDOM");
_b2.loadXML(_b1);
_b0=_b2.documentElement;
}else{
_af=window.document.body.getElementsByTagName(_ae);
_b0=_af[0];
}
return _b0;
};
};
fleegix.xml.constructor=null;
fleegix.uri=new function(){
var _b3=this;
this.params={};
this.getParamHash=function(str){
var q=str||_b3.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _b9=arr[i].split("=");
var _ba=_b9[0];
var val=_b9[1];
if(typeof d[_ba]=="undefined"){
d[_ba]=val;
}else{
if(!(d[_ba] instanceof Array)){
var t=d[_ba];
d[_ba]=[];
d[_ba].push(t);
}
d[_ba].push(val);
}
}
}
return d;
};
this.getParam=function(_bd,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_bd];
}else{
p=this.params[_bd];
}
return p;
};
this.setParam=function(_c1,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_c1+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_c1+"="+val+arr[3]);
}else{
ret=str+"&"+_c1+"="+val;
}
}else{
ret=_c1+"="+val;
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
this.fadeOut=function(_cb,_cc){
return doFade(_cb,_cc,"out");
};
this.fadeIn=function(_cd,_ce){
return doFade(_cd,_ce,"in");
};
this.blindUp=function(_cf,_d0){
var o=_d0||{};
o.blindType=o.blindType||"height";
return doBlind(_cf,o,"up");
};
this.blindDown=function(_d2,_d3){
var o=_d3||{};
o.blindType=o.blindType||"height";
return doBlind(_d2,o,"down");
};
this.setCSSProp=function(_d5,p,v){
if(p=="opacity"){
if(document.all){
_d5.style.filter="alpha(opacity="+v+")";
}else{
var d=v/100;
_d5.style.opacity=d;
}
}else{
if(p=="clip"||p.toLowerCase().indexOf("color")>-1){
_d5.style[p]=v;
}else{
_d5.style[p]=document.all?parseInt(v)+"px":v+"px";
}
}
return true;
};
this.hexPat=/^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
this.hex2rgb=function(str,_da){
var rgb=[];
var h=str.match(this.hexPat);
if(h){
for(var i=1;i<h.length;i++){
var s=h[i];
s=s.length==1?s+s:s;
rgb.push(parseInt(s,16));
}
return _da?rgb:"rgb("+rgb.join()+")";
}else{
throw ("\""+str+"\" not a valid hex value.");
}
};
this.hsv2rgb=function(h,s,v,_e2){
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
var _e7=h/60;
var i=Math.floor(_e7);
var f=_e7-i;
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
return _e2?rgb:"rgb("+rgb.join()+")";
};
function doFade(_ed,_ee,dir){
var s=dir=="in"?0:100;
var e=dir=="in"?100:0;
var o={props:{opacity:[s,e]},trans:"lightEaseIn"};
for(p in _ee){
o[p]=_ee[p];
}
return new fleegix.fx.Effecter(_ed,o);
}
function doBlind(_f3,_f4,dir){
var o={};
var s=0;
var e=0;
if(_f4.blindType=="clip"){
s=dir=="down"?0:_f3.offsetHeight;
e=dir=="down"?_f3.offsetHeight:0;
s=[0,_f3.offsetWidth,s,0];
e=[0,_f3.offsetWidth,e,0];
o.props={clip:[s,e]};
}else{
if(dir=="down"){
if(_f4.endHeight){
e=_f4.endHeight;
}else{
_f3.style.height="";
var d=document.createElement("div");
d.position="absolute";
d.style.top="-9999999999px";
d.style.left="-9999999999px";
var par=_f3.parentNode;
var ch=par.removeChild(_f3);
d.appendChild(ch);
document.body.appendChild(d);
e=ch.offsetHeight;
_f3=d.removeChild(ch);
var x=document.body.removeChild(d);
_f3.style.height="0px";
par.appendChild(_f3);
}
s=0;
}else{
s=_f3.offsetHeight;
e=0;
}
o.props={height:[s,e]};
}
for(p in _f4){
o[p]=_f4[p];
}
o.trans="lightEaseIn";
return new fleegix.fx.Effecter(_f3,o);
}
};
fleegix.fx.Effecter=function(_fd,_fe){
var _ff=this;
this.props=_fe.props;
this.trans=_fe.trans||"lightEaseIn";
this.duration=_fe.duration||500;
this.fps=30;
this.startTime=new Date().getTime();
this.timeSpent=0;
this.doOnStart=_fe.doOnStart||null;
this.doAfterFinished=_fe.doAfterFinished||null;
this.autoStart=_fe.autoStart==false?false:true;
if(typeof this.transitions[this.trans]!="function"){
throw ("\""+this.trans+"\" is not a valid transition.");
}
this.start=function(){
_ff.id=setInterval(function(){
_ff.doStep.apply(_ff,[_fd]);
},Math.round(1000/_ff.fps));
if(typeof _fe.doOnStart=="function"){
_ff.doOnStart();
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
var _105=this.props[key][0];
var _106=this.props[key][1];
var _107=this.transitions[this.trans];
if(key.toLowerCase().indexOf("color")>-1){
var _108=fleegix.fx.hex2rgb(_105,true);
var _109=fleegix.fx.hex2rgb(_106,true);
var _10a=[];
for(var i=0;i<_108.length;i++){
var s=_108[i];
var e=_109[i];
_10a.push(parseInt(_107(this.timeSpent,s,(e-s),this.duration)));
}
return "rgb("+_10a.join()+")";
}else{
if(key=="clip"){
var _108=_105;
var _109=_106;
var _10a=[];
for(var i=0;i<_108.length;i++){
var s=_108[i];
var e=_109[i];
_10a.push(parseInt(_107(this.timeSpent,s,(e-s),this.duration)));
}
return "rect("+_10a.join("px,")+"px)";
}else{
return _107(this.timeSpent,_105,(_106-_105),this.duration);
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
this.set=function(name,_12e,_12f){
var opts=_12f||{};
var exp="";
var t=0;
if(typeof _12f=="object"){
var path=opts.path||"/";
var days=opts.days||0;
var _135=opts.hours||0;
var _136=opts.minutes||0;
}else{
var path=optsParam||"/";
}
t+=days?days*24*60*60*1000:0;
t+=_135?_135*60*60*1000:0;
t+=_136?_136*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=name+"="+_12e+exp+"; path="+path;
};
this.get=function(name){
var _139=name+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_139)==0){
return c.substring(_139.length,c.length);
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
this.addCssClass=function(elem,s){
removeCssClass(elem,s);
var c=elem.className;
elem.className=c+=" "+s;
};
this.removeCssClass=function(elem,s){
var c=elem.className;
var pat="\\b"+s+"\\b";
pat=new RegExp(pat);
c=c.replace(pat,"");
elem.className=c;
};
};

