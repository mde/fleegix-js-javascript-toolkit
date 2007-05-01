if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.popup=new function(){
var _1=this;
this.win=null;
this.open=function(_2,_3){
var _4=_3||{};
var _5="";
var _6={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _7 in _6){
_5+=_7+"=";
_5+=_4[_7]?_4[_7]:_6[_7];
_5+=",";
}
var _8=_5.length;
if(_8){
_5=_5.substr(0,_8-1);
}
if(!_1.win||_1.win.closed){
_1.win=window.open(_2,"thePopupWin",_5);
}else{
_1.win.focus();
_1.win.document.location=_2;
}
};
this.close=function(){
if(_1.win){
_1.win.window.close();
_1.win=null;
}
};
this.goURLMainWin=function(_9){
location=_9;
_1.close();
};
};
fleegix.popup.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(f,o){
var h=fleegix.form.toHash(f);
var _d=o||{};
var _e="";
var _f=null;
if(_d.stripTags){
_f=/<[^>]*>/g;
}
for(var n in h){
var s="";
var v=h[n];
if(v){
if(typeof v=="string"){
s=_d.stripTags?v.replace(_f,""):v;
_e+=n+"="+encodeURIComponent(s);
}else{
var sep="";
if(_d.collapseMulti){
sep=",";
_e+=n+"=";
}else{
sep="&";
}
for(var j=0;j<v.length;j++){
s=_d.stripTags?v[j].replace(_f,""):v[j];
s=(!_d.collapseMulti)?n+"="+encodeURIComponent(s):encodeURIComponent(s);
_e+=s+sep;
}
_e=_e.substr(0,_e.length-1);
}
_e+="&";
}else{
if(_d.includeEmpty){
_e+=n+"=&";
}
}
}
_e=_e.substr(0,_e.length-1);
return _e;
};
fleegix.form.toHash=function(f){
var h={};
function expandToArr(_17,val){
if(_17){
var r=null;
if(typeof _17=="string"){
r=[];
r.push(_17);
}else{
r=_17;
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
fleegix.form.restore=function(_1c,str){
var arr=str.split("&");
var d={};
for(var i=0;i<arr.length;i++){
var _21=arr[i].split("=");
var _22=_21[0];
var val=_21[1];
if(typeof d[_22]=="undefined"){
d[_22]=val;
}else{
if(!(d[_22] instanceof Array)){
var t=d[_22];
d[_22]=[];
d[_22].push(t);
}
d[_22].push(val);
}
}
for(var i=0;i<_1c.elements.length;i++){
elem=_1c.elements[i];
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
return _1c;
};
fleegix.form.diff=function(_28,_29,_2a){
var o=_2a||{};
var _2c=_28.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_28):_28;
var _2d=_29.toString()=="[object HTMLFormElement]"?fleegix.form.toHash(_29):_29;
var _2e=[];
var _2f=0;
function addDiff(n,hA,hB,_33){
if(!_2e[n]){
_2f++;
_2e[n]=_33?[hB[n],hA[n]]:[hA[n],hB[n]];
}
}
function diffSweep(hA,hB,_36){
for(n in hA){
if(typeof hB[n]=="undefined"){
if(o.intersectionOnly){
continue;
}
addDiff(n,hA,hB,_36);
}else{
v=hA[n];
if(v instanceof Array){
if(!hB[n]||(hB[n].toString()!=v.toString())){
addDiff(n,hA,hB,_36);
}
}else{
if(hB[n]!=v){
addDiff(n,hA,hB,_36);
}
}
}
}
}
diffSweep(_2c,_2d,false);
diffSweep(_2d,_2c,true);
return {count:_2f,diffs:_2e};
};
fleegix.xhr=new function(){
var _37=null;
function spawnTransporter(_38){
var i=0;
var t=["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","Microsoft.XMLHTTP"];
var _3b=null;
if(window.XMLHttpRequest!=null){
_3b=new XMLHttpRequest();
}else{
if(window.ActiveXObject!=null){
if(_37){
_3b=new ActiveXObject(_37);
}else{
for(var i=0;i<t.length;i++){
try{
_3b=new ActiveXObject(t[i]);
_37=t[i];
break;
}
catch(e){
}
}
}
}
}
if(_3b){
if(_38){
return _3b;
}else{
fleegix.xhr.transporters.push(_3b);
var _3c=fleegix.xhr.transporters.length-1;
return _3c;
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
var _3e=null;
var _3f=Array.prototype.slice.apply(arguments);
if(typeof _3f[0]=="function"){
o.async=true;
_3e=_3f.shift();
}else{
o.async=false;
}
var url=_3f.shift();
if(typeof _3f[0]=="object"){
var _41=_3f.shift();
for(var p in _41){
o[p]=_41[p];
}
}else{
o.responseFormat=_3f.shift()||"text";
}
o.handleSuccess=_3e;
o.url=url;
return this.doReq(o);
};
this.doPost=function(){
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
var _47=_45.shift();
if(typeof _45[0]=="object"){
var _48=_45.shift();
for(var p in _48){
o[p]=_48[p];
}
}else{
o.responseFormat=_45.shift()||"text";
}
o.handleSuccess=_44;
o.url=url;
o.dataPayload=_47;
o.method="POST";
return this.doReq(o);
};
this.doReq=function(o){
var _4b=o||{};
var req=new fleegix.xhr.Request();
var _4d=null;
for(var p in _4b){
req[p]=_4b[p];
}
req.id=this.lastReqId;
this.lastReqId++;
if(req.async){
if(this.idleTransporters.length){
_4d=this.idleTransporters.shift();
}else{
if(this.transporters.length<this.maxTransporters){
_4d=spawnTransporter();
}
}
if(_4d!=null){
this.processReq(req,_4d);
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
var _51=this;
var _52=null;
var _53=null;
var url="";
var _55=null;
if(req.async){
_52=t;
_53=this.transporters[_52];
this.processingMap[req.id]=req;
this.processingArray.unshift(req);
req.transporterId=_52;
}else{
_53=this.syncTransporter;
this.syncRequest=req;
}
if(req.preventCache){
var dt=new Date().getTime();
url=req.url.indexOf("?")>-1?req.url+"&preventCache="+dt:req.url+"?preventCache="+dt;
}else{
url=req.url;
}
if(document.all){
_53.abort();
}
if(req.username&&req.password){
_53.open(req.method,url,req.async,req.username,req.password);
}else{
_53.open(req.method,url,req.async);
}
if(req.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_53.overrideMimeType(req.mimeType);
}
if(req.headers.length){
for(var i=0;i<req.headers.length;i++){
var _58=req.headers[i].split(": ");
_53.setRequestHeader(_58[i],_58[1]);
}
}else{
if(req.method=="POST"){
_53.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_53.send(req.dataPayload);
if(this.processingWatcherId==null){
this.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}
if(!req.async){
var ret=this.handleResponse(_53,req);
this.syncRequest=null;
if(_51.processingArray.length){
_51.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}
return ret;
}
};
this.getResponseByType=function(_5a,req){
switch(req.responseFormat){
case "text":
r=_5a.responseText;
break;
case "xml":
r=_5a.responseXML;
break;
case "object":
r=_5a;
break;
}
return r;
};
this.watchProcessing=function(){
var _5c=fleegix.xhr;
var _5d=_5c.processingArray;
var d=new Date().getTime();
if(_5c.syncRequest!=null){
return;
}else{
for(var i=0;i<_5d.length;i++){
var req=_5d[i];
var _61=_5c.transporters[req.transporterId];
var _62=((d-req.startTime)>(req.timeoutSeconds*1000));
switch(true){
case (req.aborted||!_61.readyState):
_5c.processingArray.splice(i,1);
case _62:
_5c.processingArray.splice(i,1);
_5c.timeout(req);
break;
case (_61.readyState==4):
_5c.processingArray.splice(i,1);
_5c.handleResponse.apply(_5c,[_61,req]);
break;
}
}
}
clearTimeout(_5c.processingWatcherId);
if(_5c.processingArray.length){
_5c.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10);
}else{
_5c.processingWatcherId=null;
}
};
this.abort=function(_63){
var r=this.processingMap[_63];
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
this.handleResponse=function(_67,req){
var _69=this.getResponseByType(_67,req);
if(req.handleAll){
req.handleAll(_69,req.id);
}else{
try{
if((_67.status>199&&_67.status<300)||_67.status==304){
if(req.async){
if(!req.handleSuccess){
throw ("No response handler defined "+"for this request");
return;
}else{
req.handleSuccess(_69,req.id);
}
}else{
return _69;
}
}else{
if(!_67.status){
if(this.debug){
throw ("XMLHttpRequest HTTP status either zero or not set.");
}
}else{
if(req.handleErr){
req.handleErr(_69,req.id);
}else{
this.handleErrDefault(_67);
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
var _6b=this.requestQueue.shift();
_6b.startTime=new Date().getTime();
this.processReq(_6b,req.transporterId);
}else{
this.idleTransporters.push(req.transporterId);
}
};
this.handleErrDefault=function(r){
console.log(r);
var _6d;
try{
_6d=window.open("","errorWin");
_6d.document.body.innerHTML=r.responseText;
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
fleegix.xhr.Request.prototype.setRequestHeader=function(_6e,_6f){
this.headers.push(_6e+": "+_6f);
};
fleegix.dumpIntoPopup=function(o){
var _71;
var str="";
if(typeof o!="string"){
for(var p in o){
str+=p+": "+o[p]+" ("+typeof o[p]+")<br/>";
}
}else{
str=o;
}
try{
_71=window.open("","errorWin");
_71.document.body.innerHTML=str;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
fleegix.event=new function(){
var _74=[];
var _75={};
this.listen=function(){
var _76=arguments[0];
var _77=arguments[1];
var _78=_76[_77]?_76[_77].listenReg:null;
if(!_78){
_78={};
_78.orig={};
_78.orig.obj=_76,_78.orig.methName=_77;
if(_76[_77]){
_78.orig.methCode=_76[_77];
}
_78.after=[];
_76[_77]=function(){
var reg=_76[_77].listenReg;
var _7a=[];
for(var i=0;i<arguments.length;i++){
_7a.push(arguments[i]);
}
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_7a);
}
if(_76.attachEvent||_76.nodeType||_76.addEventListener){
var ev=null;
if(!_7a.length){
try{
switch(true){
case !!(_76.ownerDocument):
ev=_76.ownerDocument.parentWindow.event;
break;
case !!(_76.documentElement):
ev=_76.documentElement.ownerDocument.parentWindow.event;
break;
case !!(_76.event):
ev=_76.event;
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
_7a[0]=ev;
}
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(typeof ex=="function"){
var _7e=ex;
_7e.apply(window,_7a);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_7a);
}
}
};
_76[_77].listenReg=_78;
_74.push(_76[_77].listenReg);
}
if(typeof arguments[2]=="function"){
_78.after.push(arguments[2]);
}else{
_78.after.push([arguments[2],arguments[3]]);
}
_76[_77].listenReg=_78;
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
for(var i=0;i<_74.length;i++){
var reg=_74[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_87,obj,_89){
if(!obj){
return;
}
if(!_75[_87]){
_75[_87]={};
_75[_87].audience=[];
}else{
this.unsubscribe(_87,obj);
}
_75[_87].audience.push([obj,_89]);
};
this.unsubscribe=function(_8a,obj){
if(!obj){
_75[_8a]=null;
}else{
if(_75[_8a]){
var aud=_75[_8a].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_8f){
if(_75[pub]){
aud=_75[pub].audience;
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
fleegix.xml=new function(){
var _95=this;
this.parse=function(_96,_97){
var _98=new Array;
var _99;
var _9a=[];
if(_96.hasChildNodes()){
_98=_96.getElementsByTagName(_97);
_99=_98[0];
for(var j=0;j<_98.length;j++){
_99=_98[j];
_9a[j]=_95.xmlElem2Obj(_98[j]);
}
}
return _9a;
};
this.xmlElem2Obj=function(_9c){
var ret=new Object();
_95.setPropertiesRecursive(ret,_9c);
return ret;
};
this.setPropertiesRecursive=function(obj,_9f){
if(_9f.childNodes.length>0){
for(var i=0;i<_9f.childNodes.length;i++){
if(_9f.childNodes[i].nodeType==1&&_9f.childNodes[i].firstChild){
if(_9f.childNodes[i].childNodes.length==1){
obj[_9f.childNodes[i].tagName]=_9f.childNodes[i].firstChild.nodeValue;
}else{
obj[_9f.childNodes[i].tagName]=[];
_95.setPropertiesRecursive(obj[_9f.childNodes[i].tagName],_9f.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_a1){
var _a2=_a1;
for(var _a3 in _a2){
_a2[_a3]=cleanText(_a2[_a3]);
}
return _a2;
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
var _a7=str;
_a7=_a7.replace(/</g,"&lt;");
_a7=_a7.replace(/>/g,"&gt;");
return "<pre>"+_a7+"</pre>";
};
this.getXMLDocElem=function(_a8,_a9){
var _aa=[];
var _ab=null;
if(document.all){
var _ac=document.getElementById(_a8).innerHTML;
var _ad=new ActiveXObject("Microsoft.XMLDOM");
_ad.loadXML(_ac);
_ab=_ad.documentElement;
}else{
_aa=window.document.body.getElementsByTagName(_a9);
_ab=_aa[0];
}
return _ab;
};
};
fleegix.xml.constructor=null;
fleegix.uri=new function(){
var _ae=this;
this.params={};
this.getParamHash=function(str){
var q=str||_ae.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _b4=arr[i].split("=");
var _b5=_b4[0];
var val=_b4[1];
if(typeof d[_b5]=="undefined"){
d[_b5]=val;
}else{
if(!(d[_b5] instanceof Array)){
var t=d[_b5];
d[_b5]=[];
d[_b5].push(t);
}
d[_b5].push(val);
}
}
}
return d;
};
this.getParam=function(_b8,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_b8];
}else{
p=this.params[_b8];
}
return p;
};
this.setParam=function(_bc,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_bc+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_bc+"="+val+arr[3]);
}else{
ret=str+"&"+_bc+"="+val;
}
}else{
ret=_bc+"="+val;
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
function doFade(_c6,_c7,dir){
var s=dir=="in"?0:100;
var e=dir=="in"?100:0;
var o={startVal:s,endVal:e,props:{opacity:[s,e]},trans:"lightEaseIn"};
for(p in _c7){
o[p]=_c7[p];
}
return new fleegix.fx.Effecter(_c6,o);
}
this.fadeOut=function(_cc,_cd){
return doFade(_cc,_cd,"out");
};
this.fadeIn=function(_ce,_cf){
return doFade(_ce,_cf,"in");
};
this.setCSSProp=function(_d0,p,v){
if(p=="opacity"){
if(document.all){
_d0.style.filter="alpha(opacity="+v+")";
}else{
var d=v/100;
_d0.style.opacity=d;
}
}else{
if(p.toLowerCase().indexOf("color")>-1){
_d0.style[p]=v;
}else{
_d0.style[p]=document.all?parseInt(v)+"px":v+"px";
}
}
return true;
};
this.hexPat=/^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
this.hexToRGB=function(str,_d5){
var rgb=[];
var h=str.match(this.hexPat);
if(h){
for(var i=1;i<h.length;i++){
var s=h[i];
s=s.length==1?s+s:s;
rgb.push(parseInt(s,16));
}
s="rgb("+rgb.join()+")";
return _d5?rgb:s;
}else{
throw ("\""+str+"\" not a valid hex value.");
}
};
};
fleegix.fx.Effecter=function(_da,_db){
var _dc=this;
this.props=_db.props;
this.trans=_db.trans||"lightEaseIn";
this.duration=_db.duration||500;
this.fps=30;
this.startTime=new Date().getTime();
this.timeSpent=0;
this.doOnStart=_db.doOnStart||null;
this.doAfterFinished=_db.doAfterFinished||null;
this.autoStart=_db.autoStart==false?false:true;
if(typeof this.transitions[this.trans]!="function"){
throw ("\""+this.trans+"\" is not a valid transition.");
}
this.start=function(){
_dc.id=setInterval(function(){
_dc.doStep.apply(_dc,[_da]);
},Math.round(1000/_dc.fps));
if(typeof _db.doOnStart=="function"){
_dc.doOnStart();
}
};
if(this.autoStart){
this.start();
}
return this;
};
fleegix.fx.Effecter.prototype.doStep=function(_dd){
var t=new Date().getTime();
var p=this.props;
if(t<(this.startTime+this.duration)){
this.timeSpent=t-this.startTime;
for(var i in p){
fleegix.fx.setCSSProp(_dd,i,this.calcCurrVal(i));
}
}else{
for(var i in p){
fleegix.fx.setCSSProp(_dd,i,p[i][1]);
}
clearInterval(this.id);
if(typeof this.doAfterFinished=="function"){
this.doAfterFinished();
}
}
};
fleegix.fx.Effecter.prototype.calcCurrVal=function(key){
var _e2=this.props[key][0];
var _e3=this.props[key][1];
var _e4=this.transitions[this.trans];
if(key.toLowerCase().indexOf("color")>-1){
var _e5=fleegix.fx.hexToRGB(_e2,true);
var _e6=fleegix.fx.hexToRGB(_e3,true);
var _e7=[];
for(var i=0;i<_e5.length;i++){
var s=_e5[i];
var e=_e6[i];
_e7.push(parseInt(_e4(this.timeSpent,s,(e-s),this.duration)));
}
return "rgb("+_e7.join()+")";
}else{
return _e4(this.timeSpent,_e2,(_e3-_e2),this.duration);
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
this.set=function(name,_10b,_10c){
var opts=_10c||{};
var exp="";
var t=0;
if(typeof _10c=="object"){
var path=opts.path||"/";
var days=opts.days||0;
var _112=opts.hours||0;
var _113=opts.minutes||0;
}else{
var path=optsParam||"/";
}
t+=days?days*24*60*60*1000:0;
t+=_112?_112*60*60*1000:0;
t+=_113?_113*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=name+"="+_10b+exp+"; path="+path;
};
this.get=function(name){
var _116=name+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_116)==0){
return c.substring(_116.length,c.length);
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
fleegix.ui=new function(){
this.getViewportWidth=function(){
return fleegix.ui.getViewportMeasure("Width");
};
this.getViewportHeight=function(){
return fleegix.ui.getViewportMeasure("Height");
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
this.center=function(node){
var nW=node.offsetWidth;
var nH=node.offsetHeight;
var vW=fleegix.ui.getViewportWidth();
var vH=fleegix.ui.getViewportHeight();
node.style.left=parseInt((vW/2)-(nW/2))+"px";
node.style.top=parseInt((vH/2)-(nH/2))+"px";
};
};
fleegix.ui.constructor=null;

