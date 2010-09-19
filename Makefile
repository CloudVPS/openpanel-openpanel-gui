all: clean copy minimize
	@echo Done
	
clean: 
	@echo Cleaning /http directory
	@rm -rf http/*
	
copy:
	@echo Copying files
	@cp -R http-source/iepngfix http
	@mkdir http/js
	@cp -R http-source/js/lib http/js
	@mkdir http/css
	@cp http-source/css/openpanel.ie7.css http/css
	@cp -R http-source/images-source http/images
	@cp -R http-source/templates http/templates
	@cp http-source/index.html.minified http/index.html
	
minimize:
	@echo Minimizing javascripts
	@tools/compressJSDirectory http-source/js/source http/js/openpanel-compressed.js
	@echo Combining css
	@tools/compressCSSDirectory http-source/css http/css/openpanel.css
	