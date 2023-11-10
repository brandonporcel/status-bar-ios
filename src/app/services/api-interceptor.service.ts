import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError, Observable, from, lastValueFrom } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../shared/services/authentication.service';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthenticationService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.handleRequest(request, next)).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        if (error && (error.status === 401 || error.status === 403)) {
          // Handle 401 & 403 Error | Route to Login
        }
        return throwError(() => error);
      }),
    );
  }

  async handleRequest(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Promise<HttpEvent<any>> {
    let token: string | null = null;
    const authData = this.authService.authData.getValue();
    if (authData) {
      token = authData.token;
    }

    let headers = new HttpHeaders();

    for (const key of request.headers.keys()) {
      const headerValues = request.headers.getAll(key);
      if (headerValues) {
        for (const value of headerValues) {
          headers.append(key, value);
        }
      }
    }

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    headers = headers.append('Authorization', `Bearer ${token}`);
    const apiReq = request.clone({
      headers,
      url: `${environment.baseURL}${request.url}`,
    });
    return lastValueFrom(next.handle(apiReq));
  }
}
