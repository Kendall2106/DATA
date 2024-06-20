import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from 'src/app/core/service/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  message: string = '';
  alertClass: string = '';
  progress: number = 100;
  duration: number = 0;
  private subscription: Subscription = new Subscription();


  constructor(private alertService: AlertService) { }


  ngOnInit() {
    this.subscription = this.alertService.alert$.subscribe((alert: Alert) => {
      if (alert.message) {
        this.message = alert.message;
        this.alertClass = alert.type === 'success' ? 'alert-success' : 'alert-error';
        this.duration = alert.duration;
        this.startProgressBar();
      } else {
        this.message = '';
        this.alertClass = '';
        this.progress = 100;
      }
    });
  }


  startProgressBar() {
    this.progress = 100;
    const interval = 100;
    const steps = this.duration / interval;
    let step = 0;

    const intervalId = setInterval(() => {
      step++;
      this.progress = 100 - (step / steps) * 100;
      if (step >= steps) {
        clearInterval(intervalId);
      }
    }, interval);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
