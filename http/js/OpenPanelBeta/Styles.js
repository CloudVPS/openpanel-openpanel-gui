/*
*
* Fuck IE and no time to debug deeply,
* just apply Styles the Cheesy way
*
*/

var STYLES = {
	tab: {
		tab: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_fill.gif)";
			obj.style.paddingLeft 		= "5px";
			obj.style.paddingRight 		= "5px";
			obj.style.lineHeight		= "21px";
			obj.style.height 			= "21px";
			obj.style.cursor			= "default";
		},
		
		tabDelimiter: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_delimiter.gif)";
			obj.style.height 			= "21px";
			obj.style.width				= "1px";
			obj.style.cursor			= "default";
		},		
		
		tabDelimiterSelected: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_delimiter_selected.gif)";
			obj.style.height 			= "21px";
			obj.style.width				= "1px";
			obj.style.cursor			= "default";
		},	
		
		tabStartSelected: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_start_selected.gif)";
			obj.style.height 			= "21px";
			obj.style.width				= "10px";
			obj.style.cursor			= "default";
		},
		
		tabStart: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_start.gif)";
			obj.style.height 			= "21px";
			obj.style.width				= "10px";
			obj.style.cursor			= "default";
		},	
		
		tabSelected: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_hlite.gif)";
			obj.style.paddingLeft 		= "5px";
			obj.style.paddingRight 		= "5px";
			obj.style.lineHeight		= "21px";
			obj.style.height 			= "21px";
			obj.style.cursor			= "default";
		},
	
		tabEndSelected: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_end_selected.gif)";
			obj.style.height 			= "21px";
			obj.style.width				= "10px";
			obj.style.cursor			= "default";
		},
		
		tabEnd: function(obj)
		{
			if (typeof(obj) != 'object') return;
			obj.style.backgroundImage 	= "url(/images/gui/tab_end.gif)";
			obj.style.height 			= "21px";
			obj.style.width				= "10px";
			obj.style.cursor			= "default";
		},
		
		tabDisabled: function(obj)
		{
			return this.tab(obj);
		}
	}
};
