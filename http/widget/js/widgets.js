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




/*
// ---------------------------------------------------
// we need to register targets when the mouse moves,
// to be able to map regions to mousepointer.
// ---------------------------------------------------
window.onmousemove = function(event)
{
	if (!event) var event = window.event;
	if (event.target) node = event.target;
	else if (event.srcElement) node = event.srcElement;


	if ( typeof(node) != 'undefined' && node.id.length > 0 )
	{
		window['mouseregion'] = node.id;
	}
	
	handleEvent(event);
}

window.onkeypress  	= function(event)	
{ 

	if (!event) var event = window.event;	
	if( typeof( event.keyCode ) == 'number' )
	{
		key = event.keyCode;
	} 
	else if( typeof( e.which ) == 'number' )
	{
		key = event.which;
	} 
	else if( typeof( event.charCode ) == 'number'  )
	{
		key = event.charCode;
	}
	window.ctrl  = event.ctrlKey;
	window.alt	 = event.altkey;
	window.shift = event.shiftKey;
	window.meta	 = event.metaKey;
	
	handleEvent(event); 	
}
window.onkeyup 		= function(event)	{ handleEvent(event); }
window.onmousedown 	= function(event)	{ handleEvent(event); }
window.onmouseup 	= function(event)	{ handleEvent(event); }
window.oncontextmenu = function(event)	{ handleEvent(event); }
window.onmousewheel	= function(event)	{ handleEvent(event); }


function handleEvent(event)
{
	if (!event) var event = window.event;
	if (event.target) node = event.target;
	else if (event.srcElement) node = event.srcElement;

	//if ( typeof(window.emanager[event.type]) == 'undefined' ) return;
	//if ( window.emanager[event.type].length < 1 ) return;
	
	writeCrum('handleEvent: '+event.type+' which: '+node.id);
	//setTimeout("writeCrum('');", 1500);
	
	
}
*/

// -----------------------------------------------------------------------------
//	global event registration
// -----------------------------------------------------------------------------
// emanager[ eventtype ][0].kind = enum{ div, id, tag, coo }
// emanager[ eventtype ][0].id = identifier for object
// emanager[ eventtype ][0].data = obj_div, id, tagname, [left,top,width,height] 
// emanager[ eventtype ][0].fname = function to execute
// emanager[ eventtype ][0].args arguments to pass (default event, object )
// -----------------------------------------------------------------------------
function registerEvent( eventtype, full_obj, fname, args )
{

	if ( typeof(window.emanager) == 'undefined' )
	{
		window['emanager'] = new Object();
	}
	if (typeof(window.emanager[eventtype]) == 'undefined')
	{
		window.emanager[eventtype] = new Array();
	}
	
	window.emanager[eventtype].push('aaa');
	// no worky
	return;
	
	
	var replaced = 0;
	if ( window.emanager[eventtype].length > 0 )
	{
		for (var i =0; i < window.emanager[eventtype].length; i++)
		{
			// replace current event for this object
			if ( window.emanager[eventtype][i].id == obj.id )
			{
				window.emanager[eventtype][i].kind = full_obj.kind;
				window.emanager[eventtype][i].data = full_obj.data;
				window.emanager[eventtype][i].fname = full_obj.fname;
				window.emanager[eventtype][i].args = full_obj.args;
				var replaced = 1;
				break;
			}
		}
	}
	
	if ( replaced === 0 && typeof(full_obj) == 'object')
	{
		var tmpo = new Object();
		
		tmpo['kind'] = full_obj.kind;
		tmpo['data'] = full_obj.data;
		tmpo['fname'] = full_obj.fname;
		tmpo['args'] = full_obj.args;
		
		window.emanager[ename].push(tmpo);
	}
	
}




// ==========================================================================
//                       _/        _/                        _/                
//  _/      _/      _/        _/_/_/    _/_/_/    _/_/    _/_/_/_/    _/_/_/   
// _/      _/      _/  _/  _/    _/  _/    _/  _/_/_/_/    _/      _/_/        
//  _/  _/  _/  _/    _/  _/    _/  _/    _/  _/          _/          _/_/     
//   _/      _/      _/    _/_/_/    _/_/_/    _/_/_/      _/_/  _/_/_/        
//                                      _/                                     
//                                 _/_/                                
// ===========================================================================
/*
	var ob = new Object();
	ob['NL'] = 'The Netherlands';
	ob['GB'] = 'Great Britain';
	ob['GE'] = 'Germany';
	
	var pull = new widget.pulldown( 'leftColumn', ob, 'GB');
	pull.draw();
*/



var widget = function()
{
	this.small 	= '50px';
	this.medium = '100px';
	this.large 	= '150px';
	this.xlarge = '200px';
}

widget.superClass = function(){
	this.disable = function(){
		console.log("disable");
	}
	
	this.enable = function(){
		console.log("enable");
	}
}

widget.prototype.getmouse = function(e)
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
widget.prototype.addListener = function (oNode, sEventType, fnHandler)
{
	if(this[sEventType]) 
	{
		var oldfuncs = this[sEventType];
	}

	this[sEventType] = function ()
	{
		//if (oldfuncs) oldfuncs( oNode );
		fnHandler( e, this );
	}
}

widget.prototype.deleteChildren = function ( parent, self, label )
{
	if (empty(parent)) return;
	while ( parent.hasChildNodes() ) 
	{ 
		if ( parent.firstChild.hasChildNodes() )
		{
			this.deleteChildren( parent.firstChild );
		}
		parent.removeChild(parent.firstChild); 
	}
	
	if (!undef(self))
	{
		if (parent.parentNode.hasChildNodes())
		{
			for(var i=0; i<parent.parentNode.childNodes.length; i++)
			{
				if (parent.parentNode.childNodes[i].id == parent.id)
				{
					parent.parentNode.removeChild(parent.parentNode.childNodes[i]);
					break;
				}
			}
		}
	}
}
widget.prototype.fixPNG = function (src, width, height)
{
	 var strNewHTML = "<span " 
		+ " style=\"" + "width:" + width + "px; height:" 
		+ height + "px;overflow:hidden;"
		+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
		+ "(src=\'" + src + "\', sizingMethod='scale');\"></span>";
	return strNewHTML;
		
}
// ============================================================================
//              _ _     _                     
//  _ __  _   _| | | __| | _____      ___ __  
// | '_ \| | | | | |/ _` |/ _ \ \ /\ / / '_ \ 
// | |_) | |_| | | | (_| | (_) \ V  V /| | | |
// | .__/ \__,_|_|_|\__,_|\___/ \_/\_/ |_| |_|
// |_|
// ============================================================================

widget.pulldown = function(root, itemlist, selected, name, label)
{
	this.root = root;
	this.itemlist = itemlist;
	this.selected = selected;
	this.name = name;
	this.label = label;
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	this.widgettype= 'pulldown';
	
	this.im_lbut = '/images/interface/pd_lbut.png';
	this.im_rbut = '/images/interface/pd_rbut.png';	
	this.im_fill = '/images/interface/pd_fill.png';	
	this.im_sel = '/images/interface/pd_sel.png';
	this.img_height = '19px';
	
	this.width 		= '150px';
	this.fontsize 	= '10px';

	this.fs = parseInt(this.fontsize,10);
	this.ffactor = 0.46
	this.fsize = this.fs - Math.ceil( this.fs * this.ffactor);	
	
	this.fontcolor 	= '#231f20';
	this.bgcolor 	= '#f0f0f0';
	this.highlightfontcolor = '#ffffff';
	this.highlightbgcolor = '#326ecb';
	this.cursor = 'default';
	
	this.browser = new obj_browser();
	this.callback = false;
	this.elements = new Object();
		
}



widget.pulldown.prototype.populateDivs = function( prefix )
{
	var prefix = typeof(prefix) != 'undefined' ? prefix : '';

	this.div_pulldown 	= prefix + 'pulldownholder';
	this.div_hidden 	= prefix + 'hidden';
	this.div_leftbut 	= prefix + 'pd_lbut';
	this.div_fill 		= prefix + 'pd_fill'
	this.div_option 	= prefix + 'pd_option';
	this.div_key		= prefix + 'pd_key';
	this.div_rightbut 	= prefix + 'pd_rbut';
}



widget.pulldown.prototype.name = function( name )
{
	this.name = name;
}
widget.pulldown.prototype.setRoot = function( root )
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.PULLDOWN: pulldown.setRoot() expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}
widget.pulldown.prototype.addItem = function( idx, val )
{
	if (typeof(this.itemlist)!='object' || null == this.itemslist) 
	{
		this.itemlist = new Object();
	}
	
	this.itemlist[idx] = val;
}

widget.pulldown.prototype.populate = function( _fillobject )
{
	if (typeof(_fillobject) != 'object' && typeof(_fillobject) != 'array')
	{
		alert(
			'WIDGET.PULLDOWN: pulldown.populate() expects key => value object'
		);
		return false;
	}
	
	this.itemlist = _fillobject;
}

