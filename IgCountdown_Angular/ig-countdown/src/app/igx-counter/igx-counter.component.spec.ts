import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { IgxCounterComponent } from './igx-counter.component';
import { By } from '@angular/platform-browser';

const CSS_CLASS_START = '.start';
const CSS_CLASS_PAUSE = '.pause';
const CSS_CLASS_RESET = '.reset';

describe('IgxCounterComponent', () => {
  let component: IgxCounterComponent;
  let fixture: ComponentFixture<IgxCounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ IgxCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IgxCounterComponent);
    component = fixture.componentInstance;
    component.startValue = 3;
    fixture.detectChanges();
  }));

  it('startValue should equal currentValue on creation', async(() => {
    expect(component.startValue).toEqual(component.getCurrentValue);
  }));

  it('should start decreasing the timer when started ', async(() => {
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);
    startButton.click(mockEvt);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.getCurrentValue).toBeLessThan(component.startValue);    
    });
  }));

  it('should pause when the "pause" button is pressed', async(() => {
    const expectedCurrentValue = 2;
    
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let pauseButton = fixture.debugElement.query(By.css(CSS_CLASS_PAUSE)).nativeElement;

    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);
    startButton.click(mockEvt);

    setTimeout(() => {
      pauseButton.click(mockEvt);
      fixture.detectChanges();
    }, 1000);
    
    fixture.whenStable().then(() => {
      expect(component.getCurrentValue).toEqual(expectedCurrentValue);
    });
  }));

  it('should reset the button when the "reset" button is pressed', async(() => {
    const expectedCurrentValue = component.startValue;

    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let resetButton = fixture.debugElement.query(By.css(CSS_CLASS_RESET)).nativeElement;

    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);
    startButton.click(mockEvt);

    setTimeout(() => {
      resetButton.click(mockEvt);
      fixture.detectChanges();
    }, 1000);

    expect(component.getCurrentValue).toEqual(expectedCurrentValue);
  }));

  it('should emit "started" event when it is started', async(() => {
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);
    
    spyOn(component.started, 'emit').and.callThrough();
    startButton.click(mockEvt);

    expect(component.started.emit).toHaveBeenCalledTimes(1);
  }));

  it('should emit "paused" event when the "pause" button is pressed', async(() => {
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let pauseButton = fixture.debugElement.query(By.css(CSS_CLASS_PAUSE)).nativeElement;
    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);

    spyOn(component.paused, 'emit').and.callThrough();
    startButton.click(mockEvt);
    pauseButton.click(mockEvt);
    
    expect(component.paused.emit).toHaveBeenCalledTimes(1);
  }));

  it('should emit "reset" event when the "reset" button is pressed', async(() => {
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let resetButton = fixture.debugElement.query(By.css(CSS_CLASS_RESET)).nativeElement;
    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);

    spyOn(component.reset, 'emit').and.callThrough;
    startButton.click(mockEvt);
    resetButton.click(mockEvt);
    
    expect(component.reset.emit).toHaveBeenCalledTimes(1);
  }));

  it('should emit "elapsed" event when the timer reaches zero', async(() => {
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);

    startButton.click(mockEvt);
    spyOn(component.elapsed, 'emit').and.callThrough;

    fixture.whenStable().then(() => {
        expect(component.elapsed.emit).toHaveBeenCalledTimes(1);
    });    
  }));

  it('should emit "tick" on every second that passes', async(() => {
    let startButton = fixture.debugElement.query(By.css(CSS_CLASS_START)).nativeElement;
    let mockEvt = jasmine.createSpyObj('mockEvt', ['preventDefault', 'stopImmediatePropagation']);

    startButton.click(mockEvt);
    spyOn(component.tick, 'emit').and.callThrough();

    fixture.whenStable().then(() => {
      expect(component.tick.emit).toHaveBeenCalledTimes(component.startValue);
    });
  }));
});