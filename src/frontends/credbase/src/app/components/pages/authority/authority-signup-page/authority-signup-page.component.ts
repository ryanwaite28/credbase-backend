import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PASSWORD_REGEX, PERSON_NAME_REGEX, UserSignUpDto } from '@lib/fullstack-shared';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
import { ModelClientService } from '../../../../services/model-client.service';

@Component({
  selector: 'credbase-authority-signup-page',
  templateUrl: './authority-signup-page.component.html',
  styleUrls: ['./authority-signup-page.component.scss']
})
export class AuthoritySignupPageComponent {

  loading: boolean = false;
  signupForm: UntypedFormGroup;

  get shouldDisable(): boolean {
    const isDisabled = this.loading || this.signupForm.invalid || this.signupForm.value.confirmPassword !== this.signupForm.value.password;
    return isDisabled;
  }

  constructor(
    private modelClient: ModelClientService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.signupForm = new UntypedFormGroup({
      firstname: new UntypedFormControl('', [Validators.required, Validators.pattern(PERSON_NAME_REGEX)]),
      lastname: new UntypedFormControl('', [Validators.required, Validators.pattern(PERSON_NAME_REGEX)]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      confirmPassword: new UntypedFormControl('', []),
    });
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      // return;
    }
    this.loading = true;
    const params: UserSignUpDto = {
      firstname: this.signupForm.value.firstname,
      lastname: this.signupForm.value.lastname,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };
    this.modelClient.user.sign_up(params)
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