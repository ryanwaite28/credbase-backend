import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PASSWORD_REGEX, UserSignInDto } from '@lib/fullstack-shared';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
import { ModelClientService } from '../../../../services/model-client.service';

@Component({
  selector: 'credbase-user-login-page',
  templateUrl: './user-login-page.component.html',
  styleUrls: ['./user-login-page.component.scss']
})
export class UserLoginPageComponent implements OnInit {

  loading: boolean = false;
  loginForm: UntypedFormGroup;

  get shouldDisable(): boolean {
    const isDisabled = this.loading || this.loginForm.invalid;
    return isDisabled;
  }

  constructor(
    private modelClient: ModelClientService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      // return;
    }
    this.loading = true;
    const params: UserSignInDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.modelClient.user.log_in(params)
    .pipe(finalize(() => { this.loading = false }))
    .subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric({ message: response.message! });
        this.router.navigate(['/', 'users', response.data.user.id]);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

}
