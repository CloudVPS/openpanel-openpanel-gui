/**
 * @author jp
 */
OpenPanel.GUIBuilder.GUIElements.IconBar = {
	
	targetDiv : {},
	openCoreObject : {},
	itemElements: {},
	controller: {},
	iconBarTitleElement : {},
	itemIds: {},
	itemIndexes: {},
	selectedItemId: "",
	
	build : function(){
		this.targetDiv.update("");
		this.itemElements = {};
		if(this.openCoreObject != undefined){
			
			var iconBarDiv = new Element("div").addClassName("iconBarDiv");
			var iconHolderTable = new Element("table").writeAttribute("cellpadding", 0).writeAttribute("cellspacing", 0).setStyle("margin-left: 3px;");
			iconBarDiv.appendChild(iconHolderTable);
			
			var iconHolderTBody = new Element("tbody");
			iconHolderTable.appendChild(iconHolderTBody);
			
			var iconHolder = new Element("tr").addClassName("iconHolder");
			this.targetDiv.appendChild(iconBarDiv);
			iconHolderTBody.appendChild(iconHolder);
			
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
			sortedChildren["welcome"] = {
					description: "Welcome",
					classInfo: {
						"class": {
							uuid: "crow"
						}
					},
					title : "Welcome",
					name : "Welcome",
					imageSource : "/images/icons/crow.png",
					onclick : function()
					{
						hook.selectedItemId = "Welcome";
						hook.controller.action({command: "Welcome"});
					}
			};
			for(var i = 0;i<sortIndexesToSort.length;i++){
				var childObjects = sortIndexes[sortIndexesToSort[i]];
				for(var j=0;j<childObjects.length;j++){
					sortedChildren[childObjects[j].name] = childObjects[j];
				}
			}
			
			var hook = this;
			var xcounter = 0;
			
			for(var key in sortedChildren){
				var childObject = sortedChildren[key];
				if (typeof(childObject) == "object") {
					if (key != "spacer") {
						var iconLi = new Element("td").writeAttribute("id", childObject.uuid).writeAttribute("valign", "top");
						iconHolder.appendChild(iconLi);
						
						var tableElement = new Element("table").writeAttribute("cellpadding", "0").writeAttribute("cellspacing", "0").addClassName("iconTable");
						iconLi.appendChild(tableElement);
						
						var tbodyElement = new Element("tbody");
						tableElement.appendChild(tbodyElement);
						
						var trElement = new Element("tr");
						tbodyElement.appendChild(trElement);
						
						var iconTdLeft = new Element("td").addClassName("iconTdLeft").update("&nbsp;");
						trElement.appendChild(iconTdLeft);
						
						var tdMain = new Element("td").writeAttribute("id", "iconTdMain").writeAttribute("valign", "top").addClassName("iconTdMain");
						trElement.appendChild(tdMain);
						
						var cl = new Element("div").addClassName("classIcon");
						
						var iconName = "";
						var imageUrl = "";
						var imageDownUrl = "";
						if(childObject.imageSource!=undefined){
							imageUrl = childObject.imageSource;
							if(childObject.imageDownSource!=undefined){
								imageDownUrl = childObject.imageDownSource;
							} else {
								imageDownUrl = "";
							}
						} else {
							var iconName = "" + childObject.classInfo["class"].uuid + ".png";
							imageUrl = "/dynamic/icons/"+ iconName;
							imageDownUrl = "/dynamic/icons/down/"+ iconName;
						}
						
						var iconImage = new Element("img").writeAttribute("id", "icon." + iconName).writeAttribute("src", imageUrl);
						cl.appendChild(iconImage);
						iconLi.iconImage = iconImage;
						iconLi.imageUrl = imageUrl;
						iconLi.imageDownUrl = imageDownUrl;
						
						iconLi.onmousedown = function() {
							if(this.imageUrl!="" && this.imageDownUrl!=""){
								this.iconImage.writeAttribute("src", this.imageDownUrl);
							}
						}
						iconLi.onmouseup = function() {
							if(this.imageUrl!="" && this.imageDownUrl!=""){
								this.iconImage.writeAttribute("src", this.imageUrl);
							}
						}
						tdMain.appendChild(cl);
						
						var cD = new Element("div").addClassName("classDescription").update(childObject.title);
						tdMain.appendChild(cD);

						var iconTdRight = new Element("td").addClassName("iconTdRight").update("&nbsp;");
						trElement.appendChild(iconTdRight);
						
						if (childObject.onclick == undefined) {
							iconLi.childObject = childObject;
							iconLi.onclick = function(){
								OpenPanel.GUIBuilder.GUIElements.IconBar.click(this.childObject);
							}
						} else {
							iconLi.onclick = childObject.onclick;
						}
						
						this.itemIndexes[childObject.name] = xcounter;
						this.itemIds[xcounter++] = childObject.name;
						this.itemElements[childObject.name] = iconLi;
					} else {
						var iconLi = new Element("td").writeAttribute("width", "100%");
						iconHolder.appendChild(iconLi);
					}
				}
			}
		} else {
			alert("OpenPanel.GUIBuilder.GUIElements.IconBar.build(openCoreObject) : openCoreObject is undefined");
		}
	},
	

	update: function(openCoreObject){
		this.highliteItem(openCoreObject.name);
		this.setTitle(openCoreObject.title);
	},
	
	setTitle : function(title){
		$("iconBarTitle").update(title);
	},
	
	click: function(childObject){
		this.setTitle(childObject.title);
		if (childObject.name != undefined) {
			if (this.itemElements[childObject.name] != undefined) {
				var currentItemElement = this.itemElements[childObject.name];
				this.highliteItem(childObject.name);
				this.controller.action({
					command : "ClickIconBarItem", 
					className : childObject.name
				});
			}
		}
	},
	
	nextItem: function() {
		if (this.selectedItemId != "") {
			var index = this.itemIndexes[this.selectedItemId];
			if (index != undefined) {
				if ((index+1) >= this.itemIds.length) return;
				var itemid = this.itemIds[index+1];
				if (itemid != undefined) {
					var elm = this.itemElements[itemid];
					if (elm != undefined) elm.onclick();
				}
			}
		}
	},
	
	previousItem: function() {
		if (this.selectedItemId != "") {
			var index = this.itemIndexes[this.selectedItemId];
			if ((index != undefined)&&(index>0)) {
				if (index >= this.itemIds.length) return;
				var itemid = this.itemIds[index-1];
				if (itemid != undefined) {
					var elm = this.itemElements[itemid];
					if (elm != undefined) elm.onclick();
				}
			}
		}
	},

	highliteItem: function(className){
		if(className != undefined && this.itemElements[className]!=undefined){
			var currentItemElement = this.itemElements[className];
			this.selectedItemId = className;
				
			for(var key in this.itemElements){
				if(this.itemElements[key] == currentItemElement){
					this.itemElements[key].addClassName("selected");
				} else {
					this.itemElements[key].removeClassName("selected");
				}
			}
		}
	},
		
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setTargetDivName : function(targetDivName){
		var targetDiv = $(targetDivName);
		if(targetDiv != undefined){
			this.targetDiv = targetDiv;
		} else {
			alert("div does not exist "+ targetDivName);
		}
	}
}
