// ==========================================================================
// OpenPanel - The Open Source Control Panel
// Copyright (c) 2006-2007 PanelSix
//
// This software and its source code are subject to version 2 of the
// GNU General Public License. Please be aware that use of the OpenPanel
// and PanelSix trademarks and the IconBase.com iconset may be subject
// to additional restrictions. For more information on these restrictions
// and for a copy of version 2 of the GNU General Public License, please
// visit the Legal and Privacy Information section of the OpenPanel
// website on http://www.openpanel.com/
// ==========================================================================

var ELEMENT_NODE = 1;
function addListener(oNode, sEventType, fnHandler)
{
	if(oNode[sEventType]) 
	{
		var oldfuncs = oNode[sEventType];
	}

	oNode[sEventType] = function ()
	{
		//if (oldfuncs) oldfuncs( oNode);
		fnHandler( oNode );
	}
}

MOUSEWHEEl = 0;

function popapp(url, title )
{
	var arg = "toolbar=yes";
	arg = arg + ",resizable=yes";
	arg = arg + ",titlebar=0";
	arg = arg + ",location=0";
	arg = arg + ",directories=0";
	arg = arg + ",status=0";
	arg = arg + ",scrollbars=0";
	arg = arg + ",menubar=0";
	arg = arg + ",width=900";
	arg = arg + ",height=480";
	arg = arg + ",maximize=0";
	 
	window.open(url,title, arg);
}


function clearSelect()
{
	if( typeof(document.selection)!="undefined") 
	{
		if(document.selection && document.selection.empty) 
		{
			document.selection.empty();
		}
	} 
	else if (window.getSelection) 
	{		
		var selobj = window.getSelection();
		if (ff) //< from browser.js
		{
			selobj.removeAllRanges();
		}
	}
	
	return;
}

function isAlien(a){ return isObject(a) && typeof(a.constructor) != 'function';}
function isArray(a){ return isObject(a) && a.constructor == Array; }
function isBoolean(a){ return typeof(a) == 'boolean'; }
function isFunction(a){ return typeof(a) == 'function'; }
function isNull(a){ return a === null; }
function isInt(a){ return typeof(a) == 'number'; }
function isObject(a){ return (a && typeof(a) == 'object') || isFunction(a); }
function isString(a){ return typeof(a) == 'string'; }
function undef(a){ return typeof(a) == 'undefined'; }
function isFormElement(a){ return a.constructor=='[HTMLInputElement]'; }

function empty(a,loosly)
{
	if (undef(a)) return true;
	if (isNull(a)) return true;
	if (isInt(a)) return a < 1 ;
	if (!undef(loosly) && a.match(/^[0-9]+$/)) return parseInt(a,10) == 0;
	if(isBoolean(a)) return !a;
	
	return count(a) < 1;
}
function count(a) 
{

	if (undef(a)) return 0;
	if(isString(a)) return a.length;
	 
	var c = 0;
	for (var i in a ) c++;
	return c;
}

function listkeys( obj , returndata)
{
	var ll = '';
	for (var i in obj)
	{
		ll = ll + i +' => '+obj[i]+"\n";
	}
	if (!undef(returndata)) return ll;
	alert(ll);
}


function printObj(obj)
{
	var ll = '';
	for (var i in obj) // uuid
	{
		ll = ll + "> " + i + "\n";	
		for (var y in obj[i]) //class
		{
			ll = ll + ">> " + y +" \n";
			ll = ll + listkeys(obj[i][y],1);
		}
		ll = ll +" \n ---------------------\n";
	}
	if (!undef(arguments[1]))  return ll;
	alert(ll);
}


function key (obj)
{
	for (i in obj)
	{
		return i;
	}
}
function getkey (obj)
{
	for (i in obj)
	{
		return i;
	}
}
function getkeys (obj)
{
	var ret = new Array();
	for (i in obj)
	{
		ret.push(i);
	}
	return ret;
}
function array_unique( _array )
{
	var tmp = new Array();
	for( var i = 0; i < _array.length; i++)
	{
		if (!in_array(_array[i],tmp))
		{
			tmp.push(_array[i]);
		}
	}
	return tmp;
}

function key_exists ( key, obj )
{
	if(empty(key) || empty(obj)) return false;	
	
	for (var i in obj ) 
	{
		if (i == key ) return true;
	}
	return false;
}

function in_object( value, object )
{
	if (!isObject(object)) return false;
	for (var i in object)
	{
		if (object[i] == value) return true;
	}
	return false;
}
function return_key( value, object)
{
	if (!isObject(object)) return false;
	for (var i in object)
	{
		if (object[i] == value) return i;
	}
	return false;	
}