widget.pulldown.prototype.draw = function( _returnresource )
{
	
	if ( typeof(_returnresource) == 'undefined' 
		&&this.setRoot(this.root) === false ) 
	{
		return false;
	}
	
	if ( this.populate(this.itemlist) === false)
	{
		return false;
	}
	
	var clickDiv = document.createElement('div');
	clickDiv.setAttribute('id', 'clickDiv');
	clickDiv.setAttribute('rel',  + this.uid);
	
	clickDiv.style.width = window.gui.browser.window.width;
	clickDiv.style.height = window.gui.browser.window.height;
	
	clickDiv.style.color = "#ff0000";
	//check if there is a layer with the id we are about to create
	
	var chkdv =  document.getElementById(this.div_pulldown);
	var prefix = typeof(chkdv) != 'undefined' ? this.uid : '';
	
	this.populateDivs( prefix );

	
	var pdh = document.createElement('div');
	pdh.id = this.div_pulldown;
	pdh.setAttribute('uid',this.uid);
	pdh.className="fll";
	
	pdh.style.width 	= this.width;
	pdh.style.height 	= "19px";
	pdh.style.textAlign	= "left";
	pdh.styleFloat 	= "left"; 
	pdh.style.cursor	= "default";
	pdh.style.fontSize	= "0px";
	pdh.style.zIndex	= "10";
	pdh.setAttribute('selected',this.selected);
	pdh.setAttribute('name',this.name);	
	
	
	// ----------------------------------------------------
	// create hidden input field to hold selected value
	// ----------------------------------------------------
	var hid = createNamedElement('INPUT', this.name);
	hid.id = this.div_hidden;
	hid.type='hidden';
	hid.setAttribute('src', this.src);
	hid.value = this.selected;
	
	
	
	pdh.appendChild(hid);
	
	
	pdh.setAttribute('selected',this.selected);
	pdh.setAttribute('name',this.name);	
	
	
	var lbut = document.createElement('div');
	lbut.id = this.div_leftbut;
	
	var lb_im = document.createElement('img');
	lb_im.src= this.im_lbut;
	lb_im.border 		= '0';	
	lbut.appendChild(lb_im);
	
	lbut.className="fll";
	lbut.style.fontSize	= "0px";
	lbut.style.width	= "10px";

	var rfil = document.createElement('div');
	rfil.id = this.div_fill;
	rfil.className="fll";
	
	rfil.style.backgroundImage = "url("+this.im_fill+")";
	rfil.style.backgroundRepeat = "repeat-x";
	rfil.style.width 	= ( parseInt(this.width,10) - 29 )+"px";
	rfil.style.overflow = "hidden";
	rfil.style.height 	= "19px";
	rfil.style.textAlign= "left";
	rfil.style.cursor	= "default";
	rfil.style.fontSize	= "0px";
	rfil.style.padding	= "0px";
	rfil.style.margin	= "0px";
	rfil.style.paddingTop = "3px";
	rfil.style.zIndex	= "10";

	// list items	
	var ic = 0;
	var txtwidth = parseInt(this.width,10) - 29 - 17;
	var fsize = this.fs - Math.ceil( this.fs * 0.46);
	
	
	for ( var key in this.itemlist )
	{
		var ihold = document.createElement('div');
		ihold.id = this.div_option;
		ihold.setAttribute('key',key);
		ihold.setAttribute('val',this.itemlist[key]);
		ihold.className="fll";
		ihold.style.fontSize = this.fontsize;
		
		if ( ic === 0 && empty(this.selected) )
		{
			this.selected = key;
			if ( typeof(window.pulldown) != 'object') 
			{
				window['pulldown'] = new Object();
			}
			window.pulldown[this.name] = this.selected;
		}
		
		
		var ti = document.createElement('div');
		ti.id = this.div_key;

		var displaytext = this.itemlist[key];


		
		if ( returnTextLength(displaytext) > txtwidth )
		{	
			if (displaytext.match(/ /) || displaytext.match(/\(/))
			{
				var w = displaytext.split(' ');
				if (w.length < 2 )
				{
					var dp ='';
					for (var wc =0 ; wc < w.length -1;wc++ )
					{
						dp = dp + w[wc]+' ';
					}
					
					var _displaytext = (
						dp.replace(/[^a-zA-Z0-9 \(\'\?\-_]/,'')+'...'
					);
				}
				else
				{
					var tsp = w[0]+' '+w[1]+'...';
					if( (Math.floor((txtwidth)/fsize) >= tsp.length+3 ) )
					{
						var _displaytext = tsp;
					}
					else
					{
						var _displaytext = w[0]+'...';
					}
				}
			}
			else
			{
				var _displaytext = displaytext.substring
				(
					0, Math.round(txtwidth - 4)
				)+'...';
			}
			
			if ( ic === 0  )
			{
				displaytext = _displaytext;
			}
			ihold.setAttribute('txtfit',_displaytext);
		}
		else
		{
			ihold.setAttribute('txtfit',displaytext);
		}
		
		
		
		ti.appendChild( document.createTextNode(displaytext) );
		ti.className="fll";
		ti.style.width = (txtwidth)+"px";
		ti.style.overflow = "hidden";
		ti.style.fontSize = this.fontsize;
		
		if (( !empty(this.selected) && this.selected.length > 0))
		{
			if (key != this.selected)
			{
				ihold.style.display='none';
			}
		}
		else if ( ic > 0 )
		{
			ihold.style.display='none';
		}
		
		ihold.appendChild(ti);
		rfil.appendChild(ihold);

		ic++;
	}
	
	
	// --------------------------------------------
	// if we have a selected move options up
	// --------------------------------------------
	
	
	var rbut = document.createElement('div');
	rbut.id = this.div_rightbut;
	var rb_im = document.createElement('img');
	rb_im.src= this.im_rbut;
	rb_im.border = '0';
	rbut.appendChild(rb_im);

	rbut.className="fll";
	rbut.style.fontSize = "0px";
	rbut.style.width = "19px";

	addListener(pdh, 'onclick', this.select);
	
	pdh.appendChild(lbut);
	pdh.appendChild(rfil);
	pdh.appendChild(rbut);
	
	
	if ( typeof(_returnresource) != 'undefined' )
	{
		return pdh;
	}
	this.root.appendChild( pdh );
	this.elements['input'] = hid;
	
	
}


widget.pulldown.prototype.setSelected = function (key)
{
	var fil = document.getElementById(this.div_fill);
	if (empty(fil)) return;
	if (!empty(fil.childNodes) && fil.childNodes.length < 1) return;
	
	for (var i=0; i < fil.childNodes.length; i++)
	{
		var child = fil.childNodes[i];
		var at = child.getAttribute('key');
		child.style.top='0px';

		if (i == 0 && key == '' )
		{
			child.style.display='block';
			child.style.top='0px';
			child.style.visibility='visible';
			this.selected = at;
			continue;
		}

		child.style.display='none';
		child.style.visibility='hidden';
		
		if (at == key ) 
		{
			child.style.display='block';
			child.style.top='0px';
			child.style.visibility='visible';
			this.selected = at;
			var tf = child.getAttribute('txtfit');
			child.childNodes[0].childNodes[0].nodeValue = tf;
		}
	}
	
	var pulhold = document.getElementById(this.div_pulldown);
	this.elements.input.value = key;
	pulhold.setAttribute('selected',this.selected);

}

// ------------------------------------------------------
// when we are called, we have been called out of scope
// ------------------------------------------------------

widget.pulldown.prototype.findpos = function (obj)
{

	var curleft = curtop = 0;
	if (obj.offsetParent) 
	{
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) 
		{
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];

}


widget.pulldown.prototype.select = function( obj )
{	
	
	var hook = this;
	
	this.pull = obj.parentNode.pull;
	if (pull.elements.input.disabled === true ) return;
	
	var itemlist 	= new Object();
	var itemtext 	= new Object();
	
	var base = obj.firstChild.nextSibling.nextSibling;
	var hasItems = false;
	for (var i=0; i < base.childNodes.length; i++)
	{
		if (base.childNodes[i].nodeType != ELEMENT_NODE) continue;
		if (base.childNodes[i].id != this.pull.div_option) continue;
		
		var key = base.childNodes[i].getAttribute('key');
		var value = base.childNodes[i].getAttribute('val');	
		var txtfit = base.childNodes[i].getAttribute('txtfit');	
		
		itemtext[key] = txtfit;
		itemlist[key] = value;
		hasItems = true;
	}			
	if(hasItems == false){
		removeObjectListenerByTargetAndEventName(window, 'onmousedown');
		return;
	}
	var lyr = document.createElement('div');
	lyr.id = 'pulllayer';
	lyr.setAttribute('parent',this.pull.div_option);
	
	var ps = this.pull.findpos(obj);
	lyr.style.left = ( ps[0] -8 ) + 'px';
	lyr.style.top = ( ps[1] - 8)  + "px";	
	lyr.style.cursor = this.pull.cursor;


	
	var icnt=0;
	var maxoffset = 0;
	var holdall = document.createElement('div');
	var newoffset=0;
	for ( var i in itemlist )
	{
		var ohol = document.createElement('div');
		ohol.id = i;
		ohol.style.border='0';
		
		var tmp = document.createElement('div');
		tmp.style.height="11px";
		tmp.style.padding='2px 8px 2px 21px';
		tmp.style.display='block';
		
		if (this.pull.selected == i || ( empty(this.pull.selected) && icnt === 0) )
		{
			this.pull.selectedDiv = ohol;
			tmp.style.backgroundImage="url("+this.pull.im_sel+")";
			tmp.style.backgroundPosition="8 0";
			tmp.style.backgroundRepeat='no-repeat';
		}
		
		addListener(ohol, 'onmouseover', this.pull.highlight_opt);
		addListener(ohol, 'onmouseout', this.pull.lowlight_opt);		

		ohol.style.cursor = this.pull.cursor;
		ohol.setAttribute('name',this.pull.name);
		ohol.setAttribute('parent',this.pull.div_pulldown);
		ohol.setAttribute('fill',this.pull.div_fill);
		ohol.setAttribute('number', (icnt + 1) );
		ohol.setAttribute('txtfit', itemtext[i] );
		addListener(ohol, 'onclick', this.pull.selectblur);
		addObjectListener(window.document, 'onmousedown', this.pull.selectblur, ohol);
		tmp.appendChild( document.createTextNode(itemlist[i]));
		
		ohol.style.border='1px';
		ohol.appendChild(tmp);
		lyr.appendChild(ohol);

		maxoffset =itemlist[i].length > maxoffset 
			? itemlist[i].length : maxoffset;
		
		if (!empty(this.selected) && this.selected == i )
		{
			newoffset = icnt;
			offlayer = ohol;
		}
		icnt++;
	}



	var fz = Math.ceil(this.pull.fs - (this.pull.fs * this.pull.ffactor));
	var padding = (this.pull.browser.win32 ) ? 60 : 40;
	lyr.style.width= Math.ceil((maxoffset * fz) + padding) +'px';
	
	lyr.pull = this.pull;
	lyr.pull['offsetLeft'] = obj.offsetLeft;
	lyr.pull['offsetTop'] = obj.offsetTop;
	lyr.pull['offsetParent'] = obj.parentNode;

	// ---------------------------------------------------------
	// calculating width/height in relation to browser window
	// ---------------------------------------------------------
	document.body.appendChild(lyr);	
	lyr.style.visibility='hidden';
	
	var windowpadding = 18;
	
	var lW = lyr.offsetWidth;
	var lH = lyr.offsetHeight;	
	
	
	var wH = this.pull.browser.window.height;
	var wW = this.pull.browser.window.width;	
	
	var layerright = ps[0] + lW;
	var layerbottom = ps[1] + lH;
	
	var minH = (this.pull.fs * 4) + 26; // 4x fontsize + 4x padding 8 +2
	var maxH = wH - (2 * windowpadding) ;

		
	// 1. see if layer is bigger than room left in window
	if ( layerbottom + windowpadding > wH )
	{

		var oldTop = parseInt(lyr.style.top);
		var newTop = oldTop;
		var newH = lH;
		
		// 2. see if layerH >= minH
		if ( lH > minH )
		{
			// 3. calculate the possible new height
			if (lH > maxH)
			{
				newH = maxH;
				newTop = windowpadding;
				lyr.style.overflow='hidden';	
				
				/* Use the scrollbar widget to controll the scrolling */
				var doscroll = 1;
			}
			else
			{
				newTop = wH - lH - windowpadding;
			}
			
		}
		// just move the layer with its bottom to bottomwindow 
		else
		{
			newTop = wH - lH;
		}
		
		lyr.style.top = ( newTop ) + 'px';
		lyr.style.height = ( newH ) +'px';
	}
	
	if ( typeof(doscroll) != 'undefined')
	{
		var sp = new widget.scrollbox( document.body, lyr );
		sp.height = (newH + (ie ? -2 : 4 ) ) + 'px';
		sp.targetlayername = "";
		sp.measurewindow = lyr;
		
		sp.draw();
		
		var slid = document.getElementById(sp.div_slider);
		slid.style.position="absolute";
		slid.styleFloat=null;
		slid.style.top = (parseInt(lyr.style.top) +1 ) +'px';
		slid.style.left = 
		(
			parseInt(lyr.style.left) + parseInt(lyr.offsetWidth) - 16 
		)+ 'px';
		slid.style.zIndex='100001';

		for (var l=0; l < lyr.childNodes.length; l++)
		{
			lyr.childNodes[l]['scrollbox'] = sp;
		}
		if (newoffset > 0)
		{
			var sit = document.getElementById(selected);
			sp.dragItem(lyr, 0, Math.round(sit.offsetTop/sp.drag_factor));
		}	
	}	
	lyr.style.visibility='visible';	
	
	
	/*var hook = lyr;
	window.document.onclick = function(){
		var lyrParent = hook.parentNode;
		if (lyrParent != null) {
			lyrParent.removeChild(hook);
		}
		this.onmousedown = null;
	}
	*/
}



widget.pulldown.prototype.highlight_opt = function( obj )
{
	obj.parentNode.pull.selected = obj.id;
	obj.parentNode.pull.selectedDiv = obj;
	obj.style.backgroundColor=obj.parentNode.pull.highlightbgcolor;
	obj.style.color=obj.parentNode.pull.highlightfontcolor;
	obj.childNodes[0].style.backgroundPosition='8 -16';
}

widget.pulldown.prototype.lowlight_opt = function( obj )
{
	obj.style.backgroundColor=obj.parentNode.pull.bgcolor;
	obj.style.color=obj.parentNode.pull.fontcolor;	
	obj.childNodes[0].style.backgroundPosition='8 0';	
}


widget.pulldown.prototype.sleep = function( millisec )
{
	var now = new Date();
	var exitTime = now.getTime() + millisec;
	while (true) 
	{
		now = new Date();
		if (now.getTime() > exitTime) return;
	} 
}

widget.pulldown.prototype.selectblur = function( obj )
{
	var obj = this.pull.selectedDiv;
	removeObjectListenerByTargetAndEventName(window, 'onmousedown');
	
	
	if (obj !=undefined && obj.parentNode != undefined && obj.parentNode.parentNode!=undefined) {
		var bnod = obj.parentNode;
		var inum = obj.getAttribute('number') - 1;
		var pull = document.getElementById(obj.getAttribute('parent'));
		
		// fill the hidden field with the value
		pull.firstChild.value = obj.id
		
		
		var fill = obj.getAttribute('fill');
		var txtfit = obj.getAttribute('txtfit');
		var options = false;
		
		// registering the value of this pulldown	
		var pname = obj.getAttribute('name');
		window.pulldown = new Object();
		window.pulldown[pname] = obj.id;
		
		
		// we could have 1 sibbling: <timestamp>slider 
		if (bnod.nextSibling != null) {
			if (bnod.nextSibling.id.indexOf('slider') != -1) {
				bnod.parentNode.removeChild(bnod.nextSibling);
			}
		}
		bnod.parentNode.removeChild(bnod);
		
		
		// -------------------------------------------------------
		// now loop and make sure this fellow
		// gets on top ( selected )
		// -------------------------------------------------------	
		for (var i = 0; i < pull.childNodes.length; i++) {
			if (pull.childNodes[i].nodeType != ELEMENT_NODE) 
				continue;
			if (pull.childNodes[i].id == fill) {
				options = pull.childNodes[i];
			}
		}
		if (options === false) 
			return;
		
		for (var i = 0; i < options.childNodes.length; i++) {
			options.childNodes[i].style.position = 'relative';
			options.childNodes[i].style.display = 'block';
			options.childNodes[i].style.visibility = 'hidden';
		}
		
		// the only one visible
		var node0 = parseInt(options.childNodes[0].offsetTop, 10);
		var node1 = parseInt(options.childNodes[inum].offsetTop, 10);
		
		var dif = node1 - node0;
		
		for (var i = 0; i < options.childNodes.length; i++) {
			options.childNodes[i].style.top = (-dif) + 'px';
			if (i == inum) {
				options.childNodes[i].childNodes[0].childNodes[0].nodeValue = (txtfit);
				options.childNodes[i].style.visibility = 'visible';
			}
		}
		
		if (pull.parentNode['pull'].callback) {
			var cb = pull.parentNode['pull'].callback;
			if (cb.indexOf(';') != -1) {
				var tcb = cb.split(';');
				cb = '';
				
				for (var i = 0; i < tcb.length; i++) {
					if (tcb[i].match(/\(\)/)) 
						tcb[i] = tcb[i].replace(/\(\)/, '(pull.parentNode.pull)');
					if (tcb[i].match(/this/)) 
						tcb[i] = tcb[i].replace(/this/, 'obj');
				}
				cb = tcb.join(';');
			}
			eval(cb);
		}
	}
}




// ==============================================================
//                     _ _ _               
//  ___  ___ _ __ ___ | | | |__   _____  __
// / __|/ __| '__/ _ \| | | '_ \ / _ \ \/ /
// \__ \ (__| | | (_) | | | |_) | (_) >  < 
// |___/\___|_|  \___/|_|_|_.__/ \___/_/\_\
// ==============================================================
widget.scrollbox = function( root, scrolltarget )
{
	this.root = root;
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	this.widgettype= 'scrollbox';
	
	this.img_slider		= '/images/interface/sb_bg.png';
	this.img_arrowup 	= '/images/interface/sb_aup2.png';
	this.img_balltop 	= '/images/interface/sb_sup.png';
	this.img_ballfill	= '/images/interface/sb_sfill.png';
	this.img_ballbot 	= '/images/interface/sb_sdown.png';
	this.img_arrowdown 	= '/images/interface/sb_adown2.png';

	this.img_arrowheight = '23px';
	this.img_balltopheight = '8px';
	this.img_ballbotheight = '8px';
	
	this.width = '15px';
	this.height = '279px';
	
	this.slide_offsettop = 6;
	this.textpadding = 8;	

	this.scrolltarget = scrolltarget;
	this.measurewindow = 'undefined';
	
	this.drag_factor = 0;
	this.dragrestrict_x = 1;
	this.drag_xtop = 1;
	this.dragrestrict_y = false;
	this.drag_correction = -this.slide_offsettop;
	
	this.elements = new Object();
	this.widget = new widget();
	
}

widget.scrollbox.prototype.populateDivs = function( prefix )
{
	prefix = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_slider 	= prefix + 'slider';
	this.div_arrowup 	= prefix + 'aup';
	this.div_sliderspace = prefix + 'clipfill'
	this.div_ballholder = prefix + 'fill';
	this.div_balltop	= prefix + 'sup';
	this.div_ballfill 	= prefix + 'sfill';
	this.div_ballbot 	= prefix + 'sdown';
	this.div_arrowdown 	= prefix + 'adown';
}
widget.scrollbox.prototype.setScrolltarget = function( scrolltarget )
{

	if (typeof(this.scrolltarget) == 'undefined')
	{
		alert(
			'WIDGET.SCROLLBOX: needs scrolltarget set ::'
			+' widget.setScrolltarget( <div element by id> ) '
		);
		return false;	
	}

	if (typeof(scrolltarget)!='object')
	{
		this.scrolltarget = document.getElementById( scrolltarget );
	}
	else
	{
		this.scrolltarget = scrolltarget;
	}
}


widget.scrollbox.prototype.setRoot = function( root )
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.SCROLLBOX: scroll.setRoot() expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.scrollbox.prototype.redraw = function( )
{
	this.setSliderBall();
}
widget.scrollbox.prototype.setSliderBall = function( )
{

	var slider 		= this.elements['slider'];
	var sliderspace = this.elements['sliderspace'];
	
	var ballholder 	= this.elements['ballholder'];
	var ballfill 	= this.elements['ballfill'];
	var balltop 	= this.elements['balltop'];
	var ballbot 	= this.elements['ballbot'];	
	var arrowup 	= this.elements['arrowup'];
	var arrowdown 	= this.elements['arrowdown'];

	
	var toH 	= this.scrolltarget.clientHeight;
	if ( typeof(this.measurewindow) != 'undefined' 
		&& this.measurewindow != 'undefined' 
	)
	{
		var textH	= this.measurewindow.offsetHeight;
		var scrollH = this.measurewindow.scrollHeight;
		var mwin = 1;
	}
	else
	{
		var textH	= this.scrolltarget.offsetHeight;
		var scrollH	= this.scrolltarget.scrollHeight;
		var mwin = 0;
	}
	//if (opera) textH = textH + this.textpadding;

	
	if (textH >= (scrollH +2) || textH <= parseInt(this.elements['slider'].style.height,10))
	{
		arrowup.style.visibility	= 'hidden';
		arrowdown.style.visibility	= 'hidden';
		ballholder.style.visibility	= 'hidden';
		
		slider.style.height = (
			slider.offsetHeight +'px'// + arrowdown.offsetHeight + 'px'
		);

		return;
	}
	else
	{
		arrowup.style.visibility='visible';
		arrowdown.style.visibility='visible';
		ballholder.style.visibility='visible';
	}


	var slideH = sliderspace.offsetHeight + (2*this.slide_offsettop);
	var pullH = (balltop.offsetHeight + ballbot.offsetHeight) 
		+ ballfill.offsetHeight;

	var _factor = (toH/(scrollH));
	var nsH = Math.round((_factor * slideH)) ;
	var stop = balltop.offsetHeight;
	var sbut = ballbot.offsetHeight;	
	var newsliderH = nsH - stop - sbut;

	newsliderH =  newsliderH > 0 ? newsliderH : 0;
	
	ballfill.style.height = newsliderH + 'px';
	this.dragObj.style.top=(this.scrolltarget.scrollTop)+'px';

	this.drag_factor = ((scrollH-toH) / (slideH - nsH));
	this.drag_xbottom = ballbot.offsetTop + sbut;
	this.drag_xBottomLimit = sliderspace.offsetHeight;
	this.drag_xmax = (
		this.drag_xBottomLimit - this.drag_correction - this.drag_xbottom
	);


}
widget.scrollbox.prototype.draw = function( _returnresource )
{
	if ( typeof(_returnresource) == 'undefined' 
		&&this.setRoot(this.root) === false ) 
	{
		return false;
	}
	
	if ( this.setScrolltarget(this.scrolltarget) === false )
	{
		return false;	
	}

	//check if there is a layer with the id we are about to create
	var chkdv =  document.getElementById(this.div_slider);
	var prefix = typeof(chkdv) != 'undefined' ? this.uid : '';
	
	this.populateDivs( prefix );

	var slider = document.createElement('div');
	slider.id = this.div_slider;
	slider.style.position	= 'relative';
	slider.style.width		= this.width;
	slider.style.height		= this.height;
	slider.style.styleFloat = 'right';
	slider.style.fontSize	= '0';
	slider.style.backgroundImage	= 'url('+this.img_slider+')';
	slider.style.backgroundRepeat	= 'repeat-y';
	slider.style.zIndex		= '1';


	var arrowup = document.createElement('div');
	arrowup.id = this.div_arrowup;
	arrowup.style.position 	= 'relative';
	arrowup.style.width 	= this.width;
	arrowup.style.height	= this.img_arrowheight;
	arrowup.style.styleFloat='right';
	arrowup.style.fontSize	= '0';
	arrowup.style.backgroundImage	= 'url('+this.img_arrowup+')';
	arrowup.style.backgroundRepeat	= 'no-repeat';
	arrowup.style.backgroundPosition= '0 0';	
	arrowup.style.zIndex	= '1';

	var sliderspace = document.createElement('div');
	sliderspace.id = this.div_sliderspace;
	sliderspace.style.position 	= 'relative';
	sliderspace.style.width 	= this.width;
	sliderspace.style.height 	= 
	(
		parseInt(this.height) - ( 2* parseInt(this.img_arrowheight)) 
	) +'px';
	
	sliderspace.style.styleFloat='right';
	sliderspace.style.fontSize	= '0';
	sliderspace.style.zIndex	= '20';

	var ballholder = document.createElement('div');
	ballholder.id = this.div_ballholder;
	ballholder.style.position 	= 'relative';
	ballholder.style.width 	= this.width;
	ballholder.style.styleFloat='right';
	ballholder.style.fontSize	= '0';
	ballholder.style.zIndex	= '20';
	
	var balltop = document.createElement('div');
	balltop.id = this.div_balltop;
	balltop.style.position 	= 'relative';
	balltop.style.width 	= this.width;
	balltop.style.height	= this.img_balltopheight;
	balltop.style.fontSize	= '0';
	balltop.style.backgroundImage	= 'url('+this.img_balltop+')';
	balltop.style.backgroundRepeat	= 'no-repeat';
	balltop.style.zIndex	= '20';
	balltop.style.top		= -this.slide_offsettop;
	
	var ballfill = document.createElement('div');
	ballfill.id = this.div_ballfill;
	ballfill.style.position 	= 'relative';
	ballfill.style.width 	= this.width;
	ballfill.style.fontSize	= '0';
	ballfill.style.backgroundImage	= 'url('+this.img_ballfill+')';
	ballfill.style.backgroundRepeat	= 'repeat-y';
	ballfill.style.zIndex	= '20';
	ballfill.style.top		= -this.slide_offsettop;	
	
	var ballbot = document.createElement('div');
	ballbot.id = this.div_ballbot;
	ballbot.style.position 	= 'relative';
	ballbot.style.width 	= this.width;
	ballbot.style.height	= this.img_ballbotheight;
	ballbot.style.fontSize	= '0';
	ballbot.style.backgroundImage	= 'url('+this.img_ballbot+')';
	ballbot.style.backgroundRepeat	= 'no-repeat';
	ballbot.style.zIndex	= '20';
	ballbot.style.top		= -this.slide_offsettop;	

	var arrowdown = document.createElement('div');
	arrowdown.id = this.div_arrowdown;
	arrowdown.style.position 	= 'relative';
	arrowdown.style.width 	= this.width;
	arrowdown.style.height	= this.img_arrowheight;
	arrowdown.style.styleFloat='right';
	arrowdown.style.fontSize	= '0';
	arrowdown.style.backgroundImage	= 'url('+this.img_arrowdown+')';
	arrowdown.style.backgroundRepeat	= 'no-repeat';
	arrowdown.style.backgroundPosition= '0 0';	
	arrowdown.style.zIndex	= '1';


	// -------------------------------------------------------
	// Adding to DOM 
	// -------------------------------------------------------

	arrowup.style.visibility='hidden';
	arrowdown.style.visibility='hidden';
	ballholder.style.visibility='hidden';

	ballholder.appendChild(balltop);
	ballholder.appendChild(ballfill);
	ballholder.appendChild(ballbot);
		
	
	sliderspace.appendChild(ballholder);
	slider.appendChild(arrowup);
	slider.appendChild(sliderspace);
	slider.appendChild(arrowdown);
	
	this.root.appendChild( slider );

	this.elements['slider']			= slider;
	this.elements['sliderspace']	= sliderspace;
	this.elements['ballholder']		= ballholder;
	this.elements['ballfill']		= ballfill;
	this.elements['balltop']		= balltop;
	this.elements['ballbot']		= ballbot;
	this.elements['arrowup']		= arrowup;
	this.elements['arrowdown']		= arrowdown
	
	// -------------------------------------------------------
	// setting up sliderball
	// -------------------------------------------------------
	this.drag_item = 'ballholder';
	this.dragObj = ballholder;

	ballholder['scrollbox'] = this;
	arrowup['scrollbox'] = this;
	arrowdown['scrollbox'] = this;	
	
	this.setSliderBall();
	
	this.scrolltarget['scrollbox'] = this;
	
	this.uparrow = arrowup;
	this.downarrow = arrowdown;
	
	// ----------------------------------------------------
	// setting up event handlers
	// ----------------------------------------------------	
	if (ie)
	{
		ballholder.onmousedown = function() {
			eval("this.scrollbox.dragStart();"); 
		};
		arrowup.onmousedown = function() {
			eval("this.scrollbox.scrolling=true;"
			+"this.scrollbox.scrollimg(event, this);"); 
		};
		arrowdown.onmousedown = function() {
			eval("this.scrollbox.scrolling=true;"
			+"this.scrollbox.scrollimg(event, this);"); 
		};

		arrowup.onmouseup = function() {
			eval("this.scrollbox.scrolling=false;"
			+"this.scrollbox.resetimg(event, this);"); 
		};
		arrowdown.onmouseup = function() {
			eval("this.scrollbox.scrolling=false;"
			+"this.scrollbox.resetimg(event, this);"); 
		};
	}
	else
	{
		ballholder.setAttribute (
			'onmousedown', "this.scrollbox.dragStart(event); return false;"
		);	
			
		arrowup.setAttribute (
			'onmousedown'
			, "this.scrollbox.scrolling=true;"
			+"this.scrollbox.scrollimg(event, this); return false;"
		);	
		arrowdown.setAttribute (
			'onmousedown'
			, "this.scrollbox.scrolling=true;"
			+"this.scrollbox.scrollimg(event, this); return false;"
		);	
		
		arrowup.setAttribute (
			'onmouseup'
			, "this.scrollbox.scrolling=false;"
			+"this.scrollbox.resetimg(event, this); return false;"
		);	
		arrowdown.setAttribute (
			'onmouseup'
			, "this.scrollbox.scrolling=false;"
			+"this.scrollbox.resetimg(event, this); return false;"
		);				
	}
	
	if (ff)
	{
		window.addEventListener
		(
			'DOMMouseScroll'
			, 
			function(event)
			{ 
				if (!event) var event = window.event;
				if (event.target) node = event.target;
				else if (event.srcElement) 
				{
					node = event.srcElement;
				}
				//event.preventBubble();
				event.stopPropagation();
				event.preventDefault();
				event.returnValue = false;
				
				node = node.parentNode;
				
				// ------------------------------------------------------
				// when scrolling a textnode the pointer falls through 
				// the target layer and points to a layer underneath
				// -------------------------------------------------------
				if (typeof(window.registernode) == 'undefined'
					|| window.registernode === null
				)
				{
					window['registernode'] = node;
				}
				//writeCrum(window.registernode.id);
				
				if (node.id != window.registernode.id )
				{
					if ( node.childNodes[0].id == window.registernode.id )
					{
						node = node.childNodes[0];
					}
					else if (node.id.length > 0 )
					{
						window['registernode'] = node;
					}
					else
					{
						node = window.registernode;
					}
				}

				if ( typeof(node.scrollbox) == 'undefined' ) 
				{
					return;
				}
				node.scrollbox.detectmousewheel(event, node);
			}
			, true
		);
		
	}
	else
	{
		this.scrolltarget.onmousewheel = function() {
			eval("this.scrollbox.detectmousewheel(event, this);"); 
		};
	}
	
	// ---------------------------------------------------
	// registering keytargets
	// ---------------------------------------------------
	if (typeof(keytargets) == 'undefined')
	{
		keytargets = new Array();
	}
	keytargets[keytargets.length] = this.scrolltarget;
	


	document.onkeydown =  function(event)
	{
		if (typeof(keytargets) == 'undefined') return;
		if (!event) var event = window.event;	
		
		if( typeof( event.keyCode ) == 'number' )   //DOM 
		{
			key = event.keyCode;
		} 
		else if( typeof( e.which ) == 'number' ) //NS 4 compatible
		{
			key = event.which;
		} 
		else if( typeof( event.charCode ) == 'number'  ) //also NS6+, Moz 0.9+
		{
			key = event.charCode;
		}		
		
		
		var region = false;
		
		for (var i in keytargets )
		{
			if (keytargets[i].id == window.mouseregion)
			{
				if ( typeof(keytargets[i].scrollbox) == 'undefined') continue;
				
				if (key == 38 ) // arrow up
				{
					keytargets[i].scrollbox.scrolling = true;
					keytargets[i].scrollbox.scrollUp( false );
				}
				else if (key == 40) // arrow down
				{
					keytargets[i].scrollbox.scrolling = true;
					keytargets[i].scrollbox.scrollDown( false );
				}
			}
		}

	}
	document.onkeyup =  function(event)
	{
		if (typeof(keytargets) == 'undefined') return;
		if (!event) var event = window.event;	
		for (var i in keytargets )
		{
			if (keytargets[i].id == window.mouseregion)
			{
				keytargets[i].scrollbox.scrolling = false;
			}
		}

	}

	

}

// ---------------------------------------------------------------
// slider dragging
// ---------------------------------------------------------------
widget.scrollbox.prototype.dragStart = function( event )
{

	var el;
	var x, y;
	
	this.draginit = 'ballholder';
	if (!event) var event = window.event;
	
	mousepos = this.widget.getmouse(event);
	x = mousepos[0];
	y = mousepos[1];
	
	
	this.dragObj.cursorStartX = x;
	this.dragObj.cursorStartY = y;
	this.dragObj.elStartLeft  = parseInt(this.dragObj.style.left, 10);
	this.dragObj.elStartTop   = parseInt(this.dragObj.style.top,  10);
	
	if (isNaN(this.dragObj.elStartLeft)) this.dragObj.elStartLeft = 0;
	if (isNaN(this.dragObj.elStartTop))  this.dragObj.elStartTop  = 0;
	
	if (ie) 
	{
		document.attachEvent("onmousemove", this.dragGo);
		document.attachEvent("onmouseup",   this.dragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else 
	{
		document.addEventListener("mousemove", this.dragGo,   true);
		document.addEventListener("mouseup",   this.dragStop, true);
		event.preventDefault();
		event.stopPropagation();    
	}
	
	// registering dragobject;
	window['curdrag'] = this.dragObj;
	
	return false;

}

widget.scrollbox.prototype.dragGo = function( event )
{

	if ( typeof(window.curdrag) == 'undefined')
	{
		if (!event) var event = window.event;
		if (event.target) node = event.target;
		else if (event.srcElement) node = event.srcElement;
		node = node.parentNode;
		if ( typeof(node.scrollbox) == 'undefined' ) return;
	}
	else
	{
		node = window.curdrag;
	}
	
	var x, y;
	
	mousepos = node.scrollbox.widget.getmouse(event);
	x = mousepos[0];
	y = mousepos[1];


  // Move drag element by the same amount the cursor has moved.

	node.scrollbox.dragItem (
		node.scrollbox
		, (node.elStartLeft + x - node.cursorStartX)
		, (node.elStartTop  + y - node.cursorStartY)
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


widget.scrollbox.prototype.dragItem = function(obj, x, y, full)
{


	if (typeof(this.dragrestrict_x) == 'undefined' 
		|| this.dragrestrict_x < 1 )
	{
		this.dragObj.style.left = typeof(full) == 'undefined'  
			? (parseInt(this.dragObj.style.left) + x) + 'px' 
			: x + 'px';
	}

	if (typeof(this.dragrestrict_y) == 'undefined' 
		|| this.dragrestrict_y < 1 ) 
	{
		var newtop = y;
		
		if (this.drag_xtop) 
		{
			newtop = typeof(full) == 'undefined'  
				? parseInt(this.dragObj.style.top) + newtop 
				: newtop ;			

			newtop = newtop <= this.drag_xmax 
				? newtop 
				: this.drag_xmax;
			
			newtop = newtop > 0 ? newtop : 0;
			
			if (newtop == this.drag_xmax || newtop == 0)
			{
				if (this.draginit == 'img')
				{
					this.scrolling = false;
					this.resetimg();
				}
			}
		}
		this.dragObj.style.top = newtop +'px';
	}	
	
	if ( typeof(this.scrolltarget) != 'undefined' )
	{
		this.scrolltarget.scrollTop =  (
			newtop * this.drag_factor
		);
	}
	
}


widget.scrollbox.prototype.dragStop = function( event) 
{

	if ( typeof(window.curdrag) == 'undefined')
	{
		if (!event) var event = window.event;
		
		if (event.target) node = event.target;
		else if (event.srcElement) node = event.srcElement;
		node = node.parentNode;
		
		if ( typeof(node.scrollbox) == 'undefined' ) return;
	}
	else
	{
		node = window.curdrag;
	}
	
	if (ie) 
	{
		document.detachEvent("onmousemove", node.scrollbox.dragGo);
		document.detachEvent("onmouseup",   node.scrollbox.dragStop);
	}
	else
	{
		document.removeEventListener(
			"mousemove", node.scrollbox.dragGo, true
		);
		document.removeEventListener(
			"mouseup",   node.scrollbox.dragStop, true
		);
	}

}


// ---------------------------------------------------------------
// image scrolling
// ---------------------------------------------------------------
widget.scrollbox.prototype.scrollimg = function( event, img )
{
	
	event = !event ? window.event : event;
	img.style.backgroundPosition='0 -23';
	

	this.scrolltrigger = img;
	this.draginit = 'img';
	
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

	if (img.id == this.uparrow.id)
	{
		//this.resetimg('',this.downarrow);
		this.scrollUp();
	}
	if (img.id == this.downarrow.id)
	{
		//this.resetimg('',this.uparrow);	
		this.scrollDown( );
	}

}


widget.scrollbox.prototype.scrollDown = function( noimg )
{
	if (typeof(factor) == 'undefined') var factor = 6	
	if (typeof(noimg) == 'undefined')
	{
		this.downarrow.style.backgroundPosition='0 -23';
	}
	
	this.dragItem(this, 0, factor );
	
	if(this.scrolling === true)
	{
		var nim = noimg;
		setTimeout(
			"document.getElementById('"
			+this.downarrow.id+"').scrollbox.scrollDown("+nim+")",100
		);
	}
	else
	{
		this.resetimg('',this.downarrow);
	}
}

widget.scrollbox.prototype.scrollUp = function ( noimg )
{
	if (typeof(factor) == 'undefined') factor = -6
	if (typeof(noimg) == 'undefined')
	{
		this.uparrow.style.backgroundPosition='0 -23';
	}
	
	this.dragItem(this, 0, factor );
	
	if(this.scrolling === true)
	{
		var nim = noimg;
		setTimeout(
			"document.getElementById('"
			+this.uparrow.id+"').scrollbox.scrollUp("+nim+")",100
		);
	}	
	else
	{
		this.resetimg('',this.uparrow);
	}
}



widget.scrollbox.prototype.resetimg = function( event, img )
{
	if (typeof(img) == 'undefined')
	{
		img = this.scrolltrigger;
	}
	
	img.style.backgroundPosition='0 0';	
	
}

// -----------------------------------------------------------------
// mousewheel detection
// -----------------------------------------------------------------

widget.scrollbox.prototype.detectmousewheel = function (event, obj)
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
			//event.preventBubble();
			event.stopPropagation();
			event.preventDefault();
		}
		event.returnValue = false;

		x = event.x ? event.x : event.screenX;
		y = event.y ? event.y : event.screenY;
		

		var nwtop = (-1* Math.floor(delta) );		
		this.dragItem( this, 0, nwtop);
	}

	return true;
}


// ---------------------------------------------------------------
// Arrows up / down
// ---------------------------------------------------------------
widget.scrollbox.prototype.scrollarrows = function (event)
{
	event = !event ? window.event : event;
	
	var key;
	if( typeof( event.keyCode ) == 'number' )   //DOM 
	{
		key = event.keyCode;
	} 
	else if( typeof( e.which ) == 'number' ) //NS 4 compatible
	{
		key = event.which;
	} 
	else if( typeof( event.charCode ) == 'number'  )     //also NS 6+, Moz 0.9+
	{
		key = event.charCode;
	}
	
	if (key == 38 ) // arrow up
	{
		this.scrolling = true;
		this.scrollUp();
	}
	else if (key == 40) // arrow down
	{
		this.scrolling = true;
		this.scrollDown();			
	}
	
}

widget.scrollbox.prototype.resetarrows = function (event)
{
	this.scrolling = false;
}



// ==============================================================
//  _   _                       _     _ 
// | |_| |__   ___    __ _ _ __(_) __| |
// | __| '_ \ / _ \  / _` | '__| |/ _` |
// | |_| | | |  __/ | (_| | |  | | (_| |
//  \__|_| |_|\___|  \__, |_|  |_|\__,_|
//                   |___/
// ==============================================================
widget.grid = function( root, itemlist, width, cols, rows )
{	this.root = root;
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	this.selected ='';
	this.name = '';
	this.type = '';
	this.widgettype= 'grid';
	
	this.scrolltarget = false;
	this.items 		= itemlist;
	this.values 	= new Array();
	this.headeritems = new Array();
	this.headersrc 	 = new Array();		//< datasource for header
	this.attributes = new Array();
	
	this.callback='';
	
	this.methodsrc ='';
	this.methodcallback = '';
	this.methodtrue = 'true';
	this.methoddata = new Object();
	this.methodobjects = new Array();
	this.methodclass = '';
	this.methodname = '';
	
	
	this.img_fill	= '/images/interface/grid_fill.png';
	this.img_sort 	= '/images/interface/grid_sort.png';
	this.img_delim	= '/images/interface/grid_delim.png';
	this.img_resizecursor	= 'e-resize';

	this.header_height 		= '17px';
	this.imbgpos_sortnone 	= '0 0';
	this.imbgpos_sortup 	= '0 -34';
	this.imbgpos_sortdownp 	= '0 -17';
	this.imgsort_width		= '15px';

	

	this.delim_width = '3px'; //1 + 1px padding for mouse to grab
	this.grid_bordercol = '#a0a0a0';	
	this.grid_bgcolor	= '#ffffff'

	this.row_fontcolor 		= '#231f20';
	this.row_bgcolor		= 'transparent';
	this.row_hlfontcolor 	= '#ffffff';
	this.row_hlbgcolor 		= '#326ecb';
	this.row_defselectcolor = '#c0c0c0';

	this.row_unevencolor	= '#f1f5fa';

	this.width = typeof(width)=='undefined' ? '300px' : width;
	
	this.cols = typeof(cols)=='undefined' ? '1' : cols;
	this.rows = typeof(rows)=='undefined' ? '6' : rows; // visible rows
	this.scrollbarwidth = '15px';
	this.datarowheight = '18px';
	this.headerfontsize = '10px';
	
	this.widget = new widget();
	this.elements = new Object();
}

widget.grid.prototype.populateDivs = function( prefix )
{
	prefix = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_grid 		= prefix + 'grid';
	this.div_header 	= prefix + 'gheader';
	this.div_hholder 	= prefix + 'ghholder';
	this.div_hcol 		= prefix + 'ghcol'
	this.div_hsortim 	= prefix + 'ghsortim';
	this.div_delim 		= prefix + 'delim';
	this.div_datahold	= prefix + 'gdatahold';
	this.div_data 		= prefix + 'gdata';
	this.div_dcol 		= prefix + 'gcol';
	this.div_grow 		= prefix + 'grow';
	this.div_pdown 		= prefix + 'pdown';
}

widget.grid.prototype.setScrolltarget = function( scrolltarget )
{

	if (typeof(this.scrolltarget) == 'undefined')
	{
		alert(
			'WIDGET.GRID: needs scrolltarget set ::'
			+' widget.grid( <div element by id> ) '
		);
		return false;	
	}

	if (typeof(scrolltarget)!='object')
	{
		this.scrolltarget = document.getElementById( scrolltarget );
	}
	else
	{
		this.scrolltarget = scrolltarget;
	}
}

widget.grid.prototype.setRoot = function( root )
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.GRID: grid.setRoot() expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.grid.prototype.mkitem = function ( _data, rownum, colnum )
{
	if (typeof(this.items) != 'object' )
	{
		this.items = new Array();
	}
	
	// we are building multidimensional array
	// array[ row ] [ column ] = data
	
	var rdx = typeof(rownum) == 'undefined' 
		? (this.items.length > 0 ? (this.items.length -1) : 0)
		: rownum;
	
	if ( typeof(this.items[rdx]) == 'undefined')
	{
		this.items[rdx] = new Array();
	}
	
	var cdx = typeof(colnum) == 'undefined' 
		? (this.items[rdx].length > 0 ? (this.items[rdx].length -1) : 0)
		: colnum;	
	
	this.items[rdx][cdx] = _data;
	
}

widget.grid.prototype.addrow = function ( _data, rownum )
{
	
	if ( typeof(_data) != 'object')
	{
		alert(
			'WIDGET.GRID: grid.addRow() expects data to be nummeric indexed'
			+' array or object ( data[0] = "col1 data "; ) '
		);
		return false;			
	}

	for (var i = 0; i < this.cols; i ++)
	{
		var td = typeof(_data[i]) == 'undefined' ? '' : _data[i];
		this.mkitem( td , rownum, i );
	}
}

widget.grid.prototype.populate = function( _fillobject )
{
	if (typeof(_fillobject) != 'object' && typeof(_fillobject) != 'array')
	{
		alert(
			'WIDGET.GRID: widget.grid.populate() expects key => value object'
		);
		return false;
	}
	
	// parse Headers
	/*
		var tmphead = new Array();	
		for (var i = 0; i < this.cols ; i++ )
		{		
			tmphead.push('header_'+i)
		}
		this.addHeader( tmphead );
	*/
	this.itemlist = _fillobject;
}

widget.grid.prototype.addHeader = function ( _data, rownum )
{
	
	if ( typeof(_data) != 'object')
	{
		alert(
			'WIDGET.GRID: grid.addHeader() expects data to be nummeric indexed'
			+' array or object ( data[0] = "header col1"; ) '
		);
		return false;			
	}
	
	if ( typeof(this.headeritems) == 'undefined')
	{
		this.headeritems = new Array();
	}
	
	for ( var i = 0; i < this.cols ; i++)
	{
		this.headeritems[i] = _data[i];
	}
}


widget.grid.prototype.draw = function( _returnresource, redraw )
{
	if ( empty(_returnresource)
		&& this.setRoot(this.root) === false ) 
	{
		return false;
	}
	if ( this.populate(this.items) === false)
	{
		return false;
	}
	

	if (undef(redraw) )
	{
		//check if there is a layer with the id we are about to create
		var chkdv =  document.getElementById(this.div_grid);
		var prefix = typeof(chkdv) != 'undefined' ? this.uid : '';
		
		this.populateDivs( prefix );
	}
	if (empty(this.scrolltarget) || this.scrolltarget === false)
	{	
		this.scrolltarget = this.div_data;
	}
	if ( this.setScrolltarget(this.scrolltarget) === false )
	{
		return false;	
	}

	var gridheight = (
		(this.rows * parseInt(this.datarowheight,10)) 
		+ parseInt(this.header_height,10)
		+ 2 // border
	);
	this.cols = typeof(this.cols) != 'undefined' && this.cols > 0
		? this.cols : 1;

	// -2 for border 
	var cw = parseInt(this.width,10) - parseInt(this.scrollbarwidth,10) ; 

	var headerw = Math.round( 
		(cw 
			- (this.cols * 4 )	// padding-left
			- ((this.cols) * parseInt(this.delim_width,10))
		)  / this.cols
	);
	
	if (undef(redraw))
	{
		var _grid =  document.createElement('div');
		_grid.id = this.div_grid;
		_grid.style.width = (parseInt(this.width,10) - 7)+'px';
		_grid.style.height = gridheight +'px';
		_grid.style.marginBottom = '1px';
		_grid.style.borderLeft = '1px solid';
		_grid.style.borderRight = '1px solid';
		_grid.style.borderBottom = '1px solid';
		_grid.style.borderColor = this.grid_bordercol;
		_grid.style.backgroundColor = this.grid_bgcolor;
	
		_grid['widget'] = this;
	
	}
	else
	{
		var _grid = document.getElementById(this.div_grid);
	}

	var _head = document.createElement('div');
	_head.id = this.div_header;
	_head.style.position = "absolute";
	_head.style.width = (cw*this.cols)+'px';
	_head.style.height = this.header_height;
	_head.style.clip = (
		"rect(0 "+cw+" "
		+parseInt(this.header_height,10)+" auto)"
	);
	_head.style.backgroundImage = "url(" + this.img_fill + ")";
	_head.style.backgroundRepeat = "repeat-x";
	_head.style.backgroundPosition = '0 0';
	_head.style.padding = "0";
	_head.style.overflow = "hidden";



	for (var i = 0; i < this.cols ; i++ )
	{	
	
		var _hhol = document.createElement('div');
		_hhol.id = this.div_hholder;
		_hhol.className = 'fll';
		_hhol.setAttribute('row', i );
		_hhol.style.zIndex = 50+i;
		
		var _hcol = document.createElement('div');
		_hcol.id = this.div_hcol;
		_hcol.className = 'fll';
		
		if (this.type == 'method')
		{
			var twen = 20 + parseInt(this.imgsort_width,10);
			if (i == 0) _headerw = twen;
			else
			{
				var ncw = Math.ceil((headerw-twen) / this.cols);
				_headerw = headerw + ncw;
			}
		}
		else
		{
			var _headerw = headerw;
		}
		
		_hcol.style.width = (_headerw - parseInt(this.imgsort_width,10))+'px';
		
		_hcol.style.height = this.header_height;
		_hcol.style.fontSize = this.headerfontsize;
		_hcol.style.lineHeight = this.header_height;// make it v-align center
		_hcol.style.padding = "0";
		_hcol.style.margin = "0";
		_hcol.style.paddingLeft = "4px";
		_hcol.style.cursor='default';
		_hcol.appendChild( document.createTextNode(this.headeritems[i]) );
		_hcol.style.backgroundImage = "url(" + this.img_fill + ")";
		_hcol.style.overflow = "hidden";
		_hcol.style.backgroundRepeat = "repeat-x";
		if(!undef(this.headersrc[i]))
		{
			_hcol.setAttribute('src',this.headersrc[i]);
		}
		
		var _imsort = document.createElement('div');
		_imsort.id = this.div_hsortim;
		_imsort.className = 'fll';
		_imsort.style.padding = "0";
		_imsort.style.margin = "0";
		_imsort.style.height = this.header_height;
		_imsort.style.width = this.imgsort_width;
		_imsort.style.backgroundImage = "url(" + this.img_sort + ")";
		_imsort.style.backgroundRepeat = "no-repeat";
		_imsort.style.backgroundPosition = this.imbgpos_sortnone;
		
		_hhol.appendChild(_hcol);
		_hhol.appendChild(_imsort);
		_head.appendChild(_hhol);

		
		var _delm = document.createElement('div');
		_delm.id = this.div_delim;
		_delm.className = 'fll';
		
		_delm.style.width = this.delim_width;
		_delm.style.height = this.header_height;
		_delm.style.backgroundImage = "url("+ this.img_delim +")";
		_delm.style.backgroundPosition = "0 0";
		_delm.style.backgroundRepeat = "no-repeat";
		_delm.style.cursor = this.img_resizecursor;
		
		// --------------------------------------------
		// creating handle to drag object
		// --------------------------------------------
		this.addEventListener( _delm, i );
		_delm['widget'] = this;
		_delm['dragcol'] = i;
		
		_head.appendChild(_delm);
	}
	
	// --------------------------------------------------------------
	// adding column holder div (and scrolltarget )
	// and dataholder, the scrolling and scrollcontrolling part
	// of the grid
	// ---------------------------------------------------------------
	
	var dataholder = document.createElement('div');
	dataholder.id = this.div_datahold;
	dataholder.style.position = "relative";
	//dataholder.style.top = this.header_height;
	
	var colhold = document.createElement('div');
	colhold.id = this.div_data;
	colhold.style.position = "absolute";
	colhold.style.clip = "rect(0 "+cw+" auto auto)";
	colhold.style.width = (cw*this.cols)+'px';
	colhold.style.top = this.header_height;
	colhold.style.height = (gridheight - parseInt(this.header_height,10)) +'px';
	colhold.style.overflow = "hidden";
	
	var pullholder = document.createElement('div');
	pullholder.id = this.div_pdown;
	pullholder.style.position = "relative";
	
	pullholder.style.left = (
		parseInt(this.width,10) - parseInt(this.scrollbarwidth) -1
	)+'px';
	
	pullholder.className = 'fll';
	pullholder.style.width = this.scrollbarwidth;
	pullholder.style.height = gridheight+'px';	
	//pullholder.style.border="1px solid red";
	pullholder.style.borderRight="1px solid "+this.grid_bordercol;
	pullholder.style.borderBottom="1px solid "+this.grid_bordercol;
	
	var phead = document.createElement('div');
	phead.id = 'pholder';
	phead.style.width = this.scrollbarwidth;
	phead.style.height = this.header_height;
	phead.style.backgroundImage = "url(" + this.img_fill + ")";
	phead.style.backgroundRepeat = "repeat-x";
	phead.style.backgroundPosition = '0 0';
	phead.style.padding = "0";

	pullholder.appendChild(phead);


	var colheight = (
		gridheight - parseInt(this.header_height,10)
	) + 'px';
	
	var _colw = Math.round( 
		(parseInt(this.width,10) - parseInt(this.scrollbarwidth,10) )
		/ this.cols 
	);
	
	
	if (typeof(keytargets) == 'undefined')
	{
		keytargets = new Array();
	}

	_grid.appendChild( _head );
	_grid.appendChild( dataholder );
	_grid.appendChild( pullholder );	
	
	
	if(undef(redraw)) this.root.appendChild( _grid );

	// ------------------------------------------------------
	// start scrollbox
	// ------------------------------------------------------
	var tt = new widget.scrollbox( pullholder, colhold );

	// ------------------------------------------------------
	// filling the cols with the rows
	// ------------------------------------------------------
	for ( var i=0; i < this.cols; i++)
	{

		// create column layer
		var collayer = document.createElement('div');
		collayer.id = this.div_dcol;
		collayer.setAttribute('row',i);
		collayer.className = 'fll';
		collayer.style.position="relative";
		collayer.style.cursor="default";
		collayer.style.overflow='hidden';
		collayer['grid'] = this;
		collayer['scrollbox'] = tt;
		
		if (this.type == 'method')
		{
			var twen = 24 + parseInt(this.imgsort_width,10);
			if (i == 0) collayer.style.width = twen+'px'; //20 + padding header
			else
			{
				var ncw = Math.ceil((_colw-twen) / this.cols);
				collayer.style.width = (_colw+ncw)+'px';	
			}
		}
		else
		{
			collayer.style.width = _colw+'px';
		}

		this.fillcol( collayer, i);
		
		colhold.appendChild( collayer );	
		
		
		if (i == 0 )  var measure = collayer;
	}
	dataholder.appendChild( colhold );


    tt.height = (gridheight - parseInt(this.header_height,10)) +'px';
    if (this.attributes.length >= this.cols)
    {
  		tt.measurewindow = measure;
  	}
	// --------------------------------------
	// building it
	// --------------------------------------	
    tt.draw();

    if (undef(redraw))
    {
    	if (!empty(this.selected))	this.select_opt(this.selected);
    }
    this.elements['grid'] = _grid;
    this.elements['scroll'] = tt;
	
}


widget.grid.prototype.fillcol = function( root, colnum )
{


	if (typeof(root)=='undefined') return;	
	var ic = count(this.items);
	
	for (var i=0; i < ic; i ++)
	{		
		var c_row = document.createElement('div');
		c_row.id = this.div_grow;
		c_row.style.height = '14px';
		c_row.style.lineHeight = '14px';
		c_row.setAttribute('row', i );
		
		if (i%2 == 1)
		{
			c_row.style.backgroundColor = this.row_unevencolor;
		}
		
		var attribs = new Object();
		if(!empty(this.attributes[i]))
		{
			if (isObject(this.attributes[i]))
			{
				for (var x in this.attributes[i])
				{
					c_row.setAttribute(x, this.attributes[i][x] );
				}
			}
			else
			{
				c_row.setAttribute('uuid', this.attributes[i]);
			}
		}
		if(!empty(this.headersrc[colnum]))
		{
			c_row.setAttribute('src', this.headersrc[colnum]);
		}		
		c_row.style.overflow = 'hidden';
		c_row.style.padding = '2px 0px 2px 4px'; 
		
		// ------------------------------------------------------------------
		// if this is a method grid and we are in colnr 1 set checkbox
		// -------------------------------------------------------------------
		
		if (colnum == 0 && this.type == 'method')
		{
			if(undef(this.methoddata[0][i].name)) 
			{
				this.methoddata[0][i].name=this.name;
			}
			
			c_row['check'] = new widget.checkbox
			(
				c_row, this.methoddata[0][i] , null,this.methodcallback , 1
			);
			c_row['check'].draw();
			this.methodobjects.push(c_row);
			
			if (this.methoddata[colnum][i][this.methodsrc] == this.methodtrue)
			{
				c_row['check'].switchon(c_row);
			}
			else
			{
				c_row['check'].switchoff(c_row);
			}
			//addListener(c_row, 'onclick', this.select_opt);
		}
		else
		{
			if ( ic < 0)
			{
				c_row.appendChild( document.createTextNode('    '));
			}
			else
			{
				
				if( empty(this.items[i]) ) continue;
				var txt = undef(this.items[i][colnum]) ? '    ' : this.items[i][colnum];
				c_row.appendChild( document.createTextNode(txt));
				
				if (undef(this.type) || this.type != 'method')
				{
					addListener(c_row, 'onclick', this.select_opt);
				}
			}
		}		
		
		/**
			Setting keytargets
		**/
		keytargets[keytargets.length] 	= c_row;
		root.appendChild( c_row );
		
		/*
		if (empty(this.selected) && i==0)
		{
			this.selected = undef(this.items[i][colnum]) ? null : c_row;
		}
		*/
	}
}



widget.grid.prototype.addEventListener = function( obj, row )
{
	this.dragObj = obj;
	
	if (ie)
	{
		obj.onmousedown = function() {
			eval("this.widget.dragStart(event, row);"); 
		};
	}
	else
	{
		obj.setAttribute (
			'onmousedown', "this.widget.dragStart(event,'"+row+"');"
		);	
	}
return;

	// ---------------------------------------------------
	// registering keytargets
	// ---------------------------------------------------
	if (typeof(keytargets) == 'undefined')
	{
		keytargets = new Array();
	}
	if ( typeof(keyfunctions) == 'undefined')
	{
		keyfunctions = new Array();
	}
	
	var idx = keytargets.length
	keytargets[idx] 	= obj;
	keyfunctions[idx] 	=  'widget.handleKeys( event )';

	
	document.onkeydown =  function(event)
	{

		if (typeof(keytargets) == 'undefined') return;
		if (!event) var event = window.event;	
		
		if( typeof( event.keyCode ) == 'number' )   //DOM 
		{
			key = event.keyCode;
		} 
		else if( typeof( e.which ) == 'number' ) //NS 4 compatible
		{
			key = event.which;
		} 
		else if( typeof( event.charCode ) == 'number'  ) //also NS6+, Moz 0.9+
		{
			key = event.charCode;
		}			
		
		
		if (typeof(keytargets) == 'undefined') return;
		var region = false;
		
		for (var i in keytargets )
		{
			if (keytargets[i].id == window.mouseregion)
			{

				writeCrum( key , true );	
				if ( typeof(keytargets[i].widget) == 'undefined') continue;
				
			}
		}

	}
	obj.onkeyup =  function(event)
	{
		if (typeof(keytargets) == 'undefined') return;
		if (!event) var event = window.event;	
		for (var i in keytargets )
		{
			if (keytargets[i].id == window.mouseregion)
			{
				keytargets[i].widget.handleKeys = false;
			}
		}

	}

}

// ----------------------------------------------------
// called out of scope
// caller.obj is actually us
// ----------------------------------------------------
widget.grid.prototype.receiveupdate = function( caller )
{

	caller.obj.selected = null;
	var atr = caller.obj.attributes; // [ row# ][ col# ] = val
	// always: uuid: , moduleclass: 
	
	var tmpdata 	= new Array();
	var tmpattribs	= new Array();
	var hit = 0;
	
	
	if ( caller.dataindex == 'delete' )
	{
		for (var rows =0; rows < atr.length; rows++)
		{
			ci = 0;
			hit = 0;
			for (var cols=0; cols < atr[rows].length; cols++)
			{
				if ( atr[rows][cols][caller.matchid] 
					== caller.data[caller.matchid]
				)
				{
					hit=1;
					continue;
				}
			}
			
			if (hit === 0)
			{
				tmpdata.push(caller.obj.items[rows]);
				tmpattribs.push(atr[rows]);
			}
		}
		caller.obj.items = tmpdata;
		caller.obj.attributes = tmpattribs;
	}
	else if ( caller.dataindex == 'create' )
	{
		var rowl = caller.obj.items.length;
		for( var i in caller.obj.headersrc)
		{
			if(!empty(caller.data[caller.obj.headersrc[i]]))
			{
				if (!isObject(caller.obj.items[rowl]))
				{
					caller.obj.items[rowl] = new Array();
					caller.obj.attributes[rowl] = new Object();
				}	
				caller.obj.items[rowl][i] = caller.data[caller.obj.headersrc[i]];
				for (var y in caller.matchid)
				{
					if (!isObject(caller.obj.attributes[rowl][i]))
					{
						caller.obj.attributes[rowl][i] = new Object();
					}
					caller.obj.attributes[rowl][i][caller.matchid[y]] = caller.data[caller.matchid[y]];
				}
			}
		}
	}
	else if ( caller.dataindex == 'update' )
	{
		alert('grid received update call');
	}
	
	var grid = document.getElementById(caller.obj.div_grid);
	caller.obj.widget.deleteChildren( grid );
	caller.obj.draw(null,1);
}


widget.grid.prototype.redraw = function(obj_grid)
{
	var grid = document.getElementById(obj_grid.div_grid);
	if (empty(grid)) return;
	
	obj_grid.widget.deleteChildren( grid );	
	obj_grid.draw(null,1);
	
	
}

widget.grid.prototype.handleUpdate = function( obj )
{
	
}



widget.grid.prototype.select_opt = function( obj )
{
	if (obj === null || obj.parentNode === null)
	{
		return;
	}
	var basenode = obj.parentNode.parentNode.childNodes;
	var rownum = obj.getAttribute('row');
	var lc = 0;
	for (var i =0; i < basenode.length; i++)
	{
		for( var y = 0; y < basenode[i].childNodes.length; y++)
		{	
			if ( basenode[i].childNodes[y].nodeType != ELEMENT_NODE ) continue;
			var crow = basenode[i].childNodes[y].getAttribute('row')
			if ( crow === rownum )
			{
				basenode[i].childNodes[y].style.backgroundColor = (
					obj.parentNode.grid.row_hlbgcolor
				);
				basenode[i].childNodes[y].style.color = (
					obj.parentNode.grid.row_hlfontcolor
				);
				
				if(obj.parentNode.grid.callback && lc == 0) 
				{
					eval("obj.parentNode.grid.callback(obj)");
					lc++;
				}
			}
			else
			{
				var bgcol = (crow % 2 == 1) 
					? obj.parentNode.grid.row_unevencolor
					: obj.parentNode.grid.row_bgcolor;

				basenode[i].childNodes[y].style.backgroundColor = (bgcol);
				basenode[i].childNodes[y].style.color = (
					obj.parentNode.grid.row_fontcolor
				);
			}
		}
	}
}

widget.grid.prototype.highlight_opt = function( obj )
{
	
	var basenode = obj.parentNode.parentNode.childNodes;
	var rownum = obj.getAttribute('row');
	for (var i =0; i < basenode.length; i++)
	{
		for( var y = 0; y < basenode[i].childNodes.length; y++)
		{	
			if ( basenode[i].childNodes[y].nodeType != ELEMENT_NODE ) continue;
			if ( basenode[i].childNodes[y].getAttribute('row') === rownum )
			{
				basenode[i].childNodes[y].style.backgroundColor = (
					obj.parentNode.grid.row_hlbgcolor
				);
				basenode[i].childNodes[y].style.color = (
					obj.parentNode.grid.row_hlfontcolor
				);
			}
		}
	}	
}


widget.grid.prototype.lowlight_opt = function( obj )
{
	var basenode = obj.parentNode.parentNode.childNodes;
	var rownum = obj.getAttribute('row');
	for (var i =0; i < basenode.length; i++)
	{
		for( var y = 0; y < basenode[i].childNodes.length; y++)
		{	
			if ( basenode[i].childNodes[y].nodeType != ELEMENT_NODE ) continue;
			if ( basenode[i].childNodes[y].getAttribute('row') === rownum )
			{
				basenode[i].childNodes[y].style.backgroundColor = (
					obj.parentNode.grid.row_bgcolor
				);
				basenode[i].childNodes[y].style.color = (
					obj.parentNode.grid.row_fontcolor
				);
			}
		}
	}
}



// ---------------------------------------------------------------
// slider dragging
// ---------------------------------------------------------------
widget.grid.prototype.dragStart = function( event , row)
{

	this.dragObj['currow'] = row;
	
	
	var el;
	var x, y;
	
	if (!event) var event = window.event;
	
	mousepos = this.widget.getmouse(event);
	x = mousepos[0];
	y = mousepos[1];
	
	
	this.dragObj.cursorStartX = x;
	this.dragObj.cursorStartY = y;
	this.dragObj.elStartLeft  = parseInt(this.dragObj.style.left, 10);
	this.dragObj.elStartTop   = parseInt(this.dragObj.style.top,  10);
	
	if (isNaN(this.dragObj.elStartLeft)) this.dragObj.elStartLeft = 0;
	if (isNaN(this.dragObj.elStartTop))  this.dragObj.elStartTop  = 0;
	
	if (ie) 
	{
		document.attachEvent("onmousemove", this.dragGo);
		document.attachEvent("onmouseup",   this.dragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else 
	{
		document.addEventListener("mousemove", this.dragGo,   true);
		document.addEventListener("mouseup",   this.dragStop, true);
		event.preventDefault();
		event.stopPropagation();    
	}
	
	// registering dragobject;
	window['curdrag'] = this.dragObj;
	window['gridobj'] = document.getElementById(this.dragObj.widget.div_grid);
	
	return false;
}

widget.grid.prototype.dragGo = function( event )
{
	if ( typeof(window.curdrag) == 'undefined')
	{
		if (!event) var event = window.event;
		if (event.target) node = event.target;
		else if (event.srcElement) node = event.srcElement;
		node = node.parentNode;
		if ( typeof(node.widget) == 'undefined' ) return;
	}
	else
	{
		node = window.curdrag;
	}
	
	var x, y;
	
	mousepos = node.widget.widget.getmouse(event);
	x = mousepos[0];
	y = mousepos[1];


  // Move drag element by the same amount the cursor has moved.
	node.widget.dragItem (
		node
		, (node.elStartLeft + x - node.cursorStartX)
		, (node.elStartTop  + y - node.cursorStartY)
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


widget.grid.prototype.dragItem = function(obj, x, y, full)
{
	// -------------------------------------------------------------------
	/*
		ok, so now we have the delimiter and the column we are working on
		we have to move:
		- adjacent header_divs
		- columns. note that the row number is starting point, so when
			col 0 is called we have to move the 1st ( 0 ) and all the rest
			after that one
			
			      [ grid ]
			         ||
		[ headers ] ---- [ dataholder ]   
		
	*/
	// --------------------------------------------------------------------

	var header 	= window.gridobj.childNodes[0];
	var datahold= window.gridobj.childNodes[1].childNodes[0];

	for (var i =0; i < header.childNodes.length; i++)
	{

		if ( header.childNodes[i].id == this.dragObj.widget.div_hholder)
		{
			if ( header.childNodes[i].getAttribute('row') 
				== this.dragObj.currow)
			{
				var headobj = header.childNodes[i];
				break;
			}
		}
	}
	headobj = headobj.childNodes[0];

	for (var i =0; i < datahold.childNodes.length; i++)
	{
		if ( datahold.childNodes[i].id == this.dragObj.widget.div_dcol)
		{
			if ( datahold.childNodes[i].getAttribute('row') 
				== this.dragObj.currow)
			{
				var rowobj = datahold.childNodes[i];
				break;
			}
		}
	}

	if ( typeof(window['headstart']) == 'undefined')
	{
		window['headstart'] = parseInt( headobj.offsetWidth, 10 );
		window['colstart'] = parseInt( rowobj.offsetWidth, 10 );
	}

	var hw =  window['headstart'] + x;
	var cw = window['colstart'] + x;
	
	headobj.style.width = ( hw > 14 ? hw : 14 ) + 'px';	
	rowobj.style.width = ( cw > 29 ? cw : 29  ) + 'px';

	return;
}


widget.grid.prototype.dragStop = function( event) 
{

	if ( typeof(window.curdrag) == 'undefined')
	{
		if (!event) var event = window.event;
		
		if (event.target) node = event.target;
		else if (event.srcElement) node = event.srcElement;
		node = node.parentNode;
		
		if ( typeof(node.widget) == 'undefined' ) return;
	}
	else
	{
		node = window.curdrag;
	}
	
	if (ie) 
	{
		document.detachEvent("onmousemove", node.widget.dragGo);
		document.detachEvent("onmouseup",   node.widget.dragStop);
	}
	else
	{
		document.removeEventListener(
			"mousemove", node.widget.dragGo, true
		);
		document.removeEventListener(
			"mouseup",   node.widget.dragStop, true
		);
	}

}


// ----------------------------------------------------------------------------
//                               __ _      _     _          _   
//   __ _ _ __ ___  _   _ _ __  / _(_) ___| | __| |___  ___| |_ 
//  / _` | '__/ _ \| | | | '_ \| |_| |/ _ \ |/ _` / __|/ _ \ __|
// | (_| | | | (_) | |_| | |_) |  _| |  __/ | (_| \__ \  __/ |_ 
//  \__, |_|  \___/ \__,_| .__/|_| |_|\___|_|\__,_|___/\___|\__|
//  |___/                |_| 
// ----------------------------------------------------------------------------

widget.group = function( root, level, width, height, caption )
{

	this.root = root;
	this.level 	= undef(level) ? 1 : level;
	this.width 	= undef(width) ? '635px' : width;
	
	this.height = undef(height) ? '350px': height;
	this.caption = caption;
	this.widgettype= 'group';
	
	this.elements = new Object();
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();

	this.img_topleft	= '/images/interface/level'+level+'_ctl.png';
	this.img_topright 	= '/images/interface/level'+level+'_ctr.png';
	this.img_botleft	= '/images/interface/level'+level+'_cbl.png';
	this.img_botright	= '/images/interface/level'+level+'_cbr.png';

	this.img_height	= '5px'; 
	this.img_width	= '6px';
	
	
	switch (parseInt(level))
	{
		case(2):
		{
			this.bgcolor 	 = '#e0e1e1';
			this.bordercolor = '#b1b1b1';		
		}
		break;
		
		default:
			this.bgcolor 	 = '#e9e9e9';
			this.bordercolor = '#b3b1b1';
	}
	


}

widget.group.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_group 		= p + (undef(this.div_group) ? 'group':this.div_group);
	this.div_topleft 	= p + 'ctl';
	this.div_topline 	= p + 'tl';
	this.div_topright 	= p + 'ctr';
	this.div_colleft 	= p + 'lcolm';
	this.div_center 	= p + (undef(this.div_center)? 'cpiece':this.div_center)
	this.div_colright 	= p + 'rcolm';
	this.div_botleft	= p + 'cbl';
	this.div_botline 	= p + 'bl';
	this.div_botright 	= p + 'cbr';
}


widget.group.prototype.setRoot = function( root )
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.GROUP: group.setRoot() expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}


widget.group.prototype.draw = function( _returnresource )
{
	if ( typeof(_returnresource) == 'undefined' 
		&&this.setRoot(this.root) === false ) 
	{
		return false;
	}
	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_group);
	
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );

	var linewidth = (
		parseInt(this.width,10) - ( parseInt(this.img_width,10)*2) 
	) + 'px';
	var lineheight = (
		parseInt(this.height,10) - ( parseInt(this.img_height,10)*2)
	) + 'px';
	
	var group = document.createElement('div');
	//group.style.border = "1px solid #000";
	if(this.caption!=undefined && this.caption != ""){
		var captionDiv = document.createElement('div');
		captionDiv.id = "groupcaption";
		captionDiv.style.height = "16px";
		captionDiv.style.paddingLeft = "4px";
		captionDiv.style.verticalAlign = "top";
		
		var captionTextNode = document.createTextNode(this.caption);
		captionDiv.appendChild(captionTextNode);
		group.appendChild(captionDiv);
		
		var extraHeight = captionDiv.style.height;
	} else {
		var extraHeight = 0;
	}
	
	group.id = this.div_group;
	group.style.width 		= this.width;
	group.style.height 		= parseInt(this.height,10) + extraHeight;
	group.style.position	= "relative";
	//group.style.border = '1px solid ';
	
	var topleft = document.createElement('div');
	topleft.id = this.div_topleft;
	topleft.className 		= 'fll';
	topleft.style.fontSize	= "0px";
	topleft.style.width		= this.img_width;
	topleft.style.height	= this.img_height;
	topleft.style.backgroundImage = "url(" + this.img_topleft + ")";
	topleft.style.backgroundRepeat = "no-repeat";

	var topline = document.createElement('div');
	topline.id = this.div_topline;
	topline.className 		= 'fll';
	topline.style.fontSize	= "0px";
	topline.style.width 	= linewidth;
	topline.style.height 	= (parseInt(this.img_height,10) - (ie?0:1))+'px' ;
	topline.style.backgroundColor	= this.bgcolor;
	topline.style.borderTop	= "1px solid " + this.bordercolor;

	var topright = document.createElement('div');
	topright.id = this.div_topright;
	topright.className 		= 'fll';
	topright.style.fontSize = "0px";
	topright.style.width	= this.img_width;
	topright.style.height	= this.img_height;
	var cim = document.createElement('img');
	cim.src = this.img_topright;
	cim.style.position = 'relative';
	cim.style.left='-1px';
	cim.border = 0;
	topright.appendChild(cim);

	
	var colleft = document.createElement('div');
	colleft.id = this.div_colleft;
	colleft.className 		= 'fll';
	colleft.style.fontSize	= "0px";
	colleft.style.width 	= (parseInt(this.img_width,10) - 1)+'px';
	colleft.style.height 	= lineheight;
	colleft.style.backgroundColor = this.bgcolor;
	colleft.style.borderLeft = "1px solid " + this.bordercolor;


	var center = document.createElement('div');
	center.id = this.div_center;
	center.className 		= 'fll';
	
	if (ie)
	{
		center.style.width 		= (parseInt(linewidth,10) )+'px';
		center.style.height 	= (parseInt(lineheight,10))+'px';
	}
	else 
	{
		center.style.width 		= (parseInt(linewidth,10) - (2*5))+'px';
		center.style.height 	= (parseInt(lineheight,10) - (2*5))+'px';
	}
	center.style.backgroundColor = this.bgcolor;
	center.style.padding ="5px";

	
	var colright = document.createElement('div');
	colright.id = this.div_colright;
	colright.className 		= 'fll';
	colright.style.fontSize	= "0px";
	colright.style.width 	= (parseInt(this.img_width,10) - (ie?0:1))+'px';
	colright.style.height 	= lineheight
	colright.style.backgroundColor	= this.bgcolor;
	colright.style.borderRight = "1px solid " + this.bordercolor;


	var botleft = document.createElement('div');
	botleft.id = this.div_botleft;
	botleft.className 		= 'fll';
	botleft.style.fontSize	= "0px";
	botleft.style.width		= this.img_width;
	botleft.style.height	= this.img_height;
	botleft.style.backgroundImage = "url(" + this.img_botleft + ")";
	botleft.style.backgroundRepeat = "no-repeat";
	
	var botline = document.createElement('div');
	botline.id = this.div_botline;
	botline.className 		= 'fll';
	botline.style.fontSize	= "0px";
	botline.style.width 	= linewidth;
	botline.style.height 	= (parseInt(this.img_height,10) - (ie?0:1))+'px';
	botline.style.backgroundColor	= this.bgcolor;
	botline.style.borderBottom	= "1px solid " + this.bordercolor;
	
	var botright = document.createElement('div');
	botright.id = this.div_botright;
	botright.className 		= 'fll';
	botright.style.fontSize= "0px";
	botright.style.width	= this.img_width;
	botright.style.height	= this.img_height;
	var cim = document.createElement('img');
	cim.src = this.img_botright;
	cim.style.position = 'relative';
	cim.style.left='-1px';
	cim.border = 0;
	botright.appendChild(cim);

	var hol1 = document.createElement('div');
	hol1.id = this.uid + 'hol1';
	hol1.style.width	= this.width;
	hol1.style.height	 = this.img_height;
	
	var hol2 = document.createElement('div');
	hol2.id = this.uid + 'hol2';
	hol2.style.width	= this.width;
	hol2.style.height	 = lineheight;
	
	var hol3 = document.createElement('div');
	hol3.id = this.uid + 'hol3';
	hol3.style.width	= this.width;
	hol3.style.height	 = this.img_height;


	hol1.appendChild( topleft );
	hol1.appendChild( topline );
	hol1.appendChild( topright );

	hol2.appendChild( colleft );
	hol2.appendChild( center );
	hol2.appendChild( colright );
	
	hol3.appendChild( botleft );
	hol3.appendChild( botline );
	hol3.appendChild( botright );
	
	group.appendChild( hol1 );
	group.appendChild( hol2 );
	group.appendChild( hol3 );
	
	this.root.appendChild( group );
	
	this.elements['group'] = group;
	this.elements['center'] = center;
	 
}


// -----------------------------------------------------------------------------
//      _         _        _     _        
//   __| | __ _  | |_ __ _| |__ | |__ ____
//  / _` |/ _` | | __/ _` | '_ \| '_ \_  /
// | (_| | (_| | | || (_| | |_) | |_) / / 
//  \__,_|\__,_|  \__\__,_|_.__/|_.__/___|
//
// -----------------------------------------------------------------------------
widget.tabbar = function(root, items, labels, callback, curtab)
{
	this.root 		= root;
	this.items 		= items;
	this.labels		= labels;
	this.currenttab 	= curtab;
	this.widgettype= 'tabbar';
	
	this.call_func 	= callback;
	this.call_args	= '';
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();

	this.img_lbut	= '/images/interface/tab_lbutt.png';
	this.img_fill 	= '/images/interface/tab_fill.png';
	this.img_delim	= '/images/interface/tab_mdelim.png';
	this.img_rbut	= '/images/interface/tab_rbutt.png';
	this.img_hlite	= '/images/interface/tab_hlite.png';
	
	this.img_height	= '21px'; 
	this.img_butwidth	= '10px';

	this.elements = new Object();	
}

widget.tabbar.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_tabbar = p + 'tabbar';
	this.div_tlbutt = p + 'tlbutt';
	this.div_tfill 	= p + 'tfill';
	this.div_titem 	= p + 'titem';
	this.div_tdelim = p + 'tdelim';
	this.div_trbutt = p + 'trbutt';
}


widget.tabbar.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.TABBAR: tabbar.setRoot() expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.tabbar.prototype.setCallback = function (callback )
{
	if (undef(callback))
	{
		alert(
			"WIDGET.TABBAR: tabbar.setCallback expects function "
		);
		return false;
	}
	this.call_func = callback;
}

widget.tabbar.prototype.populate = function( _fillobject )
{
	if (typeof(_fillobject) != 'object' && typeof(_fillobject) != 'array')
	{
		alert(
			'WIDGET.TABBAR: tabbar.populate() expects numeric array'
		);
		return false;
	}
	
	this.items = _fillobject;
}


widget.tabbar.prototype.draw = function( _returnresource )
{
	if ( typeof(_returnresource) == 'undefined' 
		&& this.setRoot(this.root) === false ) 
	{
		return false;
	}
	
	if ( this.setCallback(this.call_func) === false )
	{
		return false;
	}
	if (this.populate(this.items) === false)
	{
		return false;
	}
	
	this.root.innerHTML = '';	
	var chkdv =  document.getElementById(this.div_tabbar);
	var prefix = (null !== chkdv) ? this.uid : '';
	
	this.populateDivs( prefix );

	var tabbar = document.createElement('div');
	tabbar.id = this.div_tabbar;
	tabbar.style.visibility	= "hidden";
	tabbar.style.fontSize	= "0";
	tabbar.style.position	= "relative";
	tabbar.style.height		= this.img_height;
	tabbar.style.textAlign	= "center";
	tabbar.style.width		= "150px";
	tabbar.style.margin	= "0 auto 0 auto";
	tabbar.style.zIndex		= "10";	
	
	var lbut =  document.createElement('div');
	lbut.id = this.div_tlbutt;
	lbut.className="fll";
	lbut.style.fontSize		= "0";
	lbut.style.position		= "relative";
	lbut.style.width		= this.img_butwidth;
	lbut.style.height		= this.img_height;
	lbut.style.margin		= "0px";
	lbut.style.padding		= "0px";
	lbut.style.backgroundImage		= "url(" + this.img_lbut + ")";
	lbut.style.backgroundPosition 	= "0 0";
	lbut.style.backgroundRepeat		= "no-repeat";
	
	
	var fill  = document.createElement('div');
	fill.id = this.div_tfill;
	fill.className="fll";
	fill.style.fontSize		= "0";
	fill.style.position		= "relative";
	fill.style.margin		= "0px";
	fill.style.padding		= "0px";	
	fill.style.height		= this.img_height;
	fill.style.backgroundImage		= "url(" + this.img_fill + ")";
	fill.style.backgroundPosition	= "0 0";
	fill.style.backgroundRepeat		= "repeat-x";
	

	var titem = document.createElement('div');
	titem.id = this.div_titem;
	titem.className="fll";
	titem.style.fontSize	= "10px";
	titem.style.paddingLeft	= "10px";
	titem.style.paddingRight= "10px";
	titem.style.height		= this.img_height;
	titem.style.lineHeight	= this.img_height;
	titem.style.cursor		= "default";
	
	var delim  = document.createElement('div');
	delim.id = this.div_tdelim;
	delim.className="fll";
	delim.style.fontSize	= "0";
	delim.style.position	= "relative";	
	delim.style.width		= "1px";
	delim.style.height		= this.img_height;
	delim.style.backgroundImage		= "url(" + this.img_delim + ")";
	delim.style.backgroundPosition	= "0 0";
	delim.style.backgroundRepeat	= "no-repeat";

	var rbut = document.createElement('div');
	rbut.id = this.div_trbutt;
	rbut.className="fll";
	rbut.style.fontSize		= "0";
	rbut.style.position		= "relative";
	rbut.style.width		= this.img_butwidth;
	rbut.style.height		= this.img_height;
	rbut.style.margin		= "0px";
	rbut.style.padding		= "0px";
	rbut.style.backgroundImage		= "url(" + this.img_rbut + ")";
	rbut.style.backgroundPosition 	= "0 0";
	rbut.style.backgroundRepeat		= "no-repeat";
	
	
	// -----------------------------------------------------------------
	// add items
	// -----------------------------------------------------------------
	
	tabbar.appendChild( lbut );
	tabbar.appendChild( fill );
	tabbar.appendChild( rbut );
	this.root.appendChild( tabbar );
	
	
	var twidth = ( 2 * parseInt(this.img_butwidth));
	for ( var i = 0; i < this.items.length; i ++ )
	{
		
		if ( typeof(this.items[i]) == 'undefined' ) continue;
		
		var item = document.createElement('div');
		item.id='titem';
		item.setAttribute('tab', this.items[i] );
		item.setAttribute('uid', i );
		item.setAttribute('len', (this.items.length -1) );
		
		var dlm = document.createElement('div');
		dlm.id = 'tdlm';
		
		var t = null;
		if ( this.items[i] == this.currenttab )
		{
			if (i == 0) // first tab, active
			{
				lbut.style.backgroundPosition='0 -21';
			}
			else
			{
				lbut.style.backgroundPosition='0 0';
				item.style.backgroundPosition='0 0';				
			}
			
			if (i == this.items.length -1 ) // last tab active
			{
				rbut.style.backgroundPosition='0 -21';
			}
			else
			{
				rbut.style.backgroundPosition='0 0';
			}
			
			item.style.backgroundImage='url(/images/interface/tab_hlite.png)';
			item.style.backgroundRepeat='repeat-x';
			dlm.style.backgroundPosition='0 -21';
		}
		else
		{
			item.style.backgroundImage='';
			if ( this.items[i+1] == this.currenttab )
			{
				dlm.style.backgroundPosition='0 -21';
			}
			else
			{
				dlm.style.backgroundPosition='0 0';			
			}
		}
		
		if (i == 0 ) 
		{
			item.style.paddingLeft="0px";//setAttribute('class', 'first');
		}
		if (i == this.items.length -1) 
		{
			item.style.paddingRight="0px";//item.setAttribute('class', 'last');
		}
		
		
		var txt = undef(this.labels[i]) ? this.items[i] : this.labels[i];
		
		var t = document.createTextNode( txt );
		item.appendChild( t );
		item['widget'] = this;
		item.onmousedown = function(){eval("this.widget.hilite(this);")};
		item.onmouseup = function(){eval("this.widget.call_func(this);")};
	

		fill.appendChild(item);
		twidth = twidth + item.offsetWidth;
		
		if (i != this.items.length -1 )
		{
			fill.appendChild(dlm);
			twidth = twidth + dlm.offsetWidth;
		}
	}
	tabbar.style.width = twidth;
	tabbar.style.margin= (
		"0px 0px 0px " 	+ (Math.round((this.root.offsetWidth -twidth)/2))+"px"
	);
	
	this.elements['lbut'] = lbut;
	this.elements['rbut'] = rbut;
	tabbar.style.visibility='visible';
}
widget.tabbar.prototype.hilite = function( obj )
{
	clearSelect();
	var curn = obj.getAttribute('uid') ;
	var len = obj.getAttribute('len') ;
	
	for (var i=0; i < obj.parentNode.childNodes.length; i++)
	{
		if (obj.parentNode.childNodes[i].id !='titem') 
		{
			obj.parentNode.childNodes[i].style.backgroundPosition='0 0';
			continue;
		}
		obj.parentNode.childNodes[i].style.backgroundImage='none';
	}
	
	var imh = parseInt(obj.widget.img_height,10);
	obj.style.backgroundImage = 'url(/images/interface/tab_hlite.png)';
	obj.widget.elements.lbut.style.backgroundPosition='0 0';
	obj.widget.elements.rbut.style.backgroundPosition='0 0';
	if(curn == 0)
	{
		obj.widget.elements.lbut.style.backgroundPosition='0 -'+imh;
	}
	else if(curn == len)
	{
		obj.widget.elements.rbut.style.backgroundPosition='0 -'+imh;
	}
	else
	{
		obj.nextSibling.style.backgroundPosition='0 -'+imh;
	}
	obj.style.cursor = 'wait';
}

// ----------------------------------------------------------------------------
//                _ _                                   
//  _ __ __ _  __| (_) ___   __ _ _ __ ___  _   _ _ __  
// | '__/ _` |/ _` | |/ _ \ / _` | '__/ _ \| | | | '_ \ 
// | | | (_| | (_| | | (_) | (_| | | | (_) | |_| | |_) |
// |_|  \__,_|\__,_|_|\___/ \__, |_|  \___/ \__,_| .__/ 
//                          |___/                |_|                             
// ----------------------------------------------------------------------------
widget.radiogroup = function( root, label, ilist, itypes, ilabels, ivals )
{
	this.root = root;
	this.label = label;
	this.itemlist = ilist;
	this.itemtypes = itypes;	//< other widgets as groupmember
	this.itemlabels = ilabels; 	//< can use xtra labels
	this.itemvals = ivals; 		//< data for other widgets
	
	this.elements = new Object();
	this.widgettype= 'radiogroup';
}

widget.radiogroup.prototype.returnLabel = function( label , name )
{
	// FirstLetter Uppercase
	var _txt = typeof(label) == 'undefined' ? name: label;
	
	var txt = _txt.substring(0,1).toUpperCase();
	txt = txt + _txt.substring(1);
	
	txt = txt.replace(/_/g,' ');
	_txt = null;
	
	return txt;
}

widget.radiogroup.prototype.addListItem = function( idx, val )
{
	if (typeof(this.itemlist)!='object' || null == this.itemslist) 
	{
		this.itemlist = new Object();
	}
	this.itemlist[idx] = val;
}

widget.radiogroup.prototype.populateList = function( _fillobject )
{
	if (typeof(_fillobject) != 'object' && typeof(_fillobject) != 'array')
	{
		alert(
			'WIDGET.RADIOGROUP: radiogroup.populateList() '
			+'expects key => value object (keys must match populateTypes)'
		);
		return false;
	}
	this.itemlist = _fillobject;
}


widget.radiogroup.prototype.addTypeItem = function( idx, val )
{
	if (typeof(this.itemtypes)!='object' || null == this.itemtypes) 
	{
		this.itemtypes = new Object();
	}
	this.itemtypes[idx] = val;
}

widget.radiogroup.prototype.populateTypes = function( _fillobject )
{
	if (typeof(_fillobject) != 'object' && typeof(_fillobject) != 'array')
	{
		return false;
	}
	this.itemtypes = _fillobject;
}

widget.radiogroup.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.radiobutton: radiobutton.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	this.root = typeof(root)!='object' 
		? document.getElementById( root ) 
		: this.root = root;
}


widget.radiogroup.prototype.draw = function()
{

	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}
	
	if ( this.populateList(this.itemlist) === false)
	{
		return false;
	}
	
	if ( this.populateTypes(this.itemtypes) === false)
	{
		return false;
	}	
	
	// -----------------------------------------------------
	// create list of radiobutton objects and draw, if not
	// a label, but other widget the widget
	// -----------------------------------------------------
	
	alert('NEEDS IMPLEMENTING!! ' + this.itemtypes);
	
	
	
	
}




// ----------------------------------------------------------------------------
//                _ _       _           _   _   
//  _ __ __ _  __| (_) ___ | |__  _   _| |_| |_ 
// | '__/ _` |/ _` | |/ _ \| '_ \| | | | __| __|
// | | | (_| | (_| | | (_) | |_) | |_| | |_| |_ 
// |_|  \__,_|\__,_|_|\___/|_.__/ \__,_|\__|\__|                              
// ----------------------------------------------------------------------------
widget.radiobutton = function( root, attrib, label )
{
	this.root = root;
	this.label = label;
	this.attrib = attrib;
	this.name = attrib['name'];
	this.widgettype= 'radiobutton';
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	
	this.div_button = 'radiobutt';
	this.div_label 	= 'radiolabel';
	this.div_hidden = 'radiohidden';
	
	this.img 	= "/images/interface/radiobut.png";	
	this.img_height = "16px";
	this.img_width 	= "16px";
	this.img_marginRight = '8px';
	
	this.fontsize 	= "10px";
	this.fontcolor 	= "#231f20";
	
	this.cursor = "pointer";	
	this.elements = new Object();
	this.callback = '';
}
widget.radiobutton.prototype.setgroup = function( name )
{
	if (!undef(name)) this.groupname = name;
}

widget.radiobutton.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	var p = !undef(this.groupname) ? this.groupname+'_' : p;
	
	this.div_button = p + 'radiobutt';
	this.div_label 	= p + 'radiolabel';
	this.div_hidden = p + 'radiohidden';
}

widget.radiobutton.prototype.returnLabel = function( label , name )
{
	// FirstLetter Uppercase
	var _txt = typeof(label) == 'undefined' ? name: label;
	
	var txt = _txt.substring(0,1).toUpperCase();
	txt = txt + _txt.substring(1);
	
	txt = txt.replace(/_/g,' ');
	_txt = null;
	
	return txt;
}

widget.radiobutton.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.radiobutton: radiobutton.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.radiobutton.prototype.setAttrib = function( attr ) 
{
	if ( undef(attr) || undef(attr['name']) ) 
	{
		alert(
			'WIDGET.radiobutton: radiobutton.setAttrib() '
			+" requires minimal the name attribute \n"
			+" (obj) attrib['name'] = <name>"
		);
		return false;	
	}

	this.attrib = attr;
}

widget.radiobutton.prototype.draw = function()
{

	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}

	if ( this.setAttrib(this.attrib) === false ) 
	{
		return false;
	}

	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_button);
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );
	
		
	var rbholder = document.createElement('div');
	rbholder.id = this.div_button;
	rbholder.className='fll';
	rbholder.style.height = this.img_height;
	rbholder.setAttribute('uid',this.uid); //< make it unique in group
	
	
	var iholder = document.createElement('div');
	iholder.className='fll';
	iholder.id = 'radio';
	iholder.style.height = this.img_height;
	iholder.style.width = this.img_width;
	iholder.style.marginRight = this.img_marginRight;
	iholder.style.overflow= 'hidden';
	
	var img = document.createElement('img');
	img.src = this.img;
	img.style.position = "relative";
	img.style.top = 0;
	
	img.style.margin ='0';
	img.style.padding ='0';
	img.style.border ='0';
	
	iholder.appendChild(img);
	rbholder.appendChild(iholder);
	
	// ----------------------------------------------------------
	// secretly smuggle a input type=hidden with the label
	// to hold the 1/0 value
	// ----------------------------------------------------------
	
	var hid = createNamedElement('INPUT', this.attrib['name']);
	hid.type = 'hidden';
	hid.value = 0;
	
	for (var i in this.attrib)
	{
		if (i == 'type') continue;
		if (i=='default' && this.attrib[i] == 1)
		{
			hid.value='1';
			img.style.top = -(parseInt(this.img_height));
		}
		else hid.setAttribute(i,this.attrib[i]);
	}
	rbholder.appendChild(hid);
	
	if (!undef(this.label))
	{
		var lholder = document.createElement('div');
		lholder.className='fll';
		lholder.id = this.div_label;
		var txt = this.returnLabel(this.attrib['label'], this.attrib['name']);
		lholder.appendChild( document.createTextNode(txt) );
		
		rbholder.appendChild(lholder);
		
		lholder.style.lineHeight = this.img_height;
		lholder.style.height = this.img_height;
	}


	this.root.appendChild( rbholder );

	rbholder.onmousedown = function() { eval("this.widget.clickon();"); }

	
	this.elements['button'] = rbholder;	
	this.elements['iholder'] = iholder;
	this.hidden = this.elements['val'] = this.elements['input'] = hid;
	this.elements['img'] = img;
	rbholder['widget'] = this;
}

