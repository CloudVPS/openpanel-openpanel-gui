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
			
			var iconHolderTable = document.createElement("table");
			iconHolderTable.setAttribute("cellpadding", "0");
			iconHolderTable.setAttribute("cellspacing", "0");
			iconHolderTable.style.cssText="margin-left: 3px;";
			
			iconBarDiv.appendChild(iconHolderTable);
			var iconHolderTBody = document.createElement("tbody");
			iconHolderTable.appendChild(iconHolderTBody);
			
			var iconHolder = document.createElement("tr");
			iconHolder.setAttribute("class", "iconHolder");
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
					onclick : function()
					{
						hook.controller.action({command: "Welcome"});
					}
			};
			for(var i = 0;i<sortIndexesToSort.length;i++){
				var childObjects = sortIndexes[sortIndexesToSort[i]];
				for(var j=0;j<childObjects.length;j++){
					sortedChildren[childObjects[j].name] = childObjects[j];
				}
			}
			
			// add exit button
			var hook = this;
			/*
			sortedChildren["spacer"] = { };
			
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
			*/
			
			for(var key in sortedChildren){
				var childObject = sortedChildren[key];
				if (typeof(childObject) == "object") {
					if (key != "spacer") {
						var iconLi = document.createElement("td");
						iconHolder.appendChild(iconLi);
						iconLi.setAttribute("id", childObject.description);
						iconLi.setAttribute("valign", "top");
						
						var tableElement = document.createElement("table");
						tableElement.setAttribute("cellpadding", "0");
						tableElement.setAttribute("cellspacing", "0");
						tableElement.setAttribute("class", "iconTable");						
						iconLi.appendChild(tableElement);
						
						var tbodyElement = document.createElement("tbody");
						tableElement.appendChild(tbodyElement);
						
						var trElement = document.createElement("tr");
						tbodyElement.appendChild(trElement);
						
						var iconTdLeft = document.createElement("td");
						iconTdLeft.id = "iconTdLeft";
						iconTdLeft.setAttribute("class", "iconTdLeft");
						iconTdLeft.innerHTML = "&nbsp;";
						trElement.appendChild(iconTdLeft);
						
						var tdMain = document.createElement("td");
						tdMain.id = "iconTdMain";
						tdMain.setAttribute("class", "iconTdMain");
						tdMain.setAttribute("valign", "top");
						trElement.appendChild(tdMain);
						
						var cl = document.createElement("DIV");
						cl.id = 'iconbarIcon';
						cl.setAttribute("class", "classIcon");
						cl.innerHTML = "<img src=\"/images/icons/"+ iconName + "\"/><br\>";
						cl.onmousedown = function() {
							var iconName = "" + childObject.classInfo["class"].uuid + ".png";
							this.innerHTML = "<img src=\"/images/icons/down/" + iconName + "\"/><br\>";
						}
						cl.onmouseup = function() {
							var iconName = "" + childObject.classInfo["class"].uuid + ".png";
							this.innerHTML = "<img src=\"/images/icons/"+ iconName + "\"/><br\>";
						}
						tdMain.appendChild(cl);
						
						var cD = document.createElement("DIV");
						cD.id = 'iconbarText';
						cD.setAttribute("class", "classDescription");
						cD.innerHTML = childObject.title;
						tdMain.appendChild(cD);

						/*
						
						var centreTable = document.createElement("table");
						centreTable.setAttribute("cellpadding", "0");
						centreTable.setAttribute("cellspacing", "0");
						
						tdMain.appendChild(centreTable);
						var centreTbody = document.createElement("tbody");
						centreTable.appendChild(centreTbody);
						var centreTr = document.createElement("tr");
						centreTbody.appendChild(centreTr);
						var centreTrBottom = document.createElement("tr");
						centreTbody.appendChild(centreTrBottom);
						
						var classIcon = document.createElement("td");
						
						classIcon.setAttribute("class", "classIcon");
						classIcon.setAttribute("align", "Center");
						var imgElement = document.createElement("img");
						imgElement.setAttribute("src", "/images/icons/" + childObject.classInfo["class"].uuid + ".png");
						classIcon.innerHTML = "<img src=\"/images/icons/" + childObject.classInfo["class"].uuid + ".png\"/>";
						centreTr.appendChild(classIcon);
						
						var classDescription = document.createElement("td");
						classDescription.setAttribute("class", "classDescription");
						classDescription.setAttribute("valign", "top");
						
						//classDescription.setAttribute("noWrap", "TRUE");
						//classDescription.setAttribute("align", "Center");
						centreTrBottom.appendChild(classDescription);
						
						
						var title = childObject.title;
						classDescription.appendChild(
							document.createTextNode(title)
						);
						*/
						
						var iconTdRight = document.createElement("td");
						iconTdRight.id = "iconTdRight";
						iconTdRight.setAttribute("class", "iconTdRight");
						iconTdRight.innerHTML = "&nbsp;";
						trElement.appendChild(iconTdRight);
						
						if (childObject.onclick == undefined) {
							iconLi.childObject = childObject;
							iconLi.onclick = function(){
								OpenPanel.GUIBuilder.GUIElements.IconBar.click(this.childObject);
							}
						} else {
							iconLi.onclick = childObject.onclick;
						}
						
						this.itemElements[childObject.name] = iconLi;
					} else {
						var iconLi = document.createElement("td");
						iconLi.setAttribute("width", "100%");
						iconHolder.appendChild(iconLi);
					}
				}
			}
			
		} else {
			alert("OpenPanel.GUIBuilder.GUIElements.IconBar.build(openCoreObject) : openCoreObject is undefined");
		}
	},
	
	setTitle : function(title){
		document.getElementById("iconBarTitle").innerHTML = title;
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
	
	highliteItem: function(className){
		if(className != undefined && this.itemElements[className]!=undefined){
			var currentItemElement = this.itemElements[className];
				
			for(var key in this.itemElements){
				if(this.itemElements[key] == currentItemElement){
					this.itemElements[key].setAttribute("class", "selected")
					this.setHighLite(this.itemElements[key],'high');
				} else {
					this.itemElements[key].setAttribute("class", "");
					this.setHighLite(this.itemElements[key],'low');
				}
			}
		}
	},
	
	
	setHighLite: function(obj, state) {
		if (typeof(obj) == "object") {
			var someElement = document.getElementById(obj.id);
			tdElement = someElement.getElementsByTagName("TD");
			
			for (var x in tdElement) {
				if (x == "iconTdLeft") {
					if (state == "high") {
						tdElement[x].style.backgroundImage = "url(/images/gui/iconBarSelectedLeft.gif)";
					} else {
						tdElement[x].style.background = "none";
					}
				} else if (x == "iconTdRight") {
					if (state == "high") {
						tdElement[x].style.backgroundImage = "url(/images/gui/iconBarSelectedRight.gif)";
					} else {
						tdElement[x].style.background = "none";
					}
				} else if (x == "iconTdMain") {
					if (state == "high") {
						tdElement[x].style.backgroundImage = "url(/images/gui/iconBarSelectedMiddle.gif)";
					} else {
						tdElement[x].style.background = "none";
					}
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
