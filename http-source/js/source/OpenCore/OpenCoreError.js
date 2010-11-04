OpenCore.OpenCoreError = function(message, errorCode){
	var error = new Error(message)
    // take care of IE5/5.5
    if (!error.message) {
    	error.message = message
	}
	
	error.errorCode = errorCode!=undefined?errorCode:"";
	error.name = "OpenCoreError"
    return error;
}