widget.radiobutton.prototype.clickon = function()
{
	var dis = this.elements.iholder.getAttribute('disabled');
	if (!undef(dis) && dis == 1) return;
	

	if (!undef(this.groupname))
	{	
		var r = getDivsByAttribute('id',this.div_button);
		if (false === r || r.length < 1) return;
		
		for (var i=0; i < r.length; i++)
		{
			var uid = r[i].getAttribute('uid');
			if (empty(uid)) continue;
			if ( uid == this.uid)
			{
				this.switchon(r[i].widget);
				this.elements.val = 1;
			}
			else
			{
				this.switchoff(r[i].widget);
				this.elements.val = 0;
			}
		}
	}
	if(!empty(this.callback)) eval(this.callback+"( this );");
}

widget.radiobutton.prototype.switchoff = function( elm )
{
	if (empty(elm))
	{
		this.hidden.value = 0;
		this.elements.img.style.top = '0px'
	}
	else
	{
		elm.hidden.value = 0;
		elm.elements.img.style.top = '0px'
	}
}
widget.radiobutton.prototype.switchon = function( elm )
{

	elm.hidden.value = '1';
	elm.elements.img.style.top =  -(parseInt(elm.img_height))+'px';

}

// ----------------------------------------------------------------------------
//       _               _    _               
//   ___| |__   ___  ___| | _| |__   _____  __
//  / __| '_ \ / _ \/ __| |/ / '_ \ / _ \ \/ /
// | (__| | | |  __/ (__|   <| |_) | (_) >  < 
//  \___|_| |_|\___|\___|_|\_\_.__/ \___/_/\_\
//                             
// ----------------------------------------------------------------------------
widget.checkbox = function( root, attrib, label, callback, setsmall )
{
	this.root = root;
	this.label = label;
	this.attrib = attrib;
	this.callback = callback;	// a string
	this.callBackFunction; 		// a function
	this.name = attrib['name'];
	this.setsmall = setsmall;
	this.selvalue='';
	this.enabled = 0;
	this.widgettype= 'checkbox';
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	
	this.div_button = 'checkbox';
	this.div_label 	= 'checklabel';
	
	if (undef(setsmall))
	{
		this.img 	= "/images/interface/checkbox.png";	
		this.img_height = "18px";
		this.img_width 	= "16px";
		this.img_marginRight = '8px';
	}
	else
	{
		this.img 	= "/images/interface/checkbox_small.png";	
		this.img_height = "14px";
		this.img_width 	= "13px";
		this.img_marginRight = '6px';
	}
	
	this.fontsize 	= "10px";
	this.fontcolor 	= "#231f20";
	
	this.cursor = "pointer";	
	
	this.elements = new Object();
}
widget.checkbox.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';	
	this.div_button = p + this.div_button;
	this.div_label 	= p + this.div_label;
}

