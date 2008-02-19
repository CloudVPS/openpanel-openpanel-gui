OpenPanel.GUIBuilder = {
	GUIElements: {},
	dataManager: {},
	controller: {},
	selectedTab: "",
	popUpDiv : {},
	targetDiv : {},
	
	setController: function(controller){
		this.controller = controller;
	},
	
	loadTemplate : function(templateName, targetDivName){
		
		var f = $j.ajax(
			{ type: "POST",
			  url: "templates/" + templateName,
			  async: false,
			  dataType: "text"
			}).responseText;
			
				
		var o = TrimPath.parseTemplate(f);
		
		var appDivElement = document.getElementById(targetDivName);
		if (appDivElement != undefined) {
			this.targetDiv = appDivElement;
			this.targetDiv.innerHTML = o.process({ 
				controller: this.controller 
			});
			
		}
		else {
			alert("OpenPanel.GUIBuilder : targetDiv not found");
		}
		
	},
	
	createPopUp : function(){
		var previousPopUpDiv = document.getElementById("popup");
		if(previousPopUpDiv != undefined){
			this.targetDiv.removeChild(previousPopUpDiv);
		}
		var hook = this;
			var c = new Ext.Container({
                   
                });
            this.win = new Ext.Window({
                el:previousPopUpDiv,
                layout:'fit',
                width:500,
                height:300,
                closeAction:'hide',
                plain: true,
				modal: true,
                
                

                buttons: [{
                    text:'Submit',
                    disabled:true
                },{
                    text: 'Close',
                    handler: function(){
                        hook.deletePopUp();
                    }
                }]
            });
        
      // this.win.show(this);
		
		
		
		var popUpDiv = document.createElement("div");
		popUpDiv.setAttribute("id", "popup");
		
		this.targetDiv.appendChild(popUpDiv);
		
		return popUpDiv;
	},
	
	deletePopUp : function(){
		var previousPopUpDiv = document.getElementById("popup");
		if(previousPopUpDiv != undefined){
			this.targetDiv.removeChild(previousPopUpDiv);
		}
		//this.win.close();
	},
	
	renderLogin : function(el, params){
		var hook = this;
		
		if(params!=undefined && params.msg != undefined){
			// show error message
		}
		
		var simple = new Ext.FormPanel({
	        labelWidth: 75, // label settings here cascade unless overridden
	        onSubmit: function(arg){ console.log(arg); },
			submit: function() {
	           
				var obj = {};
				for(var key in this.items.items){
					var item = this.items.items[key];
					if(typeof(item) == "object"){
					
						console.log(item);
						var name = item.getName();
						var value = item.getValue();
						var initValue = item.initValue();
						obj[name] = value;
						console.log(name + " " + value + " " + initValue);
					}
				}
				hook.controller.action("login", obj);
	        },
	
	        frame:true,
	        title: 'Log in',
	        bodyStyle:'padding:5px 5px 0',
	        width: 290,
	        defaults: {width: 170},
	        defaultType: 'textfield',
			buttonAlign: "right",
			shadow: "frame",
			shadowOffset: 3,
			formId: "loginForm",
			monitorValid: true,
	
	        items: [{
	                fieldLabel: 'Username',
	                name: 'userName',
					allowBlank:false,
					value: params.userName!=undefined?params.userName:""
	            },{
	                fieldLabel: 'Password',
	                name: 'password',
					inputType: 'password',
					allowBlank:false,
					value: params.password!=undefined?params.password:""
	            }
	        ],
	
	        buttons: [{
	            text: 'Ok',
				handler: function(){
	               simple.submit();
				},
				formBind:true
	        }]
    	});

    	simple.render(el);

    	//simple.setPosition(100,100);
		
	}
}
