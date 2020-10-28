import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { RateService } from 'src/work-task/services/rate.service';
import { Currency } from 'src/work-task/types';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit, OnDestroy {

  public eurRate: Observable<Currency>;

  constructor(private rateService: RateService ) { }

  ngOnInit(): void {
    this.eurRate = this.rateService.getCurrency();
  }

  ngOnDestroy(): void {
    this.rateService.abortRequests();
  }
}
