import { Inject, Injectable } from '@angular/core';
import { EnvToken } from '../../environments/environment.provider';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(
    @Inject(EnvToken) public readonly environment
  ) { }

}
