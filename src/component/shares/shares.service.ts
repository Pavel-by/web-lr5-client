import {Injectable, OnInit} from '@angular/core';
import {Promise} from 'q';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, OperatorFunction, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';


export class Share {
  constructor(obj?: object) {
    this.update(obj);
  }

  _id: string;
  name: string;
  distribution: string;
  dispersion: number;
  price: number;
  count: number;

  update(obj): void {
    if (obj == null) {
      return;
    }

    this._id = obj._id;
    this.name = obj.name;
    this.distribution = obj.distribution;
    this.dispersion = obj.dispersion;
    this.price = obj.price;
    this.count = obj.count;
  }

  equalTo(other: Share): boolean {
    this.transformFields();
    other.transformFields();
    return this._id === other._id
      && this.name === other.name
      && this.distribution === other.distribution
      && this.dispersion === other.dispersion
      && this.price === other.price
      && this.count === other.count;
  }

  transformFields(): void {
    if (typeof this.dispersion === 'string') {
      this.dispersion = parseFloat(this.dispersion);
    }
    if (typeof this.price === 'string') {
      this.price = parseFloat(this.price);
    }
    if (typeof this.count === 'string') {
      this.count = parseFloat(this.count);
    }
  }
}

@Injectable({providedIn: 'root'})
export class SharesService {
  shares: BehaviorSubject<Array<Share>> = new BehaviorSubject<Array<Share>>(null);
  hasLastError = false;

  constructor(private httpClient: HttpClient) {
    this.refresh();
  }

  refresh(): void {
    this.httpClient.get<Array<object>>('http://lr5.test:3000/share/all')
      .pipe<Array<Share>>(this.mapShares())
      .subscribe(
        value => {
          this.shares.next(value);
        },
        error => {
          this.hasLastError = true;
        }
      );
  }

  add(share: Share): Promise<boolean>{
    return Promise<boolean>((resolve, reject) => {
      this.httpClient.put('http://lr5.test:3000/share', share)
        .pipe(this.mapShares())
        .subscribe(
        value => {
          this.shares.next(value);
          resolve(true);
        },
        error => {
          this.hasLastError = true;
          resolve(false);
        }
      );
    });
  }

  update(share: Share): Promise<boolean> {
    return Promise<boolean>((resolve, reject) => {
      this.httpClient.put(`http://lr5.test:3000/share/${share._id}`, share)
        .pipe(this.mapShares())
        .subscribe(
        value => {
          this.shares.next(value);
          resolve(true);
        },
        error => {
          this.hasLastError = true;
          resolve(false);
        }
      );
    });
  }

  delete(share: Share): Promise<boolean> {
    return Promise<boolean>((resolve, reject) => {
      this.httpClient.delete(`http://lr5.test:3000/share/${share._id}`)
        .pipe(this.mapShares())
        .subscribe(
          value => {
            this.shares.next(value);
            resolve(true);
          },
          error => {
            this.hasLastError = true;
            resolve(false);
          }
        );
    });
  }

  private mapShares(): OperatorFunction<Array<object>, Array<Share>> {
    return map(value => {
      return value.map<Share>(raw => {
        const share = new Share();
        share.update(raw);
        return share;
      });
    });
  }
}
