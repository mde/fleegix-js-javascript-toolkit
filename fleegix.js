if(typeof fleegix=="undefined"){
var fleegix={};
}
fleegix.json=new function(){
this.serialize=function(_1){
var _2="";
switch(typeof _1){
case "object":
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
_2+=i+":";
_2+=(_1[i]==undefined)?"undefined":fleegix.json.serialize(_1[i]);
}
return "{"+_2+"}";
}
}
return _2;
break;
case "unknown":
case "undefined":
case "function":
return "undefined";
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
var _5=[function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
}];
while(!this.req&&(i<_5.length)){
try{
this.req=_5[i++]();
}
catch(e){
}
}
if(this.req){
this.reqId=0;
}else{
alert("Could not create XMLHttpRequest object.");
}
this.doGet=function(_6,_7,_8){
this.handleResp=_6;
this.url=_7;
this.responseFormat=_8||"text";
return this.doReq();
};
this.doPost=function(_9,_a,_b,_c){
this.handleResp=_9;
this.url=_a;
this.dataPayload=_b;
this.responseFormat=_c||"text";
this.method="POST";
return this.doReq();
};
this.doReq=function(){
var _d=null;
var _e=null;
var id=null;
var _10=[];
_e=this.req;
this.reqId++;
id=this.reqId;
if(this.username&&this.password){
_e.open(this.method,this.url,this.async,this.username,this.password);
}else{
_e.open(this.method,this.url,this.async);
}
if(this.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){
_e.overrideMimeType(this.mimeType);
}
if(this.headers.length){
for(var i=0;i<this.headers.length;i++){
_10=this.headers[i].split(": ");
_e.setRequestHeader(_10[i],_10[1]);
}
this.headers=[];
}else{
if(this.method=="POST"){
_e.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
}
_d=this;
_e.onreadystatechange=function(){
var _12=null;
_d.readyState=_e.readyState;
if(_e.readyState==4){
_d.status=_e.status;
_d.statusText=_e.statusText;
_d.responseText=_e.responseText;
_d.responseXML=_e.responseXML;
switch(_d.responseFormat){
case "text":
_12=_d.responseText;
break;
case "xml":
_12=_d.responseXML;
break;
case "object":
_12=_e;
break;
}
if(_d.status>199&&_d.status<300){
if(_d.async){
if(!_d.handleResp){
alert("No response handler defined "+"for this XMLHttpRequest object.");
return;
}else{
_d.handleResp(_12,id);
}
}
}else{
_d.handleErr(_12);
}
}
};
_e.send(this.dataPayload);
if(this.async){
return id;
}else{
return _e;
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
var _13;
try{
_13=window.open("","errorWin");
_13.document.body.innerHTML=this.responseText;
}
catch(e){
alert("An error occurred, but the error message cannot be"+" displayed because of your browser's pop-up blocker.\n"+"Please allow pop-ups from this Web site.");
}
};
this.setMimeType=function(_14){
this.mimeType=_14;
};
this.setHandlerResp=function(_15){
this.handleResp=_15;
};
this.setHandlerErr=function(_16){
this.handleErr=_16;
};
this.setHandlerBoth=function(_17){
this.handleResp=_17;
this.handleErr=_17;
};
this.setRequestHeader=function(_18,_19){
this.headers.push(_18+": "+_19);
};
};
fleegix.xhr.constructor=null;
fleegix.form={};
fleegix.form.serialize=function(_1a,_1b){
var _1c=_1b||{};
var s="";
var str="";
var _1f;
var _20="";
var pat=null;
if(_1c.stripTags){
pat=/<[^>]*>/g;
}
for(i=0;i<_1a.elements.length;i++){
_1f=_1a.elements[i];
switch(_1f.type){
case "text":
case "hidden":
case "password":
case "textarea":
case "select-one":
s=_1c.stripTags?_1f.value.replace(pat,""):_1f.value;
str+=_1f.name+"="+encodeURIComponent(s)+"&";
break;
case "select-multiple":
var _22=false;
for(var j=0;j<_1f.options.length;j++){
var _24=_1f.options[j];
if(_24.selected){
if(_1c.collapseMulti){
if(_22){
s=_1c.stripTags?_24.value.replace(pat,""):_24.value;
str+=","+encodeURIComponent(s);
}else{
s=_1c.stripTags?_24.value.replace(pat,""):_24.value;
str+=_1f.name+"="+encodeURIComponent(s);
_22=true;
}
}else{
s=_1c.stripTags?_24.value.replace(pat,""):_24.value;
str+=_1f.name+"="+encodeURIComponent(_24.value)+"&";
}
}
}
if(_1c.collapseMulti){
str+="&";
}
break;
case "radio":
if(_1f.checked){
s=_1c.stripTags?_1f.value.replace(pat,""):_1f.value;
str+=_1f.name+"="+encodeURIComponent(_1f.value)+"&";
}
break;
case "checkbox":
if(_1f.checked){
if(_1c.collapseMulti&&(_1f.name==_20)){
if(str.lastIndexOf("&")==str.length-1){
str=str.substr(0,str.length-1);
}
s=_1c.stripTags?_1f.value.replace(pat,""):_1f.value;
str+=","+encodeURIComponent(s);
}else{
s=_1c.stripTags?_1f.value.replace(pat,""):_1f.value;
str+=_1f.name+"="+encodeURIComponent(s);
}
str+="&";
_20=_1f.name;
}
break;
}
}
str=str.substr(0,str.length-1);
return str;
};
fleegix.popup=new function(){
var _25=this;
this.win=null;
this.open=function(url,_27){
var _28=_27||{};
var str="";
var _2a={"width":"","height":"","location":0,"menubar":0,"resizable":1,"scrollbars":0,"status":0,"titlebar":1,"toolbar":0};
for(var _2b in _2a){
str+=_2b+"=";
str+=_28[_2b]?_28[_2b]:_2a[_2b];
str+=",";
}
var len=str.length;
if(len){
str=str.substr(0,len-1);
}
if(!_25.win||_25.win.closed){
_25.win=null;
_25.win=window.open(url,"thePopupWin",str);
}else{
_25.win.focus();
_25.win.document.location=url;
}
};
this.close=function(){
if(_25.win){
_25.win.window.close();
_25.win=null;
}
};
this.goURLMainWin=function(url){
location=url;
_25.close();
};
};
fleegix.popup.constructor=null;
fleegix.event=new function(){
var _2e=[];
var _2f={};
this.listen=function(){
var _30=arguments[0];
var _31=arguments[1];
var _32=_30[_31]?_30[_31].listenReg:null;
if(!_32){
_32={};
_32.orig={};
_32.orig.obj=_30,_32.orig.methName=_31;
if(_30[_31]){
_32.orig.methCode=eval(_30[_31].valueOf());
}
_32.after=[];
_30[_31]=function(){
var _33=[];
for(var i=0;i<arguments.length;i++){
_33.push(arguments[i]);
}
fleegix.event.exec(_30[_31].listenReg,_33);
};
_30[_31].listenReg=_32;
_2e.push(_30[_31].listenReg);
}
if(typeof arguments[2]=="function"){
_32.after.push(arguments[2]);
}else{
_32.after.push([arguments[2],arguments[3]]);
}
_30[_31].listenReg=_32;
};
this.exec=function(reg,_36){
if(reg.orig.methCode){
reg.orig.methCode.apply(reg.orig.obj,_36);
}
if(reg.orig.methName.match(/onclick|ondblclick|onmouseup|onmousedown|onmouseover|onmouseout|onmousemove|onkeyup/)){
_36[0]=_36[0]||window.event;
}
for(var i=0;i<reg.after.length;i++){
var ex=reg.after[i];
if(ex.length==0){
var _39=ex;
_39(_36);
}else{
execObj=ex[0];
execMethod=ex[1];
execObj[execMethod].apply(execObj,_36);
}
}
};
this.unlisten=function(){
var _3a=arguments[0];
var _3b=arguments[1];
var _3c=_3a[_3b]?_3a[_3b].listenReg:null;
var _3d=null;
if(!_3c){
return false;
}
for(var i=0;i<_3c.after.length;i++){
var ex=_3c.after[i];
if(typeof arguments[2]=="function"){
if(ex==arguments[2]){
_3c.after.splice(i,1);
}
}else{
if(ex[0]==arguments[2]&&ex[1]==arguments[3]){
_3c.after.splice(i,1);
}
}
}
_3a[_3b].listenReg=_3c;
};
this.flush=function(){
for(var i=0;i<_2e.length;i++){
var reg=_2e[i];
removeObj=reg.orig.obj;
removeMethod=reg.orig.methName;
removeObj[removeMethod]=null;
}
};
this.subscribe=function(_42,obj,_44){
if(!obj){
return;
}
if(!_2f[_42]){
_2f[_42]={};
_2f[_42].audience=[];
}else{
this.unsubscribe(_42,obj);
}
_2f[_42].audience.push([obj,_44]);
};
this.unsubscribe=function(_45,obj){
if(!obj){
_2f[_45]=null;
}else{
if(_2f[_45]){
var aud=_2f[_45].audience;
for(var i=0;i<aud.length;i++){
if(aud[i][0]==obj){
aud.splice(i,1);
}
}
}
}
};
this.publish=function(pub,_4a){
if(_2f[pub]){
aud=_2f[pub].audience;
for(var i=0;i<aud.length;i++){
var _4c=aud[i][0];
var _4d=aud[i][1];
_4c[_4d](_4a);
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
var _50=this;
this.parse=function(_51,_52){
var _53=new Array;
var _54;
var _55=[];
if(_51.hasChildNodes()){
_53=_51.getElementsByTagName(_52);
_54=_53[0];
for(var j=0;j<_53.length;j++){
_54=_53[j];
_55[j]=_50.xmlElem2Obj(_53[j]);
}
}
return _55;
};
this.xmlElem2Obj=function(_57){
var ret=new Object();
_50.setPropertiesRecursive(ret,_57);
return ret;
};
this.setPropertiesRecursive=function(obj,_5a){
if(_5a.childNodes.length>0){
for(var i=0;i<_5a.childNodes.length;i++){
if(_5a.childNodes[i].nodeType==1&&_5a.childNodes[i].firstChild){
if(_5a.childNodes[i].childNodes.length==1){
obj[_5a.childNodes[i].tagName]=_5a.childNodes[i].firstChild.nodeValue;
}else{
obj[_5a.childNodes[i].tagName]=[];
_50.setPropertiesRecursive(obj[_5a.childNodes[i].tagName],_5a.childNodes[i]);
}
}
}
}
};
this.cleanXMLObjText=function(_5c){
var _5d=_5c;
for(var _5e in _5d){
_5d[_5e]=cleanText(_5d[_5e]);
}
return _5d;
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
var _62=str;
_62=_62.replace(/</g,"&lt;");
_62=_62.replace(/>/g,"&gt;");
return "<pre>"+_62+"</pre>";
};
this.getXMLDocElem=function(_63,_64){
var _65=[];
var _66=null;
if(document.all){
var _67=document.getElementById(_63).innerHTML;
var _68=new ActiveXObject("Microsoft.XMLDOM");
_68.loadXML(_67);
_66=_68.documentElement;
}else{
_65=window.document.body.getElementsByTagName(_64);
_66=_65[0];
}
return _66;
};
};
fleegix.xml.constructor=null;
fleegix.uri=new function(){
var _69=this;
this.params={};
this.getParamHash=function(){
var _6a=_69.getQuery();
var arr=[];
var _6c=[];
var ret=null;
var pat=/(\S+?)=(\S+?)&/g;
if(_6a){
_6a+="&";
while(arr=pat.exec(_6a)){
_6c[arr[1]]=arr[2];
}
}
return _6c;
};
this.getParam=function(_6f){
return _69.params[_6f];
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
this.set=function(_70,_71,_72){
var _73=_72||{};
var exp="";
var t=0;
var _76=_73.path||"/";
var _77=_73.days||0;
var _78=_73.hours||0;
var _79=_73.minutes||0;
t+=_77?_77*24*60*60*1000:0;
t+=_78?_78*60*60*1000:0;
t+=_79?_79*60*1000:0;
if(t){
var dt=new Date();
dt.setTime(dt.getTime()+t);
exp="; expires="+dt.toGMTString();
}else{
exp="";
}
document.cookie=_70+"="+_71+exp+"; path="+_76;
};
this.get=function(_7b){
var _7c=_7b+"=";
var arr=document.cookie.split(";");
for(var i=0;i<arr.length;i++){
var c=arr[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_7c)==0){
return c.substring(_7c.length,c.length);
}
}
return null;
};
this.create=this.set;
this.destroy=function(_80,_81){
var _82={};
_82.minutes=-1;
if(_81){
_82.path=_81;
}
this.set(_80,"",_82);
};
};
fleegix.cookie.constructor=null;

