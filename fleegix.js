if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.event=new function(){
var _1={};
this.subscribe=function(_2,_3,_4){
if(!_3){
return;
}
if(!_1[_2]){
_1[_2]={};
_1[_2].audience=[];
}else{
this.unsubscribe(_2,_3);
}
_1[_2].audience.push([_3,_4]);
};
this.unsubscribe=function(_5,_6){
if(!_6){
_1[_5]=null;
}else{
if(_1[_5]){
var _7=_1[_5].audience;
for(var i=0;i<_7.length;i++){
if(_7[i][0]==_6){
_7.splice(i,1);
}
}
}
}
};
this.publish=function(_9,_a){
if(_1[_9]){
aud=_1[_9].audience;
for(var i=0;i<aud.length;i++){
var _c=aud[i][0];
var _d=aud[i][1];
_c[_d](_a);
}
}
};
};
fleegix.event.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
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
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.cookie=new function(){
this.set=function(_e,_f,_10){
var _11=_10||{};
var exp="";
var t=0;
var _14=_11.path||"/";
var _15=_11.days||0;
var _16=_11.hours||0;
var _17=_11.minutes||0;
t+=_15?_15*24*60*60*1000:0;
t+=_16?_16*60*60*1000:0;
t+=_17?_17*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_e+"="+_f+exp+"; path="+_14;
};
this.get=function(_19){
var _1a=_19+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_1a)==0){
return c.substring(_1a.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_1e,_1f){
var _20={};
_20.minutes=-1;
if(_1f){
_20.path=_1f;
}
this.set(_1e,"",_20);
};
};
fleegix.cookie.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.form={};
fleegix.form.serialize=function(_21,_22){
var _23=_22||{};
var str="";
var _25;
var _26="";
for(i=0;i<_21.elements.length;i++){
_25=_21.elements[i];
switch(_25.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
str+=_25.name+"="+encodeURI(_25.value)+"&";
break;
case "select-multiple":
var _27=false;
for(var j=0;j<_25.options.length;j++){
var _29=_25.options[j];
if(_29.selected){
if(_23.collapseMulti){
if(_27){
str+=","+encodeURI(_29.value);
}else{
str+=_25.name+"="+encodeURI(_29.value);
_27=true;
}
}else{
str+=_25.name+"="+encodeURI(_29.value)+"&";
}
}
}
if(_23.collapseMulti){
str+="&";
}
break;
case "radio":
if(_25.checked){
str+=_25.name+"="+encodeURI(_25.value)+"&";
}
break;
case "checkbox":
if(_25.checked){
if(_23.collapseMulti&&(_25.name==_26)){
if(str.lastIndexOf("&")==str.length-1){
str=str.substr(0,str.length-1);
}
str+=","+encodeURI(_25.value);
}else{
str+=_25.name+"="+encodeURI(_25.value);
}
str+="&";
_26=_25.name;
}
break;
}
}
str=str.substr(0,str.length-1);
return str;
};
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.uri=new function(){
var _2a=this;
this.params={};
this.getParamHash=function(){
var _2b=_2a.getQuery();
var arr=[];
var _2d=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_2b){
_2b+="&";
while(arr=pat.exec(_2b)){
_2d[arr[1]]=arr[2];
}
}
return _2d;
};
this.getParam=function(_30){
return _2a.params[_30];
};
this.getQuery=function(){
return location.href.split("?")[1];
};
this.params=this.getParamHash();
};
fleegix.uri.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.popup=new function(){
var _31=this;
this.win=null;
this.open=function(url,_33){
var _34=_33||{};
var str="";
var _36={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _37 in _36){
str+=_37+"=";
str+=_34[_37]?_34[_37]:_36[_37];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_31.win||_31.win.closed){
_31.win=null;
_31.win=window.open(url,"thePopupWin",str);
}else{
_31.win.focus();
_31.win.document.location=url;
}
};
this.close=function(){
if(_31.win){
_31.win.window.close();
_31.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_31.close();
};
};
fleegix.popup.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.xml=new function(){
var _3a=this;
this.parse=function(_3b,_3c){
var _3d=new Array;
var _3e;
var _3f=[];
if(_3b.hasChildNodes()){
_3d=_3b.getElementsByTagName(_3c);
_3e=_3d[0];
for(var j=0;j<_3d.length;j++){
_3e=_3d[j];
_3f[j]=_3a.xmlElem2Obj(_3d[j]);
}
}
return _3f;
};
this.xmlElem2Obj=function(_41){
var ret=new Object();
_3a.setPropertiesRecursive(ret,_41);
return ret;
};
this.setPropertiesRecursive=function(obj,_44){
if(_44.childNodes.length>0){
for(var i=0;i<_44.childNodes.length;i++){
if(_44.childNodes[i].nodeType==1&&_44.childNodes[i].firstChild){
if(_44.childNodes[i].childNodes.length==1){
obj[_44.childNodes[i].tagName]=_44.childNodes[i].firstChild.nodeValue;
}else{
obj[_44.childNodes[i].tagName]=[];
_3a.setPropertiesRecursive(obj[_44.childNodes[i].tagName],_44.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_46){
var _47=_46;
for(var _48 in _47){
_47[_48]=cleanText(_47[_48]);
}
return _47;
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
var _4c=str;
_4c=_4c.replace(/</g,"&lt;");
_4c=_4c.replace(/>/g,"&gt;");
return "<pre>"+_4c+"</pre>";
};
this.getXMLDocElem=function(_4d,_4e){
var _4f=[];
var _50=null;
if(document.all){
var _51=document.getElementById(_4d).innerHTML;
var _52=new ActiveXObject("Microsoft.XMLDOM");
_52.loadXML(_51);
_50=_52.documentElement;
}else{
_4f=window.document.body.getElementsByTagName(_4e);
_50=_4f[0];
}
return _50;
};
};
fleegix.xml.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.ajax=new function(){
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
var _54=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
while(!this.req&&(i<_54.length)){
try{
this.req=_54[i++]();
}
catch(e){
}
}
if(this.req){
this.reqId=0;
}else{
alert("Could not create XMLHttpRequest object.");
}
this.doGet=function(url,_56,_57){
this.url=url;
this.handleResp=_56;
this.responseFormat=_57||"text";
return this.doReq();
};
this.doPost=function(url,_59,_5a,_5b){
this.url=url;
this.dataPayload=_59;
this.handleResp=_5a;
this.responseFormat=_5b||"text";
this.method="POST";
return this.doReq();
};
this.doReq=function(){
var _5c=null;
var req=null;
var id=null;
var _5f=[];
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
_5f=this.headers[i].split(": ");
req.setRequestHeader(_5f[i],_5f[1]);
}
this.headers=[];
}else{
if(this.method=="POST"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_5c=this;
req.onreadystatechange=function(){
var _61=null;
_5c.readyState=req.readyState;
if(req.readyState==4){
_5c.status=req.status;
_5c.statusText=req.statusText;
_5c.responseText=req.responseText;
_5c.responseXML=req.responseXML;
switch(_5c.responseFormat){
case "text":
_61=_5c.responseText;
break;
case "xml":
_61=_5c.responseXML;
break;
case "object":
_61=req;
break;
}
if(_5c.status>199&&_5c.status<300){
if(_5c.async){
if(!_5c.handleResp){
alert("No response handler defined "+"for this XMLHttpRequest object.");
return;
}else{
_5c.handleResp(_61,id);
}
}
}else{
_5c.handleErr(_61);
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
var _62;
try{
_62=window.open("","errorWin");
_62.document.body.innerHTML=this.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
this.setMimeType=function(_63){
this.mimeType=_63;
};
this.setHandlerResp=function(_64){
this.handleResp=_64;
};
this.setHandlerErr=function(_65){
this.handleErr=_65;
};
this.setHandlerBoth=function(_66){
this.handleResp=_66;
this.handleErr=_66;
};
this.setRequestHeader=function(_67,_68){
this.headers.push(_67+": "+_68);
};
};
fleegix.ajax.constructor=null;