function in_array( item, array )
{
	for (var i =0; i < array.length; i++)
	{
		if (item == array[i]) return true;
	}
	return false;
}

function createNamedElement (type, name) 
{
  var element;
  try 
  {
    element = document.createElement('<'+type+' name="'+name+'">');
  } 
  catch (e) { }
  
  if (!element || !element.name) // Not in IE, then
  { 
    element = document.createElement(type)
    element.name = name;
  }
  return element;
}


function copyobject( obj )
{
	var tmp = new Object();
	for (i in obj)
	{
		tmp[i] = obj[i];
	}
	return tmp;
}
function getAttributes(name, obj)
{
	// normal browsers implement <div>.hasAttributes()
	// and hasAttribute(<name>);
	// thanx ms!
	
	if (!undef(obj.attributes) && isObject(obj.attributes) )
	{		
		if (ie)
		{
			for(var i =0; i < obj.attributes.length; i++)
			{
				if ( obj.attributes[i].nodeName == name) 
				{
					return obj.attributes[i].nodeValue;
				}
			}
		}
		else
		{
			if( obj.hasAttributes() && obj.hasAttribute(name))
			{
				return obj.getAttribute(name);
			}
		}
	}
	return false;
}

function getAllAttributes(obj)
{
	// normal browsers implement <div>.hasAttributes()
	// and hasAttribute(<name>);
	// thanx ms!
	
	var ret = new Object();
	if (!undef(obj.attributes) && isObject(obj.attributes) )
	{		
		for(var i =0; i < obj.attributes.length; i++)
		{
			if ( isString(obj.attributes[i].nodeValue)) 
			{
				ret[obj.attributes[i].nodeName] = obj.attributes[i].nodeValue;
			}
		}
		return ret;
	}
	return false;
}


function returnTextLength( txt )
{
	if (undef(window.bodynode))
	{
		window.bodynode = document.getElementsByTagName('body')[0];
	}
	
	var temptext = document.createElement('div');
	temptext.className='fll';
	temptext.style.visibility = 'hidden';
	
	var tmptxr = document.createTextNode( txt );
	temptext.appendChild(tmptxr);
	window.bodynode.appendChild(temptext);
	
	var textlength = temptext.offsetWidth;
	window.bodynode.removeChild(temptext);
	
	return textlength;
}


// ====================================================
// browser
// ====================================================
// ----------------------------------------------------
//	document.layers				NS 4                          
//	document.all 				IE 4+                            
//	window.opera 				Opera of some version            
//	document.getElementById 	IE5+ OR NS6+/ Firefox
//  document.getElementById 	NS6+ OR Firefox
//  && !document.all                                                       
// ----------------------------------------------------

var opera = window.opera ? true : false;
var ie = false;
var ie4	 = document.all ? true : false;
var ie5	 = document.getElementById ? true : false;
var ie6 	 = false;
var ie7	= false;
var ns4 	 = document.layers ? true : false;
var ns5 	 = ie5;
var ff	 = document.getElementById && !document.all;

// Detecting not only Safari but WebKit-based browsers
var safari = (navigator.userAgent.indexOf("AppleWebKit") !=-1); 


if (document.getElementById || document.getElementById && !document.all)
{
	if (navigator.appVersion.indexOf("MSIE")!=-1)
	{
		temp=navigator.appVersion.split("MSIE")
		version=parseFloat(temp[1])
		ie7 = version > 6;
		ie6 = version > 5.5;
		ie5 = version < 5.6;
		ie4 = version < 5;
		ie = true;
	}	
	else
	{
		ie4 = ie5 = ie6 = ie = false;
		ff = navigator.userAgent.indexOf("Firefox")!=-1 ? true : false;
		ns5 = !ff;
	}	
}

if (false)
{
	alert(
		""
		+"opera: "+ typeof(opera)+" -- "+ opera +"\n"
		+"ie5: "+ typeof(ie5)+" -- "+ ie5 +"\n"
		+"ie6: "+ typeof(ie6)+" -- "+ ie6 +"\n"
		+"ns4: "+ typeof(ns4)+" -- "+ ns4 +"\n"
		+"ns5: "+ typeof(ns5)+" -- "+ ns5 +"\n"
		+"ff: "+ typeof(ff)+" -- "+ ff +"\n"
		+"safari: "+ typeof(safari)+" -- "+ safari +"\n"
	);
}



var obj_browser = function( )
{
	this.window = new Object();
	this.getWinSize();
	
	switch ( true )
	{
		case (ie4 || ie5 || ie6 || ie7) : this.make = 'ie'; break;
		case (ff) : this.make = 'firefox'; break;
		case (ns4 ||ns5): this.make='ns'; break;
		case (safari) : this.make = 'safari'; break;
		case (opera) : this.make = 'opera'; break;
	}
	
	this.win32 = navigator.platform.indexOf('Win') !=-1;
	this.os = navigator.platform;
	
}

