OpenPanel.GUIBuilder.GUIElements.LoginWindow = {
	patchElements : function (el, parameters){
		$("loginMessageDiv").update(parameters.msg != undefined?parameters.msg:"");
		
		var form = document.getElementById("loginForm");
		var onsubmit = function (){
			if($("userName").value!="" && $("password").value!=""){
				OpenPanel.Controller.action({ 
					command : "Login", 
					userName : $("userName").value,	
					password : $("password").value,	
				});
			}
			console.log("validate");
			
			/*
			if(formPanel.validate() === true){
				
				var obj = { command : "Login" };
				var values = formPanel.getValues();
				for(var key in values){
					obj[key] = values[key];
				}
				OpenPanel.Controller.action(obj);
			} else {
				
			}
			
			*/
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