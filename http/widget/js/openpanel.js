var req = false;
var isIE = false;
var curfunction = false;
var curTrigger;
var curEvent;
var curDragInit;

var mouseX;
var mouseY;
var oCrum;
var scrolling = false;
var clickedRegion;

var SLIDE_OFFSETTOP = 6;
var TEXT_PADDING = 8;


var gui_elements = new Array();
var __date = new Date();


// ---------------------------------------------------
// global eventListeners
// ---------------------------------------------------

/*
if (window.addEventListener)
{
		window.addEventListener('DOMMouseScroll', detectmousewheel, true);
}
window.onmousewheel = document.onmousewheel = detectmousewheel;


document.onkeydown =  detectkey;
document.onkeyup =  resetkey;
*/



// -----------------------------------------------------------------------
// global eventlistener function
// -----------------------------------------------------------------------
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


/**
 * Registers events to targets. When an event is triggered callBack is called with argument argument
 * Replaces even if for a certain object target, event and callBack match with new event.
 * Returns an event id, which can used by removeEvent
 * 
 * @param {Object} target
 * @param {String} event
 * @param {Function} callBack
 * @param {mixed} argument
 * @return {Number}
 */
addObjectListener = function(target, event, callBack, argument){
	
	this.events == undefined && (this.events = new Array());
	
	var newEventObject = {id: this.events.length, target: target, event: event, callBack: callBack}
	
	for(var i=0;i<this.events.length;i++){
		var eventObject = this.events[i];
		if(eventObject != undefined && eventObject.target == target && eventObject.event == event && eventObject.callBack == callBack){
			var existingEventObjectId = eventObject.id;
		}
	}
	
	target[event] = function(){
		console.log(target + " " + event);
		callBack(argument);
	}
	
	if(existingEventObjectId == undefined){
		this.events.push(newEventObject);
		return newEventObject.id;
	} else{
		return existingEventObjectId;
	}
}

/**
 * Deletes an event by id.
 * Returns true on success, returns false if event does not exist.
 * 
 * @param {Object} clickEventId
 * @return {Boolean}
 */
removeObjectListener = function(clickEventId){
	if(this.events != undefined && this.events[clickEventId] != undefined){
		this.events[clickEventId].target[this.events[clickEventId].event] = {}
		return true;
	} else {
		return false;
	}
}

/**
 * Deletes an event by target and event name
 * 
 * @param {Object} target
 * @param {String} eventName
 */
removeObjectListenerByTargetAndEventName = function(target, eventName){
	if (this.events != undefined) {
		for(var i = 0;i<this.events.length;i++){
			var someEvent = this.events[i];
			if(someEvent != undefined && someEvent.target == target && someEvent.event == eventName){
				this.events[i].target[this.events[i].event] = {}
				this.events[i] = null;
				break;
			}
		}
	}
}



function printDiv( item, retval )
{
	var l = '';
	for (var i in item)
	{
		//if( typeof(item[i]) == 'function') continue;
		if( typeof(item[i]) == 'object') continue;		
		if( i =='innerHTML' ) continue;
		if( i =='outerHTML' ) continue;
		if( i =='innerText' ) continue;
		if( i =='outerText' ) continue;
		if( i =='textContent' ) continue;
		if( i =='text' ) continue;
			
		l = l + i + " => " + item[i];
		l = l + (typeof(retval)!='undefined' ? '<br>' : "\n");
	}
	if (typeof(retval) != 'undefined') return l;
	alert(l);
}




function init()
{	
	window.gui = new _gui(); 
	window.gui.init();
	
}


function nothing() {}


function setfocus( where )
{
	clickedRegion=where;
}


