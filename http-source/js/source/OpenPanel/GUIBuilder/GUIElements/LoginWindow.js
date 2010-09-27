OpenPanel.GUIBuilder.GUIElements.LoginWindow = {
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
		
		var hook = this;
		var onsubmit = function(){
			var obj = { command : "Login" };
			var values = formPanel.getValues();
			for(var key in values){
				obj[key] = values[key];
			}
			OpenPanel.Controller.action(obj);
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
	}
}