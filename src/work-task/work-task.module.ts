import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkTaskServiceModule } from './work-task-service.module';
import { RateComponent } from './components/rate/rate.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [RateComponent],
  imports: [
    CommonModule,
    WorkTaskServiceModule,
    HttpClientModule
  ],
  exports: [RateComponent]
})
export class WorkTaskModule { }
