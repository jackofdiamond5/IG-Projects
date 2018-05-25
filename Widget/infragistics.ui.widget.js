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
			counter: 'count'
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
		setCurrentValue: function (newValue) {
			if(isNaN(newValue)) {
				return;
			}
			if(newValue < 0) {
				return;
			}

			this._currentValue = newValue;
		},
		_currentValue : null,
		_state: {
			running: false,
			paused: false
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
			if (this._state.paused) {
				this._triggerResumed();
			}
			else if (!this._state.running) {
				let args = {
					owner: this
				}

				this._trigger(this.events.started, null, args);
				this._beginCountdown();
			}
		},
		_triggerPaused: function () {
			if (!this._state.paused && this._currentValue != this.options.startValue) {
				let args = {
					owner: this
				}

				this._state.paused = true;
				this._trigger(this.events.paused, null, args);
				clearInterval(this._intervalID);
			}
		},
		_triggerReset: function () {
			let args = {
				owner: this
			}

			clearInterval(this._intervalID);
			this._trigger(this.events.reset, null, args);

			let output = $('.counter > span');
			// let output = $(this).find('.output');
			if (this._currentValue <= 3) {
				output.removeClass('blink');
			}


			//////////////////////////////////////////
			// if (this._setOption('_currentValue', this.options.startValue)) {
			output.text(this._currentValue);
			// }
			/////////////////////////////////////////

			output.removeClass('end');

			this._state.running = false;
			this._state.paused = false;
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

			this._trigger(this.events.rendering, null, args);
		},
		_triggerRendered: function () {
			let args = {
				owner: this
			}

			this._trigger(this.events.rendered, null, args);
		},
		_render: function () {
			this._triggerRendering();

			var randomId = Math.floor(Math.random() * 100);
			let div = $('<div />', {id: randomId});
			div.append('<span />');
			div.addClass(this.css.container);
			
			this.element.prepend(div);

			// console.log(this);
			// console.log(this.element);
			// console.log(this.element.children('.widget'));

			this._renderButtons(randomId);
			this._renderWidgetStartValue(randomId);
			this._handleButtonClicks(randomId);
			
			this._triggerRendered();
		},
		_renderWidgetStartValue: function (widgetId) {
			let counter = $(`#${widgetId} > span`);
			counter.addClass('counter');
			counter.append("<span />");

			let output = $('.counter > span');
			output.addClass('output');
			
			this._currentValue = this.options.startValue;

			output.text(this._currentValue);
		},
		_renderButtons: function (widgetId) {
			let widget = $(`#${widgetId}`);

			let buttonsHolder = $('<div />');
			buttonsHolder.addClass('buttons');
			buttonsHolder
			.append(`<button id="str${widgetId}">`)
			.append(`<button id="psr${widgetId}">`)
			.append(`<button id="rst${widgetId}">`)
			.append(`<button id="dstr${widgetId}">`);
			
			widget.append(buttonsHolder);

			this._addButtonClasses(widgetId);
		},
		_addButtonClasses: function (widgetId) {
			let start = $(`.buttons > #str${widgetId}`);
			start.addClass('start');
			start.text("Start");

			let pause = $(`.buttons > #psr${widgetId}`);
			pause.addClass('pause');
			pause.text("Pause");

			let reset = $(`.buttons > #rst${widgetId}`);
			reset.addClass('reset');
			reset.text("Reset");

			let destroy = $(`.buttons > #dstr${widgetId}`);
			destroy.addClass('destroy');
			destroy.text('Destroy');
		},
		_handleButtonClicks: function (widgetId) {
			// var x= $('ns\\:text').attr('value'); eventNamespace?
			let widgetInstance = this;
	
			$(`#str${widgetId}`).click(function () {
				widgetInstance._start();
			});
		
			$(`#psr${widgetId}`).click(function () {
				widgetInstance._pause();
			});
		
			$(`#rst${widgetId}`).click(function () {
				widgetInstance._reset();
			});
		
			$(`#dstr${widgetId}`).click(function () {
				widgetInstance.destroy();
			});
		},
		_beginCountdown: function() {
			this._intervalID = setInterval($.proxy(this._decrementCurrentValue, this, true), 1000);

			this._state.running = true;
			this._state.paused = false;
		},
		_decrementCurrentValue: function (raiseEvent) {
			this._currentValue -= this.options.delta;
			let allItems = $('.counter > span');
			
			let output = $(this).find(allItems);

			// console.log($(this))

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
			this._render();

			if (this.options.autoStart) {
				this._triggerStarted();
			}
        },
        _setOption: function (option, value) {
			/* igWidget custom setOption goes here */
			let css = this.css, elements, prevValue = this.options[option];
			
			if (isNaN(value)) {
				return false;
			}
			if (value <= 0) {
				return false;
			}
			if (prevValue === value) {
				return false;
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

			this.element.children(".widget").remove();
			clearInterval(this._intervalID);

			$.Widget.prototype.destroy.apply(this, arguments);
        }
    });
    $.extend($.ui.igCountdown, {version: '<build_number>'});
}(jQuery));
