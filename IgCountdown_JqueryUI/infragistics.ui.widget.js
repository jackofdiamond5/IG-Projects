/*!@license
 * Infragistics.Web.ClientUI Widget 1.0.0
 *
 * Copyright (c) 2018 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 *  Built and tested with jquery-3.3.1.min.js;
 *   jquery.ui.core.js;
 *   jquery.ui.widget.js
 */

/*global jQuery */
if (typeof jQuery !== "function") {
   throw new Error("jQuery is undefined");
}

(function ($) {
   /*
     igCountdown is a widget based on jQuery UI that counts down to zero, from a specified start.
     It supports stopping, pausing, as well as auto-start and self-destroy.
  */
   $.widget('ui.igCountdown', {
      css: {
         /* widget element classes go here */
         container: 'widget',
         counter: 'counter',
         output: 'output',
         blink: 'blink',
         end: 'end',
         buttons: 'buttons',
         start: 'start',
         pause: 'pause',
         reset: 'reset',
         destroy: 'destroy'
      },
      options: {
         /* widget options go here */
         startValue: 10,
         resetMessage: "Resetted",
         pauseMessage: "Paused",
         elapsedMessage: "Timer has elapsed!",
         autoStart: false,
         delta: 1
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
      _currentValue: null,
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
            const args = {
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
         const args = {
            owner: this
         }

         if (!this._constrain(this.options.startValue) || this._currentValue === this.options.startValue) {
            return;
         }

         clearInterval(this._intervalID);
         this._trigger(this.events.reset, null, args);

         const output = this.element.children().find(`.${this.css.output}`);
         if (this._currentValue <= 3) {
            output.removeClass(this.css.blink);
         }

         this._currentValue = this.options.startValue;
         output.text(this.options.startValue);
         output.removeClass(this.css.end);

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
         const args = {
            owner: this,
            _currentValue: this._currentValue
         };

         this._trigger(this.events.tick, null, args);
      },
      _triggerElapsed: function () {
         const args = {
            owner: this
         }

         clearInterval(this._intervalID)
         this._trigger(this.events.elapsed, null, args);
      },
      _triggerRendering: function () {
         const args = {
            owner: this
         }

         return this._trigger(this.events.rendering, null, args);
      },
      _triggerRendered: function () {
         const args = {
            owner: this
         }

         this._trigger(this.events.rendered, null, args);
      },
      _create: function () {
         // constructor 

         this._attachEvents();

         if (this.options.autoStart) {
            this._triggerStarted();
         }

         const renderingEnabled = this._triggerRendering();
         if (renderingEnabled) {
            this._render();
            this._triggerRendered();
         }
      },
      _attachEvents: function () {
         const widgetInstance = this;
         widgetInstance._on(widgetInstance.element, {
            'click.buttons': function (event) {
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
      },
      _detachEvents: function () {
         this.element.off('igcountdownstarted igcountdownstopped igcountdownreset igcountdownpaused');
         this.element.off('igcountdowntick');
      },
      _restoreInitialState: function () {
         this.element.children(`.${this.css.container}`).remove();
         this.element.children(`.${this.css.buttons}`).remove();
      },
      _render: function () {
         const div = $('<div />');
         div.append('<span />');
         div.addClass(this.css.container);

         this.element.prepend(div);

         this._renderButtons();
         this._renderWidgetStartValue();
      },
      _renderWidgetStartValue: function () {
         const counter = this.element.children().find('span');
         counter.addClass(this.css.counter);
         counter.append("<span />");

         const output = this.element.children().find(`.${this.css.counter} > span`);
         output.addClass(this.css.output);

         if (!this._constrain(this.options.startValue)) {
            return;
         }

         this._currentValue = this.options.startValue;
         output.text(this._currentValue);
      },
      _renderButtons: function () {
         const widget = this.element;

         const buttonsHolder = $('<div />');
         buttonsHolder.addClass(`${this.css.buttons}`);
         buttonsHolder
            .append(`<button id="str">`)
            .append(`<button id="psr">`)
            .append(`<button id="rst">`)
            .append(`<button id="dstr">`);

         widget.append(buttonsHolder);

         this._addButtonClasses();
      },
      _addButtonClasses: function () {
         const start = $(`.${this.css.buttons} > #str`);
         start.addClass(this.css.start);
         start.text("Start");

         const pause = $(`.${this.css.buttons} > #psr`);
         pause.addClass(this.css.pause);
         pause.text("Pause");

         const reset = $(`.${this.css.buttons} > #rst`);
         reset.addClass(this.css.reset);
         reset.text("Reset");

         const destroy = $(`.${this.css.buttons} > #dstr`);
         destroy.addClass(this.css.destroy);
         destroy.text('Destroy');
      },
      _beginCountdown: function () {
         this._paused = false;
         this._intervalID = setInterval($.proxy(this._decrementCurrentValue, this, true), 1000);
      },
      _decrementCurrentValue: function (raiseEvent) {
         this._currentValue -= this.options.delta;
         const output = this.element.children().find(`.${this.css.output}`);

         if (raiseEvent) {
            this._triggerTick();
         }
         if (this._currentValue <= 3) {
            output.addClass(this.css.blink);
         }
         if (this._currentValue > 0) {
            output.text(this._currentValue);
            return;
         }

         output.text(this._currentValue);
         output.addClass(this.css.end);
         output.removeClass(this.css.blink);
         this._triggerElapsed();
      },
      _constrain: function (value) {
         if (isNaN(value)) {
            return false;
         }
         if (value <= 0) {
            return false;
         }

         return true;
      },
      _setOption: function (option, value) {
         // custom setOption method goes here
         prevValue = this.options[option];
         if (!this._constrain(value)) {
            return;
         }
         if (prevValue === value) {
            return;
         }

         // The following line applies the option value to the igCounter meaning you don't
         // have to perform this.options[option] = value;
         $.Widget.prototype._setOption.apply(this, arguments);
         return true;
      },
      destroy: function () {
         /* 
            igCountdown destructor - unbind all event handlers, remove dynamically added classes and 
            dynamically added elements in the widget element's DOM
         */

         this._detachEvents();
         this._restoreInitialState();
         clearInterval(this._intervalID);

         $.Widget.prototype.destroy.apply(this, arguments);
      }
   });
   $.extend($.ui.igCountdown, { version: '1.0.0' });
}(jQuery));
