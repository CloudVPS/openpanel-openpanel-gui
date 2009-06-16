OpenPanel.GUIBuilder.GUIElements.FormGrid = function(){
	
	this.targetDiv = {};
	this.formObject = {};
	this.instances = {};
	this.openCoreObject = {};
	this.instance = {};
	this.controller= {};
	this.callBackCommand = "";
	this.store = {};
	this.gridWidth = 610;
}

OpenPanel.GUIBuilder.GUIElements.FormGrid.prototype = {
		
	build : function(){
		if(this.targetDiv!=undefined){
			this.targetDiv.innerHTML = "";
			
			this.gridDiv = document.createElement("div");
			this.gridDiv.setAttribute("class", "grid");
			this.targetDiv.appendChild(this.gridDiv);
			if (this.openCoreObject.meta == true) {
				var hook = this;
				this.createG(this.instances);
				if(this.instance.uuid != undefined){
					var uuid = this.instance.uuid;
					for(var key in this.instances){
						var instance = this.instances[key];
						if(instance.uuid == this.instance.uuid){
							this.grid.setSelection(key);
						}
					}
					// does this work?
				}
				
				this.grid.onclick = function(id,values){
		      		hook.clickGridItem(id);
		      	}
			} else {
				var hook = this;
				this.createG(this.instances);
				if(this.instance.uuid != undefined){
					var uuid = this.instance.uuid;
					for(var key in this.instances){
						var instance = this.instances[key];
						if(instance.uuid == this.instance.uuid){
							this.grid.setSelection(key);
						}
					}
					// does this work?
				}
				
				this.grid.onclick = function(id,values){
		      		hook.clickGridItem(id);
		      	}
			}
		}
	},
	
	createG : function(instances){
		var parameters = this.openCoreObject.getClassInfo().structure.parameters;
		var createObject = {};
		var classInfo = this.openCoreObject.getClassInfo();

		for(var key in parameters){
			var parameter = parameters[key];
			if (!(key=="id" && classInfo["class"].indexing=="auto") && parameter.gridhide!=true) {
				createObject[key] = new Array(key, parameter.gridwidth != undefined ? parameter.gridwidth : 10);
			}
		}
		this.grid = new OpenPanel.GUIBuilder.GUIElements.Grid();
		this.grid.create(this.gridDiv,createObject,600, classInfo["class"].gridheight);
      	this.grid.setGrid (instances);
		this.grid.render = function(){ }
	},
	
	createMG : function(instances){
		this.createG(instances);
	},
	
	clickGridItem : function(id){
		this.formObject.clickGridItem(this.instances[id]);
	},
	
	setInstances : function(instances){
		this.instances = instances;	
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setInstance: function(instance){
		this.instance = instance;
	},
	
	setTargetDivName : function(targetDivName){
		var targetDiv = document.getElementById(targetDivName);
		this.setTargetDiv(targetDiv);
	},
	
	setTargetDiv: function(targetDiv){
		if(targetDiv != undefined){
			this.targetDiv = targetDiv;
		} else {
			alert("div does not exist "+ targetDivName);
		}
	},
	
	setFormObject: function(formObject){
		this.formObject = formObject;
	},
	
	setController : function(controller){
		this.controller = controller;
	},
	
	setCallBackCommand : function(callBackCommand, optionalCallBackObject){
		this.callBackCommand = callBackCommand;
		this.optionalCallBackObject = optionalCallBackObject;
	}
	
}
