/**
 * @author jp
 */
OpenPanel.GUIBuilder.GUIElements.ItemList = {
	
	targetDiv : {},
	openCoreObject : {},
	itemListElements: {},
	instances : {},
	grid: {},
	popUpDiv: {},
	gridDiv : {},
	buttonsDiv : {},
	guiBuilder: {},
	formObject : {},
	currentInstance : {},
	controller : {},
	userObject : {},
	
	build : function(){
		
		this.targetDiv.innerHTML = "";
		this.itemListElements = {};
		this.instances = {};
		this.currentInstance = undefined;
		this.userObject = OpenCore.DataManager.getOpenCoreObjectByName("User");
		this.userObject.getInstances();
		
		if(this.openCoreObject != undefined){
			if (this.openCoreObject.singleton == false) {
				this.instances = this.openCoreObject.getInstances();
				var items = {};
				for (var metaid in this.instances) {
					var instance = this.instances[metaid];
					if(this.currentInstance == undefined){
						this.currentInstance = instance;
					}
					if (typeof(instance) == "object") {
						var userInstance = this.userObject.getInstanceByUUID(instance.ownerid);
						var ownerName = userInstance!=undefined?userInstance.name_customer:"";
						//var item = [instance.uuid, this.openCoreObject.name, metaid, ownerName];
						var item = {
							id: metaid,
							name: this.openCoreObject.name,
							metaid: metaid,
							owner: ownerName,
							uuid: instance.uuid
						};
					}
					items[metaid] = item;
				}
				
				this.gridDiv = document.createElement("div");
				this.gridDiv.setAttribute("id", "itemListGrid");
				this.targetDiv.appendChild(this.gridDiv);
				
				
				this.buttonsDiv = document.createElement("div");
				this.buttonsDiv.setAttribute("id", "itemListButtons");
				this.targetDiv.appendChild(this.buttonsDiv);
				
				this.renderG(this.gridDiv, items);
				this.renderButtons(this.buttonsDiv);
				if(this.currentInstance != undefined){
					this.highliteItem(this.currentInstance.uuid);
				}
				
			} else {
				this.targetDiv.innerHTML = "<center><img src=\"/images/emblems/"+this.openCoreObject.uuid+".png\"/></center>";
			}
		} else {
			alert("OpenPanel.GUIBuilder.GUIElements.ItemList.build(openCoreObject) : openCoreObject is undefined");
		}
	},
	
	renderButtons : function(targetDiv){
	
		if (targetDiv!=undefined && targetDiv.parentNode != undefined) {
			targetDiv.innerHTML = "";
			
			var addDeleteButtonHolder = document.createElement("div");
			addDeleteButtonHolder.setAttribute("class", "addDeleteButtonHolder");
			targetDiv.appendChild(addDeleteButtonHolder);
			
			if (this.openCoreObject.meta == true) {
			
			} else {
				var createButton = document.createElement("div");
				addDeleteButtonHolder.appendChild(createButton);
				if (this.controller.dataManager.checkQuotum(this.openCoreObject.name) == true && this.openCoreObject.canCreate == true) {
					
					// create create button
					createButton.setAttribute("class", "addButton");
					var hook = this;
					createButton.onclick = function(){
						hook.createInstance();
					}
				} else {
					createButton.setAttribute("class", "addButtonDisabled");
				}
				
				var deleteButton = document.createElement("div");
				addDeleteButtonHolder.appendChild(deleteButton);
				var l = 0;
				for (var key in this.instances) {
					l = 1;
					break;
				}
				if (this.controller.dataManager.checkQuotum(this.openCoreObject.name) == true && this.openCoreObject.canDelete == true && l==1) {
					
					// create delete button
					deleteButton.setAttribute("class", "deleteButton");
					var hook = this;
					deleteButton.onclick = function(){
						hook.deleteInstance();
					}
				} else {
					deleteButton.setAttribute("class", "deleteButtonDisabled");
				}
				
				/* 
				var quotum = this.controller.dataManager.getQuotumByClassName(this.openCoreObject.name);
				if (quotum != undefined) {
					var q = document.createElement("ul");
					targetDiv.appendChild(q);
					var li = document.createElement("li");
					li.appendChild(document.createTextNode(">>quotum : " + this.openCoreObject.name + " " + quotum.quota));
					q.appendChild(li);
				}
				*/
			}
		}
	},
	
	createInstance : function(){
		this.controller.action({
			command : "ShowCreateInstanceFromItemList", 
			openCoreObject : this.openCoreObject,
			formObjectHolder : this.formObjectHolder
		});
		this.renderButtons();
	},
	
	deleteInstance : function(){
		OpenPanel.Controller.action({
			command : "DeleteInstance", 
			openCoreObject : this.openCoreObject, 
			instance : this.currentInstance
		});
	},
	
	
	click: function(metaid, instance){
		if (metaid!=undefined && instance != undefined) {
			var uuid = instance.uuid;
			var instance = this.openCoreObject.getInstanceByUUID(uuid);
			
			this.currentInstance = instance;
			for(var key in this.instances){
				if(this.instances[key].uuid == uuid){
					OpenPanel.Controller.action({
						command : "ClickItemListItem", 
						className : this.openCoreObject.name,
						instanceUUID : uuid
					});
					this.highliteItem(uuid);
					break;
				}
			}
		}
	},
	
	highliteItem: function(uuid){
		this.renderButtons(this.buttonsDiv);
		if(this.currentInstance != undefined){
			this.grid.setSelection(this.currentInstance.id);
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
	
	renderG : function(targetDiv, instances){
		this.grid = new OpenPanel.GUIBuilder.GUIElements.Grid();
		var parameters = this.openCoreObject.getClassInfo().structure.parameters;
		var createObject = {};
		for(var key in parameters){
			var parameter = parameters[key];
			if (key == "id") {
				createObject[key] = new Array(key, parameter.gridwidth != undefined ? parameter.gridwidth : 10);
			}
		}
		var data = {};
		for(var key in instances){
			var instance = instances[key];
			if(key =="id"){
				data[key] = {id: instance.id};
			}
		}
      	
		this.grid.create (this.gridDiv,createObject, 180, 0, 122, 90, -432);
      	this.grid.setGrid (instances);
		var hook = this;
		this.grid.onclick = function(metaid, fields){
			hook.click(metaid, fields);
		}
	},
	
	cellClick : function(grid, rowIndex, columnIndex, e) {
        var record = this.grid.getStore().getAt(rowIndex);  // Get the Record
        var fieldName = this.grid.getColumnModel().getDataIndex(columnIndex); // Get field name
        var data = record.get("uuid");
		this.click(data);
	},
	
	setGuiBuilder : function(guiBuilder){
		this.guiBuilder = guiBuilder;
	},
	
	setFormObject : function(formObject){
		this.formObject = formObject;
	}, 
	
	setController : function(controller){
		this.controller = controller;
	}
}

