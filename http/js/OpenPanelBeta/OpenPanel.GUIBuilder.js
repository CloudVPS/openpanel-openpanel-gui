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
		this.enterModalMode();
		var previousPopUpDiv = document.getElementById("popup");
		var modalMessageDiv = document.getElementById("modalMessageContent");
		if(previousPopUpDiv != undefined){
			modalMessageDiv.removeChild(previousPopUpDiv);
		}
		
		
		var popUpDiv = document.createElement("div");
		popUpDiv.setAttribute("id", "popup");
		
		modalMessageDiv.appendChild(popUpDiv);
		
		return popUpDiv;
	},
	
	
	deletePopUp : function(){
		
		this.exitModalMode();
		var modalMessageDiv = document.getElementById("modalMessageContent");
		var previousPopUpDiv = document.getElementById("popup");
		if(previousPopUpDiv != undefined){
			modalMessageDiv.removeChild(previousPopUpDiv);
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
		
	},
	
	enterModalMode : function(){
		var modalDiv = document.getElementById("modal");
		modalDiv.style.visibility = "visible";
		
		var modalMessageDiv = document.getElementById("modalMessageDiv");
		modalMessageDiv.style.visibility = "visible";
		
		OpenPanel.GUIBuilder.onresize();
		window.onresize = OpenPanel.GUIBuilder.onresize;	
	},
	
	exitModalMode : function(){
		var modalDiv = document.getElementById("modal");
		modalDiv.style.visibility = "hidden";
		
		var modalMessageDiv = document.getElementById("modalMessageDiv");
		modalMessageDiv.style.visibility = "hidden";
		window.onresize = {}	
	},
	
	onresize : function(){ 
		var modalDiv = document.getElementById("modal");
		var windowSizes = OpenPanel.GUIBuilder.getWindowSize();
		modalDiv.style.width = windowSizes.width + "px";
		modalDiv.style.height = windowSizes.height + "px";
	},
	
	getWindowSize : function () {
		  var myWidth = 0, myHeight = 0;
		  if( typeof( window.innerWidth ) == 'number' ) {
		    //Non-IE
		    myWidth = window.outerWidth;
		    myHeight = window.outerHeight;
		  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		    //IE 6+ in 'standards compliant mode'
		    myWidth = document.documentElement.clientWidth;
		    myHeight = document.documentElement.clientHeight;
		  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		    //IE 4 compatible
		    myWidth = document.body.clientWidth;
		    myHeight = document.body.clientHeight;
		  }
		  return { width: myWidth, height: myHeight}
		}
}
