import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgxCounterComponent } from './igx-counter.component';
import { By } from '@angular/platform-browser';

describe('IgxCounterComponent', () => {
  let component: IgxCounterComponent;
  let fixture: ComponentFixture<IgxCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgxCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgxCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});