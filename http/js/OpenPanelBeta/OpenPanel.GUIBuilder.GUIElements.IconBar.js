/**
 * @author jp
 */
OpenPanel.GUIBuilder.GUIElements.IconBar = {
	
	targetDiv : {},
	openCoreObject : {},
	itemElements: {},
	controller: {},
	iconBarTitleElement : {},
	
	build : function(){
		this.targetDiv.innerHTML = "";
		this.itemElements = {};
		if(this.openCoreObject != undefined){
			var iconBarDiv = document.createElement("div");
			iconBarDiv.setAttribute("class", "iconBarDiv");
			
			this.iconBarTitleElement = document.createElement("div");
			this.iconBarTitleElement.setAttribute("class", "iconBarTitle");
			this.iconBarTitleElement.appendChild(document.createTextNode(""));
			iconBarDiv.appendChild(this.iconBarTitleElement);
			
			var iconHolder = document.createElement("ul");
			iconHolder.setAttribute("class", "iconHolder");
			this.targetDiv.appendChild(iconBarDiv);
			iconBarDiv.appendChild(iconHolder);
			
			
			var sortIndexes = {};
			var sortIndexesToSort = [];
			
			for(var key in this.openCoreObject.children){
				var childObject = this.openCoreObject.children[key];
				if (typeof(childObject) == "object") {
					var sortIndex = childObject.classInfo["class"].sortindex;
					if (sortIndexes[sortIndex] == undefined) {
						sortIndexes[sortIndex] = [];
					}
					
					sortIndexes[sortIndex].push(childObject);
					sortIndexesToSort.push(sortIndex);
				}
			}
			sortIndexesToSort.sort(function(a,b){return a-b;});
						
			
			var sortedChildren = {};
			
			for(var i = 0;i<sortIndexesToSort.length;i++){
				var childObjects = sortIndexes[sortIndexesToSort[i]];
				for(var j=0;j<childObjects.length;j++){
					sortedChildren[childObjects[j].name] = childObjects[j];
				}
			}
			
			// add exit button
			var hook = this;
			
			sortedChildren["exit"] = {
					description: "Exit",
					classInfo: {
						"class": {
							uuid: "exit"
						}
					},
					title : "Exit",
					name : "name",
					onclick : function()
					{
						hook.controller.action({command: "Logout"});
					}
					
			};
			
			
			for(var key in sortedChildren){
				var childObject = sortedChildren[key];
				if (typeof(childObject) == "object") {
					var iconLi = document.createElement("li");
					iconLi.setAttribute("id", childObject.description);
					iconLi.setAttribute("OC:Class", childObject.name);
					
					var iconDivLeft = document.createElement("div");
					iconDivLeft.setAttribute("class", "iconDivLeft");
					iconDivLeft.innerHTML = "&nbsp;";
					iconLi.appendChild(iconDivLeft);
					
					var iconDivMain = document.createElement("span");
					iconDivMain.setAttribute("class", "iconDivMain");
					iconLi.appendChild(iconDivMain);
					
					var classIcon = document.createElement("div");
					classIcon.setAttribute("class", "classIcon");
					
					classIcon.innerHTML = "<img src=\"/images/icons/"+ childObject.classInfo["class"].uuid +".png\"/>";
					iconDivMain.appendChild(classIcon);
					var classDescription = document.createElement("div");
					classDescription.setAttribute("class", "classDescription");
					classDescription.setAttribute("id", "c" + childObject.uuid);
					iconDivMain.appendChild(classDescription);
					var title = childObject.title;
					
					classDescription.appendChild(document.createTextNode(title));
					
					var iconDivRight = document.createElement("div");
					iconDivRight.setAttribute("class", "iconDivRight");
					iconLi.appendChild(iconDivRight);
					
					iconHolder.appendChild(iconLi);
					
					if(childObject.onclick == undefined){
						iconLi.onclick = function(){
							OpenPanel.GUIBuilder.GUIElements.IconBar.click(this.getAttribute("OC:Class"))
						}
					} else {
						iconLi.onclick = childObject.onclick;
					}
					
					
					this.itemElements[childObject.name] = iconLi;
					
					var someWidth = Ext.get("c" + childObject.uuid).getWidth();
					someWidth = someWidth<40?40:someWidth;
						
					// this is ugly and it stinks.
					classIcon.style.width = someWidth + "px";
					classDescription.style.width = someWidth + "px";
					
				}
			}
			
			
		} else {
			alert("OpenPanel.GUIBuilder.GUIElements.IconBar.build(openCoreObject) : openCoreObject is undefined");
		}
	},
	
	setTitle : function(className){
		if (className != undefined && this.itemElements[className] != undefined) {
			var currentItemElement = this.itemElements[className];
			this.iconBarTitleElement.innerHTML = this.controller.dataManager.getOpenCoreObjectByName(className).title;
		}
	},
	
	click: function(className){
		this.setTitle(className);
		if (className != undefined) {
			if (this.itemElements[className] != undefined) {
				var currentItemElement = this.itemElements[className];
				this.highliteItem(className);
				this.controller.action({
					command : "ClickIconBarItem", 
					className : className
				});
			}
		}
	},
	
	highliteItem: function(className){
		if(className != undefined && this.itemElements[className]!=undefined){
			var currentItemElement = this.itemElements[className];
				
			for(var key in this.itemElements){
				if(this.itemElements[key] == currentItemElement){
					this.itemElements[key].setAttribute("class", "selected")
				} else {
					this.itemElements[key].setAttribute("class", "");
				}
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
	}
	
}

