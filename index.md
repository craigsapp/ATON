---
layout: index
---


ATON
===============

ATON stands for "AT Object Notation."  It functions in a similar
manner to JSON, the main difference is that property values are
allowed to contain un-escaped line breaks in ATON property values.
Property keys are indicated by starting a line with the "@" symbol,
followed by the property name, then a colon (:) and then the property
value.  Here is a simple example of an ATON file:

<center>
<table>
<tr valign=top>
<td>
ATON file:
<pre>
@key1: value1
@key2: value2
@key3: value3
</pre>
</td>
<td>
JavaScript object:
<pre>
{
   key1: "value1",
   key2: "value2",
   key3: "value3"
}
</td>
</tr>
</table>
</center>


ATON Content is converted from a string into a JavaScript object
with the `.parse()` method.  The process can be reversed by using the
`.stringify()` method.

## Online example

{% include aton-test.html %}


## Usage in Node applications

This module can be installed for use in [node](http://nodejs.org) by
installing globally with the command:

``` bash
$ npm install -g aton
```

If you want to use only locally within a node project, then install
as a package dependency with the command:

``` bash
$ npm install --save aton
```

Here is an example of loading the module into a node script and processing
an ATON string.  This string contains most of the capabilities of
ATON.

* **key1** is a single-line value.
* **key2** has a multi-line value, containing a literal newline.
* **key3** has an object as its value.
* **key3b** is a floating-point number.
* **key3c** has three integer values which are packed into a JavaScript array.

``` javascript
var aton = require('aton');
var ATON = new aton();

var atonString = '';
atonString += '@@type:key3c:Integer\n';
atonString += '@@type:key3b:Number\n';
atonString += '@key1: value1\n';
atonString += '@key2: value2\n';
atonString += 'value2 continued\n';
atonString += '@@begin: key3\n';
atonString += '@key3a: value3a\n';
atonString += 'value3a continued\n';
atonString += 'value3a continued further\n';
atonString += '@key3b: 2.71828\n';
atonString += '@key3c: 1\n';
atonString += '@key3c: -45\n';
atonString += '@key3c: 3.14\n';
atonString += '@@end: value3\n';
atonString += '@key4: value4\n';
console.log(atonString);
var obj = ATON.parse(atonString);
console.log('\n', obj);
```

The above code should output the following text to the console:

``` text
@@type:key3c:Integer
@@type:key3b:Number
@key1: value1
@key2: value2
value2 continued
@@begin: key3
@key3a: value3a
value3a continued
value3a continued further
@key3b: 2.71828
@key3c: 1
@key3c: -45
@key3c: 3.14
@@end: value3
@key4: value4

 { key1: 'value1',
  key2: 'value2\nvalue2 continued',
  key3:
   { key3a: 'value3a\nvalue3a continued\nvalue3a continued further',
     key3b: 'value3b',
     key3c: [ 1, -45, 3 ] },
  key4: 'value4' }
```

Whitespace before an after a parameter value is removed automatically
during the conversion process.  Also notice that multi-line values
contain an escaped newline character in the translation to a
JavaScript object. Meta entries starting with "@@TYPE" set the data
type for parameters with a given name, such as "Number" to parse the
property value as a number and "Integer" to parse as an integer.


## Browser

The JavaScript files for ATON can also be used within
a webpage by including the main JavaScript file for ATON:

``` HTML
<script src="aton.js"></script>
```

Visit the [ATON homepage](http://aton.sapp.org) to try an online
demo of ATON parser running within a webpage.


## Testing

Input and output from the code can be tested using
[mocha](http://mochajs.org) and the JavaScript files in the `test`
directory.  To test from a node installation:

``` bash
$ npm install   # to download mocha dependency if necessary
$ npm test
```


## Website

The website for ATON documentation is
[http://aton.sapp.org](http://aton.sapp.org).

And the corresponding GitHub repository is
[https://github.com/craigsapp/aton](https://github.com/craigsapp/aton).


