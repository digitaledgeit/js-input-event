/*
 * Shim to add support for input event on IE8 and IE9 - @see http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
 */

//check whether the input event is supported
var supported =
	'oninput' in document.createElement('input') &&
	(!('documentMode' in document) || document.documentMode > 9)
;

/**
 * Assert the element type - only can support `text` and `password` inputs on IE8
 * @param   {HTMLElement} el
 * @throws
 */
function assertElType(el) {

	//check the element type
	if (el.nodeName !== 'INPUT') {
		throw new Error('Element is not an input.');
	}

	//check the input type
	if (el.type !== 'text' && el.type !== 'password') {
		throw new Error('Element is not a text or password input.');
	}

}

module.exports = {

	/**
	 * Start listening for `input` events on an `<input>` element
	 * @param   {HTMLElement}   el
	 * @param   {function()}    listener
	 * @param   {boolean}       capture
	 * @returns {exports}
	 */
	bind: function(el, listener, capture) {
		assertElType(el);

		// === handle the event for modern browsers ===

		if (supported) {
			el.addEventListener('input', listener, capture);
			return this;
		}

		// === handle the event for Internet Explorer ===

		var
			focussed = false,
			oldValue,
			oldValueProperty,
			newValueProperty = {
				get: function() {
					return oldValueProperty.get.call(this);
				},
				set: function(val) {
					oldValue = val;
					oldValueProperty.set.call(this);
				}
			}
		;

		/**
		 * Triggers the input listener when the value property is changed
		 * @param {Event} event
		 */
		function onPropertyChange(event) {
			if (focussed && event.propertyName === 'value') {
				if (el.value !== oldValue) {
					oldValue = el.value;
					listener(event);
				}
			}
		}

		//for performance reasons start listening for change events when the input receives focus
		el.attachEvent('onfocus', function() {
			focussed = true;

			//get the old value and value property description
			oldValue = el.value;
			oldValueProperty = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value');

			//override the old value property
			Object.defineProperty(el, 'value', newValueProperty);

			//start listening for changes to the element properties
			el.attachEvent('onpropertychange', onPropertyChange);

		});

		//for performance reasons stop listening for change events when the input loses focus
		el.attachEvent('onblur', function() {
			focussed = false;

			//stop listening for changes to the element properties
			el.detachEvent('onpropertychange', onPropertyChange);

			//remove the overriden value property
			delete el.value;

			//set the old value and value property description
			oldValue = null;
			oldValueProperty = null;

		});

		/**
		 * Triggers the input listener when the value property is changed - IE9 fails to fire propertychange event on the first input after a value is set via JS
		 * @param event
		 */
		function onKeyPress(event) {
			if (focussed && el.value !== oldValue) {
				oldValue = el.value;
				listener(event);
			}
		}

		el.attachEvent('onselectionchange', onKeyPress);
		el.attachEvent('onkeydown', onKeyPress);
		el.attachEvent('onkeyup', onKeyPress);

	},

	/**
	 * Stop listening for `input` events on an `<input>` element
	 * @param   {HTMLElement}   el
	 * @param   {function()}    listener
	 * @param   {boolean}       capture
	 * @returns {exports}
	 */
	unbind: function(el, listener, capture) {
		assertElType(el);

		// === handle the event for modern browsers ===

		if (supported) {
			el.removeEventListener('input', listener, capture);
			return this;
		}

		// === handle the event for Internet Explorer ===

		throw new Error('Unbind is not yet supported. Create an issue on Github if you require it.');

	}

};
