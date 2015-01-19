// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Fri Jan  9 22:05:11 PST 2015
// Last Modified: Fri Jan  9 22:05:13 PST 2015
// Filename:      .../test/ATON.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1, Node 0.10
// vim:           ts=3
//
// Description:   Tests of the ATON object.  Intended to be run
//                with the mocha JavaScript test framework with the command:
//                   mocha ATON.js
//                Install mocha with the command:
//                   npm install mocha -g
//                Install npm via node installation, such as:
//                   brew install node   # Apple OS X
//                   yum install node    # Fedora Linux
//                You can also run "make test" in this directory, or
//                "make test" in the parent directory, or "npm test"
//                in the parent directory.
//

// http://nodejs.org/api/assert.html
var assert = require('assert');

// Load the ATON base members for testing:
var ATON = require('aton');


describe('ATON parsing tests', function() {
describe('Parsing simple parameters', function () {


it('Create object with a single property',
	function () {
		var aton = new ATON();
		var test = '@A:b\n';
		var target = '{"A":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object with a single property, no newline termination',
	function () {
		var aton = new ATON();
		var test = '@A:b';
		var target = '{"A":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object with two properties',
	function () {
		var aton = new ATON();
		var test = '@A:a\n@B:b';
		var target = '{"A":"a","B":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object with two properties in different order',
	function () {
		var aton = new ATON();
		var test = '@B:b\n@A:a';
		var target = '{"B":"b","A":"a"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object with three properties',
	function () {
		var aton = new ATON();
		var test = '@A:a\n@B:b\n@C:c';
		var target = '{"A":"a","B":"b","C":"c"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object with a single multi-line property',
	function () {
		var aton = new ATON();
		var test = '@A:b\nc';
		var target = '{"A":"b\\nc"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
describe('Whitespace behiavior', function () {


it('Remove whitespace after value',
	function () {
		var aton = new ATON();
		var test = '@A:b ';
		var target = '{"A":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Remove whitespace before value',
	function () {
		var aton = new ATON();
		var test = '@A: b';
		var target = '{"A":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Remove whitespace before and after value',
	function () {
		var aton = new ATON();
		var test = '@A: b';
		var target = '{"A":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Remove initial whitespace on multi-line value',
	function () {
		var aton = new ATON();
		var test = '@A: b\nc';
		var target = '{"A":"b\\nc"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Remove ending whitespace on multi-line value',
	function () {
		var aton = new ATON();
		var test = '@A:b\nc ';
		var target = '{"A":"b\\nc"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Remove starting and ending whitespaces on multi-line value',
	function () {
		var aton = new ATON();
		var test = '@A:\n\t b\nc\n \t';
		var target = '{"A":"b\\nc"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Don\'t removed intermediate whitespace',
	function () {
		var aton = new ATON();
		var test = '@A:\n\t b \n\tc\n \t';
		var target = '{"A":"b \\n\\tc"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
describe('Parsing array parameters', function () {


it('Create object with one one property with an array',
	function () {
		var aton = new ATON();
		var test = '@A:a\n@A:b\n@A:c';
		var target = '{"A":["a","b","c"]}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create array property with dislocated values',
	function () {
		var aton = new ATON();
		var test = '@A:a\n@Z:z\n@A:b\n@Y:y\n@A:c';
		var target = '{"A":["a","b","c"],"Z":"z","Y":"y"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
describe('Create subobject parameters', function () {


it('Create object property',
	function () {
		var aton = new ATON();
		var test = '@@BEGIN:A\n@X:x\n@@END:A';
		var target = '{"A":{"X":"x"}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object property with alternate control names',
	function () {
		var aton = new ATON();
		var test = '@@START:A\n@X:x\n@@STOP:A';
		var target = '{"A":{"X":"x"}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object property with lower-case control names',
	function () {
		var aton = new ATON();
		var test = '@@begin:A\n@X:x\n@@stop:A';
		var target = '{"A":{"X":"x"}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create object property with mixed-case control names',
	function () {
		var aton = new ATON();
		var test = '@@Begin:A\n@X:x\n@@End:A';
		var target = '{"A":{"X":"x"}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Create nested object property',
	function () {
		var aton = new ATON();
		var test = '@@BEGIN:A\n@@BEGIN:B\n@X:x\n@@END:B\n@@END:A';
		var target = '{"A":{"B":{"X":"x"}}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
});
describe('Advanced parsing tests', function() {
describe('Typecasting parameters', function() {


it('Convert parameter to Number type',
	function () {
		var aton = new ATON();
		var test = '@@TYPE:X:Number\n@@BEGIN:A\n@X:-23.45\n@@END:A';
		var target = '{"A":{"X":-23.45}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Convert parameter to Integer type',
	function () {
		var aton = new ATON();
		var test = '@@TYPE:X:Integer\n@@BEGIN:A\n@X:-23.45\n@@END:A';
		var target = '{"A":{"X":-23}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Testing ignore case on typecast control message',
	function () {
		var aton = new ATON();
		var test = '@@TYPE:X:InTeGeR\n@@BEGIN:A\n@X:23.95\n@@END:A';
		var target = '{"A":{"X":23}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Testing ignore case on typecast control message',
	function () {
		var aton = new ATON();
		var test = '@@TYPE:X:InTeGeR\n@@BEGIN:A\n@X:23.95\n@@END:A';
		var target = '{"A":{"X":23}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
});



