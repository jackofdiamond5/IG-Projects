import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IgxCounterComponent } from './igx-counter/igx-counter.component';

@NgModule({
  declarations: [
    AppComponent,
    IgxCounterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
