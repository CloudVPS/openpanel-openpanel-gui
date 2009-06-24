OpenPanel.GUIBuilder.GUIElements.DropDownMenu = function() {
	this.menuDiv = {};
	this.menuTable = {};
	this.itemData = {};
	this.onselect = function(id) {};
	this.itemList = {};
	this.selectedNode = {};
	this.closeTimer = {};
	this.visible = false;
	this.mouseUpValid = false;
}

OpenPanel.GUIBuilder.GUIElements.DropDownMenu.prototype = {
	create: function(targetDiv,poffset) {
		this.targetDiv = targetDiv;
		this.offset = 0;
		if (poffset != undefined) this.offset = poffset;
			
		this.menuDiv = document.createElement("div");
		var self = this;
		this.menuDiv.onmouseout = self.timedHide();
		this.menuDiv.onmouseover = self.cancelHide();
		this.menuDiv.className = "dropDownMenu";
		
		this.visible = false;
		targetDiv.appendChild (this.menuDiv);
	},
	
	getX: function(xel) {
		var el = xel;
		var x = 0;
		while (el != undefined) {
			console.log ("getX: " + el.offsetLeft);
			x += el.offsetLeft;
			el = el.offsetParent;
		}
		return x;
	},
	
	getY: function(xel) {
		var el = xel;
		var y = 0;
		while (el != undefined) {
			console.log ("getY y:" +y);
			console.log (el);
			y += el.offsetTop;
			if (el.scrollTop) y-= el.scrollTop;
			el = el.offsetParent;
		}
		return y;
	},
	
	constructImageTD: function(width,height,src) {
		var objTD = document.createElement ("td");
		if (width != 0) {
			objTD.width = width;
			objTD.fontSize = "1px";
			var objImg = document.createElement ("img");
			objImg.width = width;
			objImg.height = height;
			objImg.border = 0;
			objImg.src = "/images/gui/" + src;
			objTD.appendChild(objImg);
		} else {
			objTD.style.background = "url(/images/gui/" + src + ")";
			objTD.className = "dropDownMenuEdge";
			objTD.fontSize = "1px";
			objTD.innerHTML = "&nbsp;"
		}
		return objTD;
	},
	
	build: function() {
		var self = this;
		var objTable = document.createElement("table");
		objTable.border = 0;
		objTable.cellPadding = 0;
		objTable.cellSpacing = 0;
		
		var objTbody = document.createElement("tbody");
		objTable.appendChild (objTbody);
		
		var objTR = document.createElement ("tr");
		objTR.height = "11";
		objTbody.appendChild (objTR);
		
		objTR.appendChild (this.constructImageTD(16,11,"menu_top_left.png"));
		objTR.appendChild (this.constructImageTD(4,11,"menu_top_mid_left.png"));
		objTR.appendChild (this.constructImageTD(12,11,"menu_top_mid.png"));
		objTR.appendChild (this.constructImageTD(0,11,"menu_top_mid.png"));
		objTR.appendChild (this.constructImageTD(12,11,"menu_top_mid.png"));
		objTR.appendChild (this.constructImageTD(4,11,"menu_top_mid_right.png"));
		objTR.appendChild (this.constructImageTD(16,11,"menu_top_right.png"));
		
		var isfirst = true;
		
		for (var key in this.itemData) {
			var itemString = this.itemData[key];
			
			var objTR = document.createElement ("tr");
			objTR.height = "18";
			objTbody.appendChild (objTR);
			
			if (isfirst) {
				objTR.appendChild (this.constructImageTD(16,18,"menu_1st_left.png"));
			} else {
				objTR.appendChild (this.constructImageTD(16,18,"menu_mid_left.png"));
			}
			
			var itemTD = document.createElement ("td");
			itemTD.colSpan = 5;
			itemTD.className="dropDownMenuItem";
			itemTD.innerHTML = itemString;
			itemTD.setAttribute ("menu:id",key);
			
			itemTD.onmouseover = function() {
				self.cancelHide();
				if (self.mouseUpValid) {
					if (self.selectedNode != undefined) {
						if (self.selectedNode === this) return;
						self.selectedNode.className = "dropDownMenuItem";
					}
					self.selectedNode = this;
					this.className = "dropDownMenuItemSelected";
				}
			}
			
			itemTD.onmouseout = function() {
				if (self.mouseUpValid) self.timedHide();
			}
			
			itemTD.onmouseup = itemTD.onclick = itemTD.ondblclick = function() {
				self.cancelHide();
				if (! self.mouseUpValid) return false;
				self.mouseUpValid = false;
				this.className = "dropDownMenuItemSelected";
				var thistd = this;
				setTimeout (function() {
						thistd.className = "dropDownMenuItem";
						setTimeout (function() {
							thistd.className = "dropDownMenuItemSelected";
							setTimeout (function() {
								thistd.classname = "dropDownMenuItem";
								setTimeout (function() {
									self.hide();
									if (self.selectedNode != undefined) {
										self.onselect (self.selectedNode.getAttribute ("menu:id"));
									}
								},50);
							}, 80);
						}, 80);
					}, 80);
				
				return false;
			}
			
			objTR.appendChild (itemTD);
			this.itemList[key] = itemTD;
			
			if (isfirst) {
				objTR.appendChild (this.constructImageTD(16,18,"menu_1st_right.png"));
			} else {
				objTR.appendChild (this.constructImageTD(16,18,"menu_mid_right.png"));
			}
			
			isfirst = false;
		}

		var objTR = document.createElement ("tr");
		objTR.height = 28;
		objTbody.appendChild (objTR);
	
		objTR.appendChild (this.constructImageTD(16,28,"menu_bot_left.png"));
		objTR.appendChild (this.constructImageTD(4,28,"menu_bot_mid_left.png"));
		objTR.appendChild (this.constructImageTD(12,28,"menu_bot_mid_midleft.png"));
		objTR.appendChild (this.constructImageTD(0,28,"menu_bot_mid.png"));
	
		objTR.appendChild (this.constructImageTD(12,28,"menu_bot_mid_midright.png"));
		objTR.appendChild (this.constructImageTD(4,28,"menu_bot_mid_right.png"));
		objTR.appendChild (this.constructImageTD(16,28,"menu_bot_right.png"));

		
		this.menuDiv.appendChild (objTable);
	},
	
	show: function() {
		if (! this.visible) {
			var x = this.getX(this.targetDiv);
			var y = this.getY(this.targetDiv);
			
			console.log ("x: " + x + ", y: " + y);
			
			this.menuDiv.style.position = "fixed";
			this.menuDiv.style.left = "" + (x + this.offset) + "px";
			this.menuDiv.style.top = "" + (y -10) + "px";
			
			console.log (this.menuDiv.style.left);
			console.log (this.menuDiv.style.top);
			
			if (this.selectedNode != undefined) {
				this.selectedNode.className = "dropDownMenuItem";
			}

			for (var key in this.itemData) {
				this.selectedNode = this.itemList[key];
				this.selectedNode.className = "dropDownMenuItemSelected";
				break;
			}
			this.visible = true;
			this.menuDiv.style.display = "block";
			this.mouseUpValid = false;
			var self = this;
			setTimeout (function() { self.mouseUpValid=true; }, 200);
		}
	},
	
	hide: function() {
		this.visible = false;
		this.cancelHide();
		this.menuDiv.style.display = "none";
	},
	
	timedHide: function() {
		if (! this.visible) return;
		var self = this;
		this.closeTimer = window.setTimeout (function() {self.hide()}, 500);
	},
	
	cancelHide: function() {
		if (this.closeTimer) {
			window.clearTimeout (this.closeTimer);
			this.closeTimer = null;
		}
	}
}
