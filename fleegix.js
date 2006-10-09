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
if(typeof fleegix=="undefined"){
var fleegix={};
}
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
if(typeof fleegix=="undefined"){
var fleegix={};
}
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