obj_browser.prototype.getWinSize = function()
{
	if( typeof( window.innerWidth ) == 'number' ) 
	{

		this.window['width'] = window.innerWidth;
		this.window['height'] = window.innerHeight;
	} 
	else if( document.documentElement 
		&& ( document.documentElement.clientWidth 
		|| document.documentElement.clientHeight ) ) 
	{
		this.window['width'] = document.documentElement.clientWidth;
		this.window['height'] = document.documentElement.clientHeight;
	} 
	else if( document.body 
		&& ( document.body.clientWidth || document.body.clientHeight )) 
	{

		this.window['width'] = document.body.clientWidth;
		this.window['height'] = document.body.clientHeight;
	}
}


function sleep ( millisec )
{
	var now = new Date();
	var exitTime = now.getTime() + millisec;
	while (true) 
	{
		now = new Date();
		if (now.getTime() > exitTime) return;
	} 
}

// ==========================================================================
// string
// ==========================================================================
function rtrim(sString)
{
	if (!isString(sString)) return sString;
	while (sString.substring(sString.length-1, sString.length) == ' ')
	{
		sString = sString.substring(0,sString.length-1);
	}
	return sString;
}

function ltrim(sString)
{
	if (!isString(sString)) return sString;
	while (sString.substring(0,1) == ' ')
	{
		sString = sString.substring(1, sString.length);
	}
	return sString;
}

function trim(sString)
{
	if (!isString(sString)) return sString;
	sString = rtrim(sString);
	sString = ltrim(sString);
	return sString;
}

// ----------------------------------------------------------
// version 0.0.1 just %s <- with no padding etc
// ----------------------------------------------------------
function sprintf()
{
	if (!arguments || arguments.length < 1 || !RegExp) return;

	var str = arguments[0];
	var pstr = str.split('%s');
	var r_str = '';
	for (var i = 0; i < pstr.length; i++)
	{
		r_str = r_str + pstr[i] + ((i+1 )< pstr.length ? arguments[i+1] : '');
	}
	return !empty(r_str) ? r_str : arguments[0];

}
// ==========================================================================
// Divs & DOM
// ==========================================================================

function getDivsByAttribute( attrib, val )
{
	if (undef(attrib)) return false;
	
	var l = document.getElementsByTagName('div');
	if (l.length > 0)
	{
		var found = new Array();
		var found_cnt = 0;
		for (var i=0; i<l.length; i++)
		{
			if (l[i].getAttribute( attrib )  == val)
			{
				found.push(l[i]);
				found_cnt++;
			}
		}
		
		if (found_cnt > 0)
		{
			return found;
		}
	}
	return false;
}

function getDivs(element){
	var resultArray = new Array();
	_getDivs(element, resultArray);
	return resultArray;
}

function _getDivs(element, resultArray){
	for (var i = 0; i < element.childNodes.length; i++) {
		var childElement = element.childNodes[i];
		if(childElement.nodeType == 1){
			resultArray.push(childElement);
		}
		_getDivs(childElement, resultArray);
	}
	return resultArray;
}

// ==========================================================================
// Dragging
// ==========================================================================

var dragObj = new Object();
dragObj.zIndex = 0;


