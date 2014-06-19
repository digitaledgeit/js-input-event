# input-event

Make your `input` events work in IE8-9 too.

## Install

	component install digitaledgeit/js-input-event

## Methods

### .bind(el, callback, capture)

Start listening for `input` events on an `<input>` element.

### .unbind(el, callback, capture)

Stop listening for `input` events on an `<input>` element.

*Note: This functionality is not yet implemented in IE8-9. Please raise an issue if you require it.*

## Example

	var events = require('input-event');
	var el = document.querySelector('input[type=text]');

	events.bind(el, function() {
		console.log('Input text has changed!');
	});

## License

The MIT License (MIT)

Copyright (c) 2014 James Newell

Adapted from a [jQuery plugin](https://github.com/spicyj/jquery-splendid-textchange) by
[Ben Alpert](http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html).
