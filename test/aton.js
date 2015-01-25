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

it('Don\'t remove intermediate whitespace',
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
describe('Comment behavior tests', function () {


it('Test free-text comment at start of file',
	function () {
		var aton = new ATON();
		var test = 'a comment\n@@BEGIN:A\n@@BEGIN:B\n@X:x\n@@END:B\n@@END:A';
		var target = '{"A":{"B":{"X":"x"}}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Test regular comment splitting a multi-line value',
	function () {
		var aton = new ATON();
		var test = '@@BEGIN:A\n@@BEGIN:B\n@X:x\n@ comment\ny\n@@END:B\n@@END:A';
		var target = '{"A":{"B":{"X":"x\\ny"}}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Test free-text commen after @@END marker',
	function () {
		var aton = new ATON();
		var test = '@@BEGIN:A\n@@BEGIN:B\n@X:x\n@@END:B\ncomment\n@@END:A';
		var target = '{"A":{"B":{"X":"x"}}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Ignore comments after single-line parameters.',
	function () {
		var aton = new ATON();
		var test = '@A:a\n@ comment\n@B:b\n';
		var target = '{"A":"a","B":"b"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Ignore comments after multi-line parameters.',
	function () {
		var aton = new ATON();
		var test = '@A:a\na2\n@ comment\n@B:b\n';
		var target = '{"A":"a\\na2","B":"b"}';
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

it('Testing typecast of JSON string',
	function () {
		var aton = new ATON();
		var test = '@@TYPE:X:JSON\n@@BEGIN:A\n@X:[1,2,3,4]\n@@END:A';
		var target = '{"A":{"X":[1,2,3,4]}}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
describe('Arrays of objects', function() {

it('Testing typecast of JSON string',
	function () {
		var aton = new ATON();
		var test = '@@BEGIN:X\n@x:v1\n@@END:X\n@@BEGIN:X\n@x:v2\n@@END:X\n@@BEGIN:X\n@x:v3\n@@END:X\n';
		var target = '{"X":[{"x":"v1"},{"x":"v2"},{"x":"v3"}]}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Complicated array/object interaction',
	function () {
		var aton = new ATON();
		var test = '@@BEGIN:X\n@x:v1\n@@END:X\n@@BEGIN:X\n@x:v2\n@@BEGIN:Y\n@y:w1\n@@END:Y\n@@BEGIN:Y\n@y:w2\n@@END:Y\n@@BEGIN:Y\n@y:w3\n@@END:Y\n@x:v3\n@@END:X\n@@BEGIN:X\n@x:v4\n@@END:X\n';
		var target = '{"X":[{"x":"v1"},{"x":["v2","v3"],"Y":[{"y":"w1"},{"y":"w2"},{"y":"w3"}]},{"x":"v4"}]}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
describe('Manipulating property name cases', function() {


it('Testing converting property names to lower case',
	function () {
		var aton = new ATON();
		aton.setLCKeys();
		var test = '@X:1\n';
		var target = '{"x":"1"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Testing converting property names to upper case',
	function () {
		var aton = new ATON();
		aton.setUCKeys();
		var test = '@x:1\n';
		var target = '{"X":"1"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Testing converting property names to same case',
	function () {
		var aton = new ATON();
		aton.setUCKeys();
		aton.setOCKeys();
		var test = '@x:1\n';
		var target = '{"x":"1"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Testing type-casting when converting property names to lower case',
	function () {
		var aton = new ATON();
		aton.setLCKeys();
		// The defintion TYPE:X:Number should be used in this case since the 
		// original parameter is capital, eventhough it will be converted by the
		// parser into lower case due to aton.setLCKeys() being run.  In other
		// words, the original data does not know about the options set by the
		// parser, so it would be bad for the parser options to affect the 
		// actions of the type-casting.
		var test = '@@TYPE:X:Number\n@@TYPE:x:Integer\n@X:1.23\n';
		var target = '{"x":1.23}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Testing type-casting when converting property names to upper case',
	function () {
		var aton = new ATON();
		aton.setUCKeys();
		var test = '@@TYPE:x:Number\n@@TYPE:X:Integer\n@x:1.23\n';
		var target = '{"X":1.23}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
describe('Testing escape characters', function() {


it('Escape @ charcter in multi line value',
	function () {
		var aton = new ATON();
		var test = '@x:y\n\\@z\n';
		var target = '{"x":"y\\n@z"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Not escaping @ charcter in multi line value',
	function () {
		var aton = new ATON();
		var test = '@x:y\n@z\n';
		var target = '{"x":"y"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Single backslash',
	function () {
		var aton = new ATON();
		var test = '@x:\\\n';
		var target = '{"x":"\\\\"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);

it('Escape \@ charcters in multi line value',
	function () {
		var aton = new ATON();
		var test = '@x:y\n\\\\@z\n';
		var target = '{"x":"y\\n\\\\@z"}';
		var result = aton.parse(test);
		assert.deepEqual(target, JSON.stringify(result));
	}
);


});
});



