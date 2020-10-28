import { Injectable } from '@angular/core';
import { WorkTaskServiceModule } from '../work-task-service.module';
import { HttpClient} from '@angular/common/http';
import { Observable, Subject, timer } from 'rxjs';

import { catchError, map, switchMap, takeUntil} from 'rxjs/operators';
import { Currency,  JsonRateBuilder, JsonRateDto, XmlRateBuilder, XmlRateDto} from '../types';
import { Parser } from 'xml2js';

const xml2js = new Parser();

@Injectable({
  providedIn: WorkTaskServiceModule
})
export class RateService {

  constructor(private http: HttpClient) { }
  private destroy$ = new Subject<void>();

  // источники данных
  private sources = [
    this.getDataJson(),
    this.getDataXml()
  ];

  public getCurrency(): Observable<Currency> {

    this.sources = this.sources.map((item, idx) =>
      this.sources.length - 1 !== idx ? item.pipe(catchError(x => this.sources[idx + 1])) : item.pipe(catchError(x => []))
     );

    return timer(0, 10000).pipe(
      switchMap(x => this.sources[0]),
      takeUntil(this.destroy$)
    );
  }

  public abortRequests(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDataXml(): Observable<Currency> {
    return this.http.get('https://www.cbr-xml-daily.ru/daily_utf8.xml', { responseType: 'text' })
    .pipe(
      switchMap((xml: string) => xml2js.parseStringPromise(xml) as Promise<XmlRateDto>),
      map((x: XmlRateDto ) => {
        const builder = new XmlRateBuilder(x);
        console.log('xmlDto', x);
        return builder.getCurrency();
      }),
      takeUntil(this.destroy$)
     );
  }

   private getDataJson(): Observable<Currency>  {
     return this.http.get<JsonRateDto>('https://www.cbr-xml-daily.ru/daily_json.js')
     .pipe(
       map((obj: JsonRateDto) => {
         const builder = new JsonRateBuilder(obj);
         console.log('jsonDto', obj);
         return builder.getCurrency();
        }),
       takeUntil(this.destroy$)
       );
   }
}
