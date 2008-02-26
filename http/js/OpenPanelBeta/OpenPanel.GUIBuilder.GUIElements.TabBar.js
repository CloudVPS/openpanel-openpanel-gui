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
	tabWidth : 0,
	
	build : function(){
		this.tabWidth = 0;
		this.targetDiv.innerHTML = "";
		
		
		this.itemElements = {};
		
		if (this.openCoreObject != undefined && this.openCoreObject.childCount > 0) {
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
			
			if (this.openCoreObject.canUpdate == true && this.openCoreObject.classInfo["class"].metabase == "") {
				this.openCoreObjects.push(this.openCoreObject);
			//this.itemElements[this.openCoreObject.name] = this.openCoreObject;
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
			
			
			
			for (var key in sortedChildren) {
				var someObject = sortedChildren[key];
				if (someObject.metaType != "derived") {
					var tabSpan = document.createElement("li");
					tabSpan.setAttribute("id", someObject.uuid);
					tabSpan.setAttribute("OC:Class", someObject.name);
					tabSpan.appendChild(document.createTextNode(someObject.title));
					tabs.push(tabSpan);
					tabSpan.onclick = function(){
						OpenPanel.GUIBuilder.GUIElements.TabBar.click(this.getAttribute("OC:Class"))
					}
					
					this.itemElements[someObject.name] = tabSpan;
					tabSpan.setAttribute("class", "tab");
				}
			}
			
			
			
			for (var i = 0; i < tabs.length; i++) {
				var tabSpan = tabs[i];
				tabHolder.appendChild(tabSpan);
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
				
				var el = Ext.get(tabSpan.getAttribute("id"));
				this.tabWidth += el.getWidth();
			}
			
			
			if (tabs.length > 0) {
				this.tabWidth += (tabs.length - 1) * 16 + 30;
			}
			this.tabEnd = document.createElement("li");
			this.tabEnd.innerHTML = "&nbsp;";
			this.tabEnd.setAttribute("id", "tabEnd");
			this.tabEnd.setAttribute("class", "tabEnd");
			tabHolder.appendChild(this.tabEnd);
			
			var tabDivElement = Ext.get("tabBarDiv");
			tabDivElement.setWidth(this.tabWidth);
			tabDivElement.setStyle("marginLeft", Math.round(this.tabWidth / -2) + "px");
			tabDivElement.setStyle("left", "50%");
			
		}
	},
	
	createDelimiter : function(){
		var delimiter = document.createElement("li");
		
		delimiter.setAttribute("class", "tabDelimiter");
		
		return delimiter;
	},
	
	click: function(className){
		if (className != undefined) {
			if (this.itemElements[className] != undefined) {
				this.highliteItem(className);
				OpenPanel.Controller.action({
					command : "clickTabBarItem", 
					className : className
				});
			}
		}
	},
	
	highliteItem: function(className){
		if(className != undefined && this.itemElements[className]!=undefined){
			var currentItemElement = this.itemElements[className];
			var virgin = true;
			for(var key in this.itemElements){
				var someItem = this.itemElements[key];
				if (typeof(someItem) == "object") {
					if (virgin == true) {
						virgin = false;
						if (someItem == currentItemElement) {
							this.tabStart.setAttribute("class", "tabStartSelected");
						} else {
							this.tabStart.setAttribute("class", "tabStart");
						}
					}
					
					if (someItem == currentItemElement) {
						console.log(someItem);
						someItem.setAttribute("class", "tabSelected");
						
					} else {
						someItem.setAttribute("class", "tab");
						
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
				} else {
					this.tabEnd.setAttribute("class", "tabEnd");
					
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
				}
				
			}
		}
	},
	
	setDelimiterClass : function(tabElement, isSelected){
		console.log("tabElement");
		console.log(tabElement);
		if(tabElement.leftDelimiter != undefined){
			tabElement.leftDelimiter.setAttribute("class", isSelected==true?"tabDelimiterSelected":"tabDelimiter");
		} 
		if(tabElement.rightDelimiter != undefined){
			tabElement.rightDelimiter.setAttribute("class", isSelected==true?"tabDelimiterSelected":"tabDelimiter");
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
		if(this.openCoreObjects[0] != undefined){
			return this.openCoreObjects[0];
		}
	}
	
	
}

