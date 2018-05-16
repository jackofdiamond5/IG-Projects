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
		},
        options: {
			/* igWidget options go here */
			startValue : 10,
			stopMessage : "Stopped",
			pauseMessage : "Paused",
			autoStart : false,
			delta : 1
        },
		events: {
			/* igWidget events go here */
			// on elapsed
			// on tick
			// rendering
			// rendered
			// started
			// stopped
			// paused
			// resumed
		},
        _create: function () {
			/* igWidget constructor goes here */
			this.options.startValue = this.options.startValue;
			this.options.stopMessage = this.options.stopMessage;
			this.options.pauseMessage = this.options.pauseMessage;
			this.options.delta = this.options.delta;
			this.options.autoStart = this.options.autoStart;
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
