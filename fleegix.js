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
_1.win=null;
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
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.form={};
fleegix.form.serialize=function(_a,_b){
var _c=_b||{};
var _d="";
var _e;
var _f="";
for(i=0;i<_a.elements.length;i++){
_e=_a.elements[i];
switch(_e.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
_d+=_e.name+"="+encodeURI(_e.value)+"&";
break;
case "select-multiple":
var _10=false;
for(var j=0;j<_e.options.length;j++){
var _12=_e.options[j];
if(_12.selected){
if(_c.collapseMulti){
if(_10){
_d+=","+encodeURI(_12.value);
}else{
_d+=_e.name+"="+encodeURI(_12.value);
_10=true;
}
}else{
_d+=_e.name+"="+encodeURI(_12.value)+"&";
}
}
}
if(_c.collapseMulti){
_d+="&";
}
break;
case "radio":
if(_e.checked){
_d+=_e.name+"="+encodeURI(_e.value)+"&";
}
break;
case "checkbox":
if(_e.checked){
if(_c.collapseMulti&&(_e.name==_f)){
if(_d.lastIndexOf("&")==_d.length-1){
_d=_d.substr(0,_d.length-1);
}
_d+=","+encodeURI(_e.value);
}else{
_d+=_e.name+"="+encodeURI(_e.value);
}
_d+="&";
_f=_e.name;
}
break;
}
}
_d=_d.substr(0,_d.length-1);
return _d;
};
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
var _14=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
while(!this.req&&(i<_14.length)){
try{
this.req=_14[i++]();
}
catch(e){
}
}
if(this.req){
this.reqId=0;
}else{
alert("Could not create XMLHttpRequest object.");
}
this.doGet=function(url,_16,_17){
this.url=url;
this.handleResp=_16;
this.responseFormat=_17||"text";
return this.doReq();
};
this.doPost=function(url,_19,_1a,_1b){
this.url=url;
this.dataPayload=_19;
this.handleResp=_1a;
this.responseFormat=_1b||"text";
this.method="POST";
return this.doReq();
};
this.doReq=function(){
var _1c=null;
var req=null;
var id=null;
var _1f=[];
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
_1f=this.headers[i].split(": ");
req.setRequestHeader(_1f[i],_1f[1]);
}
this.headers=[];
}else{
if(this.method=="POST"){
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_1c=this;
req.onreadystatechange=function(){
var _21=null;
_1c.readyState=req.readyState;
if(req.readyState==4){
_1c.status=req.status;
_1c.statusText=req.statusText;
_1c.responseText=req.responseText;
_1c.responseXML=req.responseXML;
switch(_1c.responseFormat){
case "text":
_21=_1c.responseText;
break;
case "xml":
_21=_1c.responseXML;
break;
case "object":
_21=req;
break;
}
if(_1c.status>199&&_1c.status<300){
if(_1c.async){
if(!_1c.handleResp){
alert("No response handler defined "+"for this XMLHttpRequest object.");
return;
}else{
_1c.handleResp(_21,id);
}
}
}else{
_1c.handleErr(_21);
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
var _22;
try{
_22=window.open("","errorWin");
_22.document.body.innerHTML=this.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
this.setMimeType=function(_23){
this.mimeType=_23;
};
this.setHandlerResp=function(_24){
this.handleResp=_24;
};
this.setHandlerErr=function(_25){
this.handleErr=_25;
};
this.setHandlerBoth=function(_26){
this.handleResp=_26;
this.handleErr=_26;
};
this.setRequestHeader=function(_27,_28){
this.headers.push(_27+": "+_28);
};
};
fleegix.ajax.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.event=new function(){
var _29={};
this.subscribe=function(_2a,obj,_2c){
if(!obj){
return;
}
if(!_29[_2a]){
_29[_2a]={};
_29[_2a].audience=[];
}else{
this.unsubscribe(_2a,obj);
}
_29[_2a].audience.push([obj,_2c]);
};
this.unsubscribe=function(_2d,obj){
if(!obj){
_29[_2d]=null;
}else{
if(_29[_2d]){
var aud=_29[_2d].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_32){
if(_29[pub]){
aud=_29[pub].audience;
for(var i=0;i<aud.length;i++){
var _34=aud[i][0];
var _35=aud[i][1];
_34[_35](_32);
}
}
};
};
fleegix.event.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.xml=new function(){
var _36=this;
this.parse=function(_37,_38){
var _39=new Array;
var _3a;
var _3b=[];
if(_37.hasChildNodes()){
_39=_37.getElementsByTagName(_38);
_3a=_39[0];
for(var j=0;j<_39.length;j++){
_3a=_39[j];
_3b[j]=_36.xmlElem2Obj(_39[j]);
}
}
return _3b;
};
this.xmlElem2Obj=function(_3d){
var ret=new Object();
_36.setPropertiesRecursive(ret,_3d);
return ret;
};
this.setPropertiesRecursive=function(obj,_40){
if(_40.childNodes.length>0){
for(var i=0;i<_40.childNodes.length;i++){
if(_40.childNodes[i].nodeType==1&&_40.childNodes[i].firstChild){
if(_40.childNodes[i].childNodes.length==1){
obj[_40.childNodes[i].tagName]=_40.childNodes[i].firstChild.nodeValue;
}else{
obj[_40.childNodes[i].tagName]=[];
_36.setPropertiesRecursive(obj[_40.childNodes[i].tagName],_40.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_42){
var _43=_42;
for(var _44 in _43){
_43[_44]=cleanText(_43[_44]);
}
return _43;
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
var _48=str;
_48=_48.replace(/</g,"&lt;");
_48=_48.replace(/>/g,"&gt;");
return "<pre>"+_48+"</pre>";
};
this.getXMLDocElem=function(_49,_4a){
var _4b=[];
var _4c=null;
if(document.all){
var _4d=document.getElementById(_49).innerHTML;
var _4e=new ActiveXObject("Microsoft.XMLDOM");
_4e.loadXML(_4d);
_4c=_4e.documentElement;
}else{
_4b=window.document.body.getElementsByTagName(_4a);
_4c=_4b[0];
}
return _4c;
};
};
fleegix.xml.constructor=null;
if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.uri=new function(){
var _4f=this;
this.params={};
this.getParamHash=function(){
var _50=_4f.getQuery();
var arr=[];
var _52=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_50){
_50+="&";
while(arr=pat.exec(_50)){
_52[arr[1]]=arr[2];
}
}
return _52;
};
this.getParam=function(_55){
return _4f.params[_55];
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
this.set=function(_56,_57,_58){
var _59=_58||{};
var exp="";
var t=0;
var _5c=_59.path||"/";
var _5d=_59.days||0;
var _5e=_59.hours||0;
var _5f=_59.minutes||0;
t+=_5d?_5d*24*60*60*1000:0;
t+=_5e?_5e*60*60*1000:0;
t+=_5f?_5f*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_56+"="+_57+exp+"; path="+_5c;
};
this.get=function(_61){
var _62=_61+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_62)==0){
return c.substring(_62.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_66,_67){
var _68={};
_68.minutes=-1;
if(_67){
_68.path=_67;
}
this.set(_66,"",_68);
};
};
fleegix.cookie.constructor=null;

