import { 
  Component, 
  OnInit, 
  Input,
  Output, 
  EventEmitter,
  HostListener,
  OnDestroy} from '@angular/core';

import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'igx-counter',
  templateUrl: './igx-counter.component.html',
  styleUrls: ['./igx-counter.component.css']
})
export class IgxCounterComponent implements OnInit, OnDestroy {
  private _isRunning = false;
  private _isPaused = false;
  private _timer = interval(1000);
  private _currentValue = null;

  constructor() { }
  
  /**
   * The counter's initial value
   *  
   * ```html
   * <igx-counter [startValue]='100'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public startValue = 10;

  /**
   * Gets/sets the currentValue for the counter
   *
   * ```typescript
   * let counterCurrentValue = this.counter.getCurrentValue;
   * ```
   * 
   * @readonly
   * @memberof IgxCounterComponent
   */
  @Input()
  get getCurrentValue() {
   return this._currentValue; 
  }

  /**
   * Message that the counter returns after it is started
   * 
   * ```html
   * <igx-counter [startMessage]='newMessage'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public startMessage = "Countdown started.";
  
  /**
   * Message that the counter returns after it resetted
   *
   * ```html
   * <igx-counter [resetMessage]='newMessage'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public resetMessage = "The timer was reset.";
  
  /**
   * Message that the counter returns after it is paused
   *
   * ```html
   * <igx-counter [pausedMessage]='newMessage'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public pauseMessage = "The timer was paused.";

  /**
   * Message that the counter returns after it has elapsed
   *
   * ```html
   * <igx-counter [elapsedMessage]='newMessage'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public elapsedMessage = "The timer has elapsed!";

  /**
   * Boolean that determines whether the countdown will begin on initialization
   * 
   * ```html
   * <igx-counter [autoStart]='true'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public autoStart = false;

  /**
   * The value which will decrement the counter
   * 
   * ```html
   * <igx-counter [delta]='5'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Input()
  public delta = 1;

  /**
   * Emitted when the countdown has started
   *
   * ```html
   * <igx-counter (started)='onStarted()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public started = new EventEmitter();

  /**
   * Emitted when the countdown has started after it was paused
   *
   * ```html
   * <igx-counter (resumed)='onResumed()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public resumed = new EventEmitter();

  /**
   * Emitted when the countdown has been paused
   *
   * ```html
   * <igx-counter (paused)='onPaused()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public paused = new EventEmitter();

  /**
   * Emitted when the counter has been reset
   *
   * ```html
   * <igx-counter (reset)='onReset()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public reset = new EventEmitter();
  
  /**
   * Emitted when the widget has begun rendering
   *
   * ```html
   * <igx-counter (rendering)='onRendering()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public rendering = new EventEmitter();

  /**
   * Emitted when the widget has finished rendering
   *
   * ```html
   * <igx-counter (rendered)='onRendered()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public rendered = new EventEmitter();

  /**
   * Emitted when the timer has reached zero
   *
   * ```html
   * <igx-counter (elapsed)='onElapsed()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public elapsed = new EventEmitter();

  /**
   * Emitted every time the counter's value is decreased
   *
   * ```html
   * <igx-counter (tick)='onTick()'></igx-counter>
   * ```
   * 
   * @memberof IgxCounterComponent
   */
  @Output()
  public tick = new EventEmitter();

  ngOnInit() {
    if (this._constrain(this.startValue)) {
      this._currentValue = this.startValue;
    }

    if (this.autoStart) {
      this._beginCountdown();
    }
  }

  ngOnDestroy() {
    this._timer = null;
  }

  @HostListener('.start click')
  public onStart (event) {
    if (this._isRunning) {
      return;
    }
    
    event.stopImmediatePropagation();
    event.preventDefault();
    
    this._togglePausedResumedEvents();
    this._beginCountdown();
  }

  @HostListener('.pause click')
  public onPause (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    
    this._isRunning = false;
    this._isPaused = true;

    this.paused.emit();
  }
 
  @HostListener('.reset click')
  public onReset (event) {
    if (!this._isRunning && !this._isPaused) {
      return;
    }

    event.stopImmediatePropagation();
    event.preventDefault();

    this._currentValue = this.startValue;
    
    this._isRunning = false;
    this._isPaused = false;

    this.reset.emit();
  }

  private _beginCountdown() {
    this._isPaused = false;
    this._isRunning = true;

    this._timer
              .pipe(takeWhile(n => this._currentValue > 0))
              .pipe(takeWhile(n => this._isRunning))
              .subscribe(n => this._decrementCurrentValue());
  }
  
  private _decrementCurrentValue() {
    if (!this._constrain(this.delta)) {
      return;
    }
  
    this._currentValue -= this.delta;
    this.tick.emit();
  }

  private _togglePausedResumedEvents() {
    if (!this._isRunning && this._isPaused) {
      this.resumed.emit();
    } else {
      this.started.emit();
    }
  }

  private _constrain(value: any): boolean {
    if (isNaN(value)) {
      return false;
    }
    if (value <= 0) {
      return false;
    }

    return true;
  }
}