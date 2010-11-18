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
	@cp http-source/css/openpanel.css http/css
	@cp http-source/css/iconbar.css http/css
	@cp http-source/css/openpanel.ie7.css http/css
	@cp http-source/css/browsers.css http/css
	@cp -R http-source/images-source http/images
	@cp -R http-source/dynamic http/dynamic
	@cp -R http-source/templates http/templates
	@cp http-source/index.html.minified http/index.html
	
minimize:
	@echo Minimizing javascripts
	@tools/compressJSDirectory http-source/js/source http/js/openpanel-compressed.js
	
install:
	mkdir -p ${DESTDIR}/var/openpanel/
	# perhaps fiddle with ownership?
	cp -r http ${DESTDIR}/var/openpanel/
	cp -r http-templates ${DESTDIR}/var/openpanel/

