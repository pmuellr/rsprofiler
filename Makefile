# Licensed under the Tumbolia Public License. See footer for details.

.PHONY: vendor watch help static-demo

#------------------------------------------------------------------------------
main: help

#------------------------------------------------------------------------------
static-demo:
	mkdir -p tmp
	rm -rf tmp/static-demo
	mkdir  tmp/static-demo

	cp -R lib/static-files/* tmp/static-demo
	cp -R vendor/*           tmp/static-demo

	mkdir tmp/static-demo/profiles
	cp ~/.rsprofiler/*.json tmp/static-demo/profiles
	curl http://localhost:3000/profiles > tmp/static-demo/profiles/index.json


#------------------------------------------------------------------------------
watch:
	node_modules/.bin/node-supervisor -w lib -n error -- lib/cli.js 3000

#------------------------------------------------------------------------------

VERSION_JQUERY    = 1.8.2

URL_JQUERY_MIN = http://code.jquery.com/jquery-$(VERSION_JQUERY).min.js
URL_JQUERY     = http://code.jquery.com/jquery-$(VERSION_JQUERY).js
URL_D3_MIN     = http://d3js.org/d3.v2.min.js
URL_D3         = http://d3js.org/d3.v2.js

#------------------------------------------------------------------------------
vendor:
	@npm install
	@rm -rf vendor
	@mkdir vendor

	curl --output vendor/jquery.min.js --progress-bar $(URL_JQUERY_MIN)
	curl --output vendor/jquery.js     --progress-bar $(URL_JQUERY)
	curl --output vendor/d3.v2.min.js  --progress-bar $(URL_D3_MIN)
	curl --output vendor/d3.v2.js      --progress-bar $(URL_D3)

#------------------------------------------------------------------------------
help:
	@echo "This Makefile supports the following targets:"
	@echo "   watch       -  run the server under node-supervisor watching lib"
	@echo "   vendor      -  get the vendor files"
	@echo "   static-demo -  create a static demo in the tmp directory"

#------------------------------------------------------------------------------
# Copyright (c) 2012 Patrick Mueller
#
# Tumbolia Public License
#
# Copying and distribution of this file, with or without modification, are
# permitted in any medium without royalty provided the copyright notice and this
# notice are preserved.
#
# TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
#
#   0. opan saurce LOL
#------------------------------------------------------------------------------
