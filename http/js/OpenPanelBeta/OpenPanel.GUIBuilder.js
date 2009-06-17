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
		this.targetDiv.innerHTML = f;
		/*o.process({ 
			controller: this.controller 
		});*/
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
		var data = {
			structure : {
				parameters : {
					userName : {	
						type : "String",
						description : "Username",
						textwidth: 20,
						example : "",
						required : false
					},
					password : {	
						type : "Password",
						description : "Password",
						textwidth: 20,
						example : "",
						required : false
					}
				}
			},
			isCreate : true
		}
		
		var values = {};
		if(params.userName!=undefined){
			values.userName = params.userName;
		}
		if(params.password!=undefined){
			values.password = params.password;
		}
		
		var formPanel = new OpenPanel.GUIBuilder.Form("firstForm", data);
		
		formPanel.setHideAsterisks(true);
		formPanel.addRenderer(
			new OpenPanel.GUIBuilder.SingleColumnFormRenderer({
				name: "SingleColumnFormRenderer"
			})
		);
		
		el.appendChild(formPanel.render("SingleColumnFormRenderer"));
		formPanel.setValues(values);
		
		var form = document.getElementById("loginForm");
		
	
		formPanel.getElement("userName").focus();
		//document.getElementById("userName").focus();
		
		var hook = this;
		var onsubmit = function(){
			var obj = { command : "Login"};
			var values = formPanel.getValues();
			for(var key in values){
				obj[key] = values[key];
			}
			hook.controller.action(obj);
			return false;
		}
		try {
			form.attachEvent("onsubmit", function() {
				onsubmit();
				return false;
			}, false);
		} catch (IEBlowsGoats){
			form.onsubmit = onsubmit; 
			return false;
		}
		
		//var buttonOk = document.getElementById("buttonOk");
		//this.renderButton(buttonOk);
		
		/*form.onsubmit = function(){
			alert('hi!!');
			return false;
		}*/
		
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
		if(anchor != undefined && anchor!=""){
			window.location.hash = anchor;
		}
	},
	
	getLastAnchor : function(){
		return this.lastAnchor;
	},
	goToLastAnchor : function(){
		this.goToAnchor(this.lastAnchor);
	},
	
	renderButton : function(el,isdeflt){
		var buttonText = el.innerHTML;
		el.innerHTML = "";
		var button = document.createElement("div");
		button.setAttribute("type", "submit");
		button.className = "generatedButton";
		el.appendChild(button);
		
		var t = document.createElement("table");
		t.setAttribute("border", "0");
		t.setAttribute("cellpadding", "0");
		t.setAttribute("cellspacing", "0");
		// IE7 is a fucking idiot
		t.style.cssText="border-collapse: collapse";
		var tb = document.createElement("tbody");
		tb.style.cssText = "border: 0px;";
		var tr = document.createElement("tr");
		tr.style.cssText = "border: 0px;";
		var left = document.createElement("td");
		var center = document.createElement("td");
		var right = document.createElement("td");
		var txt = document.createTextNode(buttonText);
		t.appendChild(tb);
		tb.appendChild(tr);
		tr.appendChild(left);
		tr.appendChild(center);
		tr.appendChild(right);
		center.appendChild(txt);
		center.style.cursor = "default";
		button.appendChild(t);
		
		var renderDefaultButton = (isdflt!=undefined)?isdflt:false;
		
		if (renderDefaultButton)
		{
			button.onmouseup = function(){
				left.className = "buttonLeftOver";
				right.className = "buttonRightOver";
				center.className = "buttonCenterOver";
			}
		
			button.onmousedown = function(){
				left.className = "buttonLeft";
				right.className = "buttonRight";
				center.className = "buttonCenter";
			}
		}
		else
		{
			button.onmousedown = function(){
				left.className = "buttonLeftOver";
				right.className = "buttonRightOver";
				center.className = "buttonCenterOver";
			}
		
			button.onmouseup = function(){
				left.className = "buttonLeft";
				right.className = "buttonRight";
				center.className = "buttonCenter";
			}
		}
		button.onmouseup();
	}
}
