import { Component } from '@angular/core';
import { IUser } from '@lib/fullstack-shared';
import { UserService } from '../../../../services/user.service';
import { UserStoreService } from '../../../../stores/user-store.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';



@Component({
  selector: 'credbase-user-base-page',
  templateUrl: './user-base-page.component.html',
  styleUrls: ['./user-base-page.component.scss']
})
export class UserBasePageComponent {
  you: IUser | null;

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;
      }
    });
  }

  signOut() {
    this.userService.sign_out();
    this.router.navigate(['/', 'user-login']);
    this.alertService.handleResponseSuccessGeneric({ message: `Signed out successfully!` });
  }

}
