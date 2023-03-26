import { Component, OnInit } from '@angular/core';
import { IUser } from '@lib/fullstack-shared';
import { UserStoreService } from '../../../../stores/user-store.service';

@Component({
  selector: 'credbase-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent implements OnInit {
  isOpen: boolean = false;
  you: IUser | null;

  constructor(
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you) => {
        this.you = you;
      }
    });
  }

}
