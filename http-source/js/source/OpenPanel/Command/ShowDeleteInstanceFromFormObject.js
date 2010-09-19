OpenPanel.Command.ShowDeleteInstanceFromFormObject  = {
	controller : {},
	execute : function(actionObject){
		var popUpDiv = this.controller.guiBuilder.createPopUp();
		var info = actionObject.openCoreObject.classInfo["class"];

		var t = "";
		if(info.singleton==""){
			t = "this " + info.description + " instance";
		} else {
			t = info.description;
		}
		
		popUpDiv.innerHTML+= '<br/><div>Are you sure you want to delete ' + t + '?</div>';
		popUpDiv.innerHTML+= '<div style="float:right; margin-bottom: 20px;" id="modalDeleteButton">Delete</div>';	
		popUpDiv.innerHTML+= '<div style="float:right; margin-bottom: 20px; margin-right: 4px;" id="modalCancelButton">Cancel</div><br/><br/>';
		var modalDeleteButton = $("modalDeleteButton");
		var modalCancelButton = $("modalCancelButton");
		
		this.controller.guiBuilder.renderButton(modalDeleteButton);
		this.controller.guiBuilder.renderButton(modalCancelButton);
		var hook = this;
		actionObject.command = "DeleteInstanceFromFormObject"; 
		
		modalDeleteButton.onclick = function(){
			hook.controller.guiBuilder.deletePopUp();
			hook.controller.action(actionObject);
		}
		
		modalCancelButton.onclick = function(){
			hook.controller.guiBuilder.deletePopUp();
		}
	}
}