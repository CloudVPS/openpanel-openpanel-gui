OpenPanel.GUIBuilder.GUIElements.FormFields = function(){
	
	this.targetDiv = {};
	this.formObject = {};
	this.instance = undefined;
	this.fieldsDiv = {};
	this.openCoreObject = {};
	this.openCoreInstance = {};
	this.controller= {};
	this.fieldValues = {};
	this.callBackCommand = "";
	this.formPanel = {};
	this.ZIndex = 0;
	this.isCreate = false;
	this.formItems = {};
	this.items = [];
	this.itemCount = 0;
}

OpenPanel.GUIBuilder.GUIElements.FormFields.prototype = {
		
	build : function(){
		this.itemCount = 0;
		if(this.targetDiv!=undefined){
			this.targetDiv.innerHTML = "";
			
			this.fieldsDiv = document.createElement("div");
			this.fieldsDiv.setAttribute("class", "fields");
			this.targetDiv.appendChild(this.fieldsDiv);
			
			this.createFields(this.instance);
		}
	},

	createItem : function(fieldName, obj){
		if(obj.type != undefined){
			var fieldType = obj.type;
			var item = {};
			switch(fieldType){
				
				
				case "integer":
				case "string":
					item = this.createTextField(fieldName, obj);
				break;
				case "password":
					item = this.createTextField(fieldName, obj);
					item.inputType = "password";
				break;
									
				case "enum":
					item = this.createEnum(fieldName, obj);
				break;
				
				case "bool":
					item = this.createBooleanField(fieldName, obj);
				break;
				
				case "group":
					item = this.createGroup(fieldName, obj);
				break;
				
				case "ref":
					item = this.createReference(fieldName, obj);
				break;
				
				default:
					item = undefined;
				break;
			}
			
			
			if (item != undefined) {
				
				if (obj.group != undefined) {
					if(this.instance[fieldName]!=undefined){
						item.disabled = false;
					} else {
						item.disabled = true;
					}
				}
				
				
				if(obj.visible == false){
					item.type = "hidden";
				}
				if (obj.required == true) {
					if(fieldType == "password"){
						if(this.isCreate == true){
							item.allowBlank = false;
						}
					} else {
						item.allowBlank = false;
					}
				}
				
				if (obj.regexp != undefined && obj.regexp != "") {
					//item.regex = new RegEx(obj.regexp);
				}
				return item;
			}
		}
	},
	
	createGroup : function(fieldName, obj){
		// get grouped parameters
		var hook = this;
		var grouped = {};
		
		for(var paramName in this.openCoreObject.classInfo.structure.parameters){
			var parameter = this.openCoreObject.classInfo.structure.parameters[paramName];
			if(parameter.group == fieldName){
				grouped[paramName] = parameter;
			}
		}
		var radios = [];
		
		for(var paramName in grouped){
			if(this.instance[paramName]!=undefined){
				checked = true;
			} else {
				checked = false;
			}
			
			var radio = {
				checked : checked,
				value:1,
				boxLabel:paramName,
				listeners:{
					'check':function(r,c){
						
						var foundStuff = hook.formPanel.find("name", this.boxLabel);
						
						if (c == true) {
							for(var i = 0;i< foundStuff.length;i++){
								foundStuff[i].enable();
								foundStuff[i].setVisible(true);
							}
						} else {
							for(var i = 0;i< foundStuff.length;i++){
								foundStuff[i].disable();
								foundStuff[i].setVisible(true);
							}
						}
					}
				}
			}
			
			radios.push(radio);
		}
	
		var item = {xtype:'ux-radiogroup',
					fieldLabel:fieldName,
					name:fieldName,
					horizontal:false,
					radios:radios
			};
		
		return item;	
	},
	
	createBooleanField : function(fieldName, obj){
		var item = {
			xtype:'checkbox',
			fieldLabel: obj.description,
			name: fieldName,
			inputValue : "true"
		};
		
		return item;	
	},
	
	createNumberField : function(fieldName, obj){
		var item = {
			xtype:'numberfield',
			fieldLabel: obj.description,
			name: fieldName
		};
		
		return item;	
	},
	
	
	createEnum: function(fieldName, obj){
		console.log("createEnum", obj);
		var item = {};
		var enumItems = [];
		if(this.openCoreObject.classInfo.enums[fieldName] != undefined){
			
			var enums = this.openCoreObject.classInfo.enums[fieldName];
			for(var enumName in enums){
				var enumField = [
                  	enumName,enums[enumName].description
               ];
				
				enumItems.push(enumField);
			}
		}
		
		var store = new Ext.data.SimpleStore({
		    fields: ['value', 'description'],
		    data : enumItems
			
		});
		var comboWithTooltip = new Ext.form.ComboBox({
		    store: store,
		    displayField: "description",
			valueField: "value",
			hiddenName: fieldName,
			fieldLabel: obj.description,
		    typeAhead: true,
		    mode: 'local',
		    triggerAction: 'all',
		    emptyText:'Select ...',
		    selectOnFocus:true,
			name: fieldName,
			forceSelection: true
		});

			
		return comboWithTooltip;
	},
	
	createChildUsersPullDown: function(fieldName){
		var userOpenCoreObject = this.formObject.controller.dataManager.getOpenCoreObjectByName("User");
		userOpenCoreObject.setHasFetchedInstances(false);
		var instances = userOpenCoreObject.getInstances();
		var item = {};
		var userItems = [];
		if(instances != undefined){
			
			for(var userName in instances){
				var userField = [
                  	userName,
					instances[userName].uuid
               ];
			   userItems.push(userField);
			}
		}
		
		var store = new Ext.data.SimpleStore({
		    fields: ['metaid', 'owner'],
		    data : userItems
		});
		
		var comboWithTooltip = new Ext.form.ComboBox({
		    store: store,
		    displayField: 'metaid',
			fieldLabel: "User",
		    typeAhead: true,
		    mode: 'local',
		    triggerAction: 'all',
		    emptyText:'Select ...',
		    selectOnFocus:true,
			name: fieldName,
			forceSelection: true,
			value : this.formObject.controller.currentUser
		});

			
		return comboWithTooltip;
	},
	
	createReference: function(fieldName, obj){
		var item = {};
		var referenceFields = [];
		var references = this.formObject.controller.dataManager.getReferences(obj.refclass + "/" + obj.reflabel);
		if(references!=undefined){
			for(var referenceName in references){
				var referenceField = [
                  	referenceName,
				   	references[referenceName]
               ];
			   
			   referenceFields.push(referenceField);
			}
		}
		
		var store = new Ext.data.SimpleStore({
		    fields: ["description", "metaid"],
		    data : referenceFields
			
		});
		var comboWithTooltip = new Ext.form.ComboBox({
		    store: store,
		    displayField: 'description',
			fieldLabel: obj.description,
			valueField: 'metaid',
		    typeAhead: true,
		    mode: 'local',
		    triggerAction: 'all',
		    emptyText:'Select ...',
		    selectOnFocus:true,
			name: fieldName,
			forceSelection: true
		});

			
		return comboWithTooltip;
	},
	
	createTextField : function(fieldName, obj){
		var item = {
			xtype:'textfield',
			fieldLabel: obj.description,
			name: fieldName
		};
		
		return item;
	},
	
	createFields : function(instance){	
		if(instance == undefined){
			instance = {};
		}
		
		if(this.openCoreObject != undefined && this.openCoreObject.classInfo != undefined && this.openCoreObject.classInfo.structure != undefined && this.openCoreObject.classInfo.structure.parameters != undefined){
			
			this.createFormPanel(instance);
			var fieldContainerGroup = window.OpenPanel.GUIBuilder.drawGroup();
			
			var groupHolder = fieldContainerGroup.groupHolder;
			var contentDiv = fieldContainerGroup.contentDiv;
			this.fieldsDiv.appendChild(groupHolder);
			
			this.formPanel.render(contentDiv);
			if(this.openCoreObject.canUpdate == false){
				//this.formPanel.disable();
			}
			
			var parameters = this.openCoreObject.classInfo.structure.parameters;
			for (var key in parameters) {
				var parameter = parameters[key];
				if(parameter.visible == false){
					this.formPanel.items.each(function(item){
						console.log("ITEM", item);
					});
				}
			}
		} else {
			// no, is it a singleton?
			if(this.openCoreObject.singleton == true){
				// draw a delete button
			} else {
				// don't draw anything at all (this object can be deleted 
			}
		}
	},
	
	createFormPanel : function(instance){
		var parameters = this.openCoreObject.classInfo.structure.parameters;
		
		var itemsLeft = [];
		var itemsRight = [];
		var a = 0;
		this.fieldValues = {};
		
		var hook = this;
		this.items = {};
		
		for(var key in parameters){
			var parameter = parameters[key];
			var fieldName = key;
			var description = parameter.description;
			var fieldType = parameter.type;
			var item = this.createItem(fieldName, parameter);
			
			if (item != undefined) {
				if(this.isCreate != true){
					
					if(this.openCoreObject.canUpdate == false || parameter.enabled == false){
						item.disabled = true;
							item.disabledClass = "disabledField";
							
					}
				
					if(fieldName == "id"){
						item.disabled = true;
						item.disabledClass = "disabledField";
						
					
					}
				}
				
				if (instance[fieldName] != undefined) {
					switch (parameter.type) {
						case "bool":
							// @TODO 	this is wrong
							if (instance[fieldName] == "true" || instance[fieldName] == true){
								item.checked = true;
							} else {
								item.checked = false;
							}
						break;
							
						case "ref":
							var referenceObject = this.formObject.controller.dataManager.getOpenCoreObjectByName(parameter.refclass);
							if (referenceObject != undefined) {
								var referenceInstances = referenceObject.getInstances();
								for (var metaid in referenceInstances) {
									var referenceInstance = referenceInstances[metaid];
									if (referenceInstance.uuid == instance[fieldName]) {
										item.value = metaid;
									}
								}
							}
						break;
							
						default:
							item.value = instance[fieldName];
						break;	
					}
				}
				
				if (this.ZIndex != 0) {
					//item["z-index"] = this.ZIndex;
				}
				
				this.itemCount++;
				
				this.items[fieldName] = item;
				console.log("item", item);
				
			}
		}
		
		
		
		if(this.isCreate == true){
			if(this.openCoreObject.isRootObject){
				var item = this.createChildUsersPullDown("owner");
				item.value = this.formObject.controller.currentUser;
				this.items["owner"] = item;
			} 
		}
		// is root object?
		for(var key in this.items){
			console.log(key, this.items[key]);
		}
		var m = Math.ceil(this.itemCount/2);
		var i = 0;
		for(var key in this.items){
			if(i<m){
				itemsLeft.push(this.items[key]);
			} else {
				itemsRight.push(this.items[key]);
			}
			i++;
		}
		
		var formItems;
			
		if(itemsRight.length == 0){
			formItems = itemsLeft;
		} else {
			formItems = [{
	            layout:'column',
				
				items:[{
	                columnWidth:.5,
	                layout: 'form',
	                items: itemsLeft
	            },{
	                columnWidth:.5,
	                layout: 'form',
	                items: itemsRight
	            }]
	        }]
			
		}
		
		var buttons = {};
		if (this.callBackCommand != "") {
			buttons = [{
				text: 'Save',
				handler: function(){
					hook.formPanel.submit();
				},
				formBind: true,
				align: "right"
			},
			{
				text: 'Cancel',
				handler: function(){
					hook = {};
					OpenPanel.GUIBuilder.deletePopUp();
				},
				formBind: true
			}
			]
		}
		
		this.formPanel = new Ext.FormPanel({
	        
	       	header: false,
			frame:false,
			hideBorders: true,
			autoScroll: true,
	        title: 'Simple Form',
	        bodyStyle:'padding:5px 5px 5px 5px;',
	        width: 600,
			buttonAlign : "right",
        	
	       	// uhuh onSubmit: function(arg){ console.log(arg); },
			submit: function() {
           		var obj = this.getForm().getValues();
				var objectId = hook.openCoreObject.singleton == true? hook.openCoreObject.classInfo["class"].singleton:obj.id;
				
				if(hook.callBackCommand != undefined){
					hook.formObject.controller.action( 
						{ 
							command : hook.callBackCommand,
							openCoreObject:hook.openCoreObject, 
							instance: instance, 
							formValues: hook.parseValues(this),
							optionalCallBackObject: hook.optionalCallBackObject
						});
				}
				
	        },
	        items: formItems,
			buttons: buttons
	    });
		
	
	},
	
	setZIndex : function(zIndex){
		this.ZIndex = zIndex;
	},
	
	getFormValues : function(){
		
		return this.parseValues(this.formPanel);
	},
	
	parseValues : function(form){
		console.log("parseValues");
		// gets value from form and fills missing checkbox values (ext doesn't provide unchecked checkbox values)
		if (form != undefined && form.getForm != undefined) {
			var r = form.getForm().getValues();
			
			if (this.openCoreObject.classInfo.structure != undefined && this.openCoreObject.classInfo.structure.parameters != undefined) {
				var parameters = this.openCoreObject.classInfo.structure.parameters;
				
				for (var fieldName in parameters) {
					var field = parameters[fieldName];
					console.log(field);
					if (field.type == "bool") {
						if (r[fieldName] == undefined) {
							r[fieldName] = "false";
						}
					}
				}
			}
			
			console.log("r", r);
			return r;
		}
	},
	
	setInstance : function(instance){
		this.instance = instance;	
	},
	
	getInstance: function(){
		return this.instance;
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setOpenCoreInstance: function(openCoreInstance){
		this.openCoreInstance = openCoreInstance;
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
	},
	
	setIsCreate : function(bool){
		this.isCreate = bool;
	}
	
}

