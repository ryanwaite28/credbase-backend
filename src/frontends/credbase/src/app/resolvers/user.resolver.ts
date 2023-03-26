import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { IUser } from "@lib/fullstack-shared";
import { map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { ModelClientService } from "../services/model-client.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<IUser | null> {
  constructor(
    private modelClient: ModelClientService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<IUser | null> {
    // console.log({ state, route });
    return this.modelClient.user.get_user_by_id(route.params['user_id']).pipe(
      map((response: any) => {
        return response.data || null;
      })
    )
  }
}