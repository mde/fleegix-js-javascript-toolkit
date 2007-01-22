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
fleegix.fx=new function(){
this.fadeOut=function(_95,_96){
return this.doFade(_95,_96,"out");
};
this.fadeIn=function(_97,_98){
return this.doFade(_97,_98,"in");
};
this.doFade=function(_99,_9a,dir){
var s=dir=="in"?0:100;
var e=dir=="in"?100:0;
var o={startVal:s,endVal:e,props:{opacity:[s,e]},trans:"lightEaseIn"};
for(p in _9a){
o[p]=_9a[p];
}
return new fleegix.fx.Effecter(_99,o);
};
this.setCSSProp=function(_9f,p,v){
if(p=="opacity"){
if(document.all){
_9f.style.filter="alpha(opacity="+v+")";
}else{
var d=v/100;
_9f.style.opacity=d;
}
}else{
if(p.toLowerCase().indexOf("color")>-1){
_9f.style[p]=v;
}else{
_9f.style[p]=document.all?parseInt(v)+"px":v+"px";
}
}
return true;
};
this.hexPat=/^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;
this.hexToRGB=function(str,_a4){
var rgb=[];
var h=str.match(this.hexPat);
if(h){
for(var i=1;i<h.length;i++){
var s=h[i];
s=s.length==1?s+s:s;
rgb.push(parseInt(s,16));
}
s="rgb("+rgb.join()+")";
return _a4?rgb:s;
}else{
throw ("\""+str+"\" not a valid hex value.");
}
};
};
fleegix.fx.Effecter=function(_a9,_aa){
var _ab=this;
this.props=_aa.props;
this.trans=_aa.trans||"linear";
this.duration=_aa.duration||500;
this.fps=30;
this.startTime=new Date().getTime();
this.timeSpent=0;
this.doAfter=_aa.doAfter||null;
this.autoStart=_aa.autoStart==false?false:true;
if(typeof this.transitions[this.trans]!="function"){
throw ("\""+this.trans+"\" is not a valid transition.");
}
this.start=function(){
_ab.id=setInterval(function(){
_ab.doStep.apply(_ab,[_a9]);
},Math.round(1000/_ab.fps));
if(typeof _aa.doOnStart=="function"){
_aa.doOnStart();
}
};
if(this.autoStart){
this.start();
}
return this;
};
fleegix.fx.Effecter.prototype.doStep=function(_ac){
var t=new Date().getTime();
if(t<(this.startTime+this.duration)){
this.timeSpent=t-this.startTime;
var p=this.props;
for(var i in p){
fleegix.fx.setCSSProp(_ac,i,this.calcCurrVal(i));
}
}else{
clearInterval(this.id);
if(typeof this.doAfterFinished=="function"){
this.doAfterFinished();
}
}
};
fleegix.fx.Effecter.prototype.calcCurrVal=function(key){
var _b1=this.props[key][0];
var _b2=this.props[key][1];
var _b3=this.transitions[this.trans];
if(key.toLowerCase().indexOf("color")>-1){
var _b4=fleegix.fx.hexToRGB(_b1,true);
var _b5=fleegix.fx.hexToRGB(_b2,true);
var _b6=[];
for(var i=0;i<_b4.length;i++){
var s=_b4[i];
var e=_b5[i];
_b6.push(parseInt(_b3(this.timeSpent,s,(e-s),this.duration)));
}
return "rgb("+_b6.join()+")";
}else{
return _b3(this.timeSpent,_b1,(_b2-_b1),this.duration);
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
fleegix.uri=new function(){
var _d6=this;
this.params={};
this.getParamHash=function(str){
var q=str||_d6.getQuery();
var d={};
if(q){
var arr=q.split("&");
for(var i=0;i<arr.length;i++){
var _dc=arr[i].split("=");
var _dd=_dc[0];
var val=_dc[1];
if(typeof d[_dd]=="undefined"){
d[_dd]=val;
}else{
if(!(d[_dd] instanceof Array)){
var t=d[_dd];
d[_dd]=[];
d[_dd].push(t);
}
d[_dd].push(val);
}
}
}
return d;
};
this.getParam=function(_e0,str){
var p=null;
if(str){
var h=this.getParamHash(str);
p=h[_e0];
}else{
p=this.params[_e0];
}
return p;
};
this.setParam=function(_e4,val,str){
var ret=null;
if(str){
var pat=new RegExp("(^|&)("+_e4+"=[^&]*)(&|$)");
var arr=str.match(pat);
if(arr){
ret=str.replace(arr[0],arr[1]+_e4+"="+val+arr[3]);
}else{
ret=str+"&"+_e4+"="+val;
}
}else{
ret=_e4+"="+val;
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
fleegix.cookie=new function(){
this.set=function(_ee,_ef,_f0){
var _f1=_f0||{};
var exp="";
var t=0;
if(typeof _f0=="object"){
var _f4=_f1.path||"/";
var _f5=_f1.days||0;
var _f6=_f1.hours||0;
var _f7=_f1.minutes||0;
}else{
var _f4=optsParam||"/";
}
t+=_f5?_f5*24*60*60*1000:0;
t+=_f6?_f6*60*60*1000:0;
t+=_f7?_f7*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_ee+"="+_ef+exp+"; path="+_f4;
};
this.get=function(_f9){
var _fa=_f9+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_fa)==0){
return c.substring(_fa.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_fe,_ff){
var opts={};
opts.minutes=-1;
if(_ff){
opts.path=_ff;
}
this.set(_fe,"",opts);
};
};
fleegix.cookie.constructor=null;