function scrollimg( event, img )
{
	event = !event ? window.event : event;

	img.style.backgroundPosition='0 -23';
	obj = window.gui.getElement('fill');
	
	curTrigger = img;
	curEvent = event;
	curDragInit = 'img';

  if (ie) 
  {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  else 
  {
    event.preventDefault();
	event.stopPropagation();    
  }
	
	if (img.id =='aup')
	{
		resetimg(window.gui.getElement('adown'));
		scrollUp( obj );
	}
	if (img.id == 'adown')
	{
		resetimg(window.gui.getElement('aup'));	
		scrollDown( obj );
	}
}


function scrollDown( obj, factor )
{
	if (typeof(factor) == 'undefined') factor = 6
	dragItem(obj, 0, factor );
	if(scrolling == true)
	{
		har = obj;
		fact = factor;
		stm = setTimeout("scrollDown( har, fact )", 100);
	}
}

function scrollUp( obj, factor )
{
	if (typeof(factor) == 'undefined') factor = -6
	dragItem(obj, 0, factor );
	
	if(scrolling == true)
	{
		har = obj;
		fact = factor;
		stm = setTimeout("scrollUp( har, fact )", 100);
	}
}



function resetimg( img )
{
	if (typeof(img) == 'undefined')
	{
		img = curTrigger;
	}
	if (typeof(stm) != 'undefined') clearTimeout(stm);	
	img.style.backgroundPosition='0 0';	
}



function detectmousewheel(event)
{
	var delta = 0;
	
	event = !event ? window.event : event;
	if (event.wheelDelta) // IE / Opera /safari . 
	{ 
		delta = event.wheelDelta
		if (safari) delta = delta/30;
		else if (window.opera) delta = -(delta/10);
		else if (ie) delta = delta/10; 
	} 
	else if (event.detail) // Mozilla case. 
	{ 
		delta = -(event.detail*3);
	}

	if (delta)
	{
		event.cancelBubble = true;
		if (ff) 
		{
			event.preventBubble();
			event.preventDefault();
		}
		event.returnValue = false;

		x = event.x ? event.x : event.screenX;
		y = event.y ? event.y : event.screenY;
		

		if ( whereInPage(x,y) == 'nav' )
		{
			itm = window.gui.getElement(drag_item);

			nwtop = (-1* Math.floor(delta) );			
			dragItem
			( 
				itm
				, parseInt(itm.style.left)
				, parseInt(itm.style.top) + nwtop
				, true
			);
		}
		else if ( whereInPage(x,y) =='content' )
		{
			itm = window.gui.getElement('content');
			itm.scrollTop = itm.scrollTop + (-1* Math.floor(delta) );
		}
	}

	return true;
}

function whereInPage(x,y)
{
	
	mbar = window.gui.getElement('menubar');
	snav = window.gui.getElement('nav');
	scon = window.gui.getElement('content');
	sfoo = window.gui.getElement('footer');


	if (y <= (mbar.offsetLeft + mbar.offsetHeight) )
	{
		//writeCrum(' you scrolled in the menubar');
		return mbar.id;
	}
	else if( y <= (snav.offsetLeft + snav.offsetHeight) )
	{
		if ( x <= (snav.offsetLeft + snav.offsetWidth) )
		{
			//writeCrum(' you scrolled in the navigation area');
			return snav.id;
		}
		else
		{
			//writeCrum(' you scrolled in the content div');
			return scon.id;
		}
	}
	else
	{
		//writeCrum(' you scrolled the footer');
		return sfoo.id;
	}
/*

	alert( 'incomming : x '+ x +' y: '+y + "\n---------------------------\n"
		+ ' mbarTop ' + mbar.offsetTop + ' Left: ' + mbar.offsetLeft +  "\n"
		+ 'snavTop: ' + snav.offsetTop + ' Left ' + snav.offsetLeft +   "\n"
		+ 'sconTop: ' + scon.offsetTop + ' Left ' + scon.offsetLeft +   "\n"
		+ 'sfooTop: ' + sfoo.offsetTop + ' Left ' + sfoo.offsetLeft +   "\n"		
	);

*/
}


// --------------------------------------------------------------------------
// Handeling Key events per GUI - region
// --------------------------------------------------------------------------
function resetkey(event)
{
	scrolling = false;
}

function detectkey(event)
{

	event = !event ? window.event : event;	

	mousepos = getmouse(event);
	x = mousepos[0];
	y = mousepos[1];
	
	alert('mx: '+x +' my '+y);
	if (event.type == 'click') 
	{
		clickedRegion = whereInPage(x,y);
	}
	
	if( typeof( event.keyCode ) == 'number' )   //DOM 
	{
		key = event.keyCode;
	} 
	else if( typeof( e.which ) == 'number' ) //NS 4 compatible
	{
		key = event.which;
	} 
	else if( typeof( event.charCode ) == 'number'  )     //also NS 6+, Mozilla 0.9+
	{
		key = event.charCode;
	}
	
	// -------------------------------------------------------
	// detecting scrolling on arrow
	// -------------------------------------------------------	
	switch(clickedRegion)
	{
		case('nav'): 
		{
			if (key == 38 ) // arrow up
			{
				scrolling = true;
				scrollUp( window.gui.getElement('fill'), -6);
			}
			else if (key == 40) // arrow down
			{
				scrolling = true;
				scrollDown( window.gui.getElement('fill'), 6 );			
			}
		}
		break;
	}	
}


// ==========================================================================
// GUI
// 
//
// ==========================================================================


function gui_triggerButt( ii )
{
	writeCrum(ii.getAttribute('name'));
	window.gui.load(ii.getAttribute('name'));
}


function writeCrum( text , append)
{
	return;
	if (!oCrum) oCrum = window.gui.getElement('crum');
	if (typeof(oCrum) != 'object') return;
	
	oCrum.innerHTML = append ? oCrum.innerHTML + ' '+text : text;
	return;
}


function hacksearch()
{
	if (typeof(document.safari) == 'undefined')
	{
		document.safari = navigator.userAgent.indexOf("AppleWebKit") !=-1;
	}
	
	if (safari)
	{
		search = window.gui.getElement('search');
		search.style.padding = 0;
		
		sbox = window.gui.getElement('sbox');	
		sbox.type="search";
		sbox.setAttribute('placeholder', 'Filter');
		sbox.setAttribute('results', '5');
		sbox.style.zIndex="1";
		sbox.style.width="210px";
	}

	elm = window.gui.getElement('spull');
	if (elm ) 
	{
		addListener(elm,'onclick',searchPull);
	}
}


function searchPull( ii )
{

	writeCrum('you clicked ' + ii.id);
	setTimeout('writeCrum("")',1000);
}


// ----------------------------------------------------------------------
// Slider Voodoo
// ----------------------------------------------------------------------

function slider(e)
{
	writeCrum('you clicked ' + e.id);
	setTimeout('writeCrum("")',1000);	
	dragStart(window.event, e.id);		
	// -------------------------------------
	// draw slider in percentage > top+butt
	drawSlider(e);
}

function drawSlider( _slider )
{
		
	_text 	= window.gui.getElement('listbox');
	slide 	= window.gui.getElement('slider');	

	_aup 	= window.gui.getElement('aup');
	_fill 	= window.gui.getElement('fill');
	_cfill 	= window.gui.getElement('clipfill');	

	_sup 	= window.gui.getElement('sup');
	_sfill 	= window.gui.getElement('sfill');
	_sdown 	= window.gui.getElement('sdown');
	_adown 	= window.gui.getElement('adown');	



	textH = _text.scrollHeight;
	toH = _text.clientHeight;
	if (opera) textH = textH + TEXT_PADDING;
	
	if (textH <= toH )
	{
		_aup.style.visibility='hidden';
		_adown.style.visibility='hidden';
		_cfill.style.visibility = 'hidden';		
		slide.style.height = parseInt(slide.offsetHeight) + _adown.offsetHeight + 'px';
		return;
	}
	

	slideH = _cfill.offsetHeight + (2*SLIDE_OFFSETTOP);
	pullH = (_sup.offsetHeight + _sdown.offsetHeight) + _sfill.offsetHeight;

	_factor = (toH/(textH));
	nsH = Math.round((_factor * slideH)) ;

	
	stop = _sup.offsetHeight;
	sbut = _sdown.offsetHeight;
	
	newsliderH = nsH - stop - sbut;


	_sfill.style.height = newsliderH + 'px';
	_fill.style.top=(_text.scrollTop)+'px';


	// start drag listener
	dragrestrict_x = 1;
	drag_correction = -SLIDE_OFFSETTOP;
	drag_xtop = 1;


	drag_factor = ((textH-toH) / (slideH - nsH));

	
	drag_xbottom = _sdown.offsetTop + _sdown.offsetHeight;
	drag_xBottomLimit = _cfill.offsetHeight;
	
	drag_xmax = (drag_xBottomLimit - drag_correction - drag_xbottom);
	drag_slider = _text;
	drag_item = 'fill';
      
	//scrollDown( window.gui.getElement('fill'), (slideH -nsH));
}


// ----------------------------------------------------------------------
// XML reader
// ----------------------------------------------------------------------
function loadXMLDoc(url, funct) 
{
	req = false;
    if(window.XMLHttpRequest) 
    {
    	try 
    	{
			req = new XMLHttpRequest();
			if (req.overrideMimeType) 
			{
			  req.overrideMimeType('text/xml');
			}
        } 
        catch(e) 
        {
			req = false;
        }
    } 
    else if(window.ActiveXObject) 
    {
       	try 
       	{
        	req = new ActiveXObject("Msxml2.XMLHTTP");
      	} 
      	catch(e) 
      	{
        	try 
        	{
          		req = new ActiveXObject("Microsoft.XMLHTTP");
        	}
        	catch(e) 
        	{
          		req = false;
        	}
		}
    }


	if(req) 
	{
		req.onreadystatechange = processReqChange;
		req.open("GET", url, true);
		req.send("");
	}
}

function processReqChange() 
{
    // only if req shows "loaded"
    if (req.readyState == 4) 
    {
        // only if "OK"
        if (req.status == 200) 
        {
        	eval(curfunction+'()');
        } 
        else 
        {
            alert
            (
            	"There was a problem retrieving the XML data:\n"
                + req.statusText
			);
        }
    }
}


function getElementTextNS(prefix, local, parentElem, index) 
{
	var result = "";
    if (prefix && isIE) 
    {
        result = parentElem.getElementsByTagName(prefix + ":" + local)[index];
    } 
    else 
    {
        result = parentElem.getElementsByTagName(local)[index];
    }
    if (result) 
    {
        if (result.childNodes.length > 1) 
        {
            return result.childNodes[1].nodeValue;
        } 
        else 
        {
            return result.firstChild.nodeValue;    		
        }
    } 
    else 
    {
        return false;
    }
}

