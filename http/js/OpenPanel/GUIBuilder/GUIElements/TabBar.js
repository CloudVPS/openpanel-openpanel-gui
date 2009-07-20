/**
 * @author jp
 */
OpenPanel.GUIBuilder.GUIElements.TabBar = {
	
	targetDiv : {},
	openCoreObject : {},
	itemElements: {},
	openCoreObjects : [],
	tabStart : {},
	tabEnd : {},
	firstObject: {},
	tabIds: {},
	tabIndexes : {},
	selectedTabId : "",
	tabWidth : 0,
	
	build : function(){
		this.tabWidth = 0;
		this.targetDiv.innerHTML = "";
		this.tabIds = {};
		this.tabIndexes = {};
		
		this.itemElements = {};
		
		if (this.openCoreObject != undefined) {
			var tabs = [];
			var tabDiv = document.createElement("div");
			tabDiv.setAttribute("id", "tabBarDiv");
			
			var tabHolder = document.createElement("ul");
			tabHolder.setAttribute("class", "tabHolder");
			tabHolder.setAttribute("id", "tabHolder");
			this.targetDiv.appendChild(tabDiv);
			tabDiv.appendChild(tabHolder);
			this.tabStart = document.createElement("li");
			this.tabStart.setAttribute("id", "tabStart");
			this.tabStart.setAttribute("class", "tabStart");
			this.tabStart.innerHTML = "&nbsp;";
			tabHolder.appendChild(this.tabStart);
			
			this.openCoreObjects = [];
			
			if (this.openCoreObject.classInfo["class"].metabase == "") {
				if(this.openCoreObject.canUpdate == true || (this.openCoreObject.canUpdate == false && this.openCoreObject.getParameterCount() > 1)){
					this.openCoreObjects.push(this.openCoreObject);
				} 
			}
			
			var sortIndexes = {};
			var sortIndexesToSort = [];
			
			for (var key in this.openCoreObject.children) {
				this.openCoreObjects.push(this.openCoreObject.children[key]);
			}
			for (var key in this.openCoreObjects) {
				var childObject = this.openCoreObjects[key];
				if (typeof(childObject) == "object") {
					var sortIndex = childObject.classInfo["class"].sortindex;
					if (sortIndexes[sortIndex] == undefined) {
						sortIndexes[sortIndex] = [];
					}
					
					sortIndexes[sortIndex].push(childObject);
					sortIndexesToSort.push(sortIndex);
				}
			}
			
			sortIndexesToSort.sort(function(a, b){
				return a - b;
			});
			var sortedChildren = {};
			
			for (var i = 0; i < sortIndexesToSort.length; i++) {
				var childObjects = sortIndexes[sortIndexesToSort[i]];
				for (var j = 0; j < childObjects.length; j++) {
					sortedChildren[childObjects[j].name] = childObjects[j];
				}
			}
			
			for (var i = 0; i < this.openCoreObject.children.length; i++) {
				var someObject = this.openCoreObject.children[i];
				if (typeof(someObject) == "object") {
					if (someObject.classInfo["class"].metabase == "") {
						this.openCoreObjects.push(someObject);
					}
				} else {
					alert("OpenPanel.GUIBuilder.GUIElements.TabBar.build(openCoreObject) : openCoreObject is undefined");
				}
			}
			
			var counter = 0;
			
			for (var key in sortedChildren) {
				var someObject = sortedChildren[key];
				if (typeof(someObject) == "object") {
					if (someObject.metaType != "derived") {
						var tabSpan = document.createElement("li");
						tabSpan.setAttribute("id", someObject.uuid);
						tabSpan.setAttribute("OC:Class", someObject.name);
						tabSpan.appendChild(document.createTextNode(someObject.title));
						tabs.push(tabSpan);
						tabSpan.onclick = function(){
							OpenPanel.GUIBuilder.GUIElements.TabBar.click(this.getAttribute("OC:Class"))
						}
						tabSpan.onmousedown = function(){
							OpenPanel.GUIBuilder.GUIElements.TabBar.pushItem(this.getAttribute("OC:Class"))
						}
						
						this.itemElements[someObject.name] = tabSpan;
						tabSpan.setAttribute("class", "tab");
						this.setTab(tabSpan);

						this.tabIndexes[someObject.name] = counter;
						this.tabIds[counter++] = someObject.name;
						
						if (counter == 1) {
							this.firstObject = someObject;
						}
					}
				}
			}
			
			
			for (var i = 0; i < tabs.length; i++) {
				var tabSpan = tabs[i];

				tabHolder.appendChild(tabSpan);
				if (tabs.length > 1) {
					if (i == 0) {
						var delimiter = this.createDelimiter();
						tabSpan.rightDelimiter = delimiter;
						tabHolder.appendChild(delimiter);
					} else if (i == tabs.length - 1) {
						tabSpan.leftDelimiter = delimiter;
					} else {
						tabSpan.leftDelimiter = delimiter;
						var delimiter = this.createDelimiter();
						tabSpan.rightDelimiter = delimiter;
						tabHolder.appendChild(delimiter);
					}
				}
				//var el = Ext.get(tabSpan.getAttribute("id"));
				//this.tabWidth += el.getWidth();
				this.tabWidth += 50;
			}
	
			if (tabs.length > 0) {
				this.tabWidth += (tabs.length) * 4;
			}
			
			this.tabEnd = document.createElement("li");
			this.tabEnd.innerHTML = "&nbsp;";
			this.tabEnd.setAttribute("id", "tabEnd");
			this.tabEnd.setAttribute("class", "tabEnd");
			
			this.setTabEnd(this.tabEnd);
			tabHolder.appendChild(this.tabEnd);
			
			var tabDivElement = document.getElementById("tabBarDiv"); //Ext.get("tabBarDiv");
		
			tabDivElement.style.cssText = "width: " + this.tabWidth + 30 + ";"; + "margin-left:" + Math.round((this.tabWidth / -2)+98) + "px" + ";" + "left:" + "50%" + ";";
			

		}
	},
	
	createDelimiter : function(){
		var delimiter = document.createElement("li");
		delimiter.setAttribute("class", "tabDelimiter");
		this.setTabDelimiter(delimiter);
		return delimiter;
	},
	
	click: function(className){
		if (className != undefined) {
			if (this.itemElements[className] != undefined) {
				this.highliteItem(className);
				OpenPanel.Controller.action({
					command : "ClickTabBarItem", 
					className : className
				});
			}
		}
	},
	
	nextTab: function() {
		if (this.selectedTabId != "") {
			var index = this.tabIndexes[this.selectedTabId];
			if (index != undefined) {
				if ((index+1) >= this.tabIds.length) return;
				var tabid = this.tabIds[index+1];
				if (tabid != undefined) {
					var elm = this.itemElements[tabid];
					if (elm != undefined) elm.onclick();
				}
			}
		}
	},
	
	previousTab: function() {
		if (this.selectedTabId != "") {
			var index = this.tabIndexes[this.selectedTabId];
			if ((index != undefined)&&(index>0)) {
				if (index >= this.tabIds.length) return;
				var tabid = this.tabIds[index-1];
				if (tabid != undefined) {
					var elm = this.itemElements[tabid];
					if (elm != undefined) elm.onclick();
				}
			}
		}
	},
	
	highliteItem: function(className){
		if(className != undefined && this.itemElements[className]!=undefined){
			this.selectedTabId = className;
			var currentItemElement = this.itemElements[className];
			var virgin = true;
			for(var key in this.itemElements){
				var someItem = this.itemElements[key];
				if (typeof(someItem) == "object") {
					if (virgin == true) {
						virgin = false;
						if (someItem == currentItemElement) {
							this.tabStart.setAttribute("class", "tabStartPushed");
							this.setTabStartSelected(this.tabStart);
						} else {
							this.tabStart.setAttribute("class", "tabStart");
							this.setTabStart(this.tabStart);
						}
					}
					
					if (someItem == currentItemElement) {
						someItem.setAttribute("class", "tabSelected");
						this.setTabSelected(someItem);
					} else {
						someItem.setAttribute("class", "tab");
						this.setTab(someItem);
					}
					
					this.setDelimiterClass(someItem, false);
				}
			}
			
			for(var key in this.itemElements){
				var someItem = this.itemElements[key];
				if(someItem == currentItemElement){
					this.setDelimiterClass(someItem, true);
				}
			}
			if(someItem != undefined){
				if(someItem == currentItemElement){
					// is last
					this.tabEnd.setAttribute("class", "tabEndSelected");
					this.setTabEndSelected(this.tabEnd);
				} else {
					this.tabEnd.setAttribute("class", "tabEnd");
					this.setTabEnd(this.tabEnd);
					
				}
			} 
		}
	},
	
	pushItem: function(className){
		if(className != undefined && this.itemElements[className]!=undefined){
			var currentItemElement = this.itemElements[className];
			var virgin = true;
			for(var key in this.itemElements){
				var someItem = this.itemElements[key];
				if (typeof(someItem) == "object") {
					if (virgin == true) {
						virgin = false;
						if (someItem == currentItemElement) {
							this.tabStart.setAttribute("class", "tabStartPushed");
							this.setTabStartPushed(this.tabStart);
						}
					}
					
					if (someItem == currentItemElement) {
						someItem.setAttribute("class", "tabPushed");
						this.setTabPushed(someItem);
					}
					this.setDelimiterClass(someItem, false);
				}
			}
			
			for(var key in this.itemElements){
				var someItem = this.itemElements[key];
				if(someItem == currentItemElement){
					this.setDelimiterPushed(someItem);
				}
			}
			if(someItem != undefined){
				if(someItem == currentItemElement){
					// is last
					this.tabEnd.setAttribute("class", "tabEndPushed");
					this.setTabEndPushed(this.tabEnd);
				}
			} 
		}
	},
	
	
	disable : function(){
		for(var key in this.itemElements){
			var tabSpan = this.itemElements[key];
			if(typeof(tabSpan) == "object"){
				tabSpan.onclick = {};
				if(tabSpan.getAttribute("class") == "tab"){
					tabSpan.setAttribute("class", "tabDisabled");
					this.setTabDisabled(tabSpan);
				}
				
			}
		}
	},
	
	setDelimiterPushed : function(tabElement){
		if (tabElement.leftDelimiter != undefined){
			tabElement.leftDelimiter.setAttribute("class", "tabDelimiterPushed");
			this.setTabDelimiterPushed(tabElement.leftDelimiter);
		}
		if (tabElement.rightDelimiter != undefined){
			tabElement.rightDelimiter.setAttribute("class", "tabDelimiterPushed");
			this.setTabDelimiterSelected(tabElement.rightDelimiter);
		}
	},
	
	setDelimiterClass : function(tabElement, isSelected){
		if(tabElement.leftDelimiter != undefined)
		{
			if (isSelected==true)
			{
				tabElement.leftDelimiter.setAttribute("class", "tabDelimiterSelected");
				this.setTabDelimiterSelected(tabElement.leftDelimiter);
			}
			else
			{
				tabElement.leftDelimiter.setAttribute("class", "tabDelimiter");
				this.setTabDelimiter(tabElement.leftDelimiter);
			}
		} 
		
		if(tabElement.rightDelimiter != undefined)
		{
			if (isSelected==true)
			{
				tabElement.rightDelimiter.setAttribute("class", "tabDelimiterSelected");
				this.setTabDelimiterSelected(tabElement.rightDelimiter);
			}
			else
			{
				tabElement.rightDelimiter.setAttribute("class", "tabDelimiter");
				this.setTabDelimiter(tabElement.rightDelimiter);
			}
		}
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setTargetDivName : function(targetDivName){
		var targetDiv = document.getElementById(targetDivName);
		if(targetDiv != undefined){
			this.targetDiv = targetDiv;
		} else {
			alert("div does not exist "+ targetDivName);
		}
	},
	
	getFirstTabItem : function(){
		if (this.firstObject != undefined) {
			return this.firstObject;
		}
		for(var i=0;i<this.openCoreObjects.length;i++){
			if(this.openCoreObjects[i].name != undefined){
				return this.openCoreObjects[i];
			}
		}
		
	},
	
	setTab: function(obj) {
		obj.className = "tab";
	},
	
	setTabSelected: function(obj) {
		obj.className = "tabSelected";
	},

	setTabPushed: function(obj) {
		obj.className = "tabPushed";
	},

	setTabDelimiter: function(obj) {
		obj.className = "tabDelimiter";
	},	
	
	setTabDelimiterSelected: function(obj) {
		obj.className = "tabDelimiterSelected";
	},	
	
	setTabDelimiterPushed: function(obj) {
		obj.className = "tabDelimiterPushed";
	},	
	
	setTabStart: function(obj) {
		obj.className = "tabStart";
	},	
	
	setTabStartSelected: function(obj) {
		obj.className = "tabStartSelected";
	},
	
	setTabStartPushed: function(obj) {
		obj.className = "tabStartPushed";
	},
	
	setTabEnd: function(obj) {
		obj.className = "tabEnd";
	},
	
	setTabEndSelected: function(obj){
		obj.className = "tabEndSelected";
	},
	
	setTabEndPushed: function(obj){
		obj.className = "tabEndPushed";
	},
	
	setTabDisabled: function(obj) {
		return this.setTab(obj);
	}
	
	
}