widget.checkbox.prototype.returnLabel = function( label , name )
{
	// FirstLetter Uppercase
	var _txt = typeof(label) == 'undefined' ? name: label;
	if (empty(_txt)) return '    ';
	
	var txt = _txt.substring(0,1).toUpperCase();
	txt = txt + _txt.substring(1);
	
	txt = txt.replace(/_/g,' ');
	_txt = null;
	
	return txt;
}

widget.checkbox.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.checkbox: checkbox.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.checkbox.prototype.setAttrib = function( attr ) 
{
	if ( undef(attr) || undef(attr['name']) ) 
	{
		alert(
			'WIDGET.checkbox: checkbox.setAttrib() '
			+" requires minimal the name attribute \n"
			+" (obj) attrib['name'] = <name>"
		);
		return false;	
	}

	this.attrib = attr;
}

widget.checkbox.prototype.draw = function()
{

	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}

	if ( this.setAttrib(this.attrib) === false ) 
	{
		return false;
	}

	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_button);
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );
	
		
	var rbholder = document.createElement('div');
	rbholder.id = this.div_button;
	rbholder.className='fll';
	rbholder.style.height = this.img_height;
	
	
	var iholder = document.createElement('div');
	iholder.id='check';
	iholder.className='fll';
	iholder.style.height = this.img_height;
	iholder.style.width = this.img_width;
	iholder.style.marginRight = this.img_marginRight;
	iholder.style.overflow= 'hidden';
	
	var img = document.createElement('img');
	img.src = this.img;
	img.style.position = "relative";
	img.style.top = 0;
	
	img.style.margin ='0';
	img.style.padding ='0';
	img.style.border ='0';
	
	iholder.appendChild(img);
	rbholder.appendChild(iholder);
	
	// ----------------------------------------------------------
	// secretly smuggle a input type=hidden with the label
	// to hold the 1/0 value
	// ----------------------------------------------------------
	
	var hid =  createNamedElement('INPUT', this.attrib['name']);
	hid.type = 'hidden';
	hid.value=0;
	
	if (isObject(this.attrib))
	{
		for( var attr in this.attrib)
		{
			if (attr == 'name') continue;
			if (attr == 'type') continue;
			hid.setAttribute(attr, this.attrib[attr]);
		}
	}
	
	rbholder.appendChild(hid);
	
	for (var i in this.attrib)
	{
		if (i == 'type') continue;
		if (i=='default' && this.attrib[i] == 1)
		{
			if (i == 'id') continue;
			hid.value=1;
			img.style.top = -(parseInt(this.img_height));
		}
		if (i == 'selectvalue')
		{
			this.selvalue = this.attrib[i];
			continue;
		}
		hid.setAttribute(i,this.attrib[i]);
	}
	
	if (!undef(this.label))
	{
		var lholder = document.createElement('div');
		lholder.className='fll';
		lholder.id = this.div_label;
		var txt = this.returnLabel(this.label, this.attrib['name']);
		lholder.appendChild( document.createTextNode(txt) );
		
		rbholder.appendChild(lholder);
		lholder.style.lineHeight = this.img_height;
		lholder.style.height = this.img_height;
	}


	this.root.appendChild( rbholder );

	rbholder.onmousedown = function() { eval("this.widget.clickon();"); }

	
	this.elements['checkbox'] = rbholder;	
	this.elements['iholder'] = iholder;
	this.elements['img'] = img;
	this.elements['val'] = this.elements['input'] = hid;
	rbholder['widget'] = this;
}

