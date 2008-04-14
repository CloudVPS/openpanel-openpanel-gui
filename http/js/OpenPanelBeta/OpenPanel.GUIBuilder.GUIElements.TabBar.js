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
					STYLES.tab.tab(tabSpan);
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
			
			STYLES.tab.tabEnd(this.tabEnd);
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
		STYLES.tab.tabDelimiter(delimiter);
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
							STYLES.tab.tabStartSelected(this.tabStart);
						} else {
							this.tabStart.setAttribute("class", "tabStart");
							STYLES.tab.tabStart(this.tabStart);
						}
					}
					
					if (someItem == currentItemElement) {
						someItem.setAttribute("class", "tabSelected");
						STYLES.tab.tabSelected(someItem);
					} else {
						someItem.setAttribute("class", "tab");
						STYLES.tab.tab(someItem);
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
					STYLES.tab.tabEndSelected(this.tabEnd);
				} else {
					this.tabEnd.setAttribute("class", "tabEnd");
					STYLES.tab.tabEnd(this.tabEnd);
					
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
					STYLES.tab.tabDisabled(this.tabSpan);
				}
				
			}
		}
	},
	
	setDelimiterClass : function(tabElement, isSelected){
		if(tabElement.leftDelimiter != undefined)
		{
			if (isSelected==true)
			{
				tabElement.leftDelimiter.setAttribute("class", "tabDelimiterSelected");
				STYLES.tab.tabDelimiterSelected(tabElement.leftDelimiter);
			}
			else
			{
				tabElement.leftDelimiter.setAttribute("class", "tabDelimiter");
				STYLES.tab.tabDelimiter(tabElement.leftDelimiter);
			}
		} 
		
		if(tabElement.rightDelimiter != undefined)
		{
			if (isSelected==true)
			{
				tabElement.rightDelimiter.setAttribute("class", "tabDelimiterSelected");
				STYLES.tab.tabDelimiterSelected(tabElement.rightDelimiter);
			}
			else
			{
				tabElement.rightDelimiter.setAttribute("class", "tabDelimiter");
				STYLES.tab.tabDelimiter(tabElement.rightDelimiter);
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
		
		for(var i=0;i<this.openCoreObjects.length;i++){
			if(this.openCoreObjects[i].name != undefined){
				return this.openCoreObjects[i];
			}
		}
		
	}
	
	
}

