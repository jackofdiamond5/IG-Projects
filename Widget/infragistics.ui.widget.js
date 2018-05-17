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
			autoStart : false,
			delta : 1
        },
		events: {
			elapsed: new Event('elapsed'),
			tick: new Event('tick'),
			rendering: new Event('rendering'),
			rendered: new Event('rendered'),
			started: new Event('started'),
			stopped: new Event('stopped'),
			paused: new Event('paused'),
			resumed: new Event('resumed')
		},
		start: function (curValue) {
			// if started is triggered -> return -> otherwise it will increase countdown speed by 1 sec
			this._beginCountdown();
		},
		pause: function () {
			// TODO: trigger paused
			console.log('paused');
		},
		stop: function () {
			// TODO: trigger stopped
			console.log('stopped');
		},
		_render: function () {
			// TODO: trigger rendering
			var div = $('<div />');
			div.append($('<span />'));
			div.addClass(this.css.container);
			
			this.element.prepend(div);
			
			var span = $('.widget > span');
			span.addClass('counter');
			span.on('elapsed', function() {console.log('pesho')})

			this.options.currentValue = this.options.startValue;

			span.text(this.options.currentValue);
			// TODO: trigger rendered
		},
		_beginCountdown: function() {
			// TODO: trigger started; if paused was triggered - trigger resumed instead of started
			this._intervalID = setInterval($.proxy(this._updateCurrentValue, this, true), 1000);
		},
		_updateCurrentValue: function () {
			var counter = $('.counter');
			this.options.currentValue -= this.options.delta;

			if(this.options.currentValue <= 0) {
				counter.text(0);
				// TODO: trigger elapsed

				return;
			}
			
			counter.text(this.options.currentValue);
		},
        _create: function () {
			/* igWidget constructor goes here */
			this.options.startValue = this.options.startValue;
			this.options.stopMessage = this.options.stopMessage;
			this.options.pauseMessage = this.options.pauseMessage;
			this.options.delta = this.options.delta;
			this.options.autoStart = this.options.autoStart;

			this._render();

			if(this.options.autoStart) {
				this._beginCountdown();
			}
        },
        _setOption: function (option, value) {
			/* igWidget custom setOption goes here */
			var css = this.css, elements, prevValue = this.options[option];
			if (prevValue === value) {
				return;
			}

			this.options[option] = value;
			
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
