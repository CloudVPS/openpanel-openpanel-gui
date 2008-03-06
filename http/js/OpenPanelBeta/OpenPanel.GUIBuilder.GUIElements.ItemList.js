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
	
	build : function(){
		
		this.targetDiv.innerHTML = "";
		this.itemListElements = {};
		this.instances = {};
		this.currentInstance = undefined;
		
		if(this.openCoreObject != undefined){
			if (this.openCoreObject.singleton == false) {
				this.instances = this.openCoreObject.getInstances();
				var items = [];
				for (var metaid in this.instances) {
					
					var instance = this.instances[metaid];
					if(this.currentInstance == undefined){
						this.currentInstance = instance;
					}
					if (typeof(instance) == "object") {
						var item = [instance.uuid, this.openCoreObject.name, metaid];
					}
					items.push(item);
				}
				
		
				
				
				this.gridDiv = document.createElement("div");
				this.gridDiv.setAttribute("id", "itemListGrid");
				this.targetDiv.appendChild(this.gridDiv);
				
				
				this.buttonsDiv = document.createElement("div");
				this.buttonsDiv.setAttribute("id", "itemListButtons");
				this.targetDiv.appendChild(this.buttonsDiv);
				
				this.renderGrid(this.gridDiv, items);
				this.renderButtons(this.buttonsDiv);
				
				
			} else {
				this.targetDiv.appendChild(document.createTextNode("fancy picture"));
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
			command : "showCreateInstanceFromItemList", 
			openCoreObject : this.openCoreObject,
			formObjectHolder : this.formObjectHolder
		});
		this.renderButtons();
	},
	
	deleteInstance : function(){
		OpenPanel.Controller.action({
			command : "deleteInstance", 
			openCoreObject : this.openCoreObject, 
			instance : this.currentInstance
		});
	},
	
	
	click: function(uuid){
		
		if (uuid != undefined) {
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
	
	renderGrid: function(targetDiv, data){
		// create the data store
	    var store = new Ext.data.SimpleStore({
	        fields: [
	           {name: 'uuid'},
	           {name: 'className'},
			   {name: 'id'},
	          
	        ]
	    });
    	store.loadData(data);
		
		// create the Grid
	    this.grid = new Ext.grid.GridPanel({
	        store: store,
	        columns: [
	            {id:'uuid',header: "Uuid", width: 0, sortable: true, dataIndex: 'uuid', hidden: true, hideable:false, fixed: true},
	            {header: "id", width: 190, sortable: true, dataIndex: 'id', hideable:false},
	            {header: "className", width: 0, sortable: true, dataIndex: 'className', hidden: true, hideable:false}
			],
	        stripeRows: false,
	        autoExpandColumn: 'uuid',
	        height:372,
	        width:200,
	        title:'Array Grid',
			header: false
			
	    });
		
   	 	this.grid.render(targetDiv);

    	this.grid.getSelectionModel().selectFirstRow();
		var hook = this;
		this.grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
	        hook.cellClick(this.grid, rowIndex, columnIndex, e);
		
	    }); 
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

