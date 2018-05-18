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
			_elapsedIsFired: false,

			tick: 'tick',
			_tickIsFired: false,

			rendering: 'rendering',
			_renderingIsFired: false,

			rendered: 'rendered',
			_renderedIsFired: false,

			started: 'started',
			_startedIsFired: false,

			stopped: 'stopped',
			_stoppedIsFired: false,

			paused: 'paused',
			_pausedIsFired: false,

			resumed: 'resumed',
			_resumedIsFired: false,

			autoStarted: 'autoStarted',
			_autoStartedIsFired: false
		},
		_triggerElapsed: function () {
			clearInterval(this._intervalID)
			this._trigger(this.events.elapsed);
			
			this.events._elapsedIsFired = true;
			this.events._startedIsFired = false;
			this.events._stoppedIsFired = false;
			this.events._pausedIsFired = false;
			this.events._stoppedIsFired = false;
			this.events._resumedIsFired = false;
		},
		_triggerTick: function () {
			var args = {
				currentValue: this.options.currentValue
			};
			
			this._trigger(this.events.tick, null, args);
			this.events._tickIsFired = true;
		},
		_triggerRendering: function () {
			this._trigger(this.events.rendering);

			if (this.events.rendered) {
				return;
			}

			this.events._renderingIsFired = true;
		},
		_triggerRendered: function () {
			this._trigger(this.events.rendered);

			if (this.events._triggerRendering) {
				this.events._triggerRendering = false;
				this.events._triggerRendered = true;
			}
		},
		_triggerStarted: function () {
			if (!this.events._startedIsFired && this.events._pausedIsFired && !this.events._stoppedIsFired) {
				this._triggerResumed();
			}

			if (!this.events._resumedIsFired) {
				this._trigger(this.events.started);
			}

			if (!this.events._startedIsFired) {
				this.events._startedIsFired = true;
				this.events._pausedIsFired = false;
				this.events._stoppedIsFired = false;
			}

			this._beginCountdown();
		},
		_triggerStopped: function () {
			if (this.events._elapsedIsFired || 
				this.options.currentValue === this.options.startValue) {
				return;
			}

			clearInterval(this._intervalID)
			this._trigger(this.events.stopped)
			this._renderWidgetStartValue();

			this.events._tickIsFired = false;
			this.events._resumedIsFired = false;
			this.events._pausedIsFired = false;
			this.events._autoStartedIsFired = false;
			this.events._startedIsFired = false;
			this.events._stoppedIsFired = true;
		},
		_triggerPaused: function () {
			if (this.events._stoppedIsFired || 
				this.events._elapsedIsFired || 
				this.options.currentValue === this.options.startValue) {
				return;
			}

			this._trigger(this.events.paused);
			clearInterval(this._intervalID);
			
			this.events._pausedIsFired = true;
			this.events._tickIsFired = false;
			this.events._stoppedIsFired = false;
			this.events._startedIsFired = false;
			this.events._autoStartedIsFired = false;
			this.events._pausedIsFired = true;
		},
		_triggerResumed: function () {
			this._trigger(this.events.resumed);
			this.events._resumedIsFired = true;
		},
		_triggerAutoStart: function () {
			if (this.events._autoStartedIsFired) {
				return;
			}

			this._trigger(this.events.autoStarted);
			this.events._autoStartedIsFired = true;
			this._beginCountdown();
		},
		start: function () {
			if (this.events._startedIsFired || this.events._elapsedIsFired || this.events._autoStartedIsFired) {
				return;
			}

			this._triggerStarted();
		},
		pause: function () {
			this._triggerPaused();
		},
		stop: function () {
			this._triggerStopped();
		},
		_render: function () {
			this._triggerRendering();

			var div = $('<div />');
			div.append($('<span />'));
			div.addClass(this.css.container);
			
			this.element.prepend(div);
			
			this._renderWidgetStartValue();

			this._triggerRendered();
		},
		_renderWidgetStartValue: function () {
			var span = $('.widget > span');
			span.addClass('counter');

			this.options.currentValue = this.options.startValue;

			span.text(this.options.currentValue);
		},
		_beginCountdown: function() {
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
				this._triggerAutoStart();
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
