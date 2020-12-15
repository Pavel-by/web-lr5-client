import {Promise} from 'q';
import {HttpClient} from '@angular/common/http';
import {Injectable, Input} from '@angular/core';
import {Observable} from 'rxjs';

export class Market {
  start: Date;
  end: Date;
  recomputeDuration: number;

  update(obj): void {
    this.start = new Date(obj.start);
    this.end = new Date(obj.end);
    this.recomputeDuration = parseInt(obj.recomputeDuration, 0);
  }
}

@Injectable({providedIn: 'root'})
export class MarketService {
  private market: Promise<Market>;

  constructor(private httpClient: HttpClient) {
  }

  get(): Promise<Market> {
    if (this.market == null) {
      this.market = Promise<Market>((resolve, reject) => {
        this.httpClient.get<string>('http://lr5.test:3000/market').subscribe(
          value => {
            try {
              const market = new Market();
              market.update(value);
              resolve(market);
            } catch (e) {
              reject(e);
            }
          },
          error => {
            reject(error);
          }
        );
      }).then<Market>(market => {
        console.log(`market had successfully read`);
        return market;
      }, error => {
        console.log(`failed to read market: ${error}`);
        this.market = null;
        return null;
      });
    }

    return this.market;
  }

  save(market: Market): Observable<object> {
    return this.httpClient.put('http://lr5.test:3000/market', market);
  }
}
