OpenPanel.Command.LoadTemplateIntoPopup  = {
	controller : {},
	execute : function(actionObject){
		var popUpDiv = this.controller.guiBuilder.createPopUp();
		OpenPanel.GUIBuilder.loadTemplateIntoDiv(actionObject.content, popUpDiv);
		popUpDiv.innerHTML+= '<div style="float:right; margin-bottom: 20px;" id="modalCancelButton">Close</div><br/><br/>';	
		var modalCancelButton = $("modalCancelButton");
		
		this.controller.guiBuilder.GUIElements.Button.renderButton(modalCancelButton);
		var hook = this;
		modalCancelButton.onclick = function(){
			hook.controller.guiBuilder.deletePopUp();
		}
	}
}
