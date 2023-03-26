import { Injectable } from '@angular/core';
import { AuthorityService } from './authority.service';
import { UserService } from './user.service';

/* 
  This service is simply for consolidating other services relating to model CRUD api calls.
  The goal/intent is to reduce multiple imports in other components/services.
*/
@Injectable({
  providedIn: 'root'
})
export class ModelClientService {

  constructor(
    public readonly user: UserService,
    public readonly authority: AuthorityService,
  ) { }
  
}
