OpenPanel.GUIBuilder.GUIElements.Grid = function()
	{
		this.sizes = [300];
		this.headers = ["Item"];
		this.keys = ["item"];
		this.totalWidth = 301;
		this.haveActiveSelection = false;
		this.selectedIndex = -1;
		this.focusCatcher = {};
		this.count = 0;
		this.focusOnClick = true;
	}
	
	/// Bind an OpenPanelGrid object to a DOM node.
	/// @param parentidorobj If a string, the id of the parent object, if an
	///						 object, a reference to said parent.
	/// @param def An associative array in the form: {key:[title,width]}.
	/// @param height The wanted height of the grid. If not 0, the following
	///               parameters will be ignored.
	/// @param top If height is 0, the grid will be set up using css fixed
	///            positioning, provide the top pixel offset here.
	/// @param bottom The bottom pixel offset for p
  	OpenPanel.GUIBuilder.GUIElements.Grid.prototype = {
		create: function(parentidorobj, def, width, height, top, bottom, marginleft,liststyle) {
			this.sizes = new Array();
			this.headers = new Array();
			this.keys = new Array();
			this.rowsByID = new Array();
			this.rowKeys = new Array();
			this.rowKeysBySelectionText = new Array();
			this.selectedImage = "url(/images/gui/selected.png)";
			this.selectedImageUnfocused = "url(/images/gui/selectedu.png)";
			this.selectedColor = "#ffffff";
			this.selectedColorUnfocused = "#000000";
			this.selectedWeight = "normal";
			this.titleImage = "url(/images/gui/gridview_title_bg.png)";
			this.titleBorderBottom = "#666666";
			this.borderRight = "#666666";
			this.borderLeft = "#888888";
			this.contentBorderTop = "0px";
			this.selectedShadow = "";
			this.focusOnClick = true;
			this.height = height;
			this.keyboardSelectionText = "";
			this.keyboardSelectionTimer = {};
			this.keyboardSelectionTimerActive = false;
			this.ignoreNextKey = false;
			
			this.selectedIndex = -1;
			this.count = 0;
			
			var tabWidthWeight = 0;
			var count = 0;
			
			for (var ki in def){
				var w = def[ki][1];
				if (w>0) {
					tabWidthWeight += def[ki][1];
				} else {
					def[ki][1] = 10;
					tabWidthWeight += 10;
				}
				count++;
	  		}
			if(count == 0){
				throw new Error("Number of grid columns is 0");
			}
			var widthLeftForTabs = width - 19 - (5 * count);
			if (tabWidthWeight == 0) return;
			
			tabWidthWeight = widthLeftForTabs / tabWidthWeight;
			
			var parent;
			if (typeof(parentidorobj) == "string") {
				parent = document.getElementById(parentidorobj);
			} else parent = parentidorobj;
			
			this.totalWidth = width;
			var i = 0;
			
			var color;
			if (typeof(liststyle) == 'undefined')
			{
				color = "#f8f8f8";
			}
			else
			{
				if (liststyle == "itunes")
				{
					color = "#d0d7e2";
					this.selectedImage = "url(/images/gui/selected2.png)";
					this.selectedImageUnfocused = "url(/images/gui/selected2u.png)";
					this.selectedColor = "#ffffff";
					this.selectedColorUnfocused = "#ffffff";
					this.selectedWeight = "bold";
					this.titleImage = "url(/images/gui/gridview_title_bg2.png)";
					this.titleBorderBottom = "#444444";
					this.selectedShadow = "#102040 0px 0px 2px";
					this.contentBorderTop = "1px solid #444444";
					this.borderRight = "#444444";
					this.borderLeft = "#c0c7d2";
				}
			}
			
			this.valueReplacements = new Array();

			for (var ki in def) {
				this.headers[i] = def[ki][0];
				this.sizes[i] = parseInt(def[ki][1] * tabWidthWeight);
				if (def[ki].length > 2)
				{
					this.valueReplacements[i] = def[ki][2];
				}
				this.keys[i] = ki;
				i++;
			}
			
			var gridViewNode = document.createElement("div");
			gridViewNode.className = "gridView";
			gridViewNode.style.backgroundColor = color;
			gridViewNode.style.width = "" + this.totalWidth + "px";
			gridViewNode.style.borderBottomColor = this.titleBorderBottom;
			gridViewNode.style.borderRightColor = this.borderRight;
			gridViewNode.style.borderLeftColor = this.borderLeft;
			if (height) {
				gridViewNode.style.height = "" + height + "px";
			} else {
				gridViewNode.style.top = "" + top + "px";
				gridViewNode.style.position = "fixed";
				gridViewNode.style.left = "50%";
				gridViewNode.style.marginLeft = marginleft + "px";
				gridViewNode.style.bottom = "" + bottom + "px";
			}
			
			this.focusCatcher = document.createElement("input");
			this.focusCatcher.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
			this.focusCatcher.style.opacity = "0.0";
			this.focusCatcher.style.width = "0px";
			this.focusCatcher.style.height = "0px";
			this.focusCatcher.style.padding = "0px";
			this.focusCatcher.style.margin = "0px";
			
			var self = this;
			this.focusCatcher.onfocus = function() {
				self.setFocus(true);
			}
			this.focusCatcher.onblur = function() {
				self.setFocus(false);
			}
			this.focusCatcher.onkeydown = function(ev) {
				if (ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) return true;
				if (ev.which == 38) self.moveSelectionUp();
				else if (ev.which == 40) self.moveSelectionDown();
				else if (ev.which == 13) return true;
				else
				{
					var key = String.fromCharCode (ev.which);
					if ((key >= '.') && (key <= 'z'))
					{
						if (self.keyboardSelectionTimerActive)
						{
							clearTimeout (self.keyboardSelectionTimer);
							self.keyboardSelectionTimerActive = false;
						}
						
						self.keyboardSelectionText += key;
						
						self.keyboardSelectionTimerActive = true;
						self.keyboardSelectionTimer = setTimeout (
							function() {
								self.keyboardSelectionText = "";
								self.keyboardSelectionTimerActive = false;
							}, 1500);
						
						self.selectFromString (self.keyboardSelectionText);
						self.setFocus (true);
					}
					else return true;
				}
				return false;
			}
			
			var gridViewTitle = document.createElement("div");
			gridViewTitle.className = "gridViewTitle";
			gridViewTitle.style.width = "" + this.totalWidth + "px";
			gridViewTitle.style.backgroundImage = this.titleImage;
			gridViewTitle.style.borderBottomColor = this.titleBorderBottom;
			gridViewNode.appendChild(gridViewTitle);
			
			if (this.sizes.length == 1) this.totalWidth += 1;
			
			var gridViewContents = document.createElement("div");
			gridViewContents.className = "gridViewContents";
			gridViewContents.style.borderTop = this.contentBorderTop;
			gridViewContents.style.width = "" + this.totalWidth + "px";
			if (height) {
				gridViewContents.style.height = "" + (height - 15) + "px";
			} else {
				gridViewContents.style.top = "" + (top + 16) + "px";
				gridViewContents.style.position = "fixed";
				gridViewContents.style.left = "50%";
				gridViewContents.style.marginLeft = marginleft + "px";
				gridViewContents.style.bottom = "" + bottom + "px";
			}
			
			this.contents = gridViewContents;
			gridViewNode.appendChild(gridViewContents);
			
			for (i = 0; i < this.sizes.length; ++i) {
				var sz = this.sizes[i];
				if (i == (this.sizes.length - 1)) sz += 5;
				
				var gridViewTitleItem = document.createElement("div");
				gridViewTitleItem.className = "gridViewTitleItem";
				gridViewTitleItem.style.width = "" + sz + "px";
				gridViewTitleItem.innerHTML = this.headers[i];
				gridViewTitle.appendChild(gridViewTitleItem);
			}
			
			parent.appendChild (this.focusCatcher);
			parent.appendChild(gridViewNode);
		},
		
		/// Add a single selectable line
		/// \param id The id of this line
		/// \param values The dictionary with the columns.
		addGridLine: function(id, values) {
			var i = 0;
			var self = this;
			this.count++;
			var index = this.count -1;
			var row = document.createElement("div");
			row.className = "gridViewRow";
			row.style.width = "" + (this.totalWidth) + "px";
			row.onclick = function() {
				if (self.haveActiveSelection == true) {
					self.selectedObject.style.background = "";
					self.selectedObject.style.color = "#000000";
					self.selectedObject.style.fontWeight = "normal";
					self.selectedObject.style.textShadow = "";
				}
				this.style.background = self.selectedImageUnfocused;
				this.style.color = self.selectedColorUnfocused;
				this.style.fontWeight = self.selectedWeight;
				this.style.textShadow = self.selectedShadow;
				self.haveActiveSelection = true;
				self.handleClick(this, id, values, index);
			}
			
			for (i = 0; i < this.sizes.length; ++i) {
				var useInnerHTML = false;
				var col = document.createElement("div");
				col.className = "gridViewColumn";
				col.style.width = "" + this.sizes[i] + "px";
				var value = values[this.keys[i]];
				if ((value != undefined) && (this.valueReplacements[i] != undefined))
				{
					var v = "" + value;
					if (this.valueReplacements[i][v] != undefined)
					{
						value = this.valueReplacements[i][v];
						useInnerHTML = true;
					}
				}
				
				if (! useInnerHTML)
				{
					var textNode = document.createTextNode(value!=undefined?value:"");
					col.appendChild(textNode);
				}
				else
				{
					col.innerHTML = value;
				}
				row.appendChild(col);
			}
			
			this.contents.appendChild(row);
			this.rowsByID[id] = row;
			this.rowKeys[index] = id;
			
			var selectionText = values[this.keys[0]];
			if (selectionText != undefined)
			{
				this.rowKeysBySelectionText[selectionText] = id;
			}
		},
		
		selectFromString: function(selectedText) {
			var seltext = selectedText.toLowerCase();
			if (seltext.length == 0) return;
			for (key in this.rowKeysBySelectionText) {
				var slice = key.slice (0, seltext.length);
				if (slice == seltext) {
					var rowkey = this.rowKeysBySelectionText[key];
					this.rowsByID[rowkey].onclick();
					break;
				}
			}
		},
		
		moveSelectionUp: function() {
			if (! this.haveActiveSelection) return;
			if (this.selectedIndex < 1) return;
			
			this.rowsByID[this.rowKeys[this.selectedIndex-1]].onclick();
			this.setFocus (true);
		},

		moveSelectionDown: function() {
			if (! this.haveActiveSelection) return;
			if (this.selectedIndex >= (this.count-1)) return;
			this.rowsByID[this.rowKeys[this.selectedIndex+1]].onclick();
			this.setFocus (true);
		},
		
		/// Default onclick handler.
		onclick: function(id, values) {
		},
		
		/// Internal click-handler.
		handleClick: function(domobject, id, values, index) {
			var scrollpos = this.contents.scrollTop;
			var itempos = 17 * index;
			
			if (itempos < scrollpos) this.contents.scrollTop = itempos;
			else if (itempos > (scrollpos + (this.height - 32)))
			{
				if (itempos > (this.height-32))
				{
					this.contents.scrollTop = itempos - (this.height-32);
				}
				else
				{
					this.contents.scrollTop = 0;
				}
			}
			
			var doonclick = true;
			if (this.selectedObject == domobject) doonclick = false;
			this.selectedObject = domobject;
			this.selectedIndex = index;
			if (doonclick) this.onclick(id, values);
			if (this.focusOnClick) this.focusCatcher.focus();
		},
		
		setFocus: function(newval) {
			if (! this.haveActiveSelection) return;
			if (newval)
			{
				this.selectedObject.style.background = this.selectedImage;
				this.selectedObject.style.color = this.selectedColor;
			}
			else
			{
				this.selectedObject.style.background = this.selectedImageUnfocused;
				this.selectedObject.style.color = this.selectedColorUnfocused;
			}
		},
		
		takeFocus: function() {
			console.log ("Grid.takeFocus");
			this.focusCatcher.focus();
		},
		
		/// Set the grid contents from a two dimensional dictionary
		/// in the format {rowid:{colid:value,colid:value}}.
		setGrid: function(dict) {
			this.contents.innerHTML = "";
			this.haveActiveSelection = false;
			this.rowsByID = {};
			var i = 0;
			for (ki in dict) {
				this.addGridLine(ki, dict[ki]);
			}
		},
		
		/// Explicitly set the selected row without going through
		/// the callback.
		setSelection: function(id) {
			var oldonclick = this.onclick;
			this.onclick = function() {
			};
			this.focusOnClick = false;
			this.rowsByID[id].onclick();
			this.onclick = oldonclick;
			this.focusOnClick = true;
		}
	}
  
