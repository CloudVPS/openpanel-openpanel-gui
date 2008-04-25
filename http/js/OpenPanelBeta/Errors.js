RPCError = function(message, status){
	var err = new Error(message)
    // take care of IE5/5.5
    if (!err.message) {
        err.message = message
    }
	
	if(status != ""){
		err.status = status;
	} else {
		err.status = "";
	}
	
    err.name = "RPCError"
    return err;
}

var OpenCoreError = function(message, errorCode){
	var err = new Error(message)
    // take care of IE5/5.5
    if (!err.message) {
        err.message = message
	}
	
	err.errorCode = errorCode!=undefined?errorCode:"";
    err.name = "OpenCoreError"
    return err;
}

	