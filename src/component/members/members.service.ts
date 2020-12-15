import {Injectable} from '@angular/core';
import {BehaviorSubject, OperatorFunction} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Promise} from 'q';

export class Member {
  constructor(obj?) {
    this.update(obj);
  }

  _id: string;
  name: string;
  money: number;

  update(obj): void {
    if (!obj) {
      return;
    }

    this._id = obj._id;
    this.name = obj.name;
    this.money = obj.money;
  }

  equalTo(other: Member): boolean {
    this.transformFields();
    other.transformFields();
    return this.name === other.name
      && this.money === other.money;
  }

  transformFields(): void {
    if (typeof this.money === 'string') {
      this.money = parseFloat(this.money);
    }
  }
}

@Injectable({providedIn: 'root'})
export class MembersService {
  members: BehaviorSubject<Array<Member>> = new BehaviorSubject<Array<Member>>(null);
  hasLastError = false;

  constructor(private httpClient: HttpClient) {
    this.refresh();
  }

  refresh(): void {
    this.httpClient.get<Array<object>>('http://lr5.test:3000/member/all')
      .pipe<Array<Member>>(this.mapMembers())
      .subscribe(
        value => {
          this.members.next(value);
        },
        error => {
          this.hasLastError = true;
        }
      );
  }

  add(member: Member): Promise<boolean>{
    return Promise<boolean>((resolve, reject) => {
      this.httpClient.put('http://lr5.test:3000/member', member)
        .pipe(this.mapMembers())
        .subscribe(
          value => {
            this.members.next(value);
            resolve(true);
          },
          error => {
            this.hasLastError = true;
            resolve(false);
          }
        );
    });
  }

  update(member: Member): Promise<boolean> {
    return Promise<boolean>((resolve, reject) => {
      this.httpClient.put(`http://lr5.test:3000/member/${member._id}`, member)
        .pipe(this.mapMembers())
        .subscribe(
          value => {
            this.members.next(value);
            resolve(true);
          },
          error => {
            this.hasLastError = true;
            resolve(false);
          }
        );
    });
  }

  delete(member: Member): Promise<boolean> {
    return Promise<boolean>((resolve, reject) => {
      this.httpClient.delete(`http://lr5.test:3000/member/${member._id}`)
        .pipe(this.mapMembers())
        .subscribe(
          value => {
            this.members.next(value);
            resolve(true);
          },
          error => {
            this.hasLastError = true;
            resolve(false);
          }
        );
    });
  }

  private mapMembers(): OperatorFunction<Array<object>, Array<Member>> {
    return map(value => {
      return value.map<Member>(raw => {
        const member = new Member();
        member.update(raw);
        return member;
      });
    });
  }
}
