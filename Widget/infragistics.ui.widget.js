/*!@license
 * Infragistics.Web.ClientUI Widget 1.0.0
 *
 * Copyright (c) 2011-<year> Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 *  Built and tested with jquery-3.3.1.min.js;
 *	jquery.ui.core.js;
 *	jquery.ui.widget.js
 */

/*global jQuery */
if (typeof jQuery !== "function") {
	throw new Error("jQuery is undefined");
}

(function ($) {
    /*
		igCountdown is a widget based on jQuery UI that counts down to zero, from a specified start.
		It supports stopping, pausing, as well as auto-start and self-destroy.
		As well as it throws events for all of the aforementioned actions.
	*/
	$.widget('ui.igCountdown', {
		css: {
			/* igWidget element classes go here */
			container: 'widget',
			counter: 'counter'
		},
        options: {
			/* igWidget options go here */
			startValue : 10,
			resetMessage : "Resetted",
			pauseMessage : "Paused",
			elapsedMessage: "Timer has elapsed!",
			autoStart : false,
			delta : 1
        },
		events: {
			started: 'started',
			resumed: 'resumed',
			paused: 'paused',
			reset: 'reset',

			tick: 'tick',
			elapsed: 'elapsed',

			rendering: 'rendering',
			rendered: 'rendered'
		},
		_running: false,
		_paused: false,
		_currentValue : null,
		setCurrentValue: function (newValue) {
			if (!this._constrain(newValue)) {
				return;
			}

			this._currentValue = newValue;
		},
		_start: function () {
			this._triggerStarted();
		},
		_pause: function () {
			this._triggerPaused();
		},
		_reset: function () {
			this._triggerReset();
		},
		_triggerStarted: function () {		
			if (!this._constrain(this._currentValue)) {
				return;
			}

			if (this._paused) {
				this._triggerResumed();
			}
			else if (!this._running) {
				let args = {
					owner: this
				}

				this._running = true;
				this._trigger(this.events.started, null, args);
				this._beginCountdown();
			}
		},
		_triggerPaused: function () {
			if (!this._constrain(this._currentValue)) {
				return;
			}

			if (!this._paused && this._currentValue != this.options.startValue) {
				let args = {
					owner: this
				}

				this._paused = true;
				this._trigger(this.events.paused, null, args);
				clearInterval(this._intervalID);
			}
		},
		_triggerReset: function () {
			let args = {
				owner: this
			}

			if (!this._constrain(this.options.startValue) || this._currentValue === this.options.startValue) {
				return;
			}

			clearInterval(this._intervalID);
			this._trigger(this.events.reset, null, args);

			let output = this.element.children().find('.output');
			if (this._currentValue <= 3) {
				output.removeClass('blink');
			}

			this._currentValue = this.options.startValue;
			output.text(this.options.startValue);
			output.removeClass('end');

			this._running = false;
			this._paused = false;
		},
		_triggerResumed: function () {
			let args = {
				owner: this
			}

			this._trigger(this.events.resumed, null, args);
			this._beginCountdown();
		},
		_triggerTick: function () {
			let args = {
				owner: this,
				_currentValue: this._currentValue
			};
			
			this._trigger(this.events.tick, null, args);
		},
		_triggerElapsed: function () {
			let args = {
				owner: this
			}

			clearInterval(this._intervalID)
			this._trigger(this.events.elapsed, null, args);
		},
		_triggerRendering: function () {
			let args = {
				owner: this
			}

			return this._trigger(this.events.rendering, null, args);
		},
		_triggerRendered: function () {
			let args = {
				owner: this
			}

			this._trigger(this.events.rendered, null, args);
		},
		_render: function () {
			let div = $('<div />');
			div.append('<span />');
			div.addClass(this.css.container);
			
			this.element.prepend(div);

			this._renderButtons();
			this._renderWidgetStartValue();		
		},
		_renderWidgetStartValue: function () {
			let counter = this.element.children().find('span');
			counter.addClass('counter');
			counter.append("<span />");
			
			let output = this.element.children().find('.counter > span');
			output.addClass('output');
			
			if (!this._constrain(this.options.startValue)) {
				return;
			}

			this._currentValue = this.options.startValue;

			output.text(this._currentValue);
		},
		_renderButtons: function () {
			let widget = this.element;
			
			let buttonsHolder = $('<div />');
			buttonsHolder.addClass('buttons');
			buttonsHolder
			.append(`<button id="str">`)
			.append(`<button id="psr">`)
			.append(`<button id="rst">`)
			.append(`<button id="dstr">`);
			
			widget.append(buttonsHolder);

			this._addButtonClasses();
		},
		_addButtonClasses: function () {
			let start = $(`.buttons > #str`);
			start.addClass('start');
			start.text("Start");

			let pause = $(`.buttons > #psr`);
			pause.addClass('pause');
			pause.text("Pause");

			let reset = $(`.buttons > #rst`);
			reset.addClass('reset');
			reset.text("Reset");

			let destroy = $(`.buttons > #dstr`);
			destroy.addClass('destroy');
			destroy.text('Destroy');
		},
		_beginCountdown: function() {	
			this._paused = false;
			this._intervalID = setInterval($.proxy(this._decrementCurrentValue, this, true), 1000);
		},
		_decrementCurrentValue: function (raiseEvent) {
			this._currentValue -= this.options.delta;

			let output = this.element.children().find('.output');

			if (raiseEvent) {
				this._triggerTick();
			}
			if (this._currentValue <= 3) {
				output.addClass('blink');
			}
			if (this._currentValue > 0) {
				output.text(this._currentValue);
				return;
			}
			
			output.text(this._currentValue);
			output.addClass('end');
			output.removeClass('blink');
			this._triggerElapsed();
		},
        _create: function () {
			/* igWidget constructor goes here */
			
			this._attachEvents();

			if (this.options.autoStart) {
				this._triggerStarted();
			}
		},
		_attachEvents: function () {
			let widgetInstance = this;

			this._on(this.element, {
				'click .buttons': function (event) {
					event.stopImmediatePropagation();
					switch (event.target.id) {
						case 'str':
							widgetInstance._start();
						break;
						case 'psr':
							widgetInstance._pause();
						break;
						case 'rst':
							widgetInstance._reset();
						break;
						case 'dstr':
							widgetInstance.destroy();
						break;
					}
				}
			});

			// this.element.delegate('.buttons', {
			// 	'click': function (event) {
			// 		event.stopImmediatePropagation();
			// 		switch (event.target.id) {
			// 			case 'str':
			// 				widgetInstance._start();
			// 			break;
			// 			case 'psr':
			// 				widgetInstance._pause();
			// 			break;
			// 			case 'rst':
			// 				widgetInstance._reset();
			// 			break;
			// 			case 'dstr':
			// 				widgetInstance.destroy();
			// 			break;
			// 		}
			// 	}
			// });

			// $('.buttons').on('click', '.start', function (event) {
			// 	event.stopImmediatePropagation();
			// 	widgetInstance._start();
			// });

			// $('.buttons').on('click', '.pause', function (event) {
			// 	event.stopImmediatePropagation();
			// 	widgetInstance._pause();
			// });

			// $('.buttons').on('click', '.reset', function (event) {
			// 	event.stopImmediatePropagation();
			// 	widgetInstance._reset();
			// });

			// $('.buttons').on('click', '.destroy', function (event) {
			// 	event.stopImmediatePropagation();
			// 	widgetInstance.destroy();
			// });

			let renderingEnabled = this._triggerRendering();
			if (renderingEnabled) {
				this._render();
				this._triggerRendered();	
			} else {
				console.log(`Rendering disabled for element #${widgetInstance.element[0].id}.`);
			}
		},
		_constrain: function(value) {
			if (isNaN(value)) {
				return false;
			}
			if (value <= 0) {
				return false;
			}

			return true;
		},
        _setOption: function (option, value) {
			/* igWidget custom setOption goes here */
			let css = this.css, elements, prevValue = this.options[option];
			
			if (!this._constrain(value)) {
				return;
			}
			if (prevValue === value) {
				return;
			}

			// The following line applies the option value to the igWidget meaning you don't
			// have to perform this.options[option] = value;
			$.Widget.prototype._setOption.apply(this, arguments);
			
			return true;
        },
        destroy: function () {
            /* igCountdown destructor - unbind all event handlers, remove dynamically added classes and 
				dynamically added elements in the widget element's DOM
			*/

			this.element.removeClass(this.css.counter);
			this.element.removeClass(this.css.container);

			this.element.off();
			this.element.empty();

			clearInterval(this._intervalID);

			$.Widget.prototype.destroy.apply(this, arguments);
        }
    });
    $.extend($.ui.igCountdown, {version: '<build_number>'});
}(jQuery));