widget.checkbox.prototype.clickon = function()
{
	var dis = this.elements.iholder.getAttribute('disabled');
	if (!undef(dis) && dis == 1) return;
	if (this.elements.input.disabled == true) return;
	
	if (empty(this.elements.val.value)) this.switchon();
	else this.switchoff();

}

widget.checkbox.prototype.switchon = function()
{
	var sval = empty(this.selvalue) ? 1 : this.selvalue;
	this.elements.val.value = sval;
	this.enabled = 1;
	this.elements.img.style.top = -(parseInt(this.img_height))+'px';
	if(!empty(this.callback)) {console.log(this.callback);eval(this.callback+"( this );");} 
	if(!empty(this.callBackFunction)) this.callBackFunction(this);
}

widget.checkbox.prototype.switchoff = function()
{
	var unval = isString(this.selvalue) ? '' : 0;
	this.elements.val.value = unval;
	this.enabled = 0;
	this.elements.img.style.top = '0px';
	if(!empty(this.callback)) eval(this.callback+"( this );");
	if(!empty(this.callBackFunction)) this.callBackFunction(this);
}


widget.checkbox.prototype.setAttribute = function(name, value)
{
	if( empty(name) || empty(value)) return;
	this.elements['input'].setAttribute(name,value);
}

// ----------------------------------------------------------------------------
//  _                   _    __ _      _     _ 
// (_)_ __  _ __  _   _| |_ / _(_) ___| | __| |
// | | '_ \| '_ \| | | | __| |_| |/ _ \ |/ _` |
// | | | | | |_) | |_| | |_|  _| |  __/ | (_| |
// |_|_| |_| .__/ \__,_|\__|_| |_|\___|_|\__,_|
//         |_|                                
// ----------------------------------------------------------------------------
widget.inputfield = function( root, label, attrib, inline )
{
	this.inherit = widget.superClass;
	this.inherit();
	
	this.root = root;
	this.label = label;
	this.attrib = attrib;
	this.labelwidth = 0;
	this.inline = inline;
	this.widgettype= 'inputfield';
	this.elements = new Object();
	console.log(this);
}

