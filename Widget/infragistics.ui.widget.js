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
			currentValue : null,
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
		_stop: function () {
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
			if (!this._state.paused && this.options.currentValue != this.options.startValue) {
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
			if (this.options.currentValue <= 3) {
				output.removeClass('blink');
			}

			if (this._setOption('currentValue', this.options.startValue)) {
				output.text(this.options.currentValue);
			}

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
				currentValue: this.options.currentValue
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

			let div = $('<div />');
			div.append($('<span />'));
			div.addClass(this.css.container);
			
			this.element.prepend(div);
			
			this._renderButtons();
			this._renderWidgetStartValue();
			this._handleButtonClicks();
			
			this._triggerRendered();
		},
		_renderWidgetStartValue: function () {
			let counter = $('.widget > span');
			counter.addClass('counter');
			counter.append("<span />");

			let output = $('.counter > span');
			output.addClass('output');
			
			this._setOption('currentValue', this.options.startValue);

			output.text(this.options.currentValue);
		},
		_renderButtons: function () {
			let widget = $('.widget');
			
			let buttonsHolder = $('<div />');
			buttonsHolder.addClass('buttons');
			buttonsHolder
			.append('<button id="str">')
			.append('<button id="psr">')
			.append('<button id="rst">')
			.append('<button id="dstr">');
			
			widget.append(buttonsHolder);

			this._addButtonClasses();
		},
		_addButtonClasses: function () {
			let start = $('.buttons > #str');
			start.addClass('start');
			start.text("Start");

			let pause = $('.buttons > #psr');
			pause.addClass('pause');
			pause.text("Pause");

			let stop = $('.buttons > #rst');
			stop.addClass('reset');
			stop.text("Reset");

			let destroy = $('.buttons > #dstr');
			destroy.addClass('destroy');
			destroy.text('Destroy');
		},
		_handleButtonClicks: function () {
			let widgetInstance = this;
	
			$('.start').click(function () {
				widgetInstance._start();
			});
		
			$('.pause').click(function () {
				widgetInstance._pause();
			});
		
			$('.reset').click(function () {
				widgetInstance._stop();
			});
		
			$('.destroy').click(function () {
				widgetInstance.destroy();
			});
		},
		_beginCountdown: function() {
			this._intervalID = setInterval($.proxy(this._decrementCurrentValue, this, true), 1000);

			this._state.running = true;
			this._state.paused = false;
		},
		_decrementCurrentValue: function (raiseEvent) {
			this.options.currentValue -= this.options.delta;
			let output = $('.counter > span');

			if (raiseEvent) {
				this._triggerTick();
			}
			if (this.options.currentValue <= 3) {
				output.addClass('blink');
			}
			if (this.options.currentValue > 0) {
				output.text(this.options.currentValue);
				return;
			}
			
			output.text(this.options.currentValue);
			output.addClass('end');
			output.removeClass('blink');
			this._triggerElapsed();
		},
        _create: function () {
			/* igWidget constructor goes here */
			// $.Widget.prototype._create.apply(this);
			
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
