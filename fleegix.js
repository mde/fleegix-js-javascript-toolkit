if(typeof fleegix=="undefined"){
var fleegix={};
}
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
var _2=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
while(!this.req&&(i<_2.length)){
try{
this.req=_2[i++]();
}
catch(e){
}
}
if(this.req){
this.reqId=0;
}else{
alert("Could not create XMLHttpRequest object.");
}
this.doGet=function(_3,_4,_5){
this.url=_3;
this.handleResp=_4;
this.responseFormat=_5||"text";
return this.doReq();
};
this.doPost=function(_6,_7,_8,_9){
this.url=_6;
this.dataPayload=_7;
this.handleResp=_8;
this.responseFormat=_9||"text";
this.method="POST";
return this.doReq();
};
this.doReq=function(){
var _a=null;
var _b=null;
var id=null;
var _d=[];
_b=this.req;
this.reqId++;
id=this.reqId;
if(this.username&&this.password){
_b.open(this.method,this.url,this.async,this.username,this.password);
}else{
_b.open(this.method,this.url,this.async);
}
if(this.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_b.overrideMimeType(this.mimeType);
}
if(this.headers.length){
for(var i=0;i<this.headers.length;i++){
_d=this.headers[i].split(": ");
_b.setRequestHeader(_d[i],_d[1]);
}
this.headers=[];
}else{
if(this.method=="POST"){
_b.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_a=this;
_b.onreadystatechange=function(){
var _f=null;
_a.readyState=_b.readyState;
if(_b.readyState==4){
_a.status=_b.status;
_a.statusText=_b.statusText;
_a.responseText=_b.responseText;
_a.responseXML=_b.responseXML;
switch(_a.responseFormat){
case "text":
_f=_a.responseText;
break;
case "xml":
_f=_a.responseXML;
break;
case "object":
_f=_b;
break;
}
if(_a.status>199&&_a.status<300){
if(_a.async){
if(!_a.handleResp){
alert("No response handler defined "+"for this XMLHttpRequest object.");
return;
}else{
_a.handleResp(_f,id);
}
}
}else{
_a.handleErr(_f);
}
}
};
_b.send(this.dataPayload);
if(this.async){
return id;
}else{
return _b;
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
var _10;
try{
_10=window.open("","errorWin");
_10.document.body.innerHTML=this.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
this.setMimeType=function(_11){
this.mimeType=_11;
};
this.setHandlerResp=function(_12){
this.handleResp=_12;
};
this.setHandlerErr=function(_13){
this.handleErr=_13;
};
this.setHandlerBoth=function(_14){
this.handleResp=_14;
this.handleErr=_14;
};
this.setRequestHeader=function(_15,_16){
this.headers.push(_15+": "+_16);
};
};
fleegix.xhr.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(_17,_18){
var _19=_18||{};
var str="";
var _1b;
var _1c="";
for(i=0;i<_17.elements.length;i++){
_1b=_17.elements[i];
switch(_1b.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
str+=_1b.name+"="+encodeURI(_1b.value)+"&";
break;
case "select-multiple":
var _1d=false;
for(var j=0;j<_1b.options.length;j++){
var _1f=_1b.options[j];
if(_1f.selected){
if(_19.collapseMulti){
if(_1d){
str+=","+encodeURI(_1f.value);
}else{
str+=_1b.name+"="+encodeURI(_1f.value);
_1d=true;
}
}else{
str+=_1b.name+"="+encodeURI(_1f.value)+"&";
}
}
}
if(_19.collapseMulti){
str+="&";
}
break;
case "radio":
if(_1b.checked){
str+=_1b.name+"="+encodeURI(_1b.value)+"&";
}
break;
case "checkbox":
if(_1b.checked){
if(_19.collapseMulti&&(_1b.name==_1c)){
if(str.lastIndexOf("&")==str.length-1){
str=str.substr(0,str.length-1);
}
str+=","+encodeURI(_1b.value);
}else{
str+=_1b.name+"="+encodeURI(_1b.value);
}
str+="&";
_1c=_1b.name;
}
break;
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.popup=new function(){
var _20=this;
this.win=null;
this.open=function(url,_22){
var _23=_22||{};
var str="";
var _25={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _26 in _25){
str+=_26+"=";
str+=_23[_26]?_23[_26]:_25[_26];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_20.win||_20.win.closed){
_20.win=null;
_20.win=window.open(url,"thePopupWin",str);
}else{
_20.win.focus();
_20.win.document.location=url;
}
};
this.close=function(){
if(_20.win){
_20.win.window.close();
_20.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_20.close();
};
};
fleegix.popup.constructor=null;
fleegix.event=new function(){
var _29=[];
var _2a={};
this.listen=function(){
var _2b=arguments[0];
var _2c=arguments[1];
var _2d=_2b[_2c]?_2b[_2c].listenReg:null;
if(!_2d){
_2d={};
_2d.orig={};
_2d.orig.obj=_2b,_2d.orig.methName=_2c;
if(_2b[_2c]){
_2d.orig.methCode=eval(_2b[_2c].valueOf());
}
_2d.after=[];
_2b[_2c]=function(){
var _2e=[];
for(var i=0;i<arguments.length;i++){
_2e.push(arguments[i]);
}
fleegix.event.exec(_2b[_2c].listenReg,_2e);
};
_2b[_2c].listenReg=_2d;
_29.push(_2b[_2c].listenReg);
}
if(typeof arguments[2]=="function"){
_2d.after.push(arguments[2]);
}else{
_2d.after.push([arguments[2],arguments[3]]);
}
_2b[_2c].listenReg=_2d;
};
this.exec=function(reg,_31){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_31);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_31[0]=_31[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _34=ex;
_34(_31);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_31);
}
}
};
this.unlisten=function(){
var _35=arguments[0];
var _36=arguments[1];
var _37=_35[_36]?_35[_36].listenReg:null;
var _38=null;
if(!_37){
return false;
}
for(var i=0;i<_37.after.length;i++){
var ex=_37.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_37.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_37.after.splice(i,1);
}
}
}
_35[_36].listenReg=_37;
};
this.flush=function(){
for(var i=0;i<_29.length;i++){
var reg=_29[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_3d,obj,_3f){
if(!obj){
return;
}
if(!_2a[_3d]){
_2a[_3d]={};
_2a[_3d].audience=[];
}else{
this.unsubscribe(_3d,obj);
}
_2a[_3d].audience.push([obj,_3f]);
};
this.unsubscribe=function(_40,obj){
if(!obj){
_2a[_40]=null;
}else{
if(_2a[_40]){
var aud=_2a[_40].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_45){
if(_2a[pub]){
aud=_2a[pub].audience;
for(var i=0;i<aud.length;i++){
var _47=aud[i][0];
var _48=aud[i][1];
_47[_48](_45);
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
var _4b=this;
this.parse=function(_4c,_4d){
var _4e=new Array;
var _4f;
var _50=[];
if(_4c.hasChildNodes()){
_4e=_4c.getElementsByTagName(_4d);
_4f=_4e[0];
for(var j=0;j<_4e.length;j++){
_4f=_4e[j];
_50[j]=_4b.xmlElem2Obj(_4e[j]);
}
}
return _50;
};
this.xmlElem2Obj=function(_52){
var ret=new Object();
_4b.setPropertiesRecursive(ret,_52);
return ret;
};
this.setPropertiesRecursive=function(obj,_55){
if(_55.childNodes.length>0){
for(var i=0;i<_55.childNodes.length;i++){
if(_55.childNodes[i].nodeType==1&&_55.childNodes[i].firstChild){
if(_55.childNodes[i].childNodes.length==1){
obj[_55.childNodes[i].tagName]=_55.childNodes[i].firstChild.nodeValue;
}else{
obj[_55.childNodes[i].tagName]=[];
_4b.setPropertiesRecursive(obj[_55.childNodes[i].tagName],_55.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_57){
var _58=_57;
for(var _59 in _58){
_58[_59]=cleanText(_58[_59]);
}
return _58;
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
var _5d=str;
_5d=_5d.replace(/</g,"&lt;");
_5d=_5d.replace(/>/g,"&gt;");
return "<pre>"+_5d+"</pre>";
};
this.getXMLDocElem=function(_5e,_5f){
var _60=[];
var _61=null;
if(document.all){
var _62=document.getElementById(_5e).innerHTML;
var _63=new ActiveXObject("Microsoft.XMLDOM");
_63.loadXML(_62);
_61=_63.documentElement;
}else{
_60=window.document.body.getElementsByTagName(_5f);
_61=_60[0];
}
return _61;
};
};
fleegix.xml.constructor=null;
fleegix.uri=new function(){
var _64=this;
this.params={};
this.getParamHash=function(){
var _65=_64.getQuery();
var arr=[];
var _67=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_65){
_65+="&";
while(arr=pat.exec(_65)){
_67[arr[1]]=arr[2];
}
}
return _67;
};
this.getParam=function(_6a){
return _64.params[_6a];
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
this.set=function(_6b,_6c,_6d){
var _6e=_6d||{};
var exp="";
var t=0;
var _71=_6e.path||"/";
var _72=_6e.days||0;
var _73=_6e.hours||0;
var _74=_6e.minutes||0;
t+=_72?_72*24*60*60*1000:0;
t+=_73?_73*60*60*1000:0;
t+=_74?_74*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_6b+"="+_6c+exp+"; path="+_71;
};
this.get=function(_76){
var _77=_76+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_77)==0){
return c.substring(_77.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_7b,_7c){
var _7d={};
_7d.minutes=-1;
if(_7c){
_7d.path=_7c;
}
this.set(_7b,"",_7d);
};
};
fleegix.cookie.constructor=null;