widget.inputfield.prototype.returnLabel = function( label , name )
{
	// FirstLetter Uppercase
	var _txt = typeof(label) == 'undefined' ? name: label;
	
	var txt = _txt.substring(0,1).toUpperCase();
	txt = txt + _txt.substring(1);
	
	txt = txt.replace(/_/g,' ');
	_txt = null;
	
	return txt;
}



widget.inputfield.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET.INPUTFIELD: inputfield.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.inputfield.prototype.setAttrib = function( attr ) 
{
	if ( undef(attr) || undef(attr['name']) ) 
	{
		alert(
			'WIDGET.INPUTFIELD: inputfield.setAttrib() '
			+" requires minimal the name attribute \n"
			+" (obj) attrib['name'] = <name>"
		);
		return false;	
	}

	this.attrib = attr;
	
}

widget.inputfield.prototype.draw = function()
{

	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}
	
	if ( this.setAttrib(this.attrib) === false ) 
	{
		return false;
	}

	var holder = document.createElement('div');
	holder.id = 'inputholder'
	/*holder.style.clear = 'both';*/
	holder.setAttribute('name',this.attrib['name']);
	//holder.style.padding = '1px';
	holder.style.marginBottom = '1px';
	
	var inp =  createNamedElement('INPUT', 'input_' +this.attrib['name']);
	inp.setAttribute('autocomplete','off'); 
	
	var labelok=0;
	if (!undef(this.label) && !empty(this.label))
	{
		var label = document.createElement('div');
		label.id = 'label';		

		var labelwidth = 0;
		
		var txt = this.returnLabel(this.attrib['label'], this.attrib['name']) 
			+(!empty(this.inline) ? '' : ':');
		label.appendChild( document.createTextNode(txt) );	
		holder.appendChild( label );
		
		var labelok=1;
	}
	

	for ( var a  in this.attrib )
	{
		if (a == 'label' ) continue;
		if (a == 'size')
		{
			if (this.attrib[a].match(/px/) )
			{
				inp.setAttribute('size',this.attrib[a].replace(/px/,''));
			}
			else
			{
				inp.className = 'cinput_'+this.attrib[a];
			}
		}
		else
		{
			inp.setAttribute(a , this.attrib[a]);
		}
	}
	
	if ( undef(this.attrib['type']) ) 
	{
		inp.setAttribute('type' ,'text');
	}
				
	holder.appendChild( inp );
	this.root.appendChild( holder );
	
	
	if (labelok ==1)
	{
		label.style.lineHeight = (inp.offsetHeight ? inp.offsetHeight : '15') +'px';
		label.style.height = (inp.offsetHeight ? inp.offsetHeight : '15') +'px';	
		
		this.elements['label'] 	= label;
		
		// ---------------------------------------------
		// save textfields for label - width ajusting
		// ---------------------------------------------	 	
		this.labelwidth = label.offsetWidth > this.labelwidth 
			? label.offsetWidth : this.labelwidth;
	}

	
	this.elements['holder'] = holder;
	this.elements['label'] = label;
	this.elements['input'] = inp;
	
	return holder;

}





// ----------------------------------------------------------------------------
//  _           _   _              
// | |__  _   _| |_| |_ ___  _ __  
// | '_ \| | | | __| __/ _ \| '_ \ 
// | |_) | |_| | |_| || (_) | | | |
// |_.__/ \__,_|\__|\__\___/|_| |_|
// ----------------------------------------------------------------------------
widget.button = function( root, label, attrib, callback, state)
{
	this.root = root;
	this.label = label;
	this.attrib = attrib;
	this.labelwidth = 0;
	this.callback = callback;
	this.state = undef(state) ? 'active' : state;
	this.widgettype= 'button';
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	
	this.img_lbut = "/images/interface/but_lbut.png";
	this.img_fill = "/images/interface/but_fill.png";
	this.img_rbut = "/images/interface/but_rbut.png";
	
	this.real_image_height = 21;
	this.img_height = this.real_image_height + "px";
	this.img_width 	= "12px";
	this.fontsize 	= "10px";
	this.fontcolor 	= "#231f20";
	
	this.cursor = "default";
	
	this.elements = new Object();
	this.widget = new widget();
	
	
}

widget.button.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_button = p + 'button';
	this.div_lbut 	= p + 'butlbut';
	this.div_fill 	= p + 'butfill';
	this.div_text 	= p + 'buttxt';
	this.div_rbut 	= p + 'butrbut';
}

widget.button.prototype.returnLabel = function( label , name )
{
	// FirstLetter Uppercase
	var _txt = typeof(label) == 'undefined' ? name: label;
	
	var txt = _txt.substring(0,1).toUpperCase();
	txt = txt + _txt.substring(1);
	
	txt = txt.replace(/_/g,' ');
	_txt = null;
	
	return txt;
}

widget.button.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET: button.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.button.prototype.setAttrib = function( attr ) 
{
	if ( undef(attr) || undef(attr['name']) ) 
	{
		alert(
			'WIDGET: button.setAttrib() '
			+" requires minimal the name attribute \n"
			+" (obj) attrib['name'] = <name>"
		);
		return false;	
	}

	this.attrib = attr;
	
}

