import { InjectionToken, Provider } from "@angular/core";
import { environment } from "./environment";

export const EnvToken: InjectionToken<string> = new InjectionToken(`ENVIRONMENT`);
export const EnvironmentProvider: Provider = { provide: EnvToken, useValue: environment };