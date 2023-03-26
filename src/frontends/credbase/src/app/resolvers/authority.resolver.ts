import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { IAuthority } from "@lib/fullstack-shared";
import { map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { ModelClientService } from "../services/model-client.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorityResolver implements Resolve<IAuthority | null> {
  constructor(
    private modelClient: ModelClientService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<IAuthority | null> {
    // console.log({ state, route });
    return this.modelClient.authority.get_authority_by_id(route.params['authority_id']).pipe(
      map((response: any) => {
        return response.data || null;
      })
    )
  }
}