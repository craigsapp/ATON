---
layout: index
---


ATON
===============

ATON stands for "AT Object Notation."  It functions in a similar
manner to JSON, the main difference being that property values are
allowed to contain un-escaped line breaks in ATON property values.
Property keys are indicated by starting a line with the "@" symbol,
followed by the property name, then a colon (:) and then the property
value, which may extend across multiple lines of text until the next
@ marker at the start of a line.  Here is a simple example of an ATON file:

<center>
<table style="with:450px;;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:100px;">
@key1: value1
@key2: value2
line2 of value2
@key3: value3
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:100px;">
{
   key1: "value1",
   key2: "value2\nline2 of value2",
   key3: "value3"
}
</td>
</tr>
</table>
</center>

ATON Content is converted from a string into a JavaScript object
with the `.parse()` method.  The process can be reversed by using the
`.stringify()` method.  

### Nested properties

Nested properties can be represented by enclosing
them in the meta tags "`@@START: property-name`" and "`@@END: property-name`":

<center>
<table style="with:450px;;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:170px;">
@key1: value1
@@START: key2
@key2a: value2a
@key2b: value2b
@key2c: value2c
@@END: key2
@key3: value3
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:170px;">
{
   key1: "value1",
   key2: 
   {
      key2a: "value2a",
      key2b: "value2b",
      key2c: "value2c"
   }
   key3: "value3"
}
</td>
</tr>
</table>
</center>

Meta tags such as `@@START:` are case insenstive, so `@@start:` is equivalent.
In addition `@@BEGIN:` is an alias for `@@START:`, and `@@STOP:` is an
alias for `@@END:`. Ending meta tags may optionally repeat the property name.  
If so, then the name will be checked against the opening name, and an error 
will be generated if they do not match.  If the file ends without a matching `@@END:` tag, it will be inserted automatically.


### Property arrays

If a property name is repeated at any object level, then the individual
values from multiple entries with the same name will be collected into
an array:

<center>
<table style="with:450px;;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:170px;">
@key1: value1
@key2: value2a
@key2: value2b
@key3: value3
@key2: value2c
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:170px;">
{
   key1: "value1",
   key2: 
   [
      "value2a",
      "value2b",
      "value2c"
   ]
   key3: "value3"
}
</td>
</tr>
</table>
</center>



## Online example

{% include aton-test.html %}


## Usage in Node applications

The ATON module can be installed for use in [node](http://nodejs.org) by
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
     key3b: 2.71828,
     key3c: [ 1, -45, 3 ] },
  key4: 'value4' }
```

Whitespace before and after a parameter value is removed automatically
during parsing.  Also notice that multi-line values contain an
escaped newline character in the translation to a JavaScript object.
Meta entries starting with "@@TYPE" set the data type for parameters
with a given name, such as "Number" to parse the property value as
a number and "Integer" to parse as an integer.


## Command-line

There are two command-line interfaces to the ATON code:

* [aton2json](https://github.com/craigsapp/ATON/blob/master/example/cli/aton2json) &mdash; converts ATON files into JSON files.
* [json2aton](https://github.com/craigsapp/ATON/blob/master/example/cli/json2aton) &mdash; converts JSON files into ATON files.

The input data can be piped into the programs, or it can be given through 
a filename in the command-line arguments list:

``` bash
aton2json file.aton > file.json
cat file.json | json2aton
```


## Browser

The JavaScript files for ATON can also be used within
a webpage by including the main JavaScript file for ATON:

``` HTML
<script src="aton.js"></script>
```

### Reading a file from the server

Here is an example of how to read an ATON file from the sever and parse
into a JavaScript object:

``` javascript
function loadAtonFile(filename) {
   var request = new XMLHttpRequest();
   request.open('GET', filename);
   request.addEventListener('load', function () {
      var atondata = this.responseText;
      console.log("ATON data:", atondata);
      var aton = new ATON;
      var object = aton.parse(atondata);
      console.log("JavaScript object:", object);
   });
   request.addEventListener('error', function() {
      console.error(this.statusText);
   });
   request.send();
}

```



## Testing

Input and output from the code can be tested using
[mocha](http://mochajs.org) and the JavaScript files in the `test`
directory.  To test from a node installation:

``` bash
$ npm install   # to download mocha dependency if necessary
$ npm test
```