widget.button.prototype.setCallback = function ( callback )
{
	if (typeof(callback) != 'function')
	{
		alert(
			'WIDGET: button.setCallback() '
			+" callback is not a function"
		);
		return false;	
	}
	
	this.callback = callback;
}


widget.button.prototype.draw = function()
{

	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}
	
	if ( this.setAttrib(this.attrib) === false ) 
	{
		return false;
	}

	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_button);
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );
	
	
	var button = document.createElement('div');
	this.divElement = button;
	button.id = this.div_button;
	button.style.cursor = this.cursor;
	button.style.clear = "both";
	button.style.position = "relative";
	button.style.height = this.img_height;
	
	for ( var a  in this.attrib )
	{
		if (a == 'label' ) continue;
		if (a == 'size')
		{
			if (this.attrib[a].match(/px/) )
			{
				var bwidth = this.attrib[a];
			}
			else
			{
				var bwidth = this.widget[this.attrib[a]];
			}
		}
		else
		{
			button.setAttribute(a , this.attrib[a]);
		}
	}
	
	var lbut = document.createElement('div');	
	lbut.id = this.div_lbut;
	lbut.className = 'fll';
	lbut.style.width 			= this.img_width;
	lbut.style.height 			= this.img_height;
	lbut.style.backgroundImage 		= "url(" +this.img_lbut+ ")";
	lbut.style.backgroundRepeat 	= "no-repeat";
	lbut.style.backgroundPosition 	= "0 0";
	
	var fill = document.createElement('div');
	fill.id = this.div_fill;
	fill.className = 'fll';
	fill.style.lineHeight 			= this.img_height;
	fill.style.backgroundImage 		= "url(" +this.img_fill+ ")";
	fill.style.backgroundRepeat 	= "repeat-x";
	fill.style.backgroundPosition 	= "0 0";
	fill.style.textAlign = 'center';
	
	if ( !undef(bwidth) )
	{
		fill.style.width = (
			parseInt(bwidth,10) - (2 * parseInt(this.img_width))
		) + 'px';
	}
	
	
	var rbut = document.createElement('div');	
	rbut.id = this.div_rbut;
	rbut.className = 'fll';
	rbut.style.width 			= this.img_width;
	rbut.style.height 			= this.img_height;
	rbut.style.backgroundImage 		= "url(" +this.img_rbut+ ")";
	rbut.style.backgroundRepeat 	= "no-repeat";
	rbut.style.backgroundPosition 	= "0 0";
	
	
	var txt 		= this.returnLabel(this.attrib['label'], this.attrib['name']) ;
	var labelNode 	= document.createElement('div');
	var textHolder 	= document.createTextNode(txt);
	labelNode.appendChild(textHolder);
	fill.appendChild( labelNode );
	
	button.appendChild( lbut );
	button.appendChild( fill );
	button.appendChild( rbut );
	this.root.appendChild( button );
	
	this.elements['button'] = button;	
	this.elements['rbut'] 	= rbut;	
	this.elements['fill'] 	= fill;	
	this.elements['lbut'] 	= lbut;	
	this.elements['labelNode'] = labelNode;
	
	if (this.state != 'disabled') {
		this.assignMouseEvents();
	} else {
		this.disable();
		
	}
	
	button['widget'] = this;
}

widget.button.prototype.assignMouseEvents = function(){
	if (ie) {
		this.divElement.onmousedown = function(){
			eval("this.widget.clickon();");
		}
		this.divElement.onmouseup = function(){
			eval("this.widget.clickoff();");
		}
	} else {
		this.divElement.setAttribute("onmousedown", "this.widget.clickon()");
		this.divElement.setAttribute("onmouseup", "this.widget.clickoff();");
	}
}

widget.button.prototype.assignDisabledMouseEvents = function(){
	if (ie) {
		this.divElement.onmousedown = null;
		this.divElement.onmouseup = null;
	} else {
		this.divElement.setAttribute("onmousedown", null);
		this.divElement.setAttribute("onmouseup", null);
	}
}

widget.button.prototype.enable = function(){
	this.elements.lbut.style.backgroundPosition = "0 0";
	this.elements.fill.style.backgroundPosition = "0 0";
	this.elements.rbut.style.backgroundPosition = "0 0";
	this.elements.labelNode.style.color = "";
	this.assignMouseEvents();
}

widget.button.prototype.clickon = function()
{
	this.elements.lbut.style.backgroundPosition = "0 -"+ this.img_height;
	this.elements.fill.style.backgroundPosition = "0 -"+ this.img_height;
	this.elements.rbut.style.backgroundPosition = "0 -"+ this.img_height;	
}

widget.button.prototype.clickoff = function()
{
	this.elements.lbut.style.backgroundPosition = "0 0";
	this.elements.fill.style.backgroundPosition = "0 0";
	this.elements.rbut.style.backgroundPosition = "0 0";
	
	window.butpress = this.elements.button;
	eval(this.callback+'(this)');
}

widget.button.prototype.disable = function()
{
	this.elements.lbut.style.backgroundPosition = "0 -" + (2 * this.real_image_height) + "px";
	this.elements.fill.style.backgroundPosition = "0 -" + (2 * this.real_image_height) + "px";
	this.elements.rbut.style.backgroundPosition = "0 -" + (2 * this.real_image_height) + "px";
	this.elements.labelNode.style.color = "#606060";
	this.assignDisabledMouseEvents();
}

// ----------------------------------------------------------------------------
//  _____             _ ____                _           
// |  ___|__  ___  __| |  _ \ ___  __ _  __| | ___ _ __ 
// | |_ / _ \/ _ \/ _` | |_) / _ \/ _` |/ _` |/ _ \ '__|
// |  _|  __/  __/ (_| |  _ <  __/ (_| | (_| |  __/ |   
// |_|  \___|\___|\__,_|_| \_\___|\__,_|\__,_|\___|_|
// ----------------------------------------------------------------------------
widget.feedreader = function( root, url, width, height, scroll )
{
	this.root = root;
	this.url = url;
	this.width = width;
	this.height = height;
	this.scroll = scroll;
	this.widgettype= 'feedreader';
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	
	this.elements = new Object();
	this.widget = new widget();
	
	this.showChannel = false;
	this.showChannelDescription = false;
	this.showPubdate = false;
	this.useitemlink = false;
	if(!isObject(window.feed))
	{
		window.feed = new Object();
	}
}

widget.feedreader.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_feed 		 = p + 'feed';
	this.div_itemtitle 	 = p + 'item';
	this.div_itemdesc 	 = p + 'content';
	this.div_channelname = p + 'channelname';
	this.div_channeldesc = p + 'channeldesc';
}

widget.feedreader.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET: feedreader.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}
widget.feedreader.prototype.setUrl = function( url )
{
	if ( undef(url) || ! url.match(/[a-z]+\.[a-z]+/) || url.length < 4 )
	{
		alert(
			'WIDGET: feedreader.setUrl() '
			+' requires an URL'
		);
		return false;		
	}
	this.url = url;
	this.load();

}

widget.feedreader.prototype.draw = function()
{

	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}
	if ( this.setUrl(this.url) === false ) 
	{
		return false;
	}
	
	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_feed);
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );

	
	
}	

widget.feedreader.prototype.handleFeed = function()
{

	var feed = this.req;
	window.feed[this.url] = feed;

	this.entries = new Array();
	
	if (feed.responseText.indexOf('<error>')!=-1)
	{
		var tob = new Object();
		tob['title'] = 'Error connecting to RRS feed';
		tob['desc'] = '';
		tob['link'] = '';
		this.entries.push( tob );
		this.print();
		return;
	}
	var channel = feed.responseXML.getElementsByTagName('channel');
	
	if ( this.showChannel )
	{
	}
	
	// --------------------------------
	// items
	// --------------------------------
	var items = feed.responseXML.getElementsByTagName('item');
	


	for ( var i=0; i< items.length;i++ )
	{
		if (items[i].nodeType != ELEMENT_NODE) continue;
		for ( var y=0; y < items[i].childNodes.length; y++)
		{
			var cn = items[i].childNodes;
			if (cn[y].nodeType != ELEMENT_NODE) continue;
			
			var cont =  cn[y].childNodes[0].nodeValue;
			var tn =  cn[y].tagName.toLowerCase();
			
			if (tn == 'title') var title = cont;
			if (tn == 'description') var desc = cont;
			if (tn == 'link') var link = cont;
			alert(title);
		}
		var tob = new Object();
		tob['title'] = title;
		tob['desc'] = desc;
		tob['link'] = link;
		this.entries.push( tob );
	}
	this.print();
}


widget.feedreader.prototype.print = function() 
{

	var ifeed = document.createElement('div');
	ifeed.id = this.div_feed;
	ifeed.style.width = this.width;
	ifeed.style.height = this.height;
	ifeed.style.textAlign ="left";
	ifeed.style.overflow = "hidden";
	
	this.root.appendChild( ifeed );
	
	for( var i=0; i < this.entries.length; i++)
	{
		if ( !undef(this.entries[i]['title']) )
		{
			var title = document.createElement('div');
			title.id = 'title'+i;
			title.appendChild( 
				document.createTextNode(this.entries[i]['title']) 
			);
			title.style.fontweight = 'bold';
			title.style.fontSize='9px';
			title.style.marginBottom = "4px";
			
			ifeed.appendChild(title);
		}
		
	}
	
	this.elements['feed'] = ifeed;
	
}

widget.feedreader.prototype.load = function() 
{

    if(window.XMLHttpRequest) 
    {
    	try 
    	{
			this.req = new XMLHttpRequest();
			if (this.req.overrideMimeType) 
			{
			  this.req.overrideMimeType('text/xml');
			}
        } 
        catch(e) 
        {
			this.req = false;
        }
    } 
    else if(window.ActiveXObject) 
    {
       	try  { this.req = new ActiveXObject("Msxml2.XMLHTTP"); }
      	catch(e) 
      	{
        	try  { this.req = new ActiveXObject("Microsoft.XMLHTTP"); }
        	catch(e) { this.req = false; }
		}
    }
    
	if(this.req) 
	{
		var copy = this;
		this.req.onreadystatechange = function()
		{		
			if (copy.req.readyState == 4)  // LOADED
			{
				if (copy.req.status == 200) // OK
				{
					copy.handleFeed();
				} 
				else 
				{
					alert
					(
						"There was a problem retrieving the XML data:\n"
						+ copy.req.statusText
					);
				}
			}
		}

		this.req.open("GET", this.url, true);
		this.req.send("");
	}
}




// ----------------------------------------------------------------------------
//  _____            __     ___               
// |_   _| __ ___  __\ \   / (_) _____      __
//   | || '__/ _ \/ _ \ \ / /| |/ _ \ \ /\ / /
//   | || | |  __/  __/\ V / | |  __/\ V  V / 
//   |_||_|  \___|\___| \_/  |_|\___| \_/\_/  
// ----------------------------------------------------------------------------
widget.treeview = function( root, label, width, height )
{
	this.root = root;
	this.url = url;
	this.label = label;
	this.width = width;
	this.height = height;
	this.date = new Date();
	this.uid = this.date.getMilliseconds();
	this.widgettype= 'treeview';
	
	this.items 		= new Object();
	this.labels 	= new Object();
	this.nodes 		= new Object();
	this.elements 	= new Object();
	this.use_icon	= new Object();
	this.widget 	= new widget();
	this.disabled 	= new Object();
	
	this.fontcolor 	= '#231f20';
	this.bgcolor 	= 'transparent';
	this.highlightfontcolor = '#ffffff';
	this.highlightbgcolor = '#326ecb';
	this.fontsize = '10px';
	this.cursor = 'default';
	this.font_disabled = '#999999';
	
	
	this.img_starttree = false;
	this.img_open = '/images/interface/tree_open.png';
	this.img_close = '/images/interface/tree_closed.png';
	this.img_width = '16px';
	this.img_height = '16px';
	this.img_doubleheight = true;
	this.img_asbackground = true;
	
	this.img_open_branch 	= false;
	this.img_close_branch 	= false;
	
	this.use_imgspacer 	 = false; 
	this.img_line 		 = false;
	this.img_line_branch = false;
	this.img_line_end	 = false;
	
	this.img_icons 		= false;
	this.icons = new Object();
	this.icons['folder'] = '/images/interface/tree_folder.png';
	this.icon_width = "16px";
	this.icon_height = "16px";
	
	this.callback = '';
	this.nodecallback ='';
	
	this.div_tree	= 'tree';
	this.div_row	= 'trow';
	this.div_item 	= 'tritem';
	this.div_spacer = 'trspacer';
	this.div_icon	= 'tricon';
	this.div_label 	= 'trlabel';
}
widget.treeview.prototype.addcallback = function( func )
{
	this.callback = func;
}
widget.treeview.prototype.addnodecallback = function( func, param )
{
	this.nodecallback = func;
	this.nodeparams = param;
}

widget.treeview.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_tree	= p + 'tree';
}
widget.treeview.prototype.addIconType = function( type, iconpath )
{
	
	if ( !undef(type) && !undef(iconpath) )
	{
		this.icons[type] = iconpath;
	}
	
}
widget.treeview.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined' || null == root)
	{
		alert(
			'WIDGET: treeview.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.treeview.prototype.delLabel = function ( _id )
{
	if ( typeof(this.labels) !='object') return;
	if (undef(_id)) return;
	if ( undef(this.labels[_id]) ) return;
	
	var tmp = new Object();
	for ( var i in this.labels )
	{
		if ( _id != i )
		{
			tmp[i] = this.labels[i];
		}
	}
	this.labels = tmp;
}

widget.treeview.prototype.delIcon = function ( _id )
{
	if ( typeof(this.use_icon) !='object') return;
	if ( undef(this.use_icon[id]) ) return;
	
	var tmp = new Object();
	for ( var i in this.use_icon )
	{
		if ( id != i )
		{
			tmp[i] = this.use_icon[i];
		}
	}
	this.use_icon = tmp;
}


widget.treeview.prototype.delItem = function ( _id, _newparent )
{
	if ( typeof(this.items) !='object') return;
	if ( typeof(this.items[0]) !='object') return;
	
	
	// delete label
	this.delLabel( _id );
	this.delIcon( _id );
	// ------------------------------------
	// delete from parentnodes
	// -------------------------------------
	var tmp = new Array()
	for(var i=0; i < this.items[0].length ; i++)
	{
		if ( this.items[0][i] != _id )
		{
			tmp.push(this.items[0][i]);
		}
	}
	this.items[0] = tmp;
	
	// -------------------------------------
	// delete all in others, and copy self
	// when it is a parent
	// -------------------------------------
	var tmp = new Array();
	var merge = new Array();
	for( var i in this.items)
	{
		if ( i != _id )
		{
			if ( typeof(tmp[i]) == 'object')
			{
				var tmp2 = new Array();		
				for (var y=0; y < tmp[i].length ; y++)
				{
					if ( _id != tmp[i][y] )
					{
						tmp2.push(tmp[i][y]);
					}
				}
				this.items[i] = tmp2;
			}
			tmp[i].push(this.items[i]);
		}
		else if ( !undef(_newparent) )
		{
			merge = this.items[i];
		}
	}
	
	// -----------------------------------
	// merge when newparent is given
	// -----------------------------------
	if (!undef(_newparent) && typeof(this.items[_newparent]) == 'object')
	{
		this.items[_newparent].concat(merge);	
	}
	
}

// ---------------------------------------------------
// ---------------------------------------------------

widget.treeview.prototype.addItem = function ( _id, _parent, _label, disabled, icontype )
{

	if ( typeof(this.items) !='object') 
	{
		this.items = new Object;
	}
	
	if (undef(_parent) || null == _parent) _parent = '0';
	if ( undef(this.items[_parent]) )
	{
		this.items[_parent] = new Array();
	}
	this.items[_parent].push( _id );
	
	// check for overrides
	if ( !undef(this.labels[_id]) ) this.delLabel(_id);
	this.labels[_id] = _label;
	
	if (!empty(icontype)) this.use_icon[_id] = icontype;
	if (!empty(disabled)) this.disabled[_id] = 1;
}

widget.treeview.prototype.redraw = function()
{
	var tree = document.getElementById(this.div_tree);
	this.widget.deleteChildren( tree.parentNode );
	this.draw();

}

// -------------------------------------------------------
// D R A W !
// -------------------------------------------------------
widget.treeview.prototype.draw = function()
{
	if ( this.setRoot(this.root) === false ) 
	{
		return false;
	}

	if ( undef(this.items) || typeof(this.items[0]) != 'object' 
		|| this.items[0].length < 1)
	{
		alert(
			"WIDGET: treeview.addItem() "
			+"must have one parent entry with index '0' \n"
			+"treeview.addItem( <id> , parent = NULL ) "
		);
		return;
	}

	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_tree);
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );
	

	var tree = document.createElement('div');
	tree.id = this.div_tree;
	tree['tree'] = this;
	this.elements['tree'] = tree;
	
	var label;
	// -------------------------------
	// tree start
	// -------------------------------
	if ( this.img_starttree && !undef(this.label))
	{
		this.drawItem (0, tree, -1 );
	}

	// --------------------------------
	// build tree
	// --------------------------------
	for ( var i=0; i< this.items[0].length; i ++)
	{
		var children = false;
		var cval = this.items[0][i];

		var children = !undef(this.items[cval])
		this.drawItem(cval, children, tree, 0 ,this.items[0].length);

		// branch out if we have children
		if ( children && !undef(this.nodes[cval]) )
		{
			this.drawBranch( cval, tree, 1 );
		}
		if( i==0 && empty(this.curselect)) this.curselect = cval;
	}
	
	this.root.appendChild(tree);
}


