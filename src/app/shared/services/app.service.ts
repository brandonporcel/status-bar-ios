import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environment';
import { constants } from '@constants';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleBlockingError(operation: string, error: any): Observable<never> {
    const message = this.errorMessage(error);
    this.logOperation(operation, message);
    return throwError(() => new Error(message));
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleError<T>(operation: string, error: any, mockResult: T): Observable<T> {
    const message = this.errorMessage(error);
    this.logOperation(operation, message);
    return of(mockResult as T);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private errorMessage(error: any): string {
    if (!environment.production) {
    }
    let message = '';
    if (error instanceof HttpErrorResponse) {
      // Logica de Error Común Http
      message = error.error?.error;
    } else if (
      typeof error === 'string' ||
      (error instanceof String && error)
    ) {
      message = error as string;
    }
    return message ?? `mensaje--${constants.errors.defaultError}`;
  }

  private logOperation(operation: string, message: string): void {
    console.log(`${operation} failed: ${message}`);
  }
}
