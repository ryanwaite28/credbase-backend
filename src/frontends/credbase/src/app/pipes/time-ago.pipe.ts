import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string, hideAgoText: boolean = false): unknown {
    const timeAgo = moment(value).fromNow(hideAgoText);
    return timeAgo;
  }

}
