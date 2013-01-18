"use strict";if(window.util == undefined){var util={};}
util={version:"0.0.0a",author:"bubens van lyka"};Array.convert=function(a){return Array.prototype.slice.apply(a);};Function.bounce=function(x){return x;};Function.prototype.curry=function(){var _this=this,args=Array.convert(arguments);return function(){return _this.apply(this,args);}};Function.yes=Function.bounce.curry(true);Function.no=Function.bounce.curry(false);Function.prototype.type="function";Object.prototype.type="object";Array.prototype.type="array";String.prototype.type="string";Number.prototype.type="number";Date.prototype.type="date";function $(id){return document.getElementById(id);}
util.error=function(error){var e=new Error();e.name=error.what;e.message=error.why+" (at "+error.where+")";throw e;};util.error.version="0.0.0";util.leadZero=function(x){return(x>9)?""+x:"0"+x;}
util.element={create:function(tag,value,probs,css){var elem=document.createElement(tag),p,v;if(probs){for(p in probs){if(probs.hasOwnProperty(p)){elem[p]=probs[p];}}}
if(css){for(p in css){if(css.hasOwnProperty(p)){elem.style[p]=css[p];}}}
if(value){if(value.nodeType){if(value.nodeType===1||value.nodeType===3){elem.appendChild(value);}
else{util.error({what:"useless parameter",why:"can't handle node-type",where:"util.element.create"});}}
else{elem.innerHTML=value;}}
return elem;},empty:function(elem){var i,l;if(elem.nodeType){while(elem.firstChild){elem.removeChild(elem.firstChild);}
return true;}
else if(elem.type==="string"){util.element.empty($(elem));}
else if(elem.type==="array"){for(i=0,l=elem.length;i<l;i++){util.element.empty(elem[i]);}}
else{return false;}},getByClassName:function(className,parent){var p=parent||document,getThemAll=function(className,parent){var elements=parent.all||parent.getElementsByTagName("*"),clname=className.split(" "),i,l=elements.length,j,k=clname.length,e,c,t,tmp=[];for(j=0;j<k;j+=1){clname[j]=new RegExp("\\b"+clname[j]+"\\b");}
for(i=0;i<l;i+=1){e=elements[i];c=elm.className;if(c){t=true;for(j=0;j<k;j+=1){t=t&&clname[j].test(c);}
if(t){tmp.push(e);}}}
return tmp;};if(p.getElementsByClassName){return Array.convert(p.getElementsByClassName(className));}
return getThemAll(className,p);},version:"0.0.0"}
util.string={trim:function(str){str=str.replace(/^\s+/,"").replace(/\s+$/,"");return str;}}
util.time={twitterfy:function(date){var dif=((+new Date-date)/1000),days=Math.floor(dif/86400),str="";if(isNaN(days)||days<0){return null;}
if(days>31){return util.time.beautify(date);}
if(days===0){if(dif<60){return"gerade eben";}
else if(dif<120){return"vor 1 Minute";}
else if(dif<3600){return"vor "+(Math.floor(dif/60))+" Minuten";}
else if(dif<7200){return"vor 1 Stunde";}
else if(dif<86400){return"vor "+(Math.floor(dif/3600))+" Stunden";}}
else if(days==1){return"Gestern";}
else if(days<7){return"vor "+days+" Tagen";}
else if(days<=31){return"vor "+Math.ceil(days/7)+" Wochen";}},beautify:function(date){var date=new Date(date),str="";str+=util.leadZero(date.getDay())+".";str+=util.leadZero((date.getMonth()+1))+".";str+=util.leadZero((date.getYear()%100))+" (";str+=util.leadZero((date.getHours()))+":";str+=util.leadZero((date.getMinutes())+")");return str;}}
util.event={guid:1,add:function(element,type,handler){var handlers;if(element.addEventListener){element.addEventListener(type,handler,false);}
else{if(!handler.$$guid){handler.$$guid=addEvent.guid++;}
if(!element.events){element.events={};}
handlers=element.events[type];if(!handlers){handlers=element.events[type]={};if(element["on"+type]){handlers[0]=element["on"+type];}}
handlers[handler.$$guid]=handler;element["on"+type]=util.event.handle;}},remove:function(element,type,handler){if(element.removeEventListener){element.removeEventListener(type,handler,false);}
else{if(element.events&&element.events[type]){delete element.events[type][handler.$$guid];}}},handle:function(event){var returnValue=true;event=event||util.event.fix(((this.ownerDocument||this.document||this).parentWindow||window).event);var handlers=this.events[event.type];for(var i in handlers){this.$$handleEvent=handlers[i];if(this.$$handleEvent(event)===false){returnValue=false;}}
return returnValue;},fix:function(event){event.preventDefault=util.event.preventDefault;event.stopPropagation=util.event.stopPropagation;return event;},preventDefault:function(){this.returnValue=false;},stopPropagation:function(){this.cancelBubble=true;}}
util.keks=(function(){var ttd="Thu, 01 Jan 1970 00:01:00 GMT",testTtl=/^(\d+)([smhdy])$/i,objectify=function(str){str=str||document.cookie;if(str){var ck=str.split(";"),obj={},tmp,i;for(i=0;i<ck.length;i+=1){tmp=ck[i].split("=");obj[unescape(tmp[0])]=unescape(tmp[1]||tmp[0]);}
return obj;}
else{return{};}},parseTtl=function(ttl){var type=ttl.type||"error",res,now=+new Date;if(type!=="date"){if(type==="number"){return new Date(now+(ttl*1000*60*60*24));}
else if(type==="string"){if(!isNaN(+new Date(ttl))){return new Date(ttl);}
else if(!isNaN(ttl)){return new Date(now+(window.parseInt(ttl,10)*1000*60*60*24));}
else if(res=testTtl.exec(ttl)){switch(res[2].toLowerCase()){case"s":ttl=parseInt(res[1],10)*1000;break;case"m":ttl=parseInt(res[1],10)*1000*60;break;case"h":ttl=parseInt(res[1],10)*1000*60*60;break;case"d":ttl=parseInt(res[1],10)*1000*60*60*24;break;case"y":ttl=parseInt(res[1],10)*1000*60*60*24*365;break;default:util.error("huh?: "+res[0]);}
return new Date(now+ttl);}
else{util.error({what:"useless parameter",why:"can't handle ttl: "+ttl,where:"util.keks->parseTtl"});}}
else{util.error({what:"useless parameter",why:"can't handle ttl: "+ttl,where:"util.keks->parseTtl"});}}
else{return ttl;}},cookie=objectify(),keks=function(key){if(!key){return keks.getAs();}
else{if(keks.isSet(key)){return keks.get(key);}
else{return null;}}};keks.isSet=keks.isset=function(key){return(key)?(document.cookie.indexOf(key+"=")>=0):null;};keks.get=function(key){return cookie[key]||null;};keks.set=keks.modifie=function(key,value,expiration,path,domain,secure){var ext,str,p;if(key&&value&&key.toLowerCase){ext="";ext+=(expiration)?";expires="+parseTtl(expiration).toGMTString():"";ext+=(path)?";path="+path:"";ext+=(domain)?";domain="+domain:"";ext+=(secure)?";secure":"";document.cookie=escape(key)+"="+escape(value)+ext;cookie=objectify();return true;}
else if(typeof key==="object"&&!key.toLowerCase){str="";for(p in key){if(key.hasOwnProperty(p)){if(p.toLowerCase()==="expires"){str+="expires="+parseTtl(key[p])+";";}
else if(p.toLowerCase()==="secure"){str+=(key[p])?"secure;":"";}
else{str+=escape(p)+"="+escape(key[p])+";";}}}
document.cookie=str;cookie=objectify();return true;}
else{return false;}};keks.remove=function(key){var i;key=key.split(" ");for(i=0;i<key.length;i+=1){keks.set(key[i],"dummy",ttd);}
cookie=objectify();return true;};keks.getAs=keks.getas=function(t,seperator,connector,quotes){var type=t||"empty",tmp,i;switch(type.toLowerCase()){case("array"):tmp=[];for(i in cookie){if(cookie.hasOwnProperty(i)){tmp.push([i,cookie[i]]);}}
return tmp;case("string"):tmp=this.getAs("array");for(i=0;i<tmp.length;i+=1){if(quotes){tmp[i][1]=(typeof quotes==="string")?quotes+tmp[i][1]+quotes:"\""+tmp[i][1]+"\"";}
tmp[i]=tmp[i].join(connector||"=");}
return tmp.join(seperator||";");case("json"):return"{"+this.getAs("string",",",":",true)+"}";case("object"):case("empty"):return cookie;default:return null;}};keks.version="0.2.0";if(navigator.cookieEnabled){return keks;}
else{return null;}}());util.ajax=(function(){var ajax={},
getRequest=function(){return window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();};ajax.setRequest=function(type,url,orsc,headers){var request=getRequest(),p,q;request.open(type,url,true);request.setRequestHeader("X-Requested-With","XMLHttpRequest");if(headers&&headers.type=="object"){for(q in headers){if(headers.hasOwnProperty(q)){request.setRequestHeader(q,headers[q]);}}}
if(orsc.type==="object"){request.onreadystatechange=function(){if(request.status===4){for(p in orsc){if(orsc.hasOwnProperty(p)&&request.readyState===parseInt(p)){orsc[p](request);}}}}}
else{request.onreadystatechange=function(){if(request.readyState===4){orsc(request);}}}
return request;};ajax.get=function(url,params,orsc,headers){var request=ajax.setRequest("get",url,orsc);request.send(params);return true;};ajax.post=function(url,params,orsc,headers){var request=ajax.setRequest("post",url,orsc,{"Content-Type":"application/x-www-form-urlencoded"});request.send(params);};ajax.version="0.2.0";return ajax;}());util.Interval=function(fn,fr){var _this=this,to=null,iter=null,callback=null,active=false,callback=null,freq=function(t){var a=_this.frequence-(new Date().getTime()-t);return(a>=0)?a:0;},exec=function(){var t=+new Date;if(active){if(iter===null||iter>0){_this.fn();to=window.setTimeout(exec,freq(t));iter=(iter!==null)?iter-1:null;}
else{_this.stop();if(callback){callback();}}}
else{return null;}};this.fn=(fn.type==="function")?fn:util.error({what:"wrong type",where:"util.Interval",why:"fn must be function: "+fn});this.frequence=(!window.isNaN(fr))?window.parseInt(fr):util.error({what:"wrong type",where:"util.Interval",why:"fr must be number: "+fr});this.start=function(n,cb){if(n){iter=(!window.isNaN(n))?window.parseInt(n):util.error({what:"wrong type",where:"util.Interval->start",why:"n must be number: "+n});if(cb){callback=(cb.type==="function")?cb:util.error({what:"wrong type",where:"util.Interval->start",why:"callback must be function: "+callback});}}
active=true;exec();return _this;};this.stop=function(){window.clearTimeout(to);active=false;iter=null;return _this;};};util.Interval.version="0.1.1";util.Location=function(str){var obj={},match,endOfProtocol,endOfHostname;if(match=/^(mailto|javascript):(.*)$/.exec(str)){this.type=match[1];this.content=match[2];}
else{this.href=str;if((endOfProtocol=str.indexOf("://"))>=0){this.protocol=str.substring(0,endOfProtocol);str=str.replace("://","");};if(match=/\:\d+/.exec(str)){endOfHostname=str.indexOf(match[0]);this.hostname=str.substring(endOfProtocol,endOfHostname);this.port=str.substring(endOfHostname+1,endOfHostname=endOfHostname+match[0].length);str.replace(match[0],"");}
else{endOfHostname=str.indexOf("/");this.hostname=str.substring(endOfProtocol,endOfHostname);this.port="";};if(/\?/.test(str)){endOfPath=str.indexOf("?");if(/\#/.test(str)){endOfSearch=str.indexOf("#");this.pathname=str.substring(endOfHostname,endOfPath);this.search=str.substring(endOfPath,endOfSearch);this.hash=str.substring(endOfSearch,str.length);}
else{this.pathname=str.substring(endOfHostname,endOfPath);this.search=str.substring(endOfPath,str.length);this.hash="";};}
else if(/\#/.test(str)){endOfPath=str.indexOf("#");this.pathname=str.substring(endOfHostname,endOfPath);this.search="";this.hash=str.substring(endOfPath,str.length);}
else{this.pathname=str.substring(endOfHostname,str.length);this.search="";this.hash="";}};};util.Location.prototype={"goto":function(){location.href=this.href;},modifiePathname:function(newValue){this.pathname=newValue;this.href=this.protocol+"://"+this.hostname+":"+this.port+this.pathname+this.search;return this.href;},modifieSearch:function(key,value,replace){this.search=(!this.search||replace)?"?"+key+"="+value:this.search+"&"+key+"="+value;this.href=this.protocol+"://"+this.hostname+((this.port)?":"+this.port:"")+this.pathname+this.search;return this.href;}};util.json={parse:(function(){var at,ch,escapee={'"':'"','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'},text,error=function(m){throw{name:'SyntaxError',message:m,at:at,text:text};},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of '"+ch+"'");}
ch=text.charAt(at);at+=1;return ch;},number=function(){var number,string='';if(ch==='-'){string='-';next('-');}
while(ch>='0'&&ch<='9'){string+=ch;next();}
if(ch==='.'){string+='.';while(next()&&ch>='0'&&ch<='9'){string+=ch;}}
if(ch==='e'||ch==='E'){string+=ch;next();if(ch==='-'||ch==='+'){string+=ch;next();}
while(ch>='0'&&ch<='9'){string+=ch;next();}}
number=+string;if(isNaN(number)){error("Bad number");}else{return number;}},string=function(){var hex,i,string='',uffff;if(ch==='"'){while(next()){if(ch==='"'){next();return string;}else if(ch==='\\'){next();if(ch==='u'){uffff=0;for(i=0;i<4;i+=1){hex=parseInt(next(),16);if(!isFinite(hex)){break;}
uffff=uffff*16+hex;}
string+=String.fromCharCode(uffff);}else if(typeof escapee[ch]==='string'){string+=escapee[ch];}else{break;}}else{string+=ch;}}}
error("Bad string");},white=function(){while(ch&&ch<=' '){next();}},word=function(){switch(ch){case't':next('t');next('r');next('u');next('e');return true;case'f':next('f');next('a');next('l');next('s');next('e');return false;case'n':next('n');next('u');next('l');next('l');return null;}
error("Unexpected '"+ch+"'");},value,array=function(){var array=[];if(ch==='['){next('[');white();if(ch===']'){next(']');return array;}
while(ch){array.push(value());white();if(ch===']'){next(']');return array;}
next(',');white();}}
error("Bad array");},object=function(){var key,object={};if(ch==='{'){next('{');white();if(ch==='}'){next('}');return object;}
while(ch){key=string();white();next(':');if(Object.hasOwnProperty.call(object,key)){error('Duplicate key "'+key+'"');}
object[key]=value();white();if(ch==='}'){next('}');return object;}
next(',');white();}}
error("Bad object");};value=function(){white();switch(ch){case'{':return object();case'[':return array();case'"':return string();case'-':return number();default:return ch>='0'&&ch<='9'?number():word();}};return function(source,reviver){var result;text=source;at=0;ch=' ';result=value();white();if(ch){error("Syntax error");}
return typeof reviver==='function'?(function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}({'':result},'')):result;};}())};util.browser={onie:function(fn){var isie=true;isie=isie&&(/microsoft/i).test(navigator.appName);isie=isie&&(/msie/i).test(navigator.userAgent);if(isie){fn();}
fn=null;}};
