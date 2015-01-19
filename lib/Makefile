#
# Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
# Creation Date: Fri Jan  9 22:02:41 PST 2015
# Last Modified: Fri Jan  9 22:02:43 PST 2015
# Filename:      .../lib/Makefile
# Syntax:        GNU Makefile
#
# Description:   Create minimal JavaScript files for ATON.
#
# To install minify as a command-line program, run this command if it is
# not already available:
#       npm install -g minify
# If you do not have npm installed, then install node.js accoding to your
# system, such as:
#       brew install node       (Apple OS X)
#       yum install node        (Fedora linux)
#
# To run, type:
#	make
# or
#	make min
#

VERSION  = $(shell grep version ../package.json | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+')

# Try locally installed minify first
MINIFY = ../node_modules/.bin/minify
ifeq (,$(wildcard $(MINIFY)))
	# Globally installed minify
	MINIFY = minify
endif

min: aton

aton:
	$(MINIFY) aton.js --no-comments -o aton-$(VERSION).min.js

clean:
	rm *.min.js


