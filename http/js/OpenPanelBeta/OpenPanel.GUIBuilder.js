OpenPanel.GUIBuilder = {
	GUIElements: {},
	dataManager: {},
	controller: {},
	selectedTab: "",
	popUpDiv : {},
	targetDiv : {},
	lastAnchor : "",
	
	setController: function(controller){
		this.controller = controller;
	},
	
	loadTemplate : function(templateName, targetDivName){
		
		var targetDiv = document.getElementById(targetDivName);
		if (targetDiv != undefined) {
			OpenPanel.GUIBuilder.loadTemplateIntoDiv(templateName, targetDiv);	
		} else {
			alert("OpenPanel.GUIBuilder : targetDiv not found");
		}		
	},
	
	loadTemplateIntoDiv : function(templateName, targetDiv){
		var f = $j.ajax(
			{ type: "POST",
			  url: templateName,
			  async: false,
			  dataType: "text"
			}).responseText;
		
		var o = TrimPath.parseTemplate(f);
		
		this.targetDiv = targetDiv;
		this.targetDiv.innerHTML = o.process({ 
			controller: this.controller 
		});
	},
	
	createPopUp : function(){
		this.enterModalMode();
		this.showModalMessageDiv();
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
		this.hideModalMessageDiv();
		var modalMessageDiv = document.getElementById("modalMessageContent");
		var previousPopUpDiv = document.getElementById("popup");
		if(previousPopUpDiv != undefined){
			modalMessageDiv.removeChild(previousPopUpDiv);
		}
	},
	
	renderLogin : function(el, params){
		var hook = this;
		
		if(params!=undefined && params.msg != undefined){
			// show error message
		}
		
		var simple = new Ext.FormPanel({
	        labelWidth: 75, // label settings here cascade unless overridden
	        submit: function() {
	           
				var obj = {};
				for(var key in this.items.items){
					var item = this.items.items[key];
					if(typeof(item) == "object"){
						var name = item.getName();
						var value = item.getValue();
						var initValue = item.initValue();
						obj[name] = value;
					}
				}
				obj.command = "Login";
				hook.controller.action(obj);
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
		// var windowSize = OpenPanel.GUIBuilder.getWindowSize();
		// why does this not work?
    	simple.setPosition(100, 10);
		
	},
	
	enterModalMode : function(){
		var modalDiv = document.getElementById("modal");
		modalDiv.style.visibility = "visible";
		
		OpenPanel.GUIBuilder.onresize();
		window.onresize = OpenPanel.GUIBuilder.onresize;	
	},
	
	exitModalMode : function(){
		var modalDiv = document.getElementById("modal");
		modalDiv.style.visibility = "hidden";
		
		window.onresize = {}	
	},
	
	showModalMessageDiv: function(){
		var modalMessageDiv = document.getElementById("modalMessageDiv");
		modalMessageDiv.style.visibility = "visible";
		
	},
	
	hideModalMessageDiv : function(){
		console.log("hideModalMessageDiv");
		var modalMessageDiv = document.getElementById("modalMessageDiv");
		modalMessageDiv.style.visibility = "hidden";
		
	},
	
	showLoadingDiv : function(){
		OpenPanel.GUIBuilder.enterModalMode();
		var loadingDiv = document.getElementById("modalLoadingDiv");
		Throbber.setTargetDiv(loadingDiv);
		Throbber.start();
		loadingDiv.style.visibility = "visible";
	},
	
	hideLoadingDiv : function(){
		OpenPanel.GUIBuilder.exitModalMode();
		var loadingDiv = document.getElementById("modalLoadingDiv");
		loadingDiv.style.visibility = "hidden";
		Throbber.stop();
	},
	
	onresize : function(){ 
		var modalDiv = document.getElementById("modal");
		var windowSizes = OpenPanel.GUIBuilder.getWindowSize();
		console.log("windowSizes", windowSizes);
		modalDiv.style.width = windowSizes.width + "px";
		modalDiv.style.height = windowSizes.height + "px";
	},
	
	getWindowSize : function () {
		  var myWidth = 0, myHeight = 0;
		  if( typeof( window.innerWidth ) == 'number' ) {
		    //Non-IE
		    myWidth = window.outerWidth;
		    myHeight = window.innerHeight;
		  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		    //IE 6+ in 'standards compliant mode'
		    myWidth = document.documentElement.clientWidth;
		    myHeight = document.documentElement.clientHeight;
		  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		    //IE 4 compatible
		    myWidth = document.body.clientWidth;
		    myHeight = document.body.clientHeight;
		  }
		  return { width: myWidth - 4, height: myHeight - 8}
	},
	
	drawGroup: function(){
		
		var groupHolder = document.createElement("div");
		groupHolder.setAttribute("class", "groupHolder");
		var table = document.createElement("table");
		table.setAttribute("class", "groupTable");
		table.setAttribute("cellpadding", "0");
		table.setAttribute("cellspacing", "0");
		groupHolder.appendChild(table);
		
		var tBody = document.createElement("tbody");
		table.appendChild(tBody);
		
		var topTr = document.createElement("tr");
		tBody.appendChild(topTr);
			var topLeftTd = document.createElement("td");
			topLeftTd.setAttribute("class", "groupTopLeft");
			topTr.appendChild(topLeftTd);
			var topCenterTd = document.createElement("td");
			topCenterTd.setAttribute("class", "groupTopCenter");
			
			topTr.appendChild(topCenterTd);
			var topRightTd = document.createElement("td");
			topRightTd.setAttribute("class", "groupTopRight");
			topTr.appendChild(topRightTd);
				
		var centerTr = document.createElement("tr");
		tBody.appendChild(centerTr);
			var centerLeftTd = document.createElement("td");
			centerLeftTd.setAttribute("class", "groupCenterLeft");
			centerTr.appendChild(centerLeftTd);
			var centerMiddleTd = document.createElement("td");
			centerMiddleTd.setAttribute("class", "groupCenterMiddle");
			centerTr.appendChild(centerMiddleTd);
			var centerRightTd = document.createElement("td");
			centerRightTd.setAttribute("class", "groupCenterRight");
			centerTr.appendChild(centerRightTd);
		
		var bottomTr = document.createElement("tr");
		tBody.appendChild(bottomTr);
			var bottomLeftTd = document.createElement("td");
			bottomLeftTd.setAttribute("class", "groupBottomLeft");
			bottomTr.appendChild(bottomLeftTd);
			var bottomCenterTd = document.createElement("td");
			bottomCenterTd.setAttribute("class", "groupBottomMiddle");
			bottomTr.appendChild(bottomCenterTd);
			var bottomRightTd = document.createElement("td");
			bottomRightTd.setAttribute("class", "groupBottomRight");
			bottomTr.appendChild(bottomRightTd);
			
		return { groupHolder : groupHolder, contentDiv : centerMiddleTd}
		
	},
	
	goToAnchor : function (anchor) {
		// let's not do this yet
		this.lastAnchor = anchor;
		console.log("anchor", anchor);
		if(anchor != undefined && anchor!=""){
			window.location.hash = anchor;
		}
	},
	
	getLastAnchor : function(){
		return this.lastAnchor;
	},
	goToLastAnchor : function(){
		this.goToAnchor(this.lastAnchor);
	}
}
