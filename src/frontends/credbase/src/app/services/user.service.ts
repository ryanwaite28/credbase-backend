import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpStatusCode, IUser, MapType, UserSignInDto, UserSignUpDto, USER_RECORDS } from '@lib/fullstack-shared';
import { BehaviorSubject, catchError, map, mergeMap, Observable, of } from 'rxjs';
import { GetVerifySmsCode } from '../interfaces/responses.interface';
import { UserStoreService } from '../stores/user-store.service';
import { get_user_records_endpoint } from '../_misc/chamber';
import { JWT_USER_TOKEN_NAME } from '../_misc/vault';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private is_subscription_active: boolean = false;
  private is_subscription_active_stream = new BehaviorSubject<boolean>(this.is_subscription_active);

  private isFirstCall = true;

  constructor(
    private userStore: UserStoreService,
    private clientService: ClientService,
    private router: Router
  ) {}

  getHasPlatformSubscription(): boolean {
    return this.is_subscription_active;
  }

  getSubscriptionActiveStream() {
    return this.is_subscription_active_stream.asObservable();
  }

  checkUserSession(): Observable<IUser | null> {
    return this.userStore.getChangesObs().pipe(
      mergeMap((you: IUser | null) => {
        return you !== undefined
          ? of(you)
          : this.checkSession().pipe(
              map((response) => {
                return response.data.user || null;
              })
            );
      })
    );
  }

  private checkSession(): Observable<{ data: { user: IUser | null, token: string | null } }> {
    const jwt = window.localStorage.getItem(JWT_USER_TOKEN_NAME);
    const badJwt = !jwt || jwt === `undefined`;
    if (badJwt) {
      window.localStorage.removeItem(JWT_USER_TOKEN_NAME);
      this.userStore.setState(null);
      return of({
        message: `no token found`,
        data: {
          user: null,
          token: null,
        }
      });
    }
    return this.clientService.sendRequest<any>(
      '/users/check-session',
      `GET`,
      null,
    ).pipe(
      map((response: any) => {
        if (response.data?.is_subscription_active) {
          this.is_subscription_active = response.data.is_subscription_active;
          this.is_subscription_active_stream.next(this.is_subscription_active);
        }
        this.userStore.setState(response.data!.user);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== HttpStatusCode.REQUEST_FAILED) {
          // this.sign_out();
        }
        console.log(error);
        this.router.navigate(['/', 'user-login']);
        return of({
          data: {
            user: null,
            token: null,
          }
        });
      })
    );
  }

  get_users_by_query(query: string) {
    return this.clientService.get<IUser[]>(`/users/query/${query}`);
  }

  use_jwt_from_url(jwt: string) {
    window.localStorage.setItem(JWT_USER_TOKEN_NAME, jwt);
    return this.checkSession()
  }

  sign_out() {
    // return of().pipe(
    //   map(() => {
    //     this.userStore.setState(null);
    //     window.localStorage.removeItem(JWT_USER_TOKEN_NAME);
    //     console.log(`signed out`);
    //   })
    // );

    this.userStore.setState(null);
    window.localStorage.removeItem(JWT_USER_TOKEN_NAME);
    console.log(`signed out`);
  }

  verify_email(uuid: string) {
    const endpoint = '/users/verify-email/' + uuid;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        this.userStore.setState(null);
        window.localStorage.removeItem(JWT_USER_TOKEN_NAME);
        return response;
      })
    );
  }

  send_sms_verification(phone: string) {
    const endpoint = '/users/send-sms-verification/' + phone;
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
    const endpoint = `/users/verify-sms-code/request_id/${request_id}/code/${code}`;
    return this.clientService.sendRequest<GetVerifySmsCode>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  send_feedback(you_id: number, data: MapType) {
    const endpoint = `/users/${you_id}/feedback`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** */

  get_user_by_id(id: number) {
    const endpoint = '/users/' + id;
    return this.clientService.sendRequest<IUser>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_user_by_phone(phone: string) {
    const endpoint = '/users/phone/' + phone;
    return this.clientService.sendRequest<IUser>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  check_user_follows(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  toggle_user_follow(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/follows/${user_id}`;
    return this.clientService.post<any>(endpoint).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_user_followers_count(user_id: number) {
    const endpoint = `/users/${user_id}/followers-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_user_followings_count(user_id: number) {
    const endpoint = `/users/${user_id}/followings-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_user_messagings(you_id: number, messagings_timestamp?: string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/users/' + you_id + '/messagings/all'
      : messagings_timestamp
        ? '/users/' + you_id + '/messagings/' + messagings_timestamp
        : '/users/' + you_id + '/messagings';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_user_messages(you_id: number, user_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/users/' + you_id + '/messages/' + user_id + '/' + min_id
      : '/users/' + you_id + '/messages/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_unseen_counts(you_id: number) {
    const endpoint = `/users/${you_id}/unseen-counts`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  get_user_customer_cards_payment_methods(you_id: number) {
    const endpoint = `/users/${you_id}/customer-cards-payment-methods`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // generic

  get_user_records<T>(
    user_id: number,
    path: USER_RECORDS,
    min_id?: number,
    get_all: boolean = false,
    is_public: boolean = true
  ) {
    const endpoint = get_user_records_endpoint(user_id, path, min_id, get_all, is_public);
    return this.clientService.sendRequest(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_user_feed(you_id: number, feed_type: string, min_id?: number) {
    const endpoint = min_id
      ? `/users/${you_id}/feed/${min_id}?feed_type=${feed_type}`
      : `/users/${you_id}/feed?feed_type=${feed_type}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  //

  // getUserNotificationsAll<T = any>(user_id: number) {
  //   return this.get_user_records<T>(
  //     user_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     undefined,
  //     true,
  //     false
  //   );
  // }

  // getUserNotifications<T = any>(user_id: number, min_id?: number) {
  //   return this.get_user_records<T>(
  //     user_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     min_id,
  //     false,
  //     false
  //   );
  // }

  // getUserAppNotificationsAll<T = any>(user_id: number) {
  //   return this.get_user_records<T>(
  //     user_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     undefined,
  //     true,
  //     false
  //   );
  // }

  // getUserAppNotifications<T = any>(user_id: number, min_id?: number) {
  //   return this.get_user_records<T>(
  //     user_id,
  //     USER_RECORDS.NOTIFICATIONS,
  //     min_id,
  //     false,
  //     false
  //   );
  // }

  // getUserAppNotificationsLastOpened(you_id: number) {
  //   return this.clientService.sendRequest<IUserNotificationsLastOpenedByApp>(`/users/${you_id}/notifications-last-opened`, `GET`).pipe(
  //     map((response: any) => {
  //       this.notificationsLastOpened = response.data!;
  //       return response;
  //     })
  //   );
  // }

  // updateUserAppNotificationsLastOpened(you_id: number) {
  //   return this.clientService.sendRequest<IUserNotificationsLastOpenedByApp>(`/users/${you_id}/notifications-last-opened`, `POST`).pipe(
  //     map((response: any) => {
  //       this.notificationsLastOpened = response.data!;
  //       return response;
  //     })
  //   );
  // }

  /** POST */

  sign_up(data: UserSignUpDto) {
    return this.clientService.post<any>('/users', data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_user_last_opened(you_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_conversation_last_opened(you_id: number, conversation_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/conversations/${conversation_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  add_card_payment_method_to_user_customer(you_id: number, payment_method_id: string) {
    const endpoint = `/users/${you_id}/customer-cards-payment-methods/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  /** PUT */
  

  log_in(data: UserSignInDto) {
    return this.clientService.sendRequest<any>('/users', `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_info(id: number, data: MapType) {
    const endpoint = `/users/${id}/info`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_password(id: number, data: MapType) {
    const endpoint = `/users/${id}/password`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_phone(id: number, data: MapType) {
    const endpoint = `/users/${id}/phone`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, data).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_icon(id: number, formData: FormData) {
    const endpoint = `/users/${id}/icon`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  update_wallpaper(id: number, formData: FormData) {
    const endpoint = `/users/${id}/wallpaper`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        return response;
      })
    );
  }

  submit_reset_password_request(email: string) {
    const endpoint = `/users/${email}/password-reset`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  submit_password_reset_code(code: string) {
    const endpoint = `/users/password-reset/${code}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** DELETE */

  remove_card_payment_method_to_user_customer(you_id: number, payment_method_id: string) {
    const endpoint = `/users/${you_id}/customer-cards-payment-methods/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }



  get_platform_subscription(you_id: number) {
    const endpoint = `/users/${you_id}/get-subscription`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // get_platform_subscription_info(user_id: number) {
  //   const endpoint = `/users/${user_id}/get-subscription-info`;
  //   return this.clientService.sendRequest<IUserSubscriptionInfo | null>(endpoint, `GET`).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }

  check_subscription_active(you_id: number) {
    const endpoint = `/users/${you_id}/is-subscription-active`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  create_subscription(you_id: number, payment_method_id: string) {
    const endpoint = `/users/${you_id}/create-subscription/${payment_method_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem(JWT_USER_TOKEN_NAME, response.data.token);
        this.userStore.setState(response.data.user);
        this.is_subscription_active = true;
        this.is_subscription_active_stream.next(this.is_subscription_active);
        return response;
      })
    );
  }

  cancel_subscription(you_id: number) {
    const endpoint = `/users/${you_id}/cancel-subscription`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
