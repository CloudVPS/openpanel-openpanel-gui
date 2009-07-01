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
		this.focused = false;
		this.focusOnClick = true;
		this.menuCallbacks = {};
		this.menuDiv = {};
		this.listStyle = "normal";
		this.createMenu = {};
		this.buttonArea = {};
		this.createButtonDisabled = false;
		this.deleteButtonDisabled = false;
		this.createButtonCallback = function() {};
		this.deleteButtonCallback = function() {};
		this.iconImage = "/images/gui/404.png";
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
  		createInline: function(pid, def, width, height) {
  			this.create(pid, def, width, height);
  		},
  		createInlineWithButtons: function(pid, def, width, height) {
  			this.create(pid, def, width, height+22, 0, 0, 0, "buttonlist");
  		},
  		createFixed: function(pid, def, width, top, bottom, marginleft, iconimg) {
  			this.create(pid, def, width, 0, top, bottom, marginleft, "itemlist", iconimg);
  		},
		create: function(parentidorobj, def, width, height, top, bottom, marginleft,liststyle, iconimg) {
			this.sizes = new Array();
			this.headers = new Array();
			this.keys = new Array();
			this.rowsByID = new Array();
			this.rowKeys = new Array();
			this.rowKeysBySelectionText = new Array();
			
			this.gridClass = "gridView";
			this.contentsClass = "gridViewContents";
			this.rowClass = "gridViewRow";
			this.rowClassSelected = "gridViewRowSelected";
			this.rowClassSelectedUnfocused = "gridViewRowSelectedUnfocused";
			this.columnClass = "gridViewColumn";
			this.titleClass = "gridViewTitle";
			this.titleItemClass = "gridViewTitleItem";
			
			this.selectedShadow = "";
			this.focusOnClick = true;
			this.height = height;
			this.contentHeight = (liststyle == "buttonlist") ? height-22:height;
			this.keyboardSelectionText = "";
			this.keyboardSelectionTimer = {};
			this.keyboardSelectionTimerActive = false;
			this.ignoreNextKey = false;
			
			this.selectedIndex = -1;
			this.count = 0;
			
			var tabWidthWeight = 0;
			var count = 0;
			
			if (liststyle != undefined) this.listStyle = liststyle;
			else liststyle = "normal";
			if (iconimg != undefined) this.iconImage = iconimg;
			
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
			
			if (liststyle == "itemlist")
			{
				this.gridClass = "itemGridView";
				this.contentsClass = "itemGridViewContents";
				this.rowClass = "itemGridViewRow";
				this.rowClassSelected = "itemGridViewRowSelected";
				this.rowClassSelectedUnfocused = "itemGridViewRowSelectedUnfocused";
				this.columnClass = "itemGridViewColumn";
				this.titleClass = "itemGridViewTitle";
				this.titleItemClass = "itemGridViewTitleItem";
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
			gridViewNode.className = this.gridClass;
			gridViewNode.style.width = "" + this.totalWidth + "px";
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
			
			var contentHeight = height - 15;
			if (liststyle == "buttonlist") contentHeight -= 22;
			
			var gridViewTitle = document.createElement("div");
			gridViewTitle.className = this.titleClass;
			gridViewTitle.style.width = "" + this.totalWidth + "px";
			gridViewNode.appendChild(gridViewTitle);
			
			if (this.sizes.length == 1) this.totalWidth += 1;
			
			var gridViewContents = document.createElement("div");
			gridViewContents.className = this.contentsClass;
			gridViewContents.style.width = "" + this.totalWidth + "px";
			if (height) {
				gridViewContents.style.height = "" + (contentHeight) + "px";
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
				gridViewTitleItem.className = this.titleItemClass;
				gridViewTitleItem.style.width = "" + sz + "px";
				gridViewTitleItem.innerHTML = this.headers[i];
				gridViewTitle.appendChild(gridViewTitleItem);
			}
			
			parent.appendChild (this.focusCatcher);
			parent.appendChild(gridViewNode);
			if (liststyle == "buttonlist") {
				this.renderButtons(gridViewNode);
			}
			
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
			row.className = this.rowClass;
			row.style.width = "" + (this.totalWidth) + "px";
			row.onclick = function() {
				if (self.haveActiveSelection == true) {
					self.selectedObject.className = self.rowClass;
				}
				if (self.focused) {
					this.className = self.rowClassSelected;
				} else {
					this.className = self.rowClassSelectedUnfocused;
				}
				self.haveActiveSelection = true;
				self.handleClick(this, id, values, index);
			}
			
			for (i = 0; i < this.sizes.length; ++i) {
				var useInnerHTML = false;
				var col = document.createElement("div");
				col.className = this.columnClass;
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
				
				if (value == undefined || value == "") { 
					value = useInnerHTML ? "&nbsp;" : " ";
				}
				
				if (this.listStyle == "itemlist") {
					var icondiv = document.createElement("div");
					icondiv.style.width = "16px";
					icondiv.style.height = "18px";
					icondiv.style.background = "url(" + this.iconImage + ")";
					icondiv.style.backgroundRepeat = "no-repeat";
					icondiv.style.cssFloat = "left";
					icondiv.style.marginTop = "2px";
					icondiv.style.opacity = "0.8";
					col.appendChild(icondiv);
					var textdiv = document.createElement("div");
					textdiv.style.marginLeft = "4px";
					textdiv.style.cssFloat = "left";
					var textNode = document.createTextNode(value!=undefined?value:" ");
					textdiv.appendChild (textNode);
					col.appendChild (textdiv);
				} else {
					if (! useInnerHTML)
					{
						var textNode = document.createTextNode(value!=undefined?value:" ");
						col.appendChild(textNode);
					}
					else
					{
						col.innerHTML = value!=undefined?value:"&nbsp;";
					}
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
		
		setMenu: function(menudef) {
			if (this.buttonArea.appendChild == undefined) return;
			this.menuDiv = document.createElement("div");
			this.buttonArea.appendChild(this.menuDiv);
			
			var self = this;
			
			this.createButton.onmousedown = this.createButton.onclick = this.createButton.ondblclick = function() {
				if (self.createButtonDisabled) return false;
				this.className = "gridViewCreateButtonPushed";
				var btn = this;
				setTimeout (function() { btn.className = "gridViewCreateButton"; }, 50);
				self.createMenu.show();
				return false;
			}

			this.createMenu = new OpenPanel.GUIBuilder.GUIElements.DropDownMenu();
			this.createMenu.create(this.menuDiv, -17);
			
			var itemData = {};
			for (key in menudef) {
				itemData[key] = key;
				this.menuCallbacks[key] = menudef[key];
			}
			
			this.createMenu.itemData = itemData;
			this.createMenu.build();
			this.createMenu.onselect = function(id) {
				if (self.menuCallbacks[id] != undefined)
					self.menuCallbacks[id]();
			}
		},
		
		renderButtons: function(gridViewNode) {
			var buttonArea = document.createElement("div");
			buttonArea.className = "gridViewButtonArea";
			gridViewNode.appendChild(buttonArea);
			this.buttonArea = buttonArea;
			
			var createButton = document.createElement("div");
			createButton.className = "gridViewCreateButton";
			buttonArea.appendChild(createButton);
			this.createButton = createButton;
			
			var self = this;
			
			var deleteButton = document.createElement("div");
			deleteButton.className = "gridViewDeleteButton";
			buttonArea.appendChild(deleteButton);
			this.deleteButton = deleteButton;
			
			createButton.onmousedown = function() {
				if (self.createButtonDisabled) return false;
				this.className = "gridViewCreateButtonPushed";
				return false;
			}
			
			createButton.onclick = function() {
				if (self.createButtonDisabled) return false;
				self.createButtonCallback();
			}
			
			createButton.onmouseup = function() {
				this.className = "gridViewCreateButton";
				return false;
			}
			
			deleteButton.onmousedown = function() {
				if (self.deleteButtonDisabled) return false;
				this.className = "gridViewDeleteButtonPushed";
				return false;
			}
			
			deleteButton.onmouseup = function() {
				this.className = "gridViewDeleteButton";
				return false;
			}
			
			deleteButton.onclick = function() {
				if (self.deleteButtonDisabled) return false;
				self.deleteButtonCallback();
			}
		},
		
		disableCreateButton: function() {
			this.createButton.className = "gridViewCreateButtonDisabled";
			this.createButtonDisabled = true;
		},
		
		disableDeleteButton: function() {
			this.deleteButton.className = "gridViewDeleteButtonDisabled";
			this.deleteButtonDisabled = true;
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
			else if (itempos > (scrollpos + (this.contentHeight - 32)))
			{
				if (itempos > (this.contentHeight-32))
				{
					this.contents.scrollTop = itempos - (this.contentHeight-32);
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
			this.focused = newval;
			if (! this.haveActiveSelection) return;
			if (newval == true)
			{
				this.selectedObject.className = this.rowClassSelected;
			}
			else
			{
				this.selectedObject.className = this.rowClassSelectedUnfocused;
			}
		},
		
		takeFocus: function() {
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
  
