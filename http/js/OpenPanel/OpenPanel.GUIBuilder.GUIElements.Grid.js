OpenPanel.GUIBuilder.GUIElements.Grid = function()
	{
		this.sizes = [300];
		this.headers = ["Item"];
		this.keys = ["item"];
		this.totalWidth = 301;
		this.haveActiveSelection = false;
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
		create: function(parentidorobj, def, width, height, top, bottom, marginleft) {
			this.sizes = new Array();
			this.headers = new Array();
			this.keys = new Array();
			this.rowsByID = new Array();
			
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
			
			for (var ki in def) {
				this.headers[i] = def[ki][0];
				this.sizes[i] = parseInt(def[ki][1] * tabWidthWeight);
				this.keys[i] = ki;
				i++;
			}
			
			var gridViewNode = document.createElement("div");
			gridViewNode.className = "gridView";
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
			var gridViewTitle = document.createElement("div");
			gridViewTitle.className = "gridViewTitle";
			gridViewTitle.style.width = "" + this.totalWidth + "px";
			gridViewNode.appendChild(gridViewTitle);
			
			if (this.sizes.length == 1) this.totalWidth += 1;
			
			var gridViewContents = document.createElement("div");
			gridViewContents.className = "gridViewContents";
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
			
			parent.appendChild(gridViewNode);
		},
		
		/// Add a single selectable line
		/// \param id The id of this line
		/// \param values The dictionary with the columns.
		addGridLine: function(id, values) {
			var i = 0;
			var self = this;
			var row = document.createElement("div");
			row.className = "gridViewRow";
			row.style.width = "" + (this.totalWidth) + "px";
			row.onclick = function() {
				if (self.haveActiveSelection == true) {
					self.selectedObject.style.background = "";
				}
				this.style.background = "url(/images/gui/selected.png)";
				self.haveActiveSelection = true;
				self.handleClick(this, id, values);
			}
			
			for (i = 0; i < this.sizes.length; ++i) {
				var col = document.createElement("div");
				col.className = "gridViewColumn";
				col.style.width = "" + this.sizes[i] + "px";
				var value = values[this.keys[i]];
				col.innerHTML = value!=undefined?value:"";
				row.appendChild(col);
			}
			
			this.contents.appendChild(row);
			this.rowsByID[id] = row;
		},
		
		/// Default onclick handler.
		onclick: function(id, values) {
		},
		
		/// Internal click-handler.
		handleClick: function(domobject, id, values) {
			this.selectedObject = domobject;
			this.onclick(id, values);
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
			this.rowsByID[id].onclick();
			this.onclick = oldonclick;
		}
	}
  