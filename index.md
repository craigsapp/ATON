---
layout: index
---

<span style="height:40px;"></span>

<span style="font-weight:900; letter-spacing:2px;">ATON</span>
stands for "AT Object Notation."  It has similar functionality to
[JSON](http://en.wikipedia.org/wiki/JSON), with the main difference
being that ATON property values are allowed to contain unescaped
line breaks.  Property names are indicated by starting a line with
the "@" symbol, followed by the property name and then a colon (:).
Property values follow the colon and may span multiple lines until
the next property name or control message is found.  Here is a
simple example of an ATON file with three key/value pairs:

<center>
<table style="with:450px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:90px;">
@key1: value1
@key2: value2
line2 of value2
&nbsp;
@key3: value3
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:90px;">
{
   key1: "value1",
   key2: "value2\nline2 of value2",
   key3: "value3"
}
</td>
</tr>
</table>
</center>

Notice that any whitespace before or after a property value is
automatically removed when parsing into a JavaScript object.  This
can allow visual separation and grouping of parameters with blank
lines as in the above example.  ATON strings are converted into a
JavaScript object with the `ATON.parse()` method.  The process can
be reversed by using the `ATON.stringify()` method.



### Nested property lists

Property values can themselves contain recursive lists of properties.
The control tags "`@@START: property-name`" and "`@@END: property-name`"
is used to indicate the beginning and ending points of the property list.
In the following example, the "`key2`" property has a value which itself
is a list of properties whose keys are "`key2a`", "`key2b`" and "`key2c`".

<center>
<table style="with:450px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:180px;">
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
<pre style="height:180px;">
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

Control tags such as "`@@START:`" are case insensitive, so "`@@start:`"
is equivalent.  In addition "`@@BEGIN:`" is an alias for "`@@START:`",
and "`@@STOP:`" is an alias for "`@@END:`". Property names in ending
control tags are optional: including them will force a check to
ensure that the closing tag matches to an opening tag with the same
name.  If the file ends without a matching "`@@END:`" tag, it will
be inserted automatically.



### Property value arrays

If a property name is repeated on a specific object level, then the
individual values from multiple entries with the same property name
will be collected into a single array:

<center>
<table style="with:450px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:180px;">
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
<pre style="height:180px;">
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


### Property value data types.

By default all property values will be parsed as strings in JavaScript.
The control message "`@@TYPE:tag:Number` will convert any properties
which have the name *tag* into Numbers when parsing the ATON string.
Likewise "`@@TYPE:tag:Integer` will convert the string to an Integer
(by chopping off fractional values of floating point numbers.

<center>
<table style="with:450px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:100px;">
@@TYPE:key2:Number
@@TYPE:key3:Integer
@key1: 1
@key2: 2.71828
@key3: 3.14159
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:100px;">
{
   key1: "1",
   key2: 2.71828,
   key3: 3
}
</td>
</tr>
</table>
</center>

The "`TYPE`" control message and the data types, such as "`Number`" and
"`Integer`", are case insensitive.  The case of the property tag must match
that of the property name to which the type conversion will be applied.
The type messages will (currently) act on properties at any
hierarchical level.  You can change the type-cast by inserting a
type control message before any properties.  To cancel type-casting
of a particular parameter name, use the control message
"`@@TYPE:tag:String`".


#### embedded JSON string parsing

The "`@@TYPE:tag:JSON`" control message will cause all property names matching
"`tag`" to be interpreted as a JSON string and parsed as such.  The following
example reads an array of integers

<center>
<table style="with:150px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:90px;">
@@TYPE:key2:JSON
@key1: 1
@key2: [1,2,3]
@key3: 3
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:90px;">
{
   key1: "1",
   key2: [1, 2, 3],
   key3: "3"
}
</td>
</tr>
</table>
</center>

The above ATON data is equivalent to the following example which does
not use an embedded JSON string:

<center>
<table style="with:150px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:110px;">
@@TYPE:key2:Number
@key1: 1
@key2: 1
@key2: 2
@key2: 3
@key3: 3
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:110px;">
{
   key1: "1",
   key2: [1, 2, 3],
   key3: "3"
}
</td>
</tr>
</table>
</center>



### Comments

Comments are lines which start with "`@`" but are not property names
or control messages.  The "`@`" character should be followed by a
space or at least three more "`@`" characters.  Comments can interrupt
multi-line property values.  To indicate an "`@`" character at the
start of a line in a property value, escape it by preceding it with
a backslash.  Backslashes at the start of a line should also be
escaped with a backslash.  These characters should not be escaped
if they do not start in the first position in a line.

<center>
<table style="with:450px;">
<tr valign=top>
<td style="margin:10px;">
ATON
<pre style="height:330px;">
This is a bad comment
@ This is a good comment
@@@@This is a comment
@key1: value1
value1b
\@value1c
\\value1d
@ This is a comment
 &nbsp;
@@START:key2
@key2: value2
@@END:key2
This is an OK comment
 &nbsp;
@key3: value3
@ interrupting comment
and @value3b
</pre>
</td>
<td style="width:50px;"></td>
<td style="margin:10px;">
JavaScript object
<pre style="height:330px;">
{
   key1: "value1\nvalue1b\n@value1c\n\\value1d",
   key2: { key2: "value2"},
   key3: "value3\nand @value3b"
}
</td>
</tr>
</table>
</center>

Free text at the start of an ATON file is technically a comment
since it is not associated with a property name.  But if files are
concatenated together, the comments may become attached to the
last property in the previous file.  Free text after an "`@@END:`"
control message will also be interpreted as a comment.

<a name=online> </a>
## Online conversion example

{% include aton-test.html %}



## Using in Node applications

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
Control entries starting with "@@TYPE" set the data type for parameters
with a given name, such as "Number" to parse the property value as
a number and "Integer" to parse as an integer.


## Using on the command-line

There are two command-line interfaces to the ATON code:

* [aton2json](https://github.com/craigsapp/ATON/blob/master/example/cli/aton2json) &mdash; converts ATON files into JSON files. Options:
 * __-p__ &rarr; pretty-print JSON output.
 * __-i *string*__ &rarr; indenting characters when pretty printing.
* [json2aton](https://github.com/craigsapp/ATON/blob/master/example/cli/json2aton) &mdash; converts JSON files into ATON files.

The input data can be piped into the programs, or it can be given through
a filename in the command-line arguments list:

``` bash
aton2json file.aton > file.json
cat file.json | json2aton
```


## Using in a web browser

The [source code for
ATON](https://github.com/craigsapp/ATON/blob/master/lib/aton.js)
can be used in a web browser as well as in node.  A
[makefile](https://github.com/craigsapp/ATON/blob/master/lib/Makefile) in
the [lib](https://github.com/craigsapp/ATON/tree/master/lib) directory
also shows how to create a [minified version of the
code](http://aton.sapp.org/javascripts/aton.min.js).

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


