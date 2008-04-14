OpenPanel.Command.SaveFormDone  = {
	controller : {},
	execute : function(actionObject){
		var errorId = actionObject.header.errorid;
		actionObject.done++;
		if(errorId != 0){
			var error = actionObject.header.error;
			actionObject.failed = true;
			actionObject.errors.push({
				error: error,
				errorId: errorId
			}
			);
		}
		
		if(actionObject.done == actionObject.numberOfChildObjects){
			try {
				if(actionObject.failed == true){
					var errorString = "";
					for(var i = 0;i<actionObject.errors.length;i++){
						errorString += actionObject.errors[i] + "<br/>";
					}
						
					var e = new OpenCoreError(errorString);
					e.threaded = true;
					e.errors = actionObject.errors;
					throw e;
				}
				
				OpenPanel.GUIBuilder.GUIElements.FormBuilder.rootFormObject.build();
			} catch (e){
				this.controller.handleErrors(e);
			}
		}
	}
}

