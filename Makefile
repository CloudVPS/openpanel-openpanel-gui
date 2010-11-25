all: clean copy minimize down_crow
	
	
clean: 
	# Cleaning /http directory
	rm -rf http/*
	
copy:
	# Copying files
	cp -R http-source/iepngfix http
	mkdir http/js
	cp -R http-source/js/lib http/js
	mkdir http/css
	cp http-source/css/openpanel.css http/css
	cp http-source/css/iconbar.css http/css
	cp http-source/css/openpanel.ie7.css http/css
	cp http-source/css/browsers.css http/css
	cp -R http-source/images http/images
	cp -R http-source/dynamic http/dynamic
	cp -R http-source/templates http/templates
	cp http-source/index.html.minified http/index.html
	cp http-source/favicon.ico http/
	
minimize:
	# Minimizing javascripts
	tools/compressJSDirectory http-source/js/source http/js/openpanel-compressed.js
	
down_crow: http-source/images/icons/crow.png
	# only try to create the down icon when imagemagick is available, so we can
	# still make one without it.
	# imagemagick is listed as a build dependency in packaging, so packages will
	# always have the down icon.
	which convert > /dev/null && \
		convert -modulate 50,100,100 http-source/images/icons/crow.png http-source/images/icons/down_crow.png || \
		true

install:
	mkdir -p ${DESTDIR}/var/openpanel/
	# perhaps fiddle with ownership?
	cp -r http ${DESTDIR}/var/openpanel/
	cp -r http-templates ${DESTDIR}/var/openpanel/