function dragStart(event, id) 
{

	var el;
	var x, y;
	
	if (id)
	{
		dragObj.oNode = document.getElementById(id);
	}
	else 
	{
		if (ie) dragObj.oNode = ie ? window.event.srcElement : event.target;
		if (dragObj.oNode.nodeType == 3) 
		{
			dragObj.oNode = dragObj.oNode.parentNode;
		}
	}
	
	mousepos = getmouse(event);
	x = mousepos[0];
	y = mousepos[1];



  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;
  dragObj.elStartLeft  = parseInt(dragObj.oNode.style.left, 10);
  dragObj.elStartTop   = parseInt(dragObj.oNode.style.top,  10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

  if (ie) 
  {
    document.attachEvent("onmousemove", dragGo);
    document.attachEvent("onmouseup",   dragStop);
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  else 
  {
    document.addEventListener("mousemove", dragGo,   true);
    document.addEventListener("mouseup",   dragStop, true);
    event.preventDefault();
	event.stopPropagation();    
  }
  return false;
}


function dragItem(obj, x, y, full)
{
	
	if (typeof(dragrestrict_x) == 'undefined' || dragrestrict_x < 1 )
	{
		obj.style.left = typeof(full) == 'undefined'  
			? (parseInt(obj.style.left) + x) + 'px' : x + 'px';
	}
	
	if (typeof(dragrestrict_y) == 'undefined' || dragrestrict_y < 1 ) 
	{
		var newtop = y;
		
		if (drag_xtop) 
		{
			newtop = typeof(full) == 'undefined'  
				? parseInt(obj.style.top) + newtop 
				: newtop ;			
				
			newtop = newtop <= drag_xmax 
				? newtop 
				: drag_xmax;
				
			newtop = newtop > 0 ? newtop : 0;
			
			if (newtop == drag_xmax || newtop == 0)
			{
				if (curDragInit == 'img')
				{
					scrolling = false;
					resetimg();
				}
			}
		}
		obj.style.top = newtop +'px';
	}	
	
	if ( typeof(drag_slider) != 'undefined' )
	{
		drag_slider.scrollTop =  newtop * drag_factor;	;

	}
	
}



function dragGo(event) {

  var x, y;

  // Get cursor position with respect to the page.
	mousepos = getmouse(event);
	x = mousepos[0];
	y = mousepos[1];


  // Move drag element by the same amount the cursor has moved.

	dragItem (
		 dragObj.oNode
		, (dragObj.elStartLeft + x - dragObj.cursorStartX)
		, (dragObj.elStartTop  + y - dragObj.cursorStartY)
		, true
	);

	
	if (ie) 
	{
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
		event.preventDefault();
	}
}



function dragStop(event) 
{

	if (ie) 
	{
		document.detachEvent("onmousemove", dragGo);
		document.detachEvent("onmouseup",   dragStop);
	}
	else
	{
		document.removeEventListener("mousemove", dragGo,   true);
		document.removeEventListener("mouseup",   dragStop, true);
	}
}


// ==========================================================================
// mouse etc
// ==========================================================================

function getmouse(e)
{
   var mouseX = 0, mouseY = 0;
   if( !e ) { e = window.event; } 
   if( !e ) { return false; }
   

   if( typeof( e.pageX ) == 'number' ) 
   {
      mouseX = e.pageX; mouseY = e.pageY;
   } 
   else 
   {
      if( typeof( e.clientX ) == 'number' ) 
      {
         mouseX = e.clientX; 
         mouseY = e.clientY;
         
         if( document.body  
         		&& ( document.body.scrollTop || document.body.scrollLeft ) 
         		&& !( window.opera || window.debug || navigator.vendor == 'KDE'  
         	) ) 
         {
               mouseX += document.body.scrollLeft; 
               mouseY += document.body.scrollTop;
         }  
         else 
         {
            if( document.documentElement 
            	&& ( document.documentElement.scrollTop 
            		|| document.documentElement.scrollLeft ) 
            	&& !( window.opera || window.debug || navigator.vendor == 'KDE' 
            ) ) 
            {
               mouseX += document.documentElement.scrollLeft; 
               mouseY += document.documentElement.scrollTop;
            }
         }
      }
   }
   return [mouseX , mouseY];

}


// ==========================================================================
// encoding and decoding
// ==========================================================================
function URLEncode( string )
{
	if ( undef(string) ) return '';
	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = (
		"0123456789" +					// Numeric
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
		"abcdefghijklmnopqrstuvwxyz" +
		"-_.!~*'()"					// RFC2396 Mark characters
	);
	var HEX = "0123456789ABCDEF";

	var plaintext = string;
	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
			    alert( 
			    	"Unicode Character '" 
                    + ch 
                    + "' cannot be encoded using standard URL encoding.\n" 
                    + "(URL encoding only supports 8-bit characters.)\n" 
					+ "A space (+) will be substituted." 
				);
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for

	return encoded;
	return false;
};

function URLDecode( string )
{
   // Replace + with ' '
   // Replace %xx with equivalent character
   // Put [ERROR] in output if %xx is invalid.
   var HEXCHARS = "0123456789ABCDEFabcdef"; 
   
   var encoded = string;
   var plaintext = "";
   var i = 0;
   while (i < encoded.length) {
       var ch = encoded.charAt(i);
	   if (ch == "+") {
	       plaintext += " ";
		   i++;
	   } else if (ch == "%") {
			if (i < (encoded.length-2) 
					&& HEXCHARS.indexOf(encoded.charAt(i+1)) != -1 
					&& HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 ) {
				plaintext += unescape( encoded.substr(i,3) );
				i += 3;
			} else {
				alert( 'Bad escape combination near ...' + encoded.substr(i) );
				plaintext += "%[ERROR]";
				i++;
			}
		} else {
		   plaintext += ch;
		   i++;
		}
	} // while
   return plaintext;
};



var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function base64_encode(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
         keyStr.charAt(enc3) + keyStr.charAt(enc4);
   } while (i < input.length);
   
   return output;
}



function base64_decode(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}
















