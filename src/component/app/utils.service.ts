import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UtilsService {
  dateToLocal(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
  }
}
