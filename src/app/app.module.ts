import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WorkTaskModule } from 'src/work-task/work-task.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WorkTaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
