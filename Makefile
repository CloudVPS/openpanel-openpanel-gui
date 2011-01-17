all: clean copy minimize
	
	
clean: 
	# Cleaning /http directory
	rm -rf http
	
copy:
	# Copying files
	mkdir -p http/js
	mkdir -p http/css

	cp -R http-source/js/lib http/js
	cp http-source/css/openpanel.css http/css
	cp http-source/css/iconbar.css http/css
	cp http-source/css/openpanel.ie7.css http/css
	cp http-source/css/browsers.css http/css

	cp -R http-source/iepngfix http/iepngfix
	cp -R http-source/images http/images
	cp -R http-source/dynamic http/dynamic
	cp -R http-source/templates http/templates
	cp http-source/index.html.minified http/index.html
	cp http-source/favicon.ico http/
	
minimize:
	# Minimizing javascripts
	tools/compressJSDirectory http-source/js/source http/js/openpanel-compressed.js

install:
	mkdir -p ${DESTDIR}/var/openpanel/
	# perhaps fiddle with ownership?
	cp -r http ${DESTDIR}/var/openpanel/
	cp -r http-templates ${DESTDIR}/var/openpanel/
	cp -r wallpaper ${DESTDIR}/var/openpanel/

