import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  fixedPreviousUrl: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);

  constructor() {}

  setPreviousUrl(url: string): void {
    this.fixedPreviousUrl.next(url);
  }
}
