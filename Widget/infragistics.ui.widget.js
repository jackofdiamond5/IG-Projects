/*!@license
 * Infragistics.Web.ClientUI Widget <build_number>
 *
 * Copyright (c) 2011-<year> Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 *  jquery-<min_supported_version>.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

/*global jQuery */
if (typeof jQuery !== "function") {
	throw new Error("jQuery is undefined");
}

(function ($) {
    /*
		igWidget is a widget based on jQuery UI that <widget_description>
	*/
	$.widget('ui.igWidget', {
		css: {
			/* igWidget element classes go here */
			container: 'widget',
			counter: 'count'
		},
        options: {
			/* igWidget options go here */
			startValue : 10,
			currentValue : null,
			stopMessage : "Stopped",
			pauseMessage : "Paused",
			elapsedMessage: "Timer has elapsed!",
			autoStart : false,
			delta : 1
        },
		events: {
			elapsed: 'elapsed',
			tick: 'tick',
			rendering: 'rendering',
			rendered: 'rendered',
			started: 'started',
			stopped: 'stopped',
			paused: 'paused',
			resumed: 'resumed'
		},
		_triggerElapsed: function () {
			clearInterval(this._intervalID)
			this._trigger(this.events.elapsed);
			console.log(this.options.elapsedMessage);
		},
		_triggerTick: function () {
			var args = {
				currentValue: this.options.currentValue
			};
			
			this._trigger(this.events.tick, null, args);
		},
		_triggerRendering: function () {
			// TODO	
		},
		_triggerRendered: function () {
			// TODO
		},
		_triggerStarted: function () {
			// TODO
		},
		_triggerStopped: function () {
			clearInterval(this._intervalID)
			this._trigger(this.events.stopped)
			this._renderWidgetStartValue();
		},
		_triggerPaused: function () {
			this._trigger(this.events.paused);
			clearInterval(this._intervalID);
		},
		_triggerResumed: function () {
			// TODO
		},
		_triggerStart: function () {
			// TODO
		},
		start: function (curValue) {
			// if start is called more than once -> pause and stop do not work
			// if start is called more than once -> the elapsed event is called infinitely
			// if started is triggered -> return -> otherwise it will increase countdown speed by 1 sec
			this._beginCountdown();
		},
		pause: function () {
			this._triggerPaused();
		},
		stop: function () {
			this._triggerStopped();
		},
		_render: function () {
			// TODO: trigger rendering
			var div = $('<div />');
			div.append($('<span />'));
			div.addClass(this.css.container);
			
			this.element.prepend(div);
			
			this._renderWidgetStartValue();
			// TODO: trigger rendered
		},
		_renderWidgetStartValue: function () {
			var span = $('.widget > span');
			span.addClass('counter');

			this.options.currentValue = this.options.startValue;

			span.text(this.options.currentValue);
		},
		_beginCountdown: function() {
			// TODO: trigger started; if paused was triggered - trigger resumed instead of started
			this._intervalID = setInterval($.proxy(this._decrementCurrentValue, this, true), 1000);
		},
		_decrementCurrentValue: function (raiseEvent) {
			var counter = $('.counter');
			this.options.currentValue -= this.options.delta;

			if (raiseEvent) {
				this._triggerTick();
			}

			if (this.options.currentValue > 0) {
				counter.text(this.options.currentValue);
				return;
			}
			
			// TODO: trigger elapsed
			counter.text(0);
			this._triggerElapsed();
		},
        _create: function () {
			/* igWidget constructor goes here */
			this.options.startValue = this.options.startValue;
			this.options.stopMessage = this.options.stopMessage;
			this.options.pauseMessage = this.options.pauseMessage;
			this.options.delta = this.options.delta;
			this.options.autoStart = this.options.autoStart;

			this._render();

			if (this.options.autoStart) {
				this._beginCountdown();
			}
        },
        _setOption: function (option, value) {
			/* igWidget custom setOption goes here */
			var css = this.css, elements, prevValue = this.options[option]; // ?
			if (prevValue === value) {
				return;
			}

			// if we want to explicitly check for any changes to currentValue
			// unneeded since the line that is afterwards sets it anyway
			// if(option === 'currentValue') {
			// 	this.options['currentValue'] = value;
			// }
			
			// The following line applies the option value to the igWidget meaning you don't
			// have to perform this.options[option] = value;
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        destroy: function () {
            /* igWidget destructor - unbind all event handlers, remove dynamically added classes and 
				dynamically added elements in the widget element's DOM
			*/
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
    $.extend($.ui.igWidget, {version: '<build_number>'});
}(jQuery));
