import { Pipe, PipeTransform } from '@angular/core';
import { IUser, getUserFullName } from '@lib/fullstack-shared';


@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {
  transform(value: any, user: IUser): string {
    const nameFormatted: string = getUserFullName(user);
    return nameFormatted;
  }
}
