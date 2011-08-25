all: clean copy minimize hash compress
	
clean: 
	# Cleaning /http directory
	rm -rf http
	
hash:
	cd  http/ && ../tools/hashresources.sh css/openpanel.css
	cd  http/ && ../tools/hashresources.sh css/iconbar.css
	cd  http/ && ../tools/hashresources.sh css/openpanel.noembed.css
	cd  http/ && ../tools/hashresources.sh css/iconbar.noembed.css

	cd  http/ && ../tools/hashresources.sh index.html
	
	cd  http/ && ../tools/hashresources.sh templates/browsers.html
	cd  http/ && ../tools/hashresources.sh templates/welcome.html
	cd  http/ && ../tools/hashresources.sh templates/application.html
	cd  http/ && ../tools/hashresources.sh templates/test.html
	cd  http/ && ../tools/hashresources.sh templates/login.html
	cd  http/ && ../tools/hashresources.sh templates/main.html
	cd  http/ && ../tools/hashresources.sh templates/license.html

compress:		
	gzip -9 < http/css/openpanel.css > http/css/openpanel.css.gz
	gzip -9 < http/css/iconbar.css > http/css/iconbar.css.gz
	gzip -9 < http/css/openpanel.noembed.css > http/css/openpanel.noembed.css.gz
	gzip -9 < http/css/iconbar.noembed.css > http/css/iconbar.noembed.css.gz
	gzip -9 < http/js/openpanel-compressed.js > http/js/openpanel-compressed.js.gz
	gzip -9 < http/js/lib/prototype-1.6.1-compressed.js > http/js/lib/prototype-1.6.1-compressed.js.gz
	gzip -9 < http/js/lib/jquery-1.6.2.min.js > http/js/lib/jquery-1.6.2.min.js.gz
	gzip -9 < http/js/lib/jquery.tmpl.min.js > http/js/lib/jquery.tmpl.min.js.gz
	gzip -9 < http/js/lib/effects.js > http/js/lib/effects.js.gz
	
copy: 
	# Copying files
	mkdir -p http/js
	mkdir -p http/css

	cp -R http-source/js/lib http/js
	cp -R http-source/iepngfix http/iepngfix
	cp -R http-source/images http/images
	cp -R http-source/dynamic http/dynamic
	cp -R http-source/templates http/templates
	cp http-source/index.html.minified http/index.html
	
	cp http-source/favicon.ico http/favicon.ico
	
minimize:
	# Minimizing javascripts
	tools/compressJSDirectory http-source/js/source http/js/openpanel-compressed.js
	
	tools/cssmin.py --embed "http-source" < http-source/css/openpanel.css > http/css/openpanel.css
	tools/cssmin.py --embed "http-source" < http-source/css/iconbar.css   > http/css/iconbar.css

	tools/cssmin.py < http-source/css/openpanel.css > http/css/openpanel.noembed.css
	tools/cssmin.py < http-source/css/iconbar.css   > http/css/iconbar.noembed.css

	tools/cssmin.py < http-source/css/openpanel.ie7.css > http/css/openpanel.ie7.css
	tools/cssmin.py < http-source/css/browsers.css > http/css/browsers.css


install:
	mkdir -p ${DESTDIR}/var/openpanel/
	# perhaps fiddle with ownership?
	cp -r http ${DESTDIR}/var/openpanel/
	cp -r http-templates ${DESTDIR}/var/openpanel/
	cp -r wallpaper ${DESTDIR}/var/openpanel/

