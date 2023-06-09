import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceMethodResultsInfo } from '@lib/backend-shared';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { JWT_AUTHORITY_TOKEN_NAME, JWT_USER_TOKEN_NAME } from '../_misc/vault';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  DOMAIN: string = '';
  API_PREFIX: string = '';
  isProd: boolean = false;

  private xsrf_token_ready = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly http: HttpClient,
    private environmentService: EnvironmentService,
  ) {
    this.isProd = this.environmentService.environment.production;
    this.DOMAIN = this.environmentService.environment.API_DOMAIN;
    const apiDomain = this.DOMAIN + '/web';
    this.API_PREFIX = apiDomain;
  }


  get httpClient(): HttpClient {
    return this.http;
  }

  setApiContext(options: {
    DOMAIN: string;
    API_PREFIX: string;
    isProd: boolean;
  }) {
    this.DOMAIN = options.DOMAIN;
    this.API_PREFIX = options.API_PREFIX;
    this.isProd = options.isProd;
  }

  isXsrfTokenReady() {
    return this.xsrf_token_ready.asObservable();
  }

  getCsrfToken() {
    return this.sendRequest<any>(`/csrf-token`, 'GET')
      .pipe(
        map((response: any) => {
          console.log(`CSRF Token Set.`);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  sendRequest<T = any>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object | FormData | null,
    customHeaders?: HttpHeaders,
    report_progress: boolean = false,
  ): Observable<ServiceMethodResultsInfo<T>> {
    const api_url = this.API_PREFIX + route;
    const jwt = route.startsWith('/authorities')
      ? window.localStorage.getItem(JWT_AUTHORITY_TOKEN_NAME) || ''
      : window.localStorage.getItem(JWT_USER_TOKEN_NAME) || '';
    const httpOptions = {
      withCredentials: true,
      reportProgress: report_progress,
      headers: customHeaders || new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }),
    };
    if (data && data.constructor === Object) {
      httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    }

    let requestObservable: Observable<ServiceMethodResultsInfo<T>>;

    switch (method) {
      case 'GET': {
        requestObservable = (<any> this.http.get(api_url, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'POST': {
        requestObservable = (<any> this.http.post(api_url, data, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'PUT': {
        requestObservable = (<any> this.http.put(api_url, data, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
      case 'DELETE': {
        requestObservable = (<any> this.http.delete(api_url, httpOptions)) as Observable<ServiceMethodResultsInfo<T>>;
        break;
      }
    }

    return requestObservable;
  }

  get<T = any>(route: string, customHeaders?: HttpHeaders, report_progress: boolean = false) {
    return this.sendRequest<T>(route, 'GET', undefined, customHeaders, report_progress);
  }

  post<T = any>(route: string, data?: object | FormData | null, customHeaders?: HttpHeaders, report_progress: boolean = false) {
    return this.sendRequest<T>(route, 'POST', data, customHeaders, report_progress);
  }

  put<T = any>(route: string, data?: object | FormData | null, customHeaders?: HttpHeaders, report_progress: boolean = false) {
    return this.sendRequest<T>(route, 'PUT', data, customHeaders, report_progress);
  }

  delete<T = any>(route: string, customHeaders?: HttpHeaders, report_progress: boolean = false) {
    return this.sendRequest<T>(route, 'DELETE', undefined, customHeaders, report_progress);
  }
}
