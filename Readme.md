# play-nicely

## Description

This is a service location implementation that uses Constructor injection to satisfy dependencies

At the moment it is "sequential", i.e. any dependency must be "please"'d before a "thankYou" can be made,
otherwise an error will occur (strict mode) or the dependency will fail.

I'm guessing there will have to be a failure if there is a cyclic dependency! Need to test for this.

## TODO

Would it be possible to delay Constructor injection until the listed dependencies are satisfied, by making thankYou() async?

This probably wont work because of the use of require() and its return value of export/module.exports
We could end up in promise hell!

I think it is better to know that a dependency has not been satisfied earlier?


## Installation

```
$ npm install play-nicely
```

## Usage

```
var di = require('play-nicely')();
```

Say something about the options object...
```
var di = require('play-nicely')({global: false, strict: true});
```
## License

(The MIT License)

Copyright (c) 2013 Dave McNaughton &lt;dave@somewhere.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.