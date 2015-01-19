#
# Programmer:	 Craig Stuart Sapp <craig@ccrma.stanford.edu>
# Creation Date: Sun Jan 18 15:31:21 PST 2015
# Last Modified: Sun Jan 18 15:31:24 PST 2015
# Filename:      .../example/cli/Makefile
# Syntax:        GNU Makefile
#
# Description:	 Makefile for testing command line programs.
#

all: test1 test2 test3 test4
aton2json: test1 test2
json2aton: test3 test4


test1:
	./aton2json test.aton

test2:
	cat test.aton | ./aton2json

test3:
	./json2aton test.json

test4:
	cat test.json | ./json2aton


