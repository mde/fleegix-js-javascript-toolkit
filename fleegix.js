if(typeof fleegix=="undefined"){var fleegix={}}fleegix.dom=new function(){var A=function(B){if(document.all){if(document.documentElement&&document.documentElement["client"+B]){return document.documentElement["client"+B]}else{return document.body["client"+B]}}else{return window["inner"+B]}};this.getViewportWidth=function(){return A("Width")};this.getViewportHeight=function(){return A("Height")};this.center=function(E){var B=E.offsetWidth;var C=E.offsetHeight;var D=fleegix.dom.getViewportWidth();var F=fleegix.dom.getViewportHeight();E.style.left=parseInt((D/2)-(B/2))+"px";E.style.top=parseInt((F/2)-(C/2))+"px";return true}};fleegix.form={};fleegix.form.serialize=function(F,B){var E=fleegix.form.toObject(F,B);var A=B||{};var H="";var G=null;if(A.stripTags){G=/<[^>]*>/g}for(var C in E){var K="";var I=E[C];if(I){if(typeof I=="string"){K=A.stripTags?I.replace(G,""):I;H+=C+"="+encodeURIComponent(K)}else{var J="";if(A.collapseMulti){J=",";H+=C+"="}else{J="&"}for(var D=0;D<I.length;D++){K=A.stripTags?I[D].replace(G,""):I[D];K=(!A.collapseMulti)?C+"="+encodeURIComponent(K):encodeURIComponent(K);H+=K+J}H=H.substr(0,H.length-1)}H+="&"}else{if(A.includeEmpty){H+=C+"=&"}}}H=H.substr(0,H.length-1);return H};fleegix.form.toObject=function(J,D){var A=D||{};var I={};function G(P,O){if(P){var N=null;if(typeof P=="string"){N=[];N.push(P)}else{N=P}N.push(O);return N}else{return O}}for(var H=0;H<J.elements.length;H++){elem=J.elements[H];if(elem.name){var M=elem.name.indexOf("[");var C=elem.name.indexOf("]");var L="";var B="";if(A.hierarchical&&(M>0)&&(C>2)){L=elem.name.substring(0,M);B=elem.name.substring(M+1,C);if(typeof I[L]=="undefined"){I[L]={}}var K=I[L];var E=B}else{var K=I;var E=elem.name}switch(elem.type){case"text":case"hidden":case"password":case"textarea":case"select-one":K[E]=elem.value||null;break;case"select-multiple":K[E]=null;for(var F=0;F<elem.options.length;F++){var D=elem.options[F];if(D.selected){K[E]=G(K[E],D.value)}}break;case"radio":if(typeof K[E]=="undefined"){K[E]=null}if(elem.checked){K[E]=elem.value}break;case"checkbox":if(typeof K[E]=="undefined"){K[E]=null}if(elem.checked){K[E]=G(K[E],elem.value)}break;case"submit":case"reset":case"file":case"image":case"button":if(A.pedantic){K[E]=elem.value||null}break}}}return I};fleegix.form.toHash=fleegix.form.toObject;fleegix.xhr=new function(){var A=null;function B(F){var E=0;var D=["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","Microsoft.XMLHTTP"];var C=null;if(window.XMLHttpRequest!=null){C=new XMLHttpRequest()}else{if(window.ActiveXObject!=null){if(A){C=new ActiveXObject(A)}else{for(var E=0;E<D.length;E++){try{C=new ActiveXObject(D[E]);A=D[E];break}catch(G){}}}}}if(C){if(F){return C}else{fleegix.xhr.transporters.push(C);var H=fleegix.xhr.transporters.length-1;return H}}else{throw ("Could not create XMLHttpRequest object.")}}this.transporters=[];this.maxTransporters=5;this.lastReqId=0;this.requestQueue=[];this.idleTransporters=[];this.processingMap={};this.processingArray=[];this.syncTransporter=B(true);this.syncRequest=null;this.debug=false;this.processingWatcherId=null;this.doGet=function(){var H={};var C=null;var E=Array.prototype.slice.apply(arguments);if(typeof E[0]=="function"){H.async=true;C=E.shift()}else{H.async=false}var D=E.shift();if(typeof E[0]=="object"){var F=E.shift();for(var G in F){H[G]=F[G]}}else{H.responseFormat=E.shift()||"text"}H.handleSuccess=C;H.url=D;return this.doReq(H)};this.doPost=function(){var I={};var C=null;var E=Array.prototype.slice.apply(arguments);if(typeof E[0]=="function"){I.async=true;C=E.shift()}else{I.async=false}var D=E.shift();var F=E.shift();if(typeof E[0]=="object"){var G=E.shift();for(var H in G){I[H]=G[H]}}else{I.responseFormat=E.shift()||"text"}I.handleSuccess=C;I.url=D;I.dataPayload=F;I.method="POST";return this.doReq(I)};this.doReq=function(F){var D=F||{};var C=new fleegix.xhr.Request();var G=null;for(var E in D){C[E]=D[E]}C.id=this.lastReqId;this.lastReqId++;if(C.async){if(this.idleTransporters.length){G=this.idleTransporters.shift()}else{if(this.transporters.length<this.maxTransporters){G=B()}}if(G!=null){this.processReq(C,G)}else{if(C.uber){this.requestQueue.unshift(C)}else{this.requestQueue.push(C)}}return C.id}else{return this.processReq(C)}};this.processReq=function(J,K){var L=this;var H=null;var M=null;var C="";var E=null;if(J.async){H=K;M=this.transporters[H];this.processingMap[J.id]=J;this.processingArray.unshift(J);J.transporterId=H}else{M=this.syncTransporter;this.syncRequest=J}if(J.preventCache){var D=new Date().getTime();C=J.url.indexOf("?")>-1?J.url+"&preventCache="+D:J.url+"?preventCache="+D}else{C=J.url}if(document.all){M.abort()}if(J.username&&J.password){M.open(J.method,C,J.async,J.username,J.password)}else{M.open(J.method,C,J.async)}if(J.mimeType&&navigator.userAgent.indexOf("MSIE")==-1){M.overrideMimeType(J.mimeType)}if(J.headers.length){for(var G=0;G<J.headers.length;G++){var F=J.headers[G].split(": ");M.setRequestHeader(F[G],F[1])}}else{if(J.method=="POST"){M.setRequestHeader("Content-Type","application/x-www-form-urlencoded")}}M.send(J.dataPayload);if(this.processingWatcherId==null){this.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10)}if(!J.async){var I=this.handleResponse(M,J);this.syncRequest=null;if(L.processingArray.length){L.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10)}return I}};this.getResponseByType=function(C,E){var D=null;switch(E.responseFormat){case"text":D=C.responseText;break;case"xml":D=C.responseXML;break;case"object":D=C;break}return D};this.watchProcessing=function(){var D=fleegix.xhr;var C=D.processingArray;var I=new Date().getTime();if(D.syncRequest!=null){return }else{for(var F=0;F<C.length;F++){var G=C[F];var E=D.transporters[G.transporterId];var H=((I-G.startTime)>(G.timeoutSeconds*1000));switch(true){case (G.aborted||!E.readyState):D.processingArray.splice(F,1);case H:D.processingArray.splice(F,1);D.timeout(G);break;case (E.readyState==4):D.processingArray.splice(F,1);D.handleResponse.apply(D,[E,G]);break}}}clearTimeout(D.processingWatcherId);if(D.processingArray.length){D.processingWatcherId=setTimeout(fleegix.xhr.watchProcessing,10)}else{D.processingWatcherId=null}};this.abort=function(E){var D=this.processingMap[E];var C=this.transporters[D.transporterId];if(C){C.onreadystatechange=function(){};C.abort();D.aborted=true;this.cleanupAfterReq(D);return true}else{return false}};this.timeout=function(C){if(fleegix.xhr.abort.apply(fleegix.xhr,[C.id])){if(typeof C.handleTimeout=="function"){C.handleTimeout()}else{alert("XMLHttpRequest to "+C.url+" timed out.")}}};this.handleResponse=function(C,D){var F=this.getResponseByType(C,D);if(D.handleAll){D.handleAll(F,D.id)}else{try{if((C.status>199&&C.status<300)||C.status==304){if(D.async){if(!D.handleSuccess){throw ("No response handler defined for this request");return }else{D.handleSuccess(F,D.id)}}else{return F}}else{if(!C.status){if(this.debug){throw ("XMLHttpRequest HTTP status either zero or not set.")}}else{if(D.handleErr){D.handleErr(F,D.id)}else{this.handleErrDefault(C)}}}}catch(E){if(this.debug){throw (E)}}}if(D.async){this.cleanupAfterReq(D)}return true};this.cleanupAfterReq=function(D){delete this.processingMap[D.id];if(this.requestQueue.length){var C=this.requestQueue.shift();C.startTime=new Date().getTime();this.processReq(C,D.transporterId)}else{this.idleTransporters.push(D.transporterId)}};this.handleErrDefault=function(D){var C;try{C=window.open("","errorWin");C.document.body.innerHTML=D.responseText}catch(E){alert("An error occurred, but the error message cannot be displayed because of your browser's pop-up blocker.\nPlease allow pop-ups from this Web site.")}}};fleegix.xhr.Request=function(){this.id=0;this.transporterId=null;this.url=null;this.status=null;this.statusText="";this.method="GET";this.async=true;this.dataPayload=null;this.readyState=null;this.responseText=null;this.responseXML=null;this.handleSuccess=null;this.handleErr=null;this.handleAll=null;this.handleTimeout=null;this.responseFormat="text",this.mimeType=null;this.username="";this.password="";this.headers=[];this.preventCache=false;this.startTime=new Date().getTime();this.timeoutSeconds=30;this.uber=false;this.aborted=false};fleegix.xhr.Request.prototype.setRequestHeader=function(B,A){this.headers.push(B+": "+A)};fleegix.event=new function(){var B=[];var A={};this.listen=function(){var G=arguments[0];var E=arguments[1];if(!G){throw ("fleegix.listen called on an object that does not exist.")}if(E=="onmousewheel"){if(window.addEventListener&&typeof G.onmousewheel=="undefined"){G.onmousewheel=null}}var D=G[E]?G[E].listenReg:null;if(!D){D={};D.orig={};D.orig.obj=G,D.orig.methName=E;if(G[E]){D.orig.methCode=G[E]}D.after=[];G[E]=function(){var L=G[E].listenReg;if(!L){throw ("Cannot execute handlers. Something (likely another JavaScript library) has removed the fleegix.event.listen handler registry.")}var I=[];for(var K=0;K<arguments.length;K++){I.push(arguments[K])}if(L.orig.methCode){L.orig.methCode.apply(L.orig.obj,I)}if(G.attachEvent||G.nodeType||G.addEventListener){var M=null;if(!I.length){try{switch(true){case !!(G.ownerDocument):M=G.ownerDocument.parentWindow.event;break;case !!(G.documentElement):M=G.documentElement.ownerDocument.parentWindow.event;break;case !!(G.event):M=G.event;break;default:M=window.event;break}}catch(O){M=window.event}}else{M=I[0]}if(M){if(typeof M.target=="undefined"){M.target=M.srcElement}if(typeof M.srcElement=="undefined"){M.srcElement=M.target}if(M.type=="DOMMouseScroll"||M.type=="mousewheel"){if(M.wheelDelta){M.delta=M.wheelDelta/120}else{if(M.detail){M.delta=-M.detail/3}}}I[0]=M}}for(var K=0;K<L.after.length;K++){var J=L.after[K];var N=null;var P=null;if(!J.context){N=J.method;P=window}else{N=J.context[J.method];P=J.context}if(typeof N!="function"){throw (N+" is not an executable function.")}else{N.apply(P,I)}M=I[0];if(J.stopPropagation){if(M.stopPropagation){M.stopPropagation()}else{M.cancelBubble=true}}if(J.preventDefault){if(M.preventDefault){M.preventDefault()}else{M.returnValue=false}}}};G[E].listenReg=D;B.push(G[E].listenReg);if(E=="onmousewheel"){if(window.addEventListener){G.addEventListener("DOMMouseScroll",G.onmousewheel,false)}}}var F={};var H={};if(typeof arguments[2]=="function"){F.method=arguments[2];H=arguments[3]||{}}else{F.context=arguments[2];F.method=arguments[3];H=arguments[4]||{}}for(var C in H){F[C]=H[C]}D.after.push(F);G[E].listenReg=D};this.unlisten=function(){var H=arguments[0];var E=arguments[1];var D=H[E]?H[E].listenReg:null;var C=null;if(!D){return false}for(var F=0;F<D.after.length;F++){var G=D.after[F];if(typeof arguments[2]=="function"){if(G.method==arguments[2]){D.after.splice(F,1)}}else{if(G.context==arguments[2]&&G.method==arguments[3]){D.after.splice(F,1)}}}H[E].listenReg=D};this.flush=function(){for(var C=0;C<B.length;C++){var D=B[C];removeObj=D.orig.obj;removeMethod=D.orig.methName;removeObj[removeMethod]=null}};this.subscribe=function(C,D,E){if(!D){return }if(!A[C]){A[C]={};A[C].audience=[]}else{this.unsubscribe(C,D)}A[C].audience.push([D,E])};this.unsubscribe=function(E,D){if(!D){A[E]=null}else{if(A[E]){var F=A[E].audience;for(var C=0;C<F.length;C++){if(F[C][0]==D){F.splice(C,1)}}}}};this.publish=function(F,G){if(A[F]){var H=A[F].audience;for(var D=0;D<H.length;D++){var C=H[D][0];var E=H[D][1];C[E](G)}}};this.getSrcElementId=function(D){var C=null;if(D.srcElement){C=D.srcElement}else{if(D.target){C=D.target}}if(typeof C.id=="undefined"){return null}else{while(!C.id||C.nodeType==3){if(C.parentNode){C=C.parentNode}else{return null}}}return C.id}};fleegix.event.listen(window,"onunload",fleegix.event,"flush");fleegix.uri=new function(){var A=this;this.params={};this.getParamHash=function(I){var B=I||A.getQuery();var H={};if(B){var G=B.split("&");for(var F=0;F<G.length;F++){var E=G[F].split("=");var C=E[0];var D=E[1];if(typeof H[C]=="undefined"){H[C]=D}else{if(!(H[C] instanceof Array)){var J=H[C];H[C]=[];H[C].push(J)}H[C].push(D)}}}return H};this.getParam=function(B,E){var D=null;if(E){var C=this.getParamHash(E);D=C[B]}else{D=this.params[B]}return D};this.setParam=function(E,G,F){var D=null;if(F){var C=new RegExp("(^|&)("+E+"=[^&]*)(&|$)");var B=F.match(C);if(B){D=F.replace(B[0],B[1]+E+"="+G+B[3])}else{D=F+"&"+E+"="+G}}else{D=E+"="+G}return D};this.getQuery=function(C){var B=C?C:location.href;return B.split("?")[1]};this.getBase=function(C){var B=C?C:location.href;return B.split("?")[0]};this.params=this.getParamHash()};fleegix.fx=new function(){this.fadeOut=function(D,C){return A(D,C,"out")};this.fadeIn=function(D,C){return A(D,C,"in")};this.blindUp=function(D,C){var E=C||{};E.blindType=E.blindType||"height";return B(D,E,"up")};this.blindDown=function(D,C){var E=C||{};E.blindType=E.blindType||"height";return B(D,E,"down")};this.setCSSProp=function(D,E,C){if(E=="opacity"){if(document.all){D.style.filter="alpha(opacity="+C+")"}else{var F=C/100;D.style.opacity=F}}else{if(E=="clip"||E.toLowerCase().indexOf("color")>-1){D.style[E]=C}else{D.style[E]=document.all?parseInt(C)+"px":C+"px"}}return true};this.hexPat=/^[#]{0,1}([\w]{1,2})([\w]{1,2})([\w]{1,2})$/;this.hex2rgb=function(G){var C=[];var F=G.match(this.hexPat);if(F){for(var D=1;D<F.length;D++){var E=F[D];E=E.length==1?E+E:E;C.push(parseInt(E,16))}return C}else{throw ("\""+G+"\" not a valid hex value.")}};function A(F,E,C){var D=C=="in"?0:100;var H=C=="in"?100:0;var I={props:{opacity:[D,H]},trans:"lightEaseIn"};for(var G in E){I[G]=E[G]}return new fleegix.fx.Effecter(F,I)}function B(G,D,H){var F={};var M=0;var I=0;if(D.blindType=="clip"){M=H=="down"?0:G.offsetHeight;I=H=="down"?G.offsetHeight:0;M=[0,G.offsetWidth,M,0];I=[0,G.offsetWidth,I,0];F.props={clip:[M,I]}}else{if(H=="down"){if(D.endHeight){I=D.endHeight}else{G.style.height="";var J=document.createElement("div");J.position="absolute";J.style.top="-9999999999px";J.style.left="-9999999999px";var K=G.parentNode;var C=K.removeChild(G);J.appendChild(C);document.body.appendChild(J);I=C.offsetHeight;G=J.removeChild(C);var L=document.body.removeChild(J);G.style.height="0px";K.appendChild(G)}M=0}else{M=G.offsetHeight;I=0}F.props={height:[M,I]}}for(var E in D){F[E]=D[E]}F.trans="lightEaseIn";return new fleegix.fx.Effecter(G,F)}};fleegix.fx.Effecter=function(C,B){var A=this;this.props=B.props;this.trans=B.trans||"lightEaseIn";this.duration=B.duration||500;this.fps=30;this.startTime=new Date().getTime();this.timeSpent=0;this.doOnStart=B.doOnStart||null;this.doAfterFinished=B.doAfterFinished||null;this.autoStart=B.autoStart==false?false:true;if(typeof this.transitions[this.trans]!="function"){throw ("\""+this.trans+"\" is not a valid transition.")}this.start=function(){A.id=setInterval(function(){A.doStep.apply(A,[C])},Math.round(1000/A.fps));if(typeof B.doOnStart=="function"){A.doOnStart()}};if(this.autoStart){this.start()}return this};fleegix.fx.Effecter.prototype.doStep=function(C){var B=new Date().getTime();var D=this.props;if(B<(this.startTime+this.duration)){this.timeSpent=B-this.startTime;for(var A in D){fleegix.fx.setCSSProp(C,A,this.calcCurrVal(A))}}else{for(var A in D){if(A=="clip"){fleegix.fx.setCSSProp(C,A,"rect("+D[A][1].join("px,")+"px)")}else{fleegix.fx.setCSSProp(C,A,D[A][1])}}clearInterval(this.id);if(typeof this.doAfterFinished=="function"){this.doAfterFinished()}}};fleegix.fx.Effecter.prototype.calcCurrVal=function(G){var A=this.props[G][0];var F=this.props[G][1];var I=this.transitions[this.trans];if(G.toLowerCase().indexOf("color")>-1){var B=fleegix.fx.hex2rgb(A);var D=fleegix.fx.hex2rgb(F);var J=[];for(var C=0;C<B.length;C++){var H=B[C];var E=D[C];J.push(parseInt(I(this.timeSpent,H,(E-H),this.duration)))}return"rgb("+J.join()+")"}else{if(G=="clip"){var B=A;var D=F;var J=[];for(var C=0;C<B.length;C++){var H=B[C];var E=D[C];J.push(parseInt(I(this.timeSpent,H,(E-H),this.duration)))}return"rect("+J.join("px,")+"px)"}else{return I(this.timeSpent,A,(F-A),this.duration)}}};fleegix.fx.Effecter.prototype.transitions={linear:function(B,A,D,C){return D*(B/C)+A},lightEaseIn:function(B,A,D,C){return D*(B/=C)*B+A},lightEaseOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A},lightEaseInOut:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A}return -D/2*((--B)*(B-2)-1)+A},heavyEaseIn:function(B,A,D,C){return D*(B/=C)*B*B+A},heavyEaseOut:function(B,A,D,C){return D*((B=B/C-1)*B*B+1)+A},heavyEaseInOut:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B+A}return D/2*((B-=2)*B*B+2)+A}};fleegix.json=new function(){this.serialize=function(B){var C="";switch(typeof B){case"object":if(B==null){return"null"}else{if(B instanceof Array){for(var A=0;A<B.length;A++){if(C){C+=","}C+=fleegix.json.serialize(B[A])}return"["+C+"]"}else{if(typeof B.toString!="undefined"){for(var A in B){if(C){C+=","}C+="\""+A+"\":";if(typeof B[A]=="undefined"){C+="\"undefined\""}else{C+=fleegix.json.serialize(B[A])}}return"{"+C+"}"}}}return C;break;case"unknown":case"undefined":case"function":return"\"undefined\"";break;case"string":C+="\""+B.replace(/(["\\])/g,"\\$1").replace(/\r/g,"").replace(/\n/g,"\\n")+"\"";return C;break;default:return String(B);break}}};fleegix.cookie=new function(){this.set=function(B,H,E){var A=E||{};var F="";var J=0;if(typeof E=="object"){var K=A.path||"/";var I=A.days||0;var G=A.hours||0;var D=A.minutes||0}else{var K=optsParam||"/"}J+=I?I*24*60*60*1000:0;J+=G?G*60*60*1000:0;J+=D?D*60*1000:0;if(J){var C=new Date();C.setTime(C.getTime()+J);F="; expires="+C.toGMTString()}else{F=""}document.cookie=B+"="+H+F+"; path="+K};this.get=function(B){var D=B+"=";var A=document.cookie.split(";");for(var C=0;C<A.length;C++){var E=A[C];while(E.charAt(0)==" "){E=E.substring(1,E.length)}if(E.indexOf(D)==0){return E.substring(D.length,E.length)}}return null};this.create=this.set;this.destroy=function(A,C){var B={};B.minutes=-1;if(C){B.path=C}this.set(A,"",B)}};fleegix.css=new function(){this.addClass=function(B,A){fleegix.css.removeClass(B,A);var C=B.className;B.className=C+=" "+A};this.removeClass=function(C,B){var D=C.className;var A="\\b"+B+"\\b";A=new RegExp(A);D=D.replace(A,"");C.className=D}}