widget.treeview.prototype.drawItem = function(id, chld, toor, level, lenghtcount)
{

	var row = document.createElement('div');
	row.id = this.div_row;
	row.setAttribute('uid', id);
	row.style.clear = 'both';
	row.style.lineHeight = this.icon_height
	row.style.cursor = this.cursor;
	row.style.margin = "1px";
	row.style.fontSize = this.fontsize;
	row.style.heigt = this.icon_height;


	
	// -------------------------------------------
	// shortcut for starttree
	// -------------------------------------------
	if (level == -1) // start of tree
	{
		var ts = document.createElement('div');
		ts.style.width = this.img_starttree;
		ts.className='fll';
		
		if ( this.img_line )
		{
			var tsi = document.createElement('img');
			tsi.src = this.img_starttree;
			ts.appendChild(tsi);			
		}
		row.appendChild(ts);		
		if (!undef(this.label))
		{
			var lb = document.createElement('div');
			lb.className = 'fll';
			lb.appendChild( document.createTextNode(this.label) );
		}
		row.appendChild(lb);
		
		toor.appendChild( row );
		return;
	}
	
	// -------------------------------------------
	// create spacer amount in relation to level
	// --------------------------------------------
	
	if ( level > 0 )
	{
		var spacer = document.createElement('div');
		spacer.id = this.div_spacer;
		spacer.style.height = parseInt(this.img_height);
		spacer.className='fll';
		for (var i=0 ; i < level-1; i++)
		{
			var ts = document.createElement('div');
			ts.className='fll';
			ts.style.width = this.img_width;
			ts.style.height = this.img_height;
			if ( this.img_line )
			{
				var tsi = document.createElement('img');
				tsi.src = this.img_line;
				ts.appendChild(tsi);			
			}
			spacer.appendChild(ts);
		}
		row.appendChild(spacer);
	}
	
	
	// -------------------------------------------
	// event listeners
	// --------------------------------------------	
	
	if(empty(this.disabled[id]))
	{
		row.onclick = function(){ 
			eval("this.parentNode.tree.hilite('"
			+ id +"', 1, this)"); 
		};
	}
	
	// -------------------------------------------
	// draw tree open/ close image
	// -------------------------------------------	
	var arrow = document.createElement('div');
	arrow.id = this.div_item;
	arrow.className = 'fll';
	arrow.style.width = this.icon_width;
	arrow.style.height = this.icon_height;	
	arrow.style.marginLeft = "2px";
	arrow.style.marginRight = "2px";
	arrow.style.overflow = 'hidden';
	var imgs = false;
	if ( chld )
	{
		if (undef(this.nodes[id]) ) // node closed
		{
			imgs = this.img_close;
			if ( level != lenghtcount ) // last in line
			{
				imgs = (!this.img_close_branch ? imgs : this.img_close_branch);
			}
		}
		else
		{
			imgs = this.img_open;
			if ( level != lenghtcount ) 
			{
				imgs = (!this.img_open_branch ? imgs : this.img_open_branch);
			}
		}
	}
	else if ( this.use_imgspacer )
	{
		imgs = this.img_line_end;
		if ( level != lenghtcount ) 
		{
			imgs = (!this.img_line_branch ? imgs : this.img_line_branch);
		}
	}
	
	if ( imgs )
	{
		var ihod = document.createElement('div');
		ihod.id = 'fuckie';
		ihod.style.width = arrow.style.width;
		ihod.style.width = arrow.style.height;
		

		if (ie && !ie7)
		{
			ihod.innerHTML = this.widget.fixPNG(
				imgs
				, ( parseInt(this.img_width,10))
				, (2 * parseInt(this.img_height,10))
			);
		}
		else
		{
			arrow.style.backgroundImage = "url("+imgs+")";
			arrow.style.backgroundPosition = "0 0";
			arrow.style.backgroundRepeat = "no-repeat";
		}
		arrow.appendChild(ihod);
		// -------------------------------------------
		// event listeners
		// --------------------------------------------	
		if (ie) 
		{
			arrow.onclick = function(){ 
				eval("this.parentNode.parentNode.tree.toggleNode('"
				+ id +"', 1, this)"); 
			};
		}
		else
		{
			arrow.setAttribute(
				"onclick","this.parentNode.parentNode.tree.toggleNode('"
				+ id +"', 1, this)"
			);
		}
	}
	
	row.appendChild(arrow);
	
	if ( this.img_icons )
	{
		var ico = document.createElement('div');
		ico.className='fll';
		ico.id = this.div_icon;
		ico.style.width = this.icon_width;
		ico.style.height = this.icon_height;
		ico.style.overflow = 'hidden';
		ico.style.marginRight = "4px";
		if (ie && !ie7)
		{
			ico.innerHTML = this.widget.fixPNG(
				this.icons[this.use_icon[id]]
				, ( parseInt(this.icon_width,10))
				, (2 * parseInt(this.icon_height,10))
			);
		}
		else
		{
			ico.style.backgroundImage = (
				"url("+this.icons[this.use_icon[id]]+")"
			);
			ico.style.backgroundRepeat = "no-repeat";
			ico.style.backgroundPosition = '0 0';
		}
		row.appendChild(ico);
	}	
	// ------------------------------------------
	// [ spacer ][ arrow ][ ... label ... ]
	// ------------------------------------------

	var labe = document.createElement('div');
	labe.id = this.div_label;
	labe.appendChild( document.createTextNode( this.labels[id] ) );
	
	row.appendChild(labe);
	toor.appendChild( row );

}

widget.treeview.prototype.drawBranch = function ( _id , curroot, level )
{
	if ( undef(this.items[_id]) ) return ;
	++level;

	for ( var i=0; i< this.items[_id].length; i ++)
	{
		var children = false;
		var cval = this.items[_id][i];

		var children = !undef(this.items[cval])
		this.drawItem(cval, children, curroot, level ,this.items[_id].length);

		// branch out if we have children
		if ( children && !undef(this.nodes[cval]) )
		{
			this.drawBranch( cval, curroot, level );
		}
	}
	
}

widget.treeview.prototype.toggleNode = function ( id , redraw)
{


	if ( typeof(this.nodes) != 'object' )
	{
		this.nodes = new Object();
	}
	
	if (undef(this.nodes[id])) 
	{
		this.nodes[id] = 1;
	}
	else
	{
		var tn = new Object();
		for (var i in this.nodes)
		{
			if ( i == id ) continue;
			tn[i] = 1;
		}
		
		this.nodes = tn;
	}
	
	if ( !undef(redraw) ) this.redraw();
	if ( !undef(this.curselect)) this.hilite(this.curselect);
	
	if(!empty(this.nodecallback)) this.nodecallback();	
}

widget.treeview.prototype.hilite = function( id, redraw )
{
	this.curselect = undef(id) ? window.curnode : id;
	window.curnode = this.curselect;
	
	if ( !undef(redraw) ) this.redraw();
	
	
	if ( !this.elements.tree.hasChildNodes() ) return;
	for (var i=0; i < this.elements.tree.childNodes.length; i++)
	{
		var cn = this.elements.tree.childNodes[i];
		var cn_id = cn.getAttribute('uid');

		if (!empty(this.disabled[cn_id]))
		{
			cn.style.color = this.font_disabled;
			continue;
		}
		if ( cn_id == id )
		{
			window.gui.navselect = id;
			cn.style.backgroundColor = this.highlightbgcolor;
			cn.style.color = this.highlightfontcolor;
			if (this.img_doubleheight)
			{
				for( var y=0; y < cn.childNodes.length; y++)
				{
					if (cn.childNodes[y].id == this.div_item)
					{
						var cnd = cn.childNodes[y];
						if (ie && !ie7)
						{
							
							if (cnd.hasChildNodes() 
								&& !undef(cnd.childNodes[0].tagName))
							{
								cnd.childNodes[0].style.position = "relative";
								cnd.childNodes[0].style.top = (
									(1-parseInt(this.img_height))+'px'
								);
							}
						}
						else
						{
							if (!undef(cn.childNodes[y].style.backgroundImage))
							{
								cn.childNodes[y].style.backgroundPosition = (
									"0 -" + this.img_height
								);
							}
						}
					}
					if (cn.childNodes[y].id == this.div_icon)
					{
						var cnd = cn.childNodes[y];
						if (ie && !ie7)
						{
							if (cnd.hasChildNodes() 	
								&& !undef(cnd.childNodes[0].tagName))
							{
								cnd.childNodes[0].style.position = "relative";
								cnd.childNodes[0].style.top = (
									(1-parseInt(this.img_height))+'px'
								);
							}
						}
						else
						{					
							if (!undef(cnd.style.backgroundImage))
							{
								cnd.style.backgroundPosition = (
									"0 -" + this.icon_height
								);
							}
						}
					}
				}
			}
			this.callback(id);
		}
		else
		{
			cn.style.backgroundColor = this.bgcolor;
			cn.style.color = this.fontcolor;
			if (this.img_doubleheight)
			{
				for( var y=0; y < cn.childNodes.length; y++)
				{
					if (cn.childNodes[y].id == this.div_item)
					{
						var cnd = cn.childNodes[y];
						if (ie && !ie7)
						{
							if (cnd.hasChildNodes() 
								&& !undef(cnd.childNodes[0].tagName))
							{
								cnd.childNodes[0].style.position = "relative";
								cnd.childNodes[0].style.top ="0px";
							}
						}
						else
						{
							if ( !undef(cnd.style.backgroundImage) )
							{
								cnd.style.backgroundPosition = "0 0";
							}
						}
					}
					if (cn.childNodes[y].id == this.div_icon)
					{
						var cnd = cn.childNodes[y];
						if (ie && !ie7)
						{
							if (cnd.hasChildNodes() 
								&& !undef(cnd.childNodes[0].tagName))
							{
								cnd.childNodes[0].style.position = "relative";
								cnd.childNodes[0].style.top ="0px";
							}
						}
						else
						{
							if (!undef(cnd.style.backgroundImage))
							{
								cnd.style.backgroundPosition="0 0"
							}
						}
					}
				}
			}
		}
	}
}

// ----------------------------------------------------------------------------
//  ____                      _     ____            
// / ___|  ___  __ _ _ __ ___| |__ | __ )  _____  __
// \___ \ / _ \/ _` | '__/ __| '_ \|  _ \ / _ \ \/ /
//  ___) |  __/ (_| | | | (__| | | | |_) | (_) >  < 
// |____/ \___|\__,_|_|  \___|_| |_|____/ \___/_/\_\
// ----------------------------------------------------------------------------

widget.searchbox = function( rootdiv, width, target, items, filteritems)
{
	this.rootdiv = rootdiv;
	this.width = width;
	this.use_parts = safari ? false : true;
	this.widgettype= 'searchbox';
	
	this.target = target;
	this.items = items;
	
	this.filteritems = !undef(filteritems) && false !== filteritems 
		? filteritems
		: new Object();//{'' : 'No filter created' };
	
	this.date = new Date();
	this.uid = this.date.getMilliseconds();

	this.img_searchbox 	= "/images/interface/searchlong.png";
	this.img_sbox_left	= "/images/interface/sbox_left.png";
	this.img_sbox_fill	= "/images/interface/sbox_fill.png";
	this.img_sbox_right	= "/images/interface/sbox_right.png";	
	this.img_searchpull = "/images/interface/s_pull.png";
	
	this.img_searchbox_width 	= '210px';	
	this.img_sboxleft_width 	= '27px';
	this.img_sboxright_width 	= '19px';
	this.img_searchpull_width 	= '26px';
	this.img_searchpull_height 	= '18px';
	
	this.img_height 	= '19px';
	
	this.fontsize = '11px';	
	this.defaultvalue = false;
	this.textselectcolor = '#b5d5ff';
	this.bordercolor = '#d8d8d8';
	
	this.filter_fontcolor = '#b6b6b6';
	this.backgroundcolor = '#f2f2f2';
	
	this.fontcolor 	= '#231f20';
	this.bgcolor 	= '#f2f2f2';
	this.highlightfontcolor = '#ffffff';
	this.highlightbgcolor = '#326ecb';
	
	this.filterleft = '8px';
	this.cursor = 'default';
	this.elements = new Object();
	this.widget = new widget();
	
	
}

widget.searchbox.prototype.populateDivs = function( prefix )
{
	var p = typeof(prefix) != 'undefined' ? prefix : '';
	
	this.div_searchbox 	= p + 'searchbox';
	this.div_sboxhold	= p + 'sbxinputholder';	
	this.div_lbut 	= p + 'sbxlbut';
	this.div_fill 	= p + 'sbxfill';
	this.div_input 	= p + 'sbxinput';
	this.div_rbut 	= p + 'sbxrbut';
	this.div_spull 	= p + 'sbxpull';
}

widget.searchbox.prototype.setRoot = function( root) 
{
	if (typeof(root) == 'undefined')
	{
		alert(
			'WIDGET: searchbox.setRoot() '
			+'expects DIV element as root'
		);
		return false;	
	}

	if (typeof(root)!='object')
	{
		this.root = document.getElementById( root );
	}
	else
	{
		this.root = root;
	}
}

widget.searchbox.prototype.draw = function()
{
	if ( this.setRoot(this.rootdiv) === false ) 
	{
		return false;
	}
	this.populateDivs( );
	var chkdv =  document.getElementById(this.div_searchbox);
	var prefix = (null !== chkdv) ? this.uid : '';
	this.populateDivs( prefix );

	// boxholder
	var sbox 	= document.createElement('div');
	sbox.id = this.div_searchbox;
	sbox.style.width=this.width;
	sbox.style.height = this.img_height;
	sbox.style.clear = "both";

	// overlayimage
	if (this.filteritems)
	{
		var spull 	= document.createElement('div');
		spull.id = this.div_spull;
		
		spull.style.position="absolute";
		spull.style.width	= this.img_searchpull_width;
		spull.style.height	= this.img_searchpull_height;
		spull.style.marginTop	= "3px";
		if ( opera || ff )
		{
			spull.style.marginTop	= "4px";
		}
		spull.style.paddingLeft	= "0px";
		spull.style.backgroundImage	="url("+this.img_searchpull+")";
		spull.style.backgroundRepeat="no-repeat";
		spull.style.zIndex	= "10";
		spull.onmousedown = function() {
			eval("this.nextSibling.searchbox.filterSearch()");
		};
	}
	// ---------------------------------------------------------
	// use parts
	// ---------------------------------------------------------
	if (  this.use_parts )
	{
		var lbut = document.createElement('div');
		lbut.id = this.div_lbut;
		
		lbut.className = 'fll';
		lbut.style.width = this.filteritems 
			? this.img_sboxleft_width 
			: '10px';
			
		lbut.style.height = this.img_height;
		lbut.style.overflow = 'hidden';
		var limg = document.createElement('img');
		limg.src = this.img_sbox_left;
		limg.border='0';
		lbut.appendChild(limg);

		var fill = document.createElement('div');
		fill.id = this.div_fill;
		
		fill.className = 'fll';
		fill.style.width = (
			parseInt(this.width,10) 
			- parseInt(lbut.style.width,10)
			- parseInt(this.img_sboxright_width,10)
		) +'px';
		fill.style.height = this.img_height;
		fill.style.backgroundImage = "url("+this.img_sbox_fill+")";
		fill.style.backgroundRepeat = "repeat-x";

		var iput = createNamedElement('INPUT', 'searchbox');
		iput.id = this.div_input;
		iput.type="text";
		iput.style.border = "0";
		iput.style.width = fill.style.width;
		iput.style.fontSize = this.fontsize; 
		iput.style.padding = "0";
		//iput.style.paddingTop = "1px";
		if (ie) iput.style.marginTop = "2px";
		else iput.style.marginTop = "3px";
		iput.style.backgroundColor = 'transparent';
		
		fill.appendChild(iput);
		
		var rbut = document.createElement('div');
		rbut.id = this.div_rbut;
		
		rbut.className = 'fll';
		rbut.style.width = this.img_sboxright_width;
		rbut.style.height = this.img_height;
		rbut.style.overflow = 'hidden';
		var rimg = document.createElement('img');
		rimg.src = this.img_sbox_right;
		rimg.border='0';
		rbut.appendChild(rimg);
		
		sbox.appendChild(lbut);
		sbox.appendChild(fill);
		sbox.appendChild(rbut);
		this.elements['rbut'] = rbut;
	}
	else
	{
		var iput =  createNamedElement('INPUT', 'searchbox');
		iput.id = this.div_input;
		iput.type="search";
		if (this.defaultvalue)
		{
			iput.setAttribute('placeholder', this.defaultvalue);
		}
		if (this.filteritems)
		{
			iput.setAttribute('results', '5');
		}
		iput.style.zIndex="1";
		iput.style.width = this.width;
		iput.style.fontSize = this.fontsize; 
		
		sbox.appendChild(iput);
	}

	// ---------------------------------------------------------
	// 
	// ---------------------------------------------------------


	if ( this.filteritems ) this.root.appendChild(spull);
	this.rootdiv.appendChild(sbox);

	iput.onkeypress = function() {
		eval("this.parentNode.parentNode.searchbox.search();");
	};
	
	this.elements['input'] = iput;
	sbox['searchbox'] = this;
		
	// ---------------------------------------------------------
	// build the target for our searchoutput
	// ---------------------------------------------------------
	
	
	// ---------------------------------------------------------
	// build the items
	// ---------------------------------------------------------
	
	
	// ---------------------------------------------------------
	// populate target with items
	// ---------------------------------------------------------
	
	
}

widget.searchbox.prototype.search = function( )
{

	if (this.use_parts)
	{
		var but = this.elements.rbut.childNodes[0];
		but.style.position = 'relative';
		but.style.top = '-'+(parseInt(this.img_height,10))+'px';
		but.onmousedown = function(){
			eval(
				"this.parentNode.parentNode.searchbox.hiliteClear();"
			);
		};
		but.onmouseup = function(){
			eval(
				"this.parentNode.parentNode.searchbox.clearInput();"
			);
		};
		
	}
}
widget.searchbox.prototype.hiliteClear = function( )
{
	if ( this.use_parts )
	{
		var ip =this.elements.input;
		this.elements.input.style.backgroundColor = this.textselectcolor;

		var but = this.elements.rbut.childNodes[0];
		but.style.position = 'relative';
		but.style.top = '-'+(2*parseInt(this.img_height,10))+'px';
		but.onmousedown = null;
	}
}

widget.searchbox.prototype.clearInput = function( )
{
	if ( this.use_parts )
	{
		this.elements.input.value='';
		this.elements.input.style.backgroundColor = 'transparent';
		var but = this.elements.rbut.childNodes[0];
		but.style.position = 'relative';
		but.style.top = '0px';
		but.onmouseup = null;
	}
}


widget.searchbox.prototype.filterSearch = function( )
{
	var rt = document.getElementById(this.div_searchbox);
	var fholder = document.createElement('div');
	fholder.id = this.uid + 'filterh';
	fholder.style.position = 'absolute';
	fholder.style.border = '1px solid ' + this.bordercolor;
	fholder.style.backgroundColor = this.backgroundcolor;
	fholder.style.padding = "8px 0px 4px 0px";
	fholder.style.left = (
		rt.offsetLeft + parseInt(this.filterleft)
	) +'px';
	fholder.style.top = (
		rt.offsetTop + (Math.round(rt.offsetHeight/2) )
	) +'px';
	fholder.style.zIndex = '20';	
	fholder.onmousedown = function() {
		eval("this.parentNode.removeChild(this);");
	};

	if ( typeof(this.filteritems) == 'object' )
	{
		var tmp = document.createElement('div');
		tmp.style.paddingBottom = '4px';
		tmp.style.color = this.filter_fontcolor;
		tmp.appendChild( document.createTextNode('Search'));
		fholder.appendChild(tmp);
		tmp = null;
		
		var tmp = document.createElement('div');
		tmp.setAttribute('parent',this.div_searchbox);
		tmp.style.padding = "2px 18px 2px 22px";
		tmp.style.cursor = this.cursor;
		tmp.onmouseover = function() {
			eval(
			"var p = document.getElementById(this.getAttribute('parent')); "
			+ " p.searchbox.hilite(this);"
			);
		};
		tmp.onmouseout = function() {
			eval(
			"var p = document.getElementById(this.getAttribute('parent')); "
			+ " p.searchbox.lolite(this);"
			);
		};
		tmp.appendChild( document.createTextNode('All'));
		fholder.appendChild(tmp);
		tmp = null;
		
		for ( var i in this.filteritems )
		{
			var tmp = document.createElement('div');
			tmp.style.padding = "2px 2px 2px 22px";
			tmp.setAttribute('parent',this.div_searchbox);
			tmp.style.cursor = this.cursor;
			
			tmp.onmouseover = function() {
				eval(
				"var p = document.getElementById(this.getAttribute('parent')); "
				+ " p.searchbox.hilite(this);"
				);
			};
			tmp.onmouseout = function() {
				eval(
				"var p = document.getElementById(this.getAttribute('parent')); "
				+ " p.searchbox.lolite(this);"
				);
			};
			tmp.appendChild( document.createTextNode(this.filteritems[i]));
			fholder.appendChild(tmp);
			tmp = null;
		};
		rt.parentNode.appendChild(fholder);
	}
}

widget.searchbox.prototype.hilite = function( obj )
{
	obj.style.backgroundColor = this.highlightbgcolor;
	obj.style.color = this.highlightfontcolor;
}

widget.searchbox.prototype.lolite = function( obj)
{
	obj.style.backgroundColor = this.bgcolor;
	obj.style.color = this.fontcolor;
}

widget.searchbox.prototype.setFilter = function( )
{

}

widget.searchbox.prototype.buildItems = function( )
{
}








