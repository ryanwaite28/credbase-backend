import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AUTHORITY_RECORDS, HttpStatusCode, IAuthority, MapType, USER_RECORDS } from '@lib/fullstack-shared';
import { BehaviorSubject, catchError, map, mergeMap, Observable, of } from 'rxjs';
import { GetVerifySmsCode } from '../interfaces/responses.interface';
import { AuthorityStoreService } from '../stores/authority-store.service';
import { get_authority_records_endpoint } from '../_misc/chamber';
import { JWT_AUTHORITY_TOKEN_NAME } from '../_misc/vault';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private is_subscription_active: boolean = false;
  private is_subscription_active_stream = new BehaviorSubject<boolean>(this.is_subscription_active);

  private isFirstCall = true;

  constructor(
    private authorityStore: AuthorityStoreService,
    private clientService: ClientService,
    private router: Router
  ) {}

  getHasPlatformSubscription(): boolean {
    return this.is_subscription_active;
  }

  getSubscriptionActiveStream() {
    return this.is_subscription_active_stream.asObservable();
  }

  checkAuthoritySession(): Observable<IAuthority | null> {
    return this.authorityStore.getChangesObs().pipe(
      mergeMap((authority: IAuthority | null) => {
        return authority !== undefined
          ? of(authority)
          : this.checkSession().pipe(
              map((response) => {
                return response.data.authority || null;
              })
            );
      })
    );
  }

  private checkSession(): Observable<{ data: { authority: IAuthority | null, token: string | null } }> {
    const jwt = window.localStorage.getItem(JWT_AUTHORITY_TOKEN_NAME);
    const badJwt = !jwt || jwt === `undefined`;
    if (badJwt) {
      window.localStorage.removeItem(JWT_AUTHORITY_TOKEN_NAME);
      this.authorityStore.setState(null);
      return of({
        message: `no token found`,
        data: {
          authority: null,
          token: null,
        }
      });
    }
    return this.clientService.sendRequest<any>(
      '/authorities/check-session',
      `GET`,
      null,
    ).pipe(
      map((response: any) => {
        if (response.data?.is_subscription_active) {
          this.is_subscription_active = response.data.is_subscription_active;
          this.is_subscription_active_stream.next(this.is_subscription_active);
        }
        this.authorityStore.setState(response.data!.authority);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== HttpStatusCode.REQUEST_FAILED) {
          // this.sign_out();
        }
        console.log(error);
        this.router.navigate(['/', 'authority-login']);
        return of({
          data: {
            authority: null,
            token: null,
          }
        });
      })
    );
  }

  get_authorities_by_query(query: string) {
    return this.clientService.get<IAuthority[]>(`/authorities/query/${query}`);
  }

  use_jwt_from_url(jwt: string) {
    window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, jwt);
    return this.checkSession()
  }

  sign_out() {
    // return of().pipe(
    //   map(() => {
    //     this.authorityStore.setState(null);
    //     window.localStorage.removeItem(JWT_AUTHORITY_TOKEN_NAME);
    //     console.log(`signed out`);
    //   })
    // );

    this.authorityStore.setState(null);
    window.localStorage.removeItem(JWT_AUTHORITY_TOKEN_NAME);
    console.log(`signed out`);
  }

  verify_email(uuid: string) {
    const endpoint = '/authorities/verify-email/' + uuid;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        this.authorityStore.setState(null);
        window.localStorage.removeItem(JWT_AUTHORITY_TOKEN_NAME);
        return response;
      })
    );
  }

  send_sms_verification(phone: string) {
    const endpoint = '/authorities/send-sms-verification/' + phone;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verify_sms_code(params: {
    request_id: string,
    code: string,
  }): Observable<GetVerifySmsCode> {
    const { request_id, code } = params;
    const endpoint = `/authorities/verify-sms-code/request_id/${request_id}/code/${code}`;
    return this.clientService.sendRequest<GetVerifySmsCode>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  send_feedback(authority_id: number, data: MapType) {
    const endpoint = `/authorities/${authority_id}/feedback`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** */

  get_authority_by_id(id: number) {
    const endpoint = '/authorities/' + id;
    return this.clientService.sendRequest<IAuthority>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_authority_by_phone(phone: string) {
    const endpoint = '/authorities/phone/' + phone;
    return this.clientService.sendRequest<IAuthority>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  check_authority_follows(authority_id: number, other_authority_id: number) {
    const endpoint = `/authorities/${authority_id}/follows/${other_authority_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  toggle_authority_follow(authority_id: number, other_authority_id: number) {
    const endpoint = `/authorities/${authority_id}/follows/${other_authority_id}`;
    return this.clientService.post<any>(endpoint).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_authority_followers_count(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/followers-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_authority_followings_count(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/followings-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_authority_messagings(authority_id: number, messagings_timestamp?: string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/authorities/' + authority_id + '/messagings/all'
      : messagings_timestamp
        ? '/authorities/' + authority_id + '/messagings/' + messagings_timestamp
        : '/authorities/' + authority_id + '/messagings';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_authority_messages(authority_id: number, other_authority_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/authorities/' + authority_id + '/messages/' + other_authority_id + '/' + min_id
      : '/authorities/' + authority_id + '/messages/' + other_authority_id;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_unseen_counts(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/unseen-counts`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  get_authority_customer_cards_payment_methods(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/customer-cards-payment-methods`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // generic

  get_authority_records<T>(
    authority_id: number,
    path: AUTHORITY_RECORDS,
    min_id?: number,
    get_all: boolean = false,
    is_public: boolean = true
  ) {
    const endpoint = get_authority_records_endpoint(authority_id, path, min_id, get_all, is_public);
    return this.clientService.sendRequest(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_authority_feed(authority_id: number, feed_type: string, min_id?: number) {
    const endpoint = min_id
      ? `/authorities/${authority_id}/feed/${min_id}?feed_type=${feed_type}`
      : `/authorities/${authority_id}/feed?feed_type=${feed_type}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  //

  // getAuthorityNotificationsAll<T = any>(authority_id: number) {
  //   return this.get_authority_records<T>(
  //     authority_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     undefined,
  //     true,
  //     false
  //   );
  // }

  // getAuthorityNotifications<T = any>(authority_id: number, min_id?: number) {
  //   return this.get_authority_records<T>(
  //     authority_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     min_id,
  //     false,
  //     false
  //   );
  // }

  // getAuthorityAppNotificationsAll<T = any>(authority_id: number) {
  //   return this.get_authority_records<T>(
  //     authority_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     undefined,
  //     true,
  //     false
  //   );
  // }

  // getAuthorityAppNotifications<T = any>(authority_id: number, min_id?: number) {
  //   return this.get_authority_records<T>(
  //     authority_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     min_id,
  //     false,
  //     false
  //   );
  // }

  // getAuthorityAppNotificationsLastOpened(authority_id: number) {
  //   return this.clientService.sendRequest<IAuthorityNotificationsLastOpenedByApp>(`/authorities/${authority_id}/notifications-last-opened`, `GET`).pipe(
  //     map((response: any) => {
  //       this.notificationsLastOpened = response.data!;
  //       return response;
  //     })
  //   );
  // }

  // updateAuthorityAppNotificationsLastOpened(authority_id: number) {
  //   return this.clientService.sendRequest<IAuthorityNotificationsLastOpenedByApp>(`/authorities/${authority_id}/notifications-last-opened`, `POST`).pipe(
  //     map((response: any) => {
  //       this.notificationsLastOpened = response.data!;
  //       return response;
  //     })
  //   );
  // }

  /** POST */

  sign_up(data: MapType) {
    return this.clientService.post<any>('/authorities', data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_authority_last_opened(authority_id: number) {
    return this.clientService.sendRequest<any>(`/authorities/${authority_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_conversation_last_opened(authority_id: number, conversation_id: number) {
    return this.clientService.sendRequest<any>(`/authorities/${authority_id}/conversations/${conversation_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  add_card_payment_method_to_authority_customer(authority_id: number, payment_method_id: string) {
    const endpoint = `/authorities/${authority_id}/customer-cards-payment-methods/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  /** PUT */
  

  log_in(data: MapType) {
    return this.clientService.sendRequest<any>('/authorities', `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_info(id: number, data: MapType) {
    const endpoint = `/authorities/${id}/info`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_password(id: number, data: MapType) {
    const endpoint = `/authorities/${id}/password`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_phone(id: number, data: MapType) {
    const endpoint = `/authorities/${id}/phone`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_icon(id: number, formData: FormData) {
    const endpoint = `/authorities/${id}/icon`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  update_wallpaper(id: number, formData: FormData) {
    const endpoint = `/authorities/${id}/wallpaper`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        return response;
      })
    );
  }

  submit_reset_password_request(email: string) {
    const endpoint = `/authorities/${email}/password-reset`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  submit_password_reset_code(code: string) {
    const endpoint = `/authorities/password-reset/${code}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** DELETE */

  remove_card_payment_method_to_authority_customer(authority_id: number, payment_method_id: string) {
    const endpoint = `/authorities/${authority_id}/customer-cards-payment-methods/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }



  get_platform_subscription(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/get-subscription`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // get_platform_subscription_info(authority_id: number) {
  //   const endpoint = `/authorities/${authority_id}/get-subscription-info`;
  //   return this.clientService.sendRequest<IAuthoritySubscriptionInfo | null>(endpoint, `GET`).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }

  check_subscription_active(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/is-subscription-active`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  create_subscription(authority_id: number, payment_method_id: string) {
    const endpoint = `/authorities/${authority_id}/create-subscription/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_AUTHORITY_TOKEN_NAME, response.data.token);
        this.authorityStore.setState(response.data.authority);
        this.is_subscription_active = true;
        this.is_subscription_active_stream.next(this.is_subscription_active);
        return response;
      })
    );
  }

  cancel_subscription(authority_id: number) {
    const endpoint = `/authorities/${authority_id}/cancel-subscription`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
