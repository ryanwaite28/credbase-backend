import { AlertTypes } from "../enums/common.enum";

export interface IAlert {
  type: AlertTypes;
  message: string;
}
