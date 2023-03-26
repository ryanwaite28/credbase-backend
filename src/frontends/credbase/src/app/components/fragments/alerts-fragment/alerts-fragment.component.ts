import { Component, OnInit } from '@angular/core';
import { IAlert, AlertTypes, AlertTypeTailwindColor, AlertDivClass, AlertTextClass } from '@lib/frontend-shared';
import { MapType } from '@lib/fullstack-shared';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';




@Component({
  selector: 'credbase-alerts-fragment',
  templateUrl: './alerts-fragment.component.html',
  styleUrls: ['./alerts-fragment.component.scss']
})
export class CommonAlertsFragmentComponent implements OnInit {
  alertsList: IAlert[] = [];
  AlertTypes = AlertTypes;
  AlertTypeTailwindColor = AlertTypeTailwindColor;

  subscription: Subscription | undefined;
  TIMEOUT_DURATION = 1000 * 5;

  get currentAlertColor(): string {
    return this.alertsList[0]
      ? AlertTypeTailwindColor[this.alertsList[0].type]
      : '';
  }

  get useClassBox(): MapType {
    return {
      [AlertDivClass.success]: this.alertsList[0]?.type === AlertTypes.SUCCESS,
      [AlertDivClass.info]:this. alertsList[0]?.type === AlertTypes.INFO,
      [AlertDivClass.warning]: this.alertsList[0]?.type === AlertTypes.WARNING,
      [AlertDivClass.danger]: this.alertsList[0]?.type === AlertTypes.DANGER,
      [AlertDivClass.secondary]: this.alertsList[0]?.type === AlertTypes.SECONDARY,
    };
  }

  get useClassText(): MapType {
    return {
      [AlertTextClass.success]: this.alertsList[0]?.type === AlertTypes.SUCCESS,
      [AlertTextClass.info]:this. alertsList[0]?.type === AlertTypes.INFO,
      [AlertTextClass.warning]: this.alertsList[0]?.type === AlertTypes.WARNING,
      [AlertTextClass.danger]: this.alertsList[0]?.type === AlertTypes.DANGER,
      [AlertTextClass.secondary]: this.alertsList[0]?.type === AlertTypes.SECONDARY,
    };
  }

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.subscription = this.alertService.getObservabe().subscribe((params) => {
      this.alertsList.push(params.alertObj);
      if (params.autoClose) {
        setTimeout(() => {
          this.closeAlert();
        }, this.TIMEOUT_DURATION);
      }
    });
    // console.log(this);
  }

  closeAlert() {
    const alert = this.alertsList.shift();
  }
}
