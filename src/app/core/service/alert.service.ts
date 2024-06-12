// alert.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export interface Alert {
    message: string;
    type: 'success' | 'error' | '';
    duration: number;
  }

@Injectable({
  providedIn: 'root'
})
export class AlertService {
    private alertSubject = new Subject<Alert>();
    alert$ = this.alertSubject.asObservable();
  
    showAlert(message: string, type: 'success' | 'error', duration: number = 3000) {
        this.alertSubject.next({ message, type, duration });
        setTimeout(() => this.alertSubject.next({ message: '', type: '', duration: 0 }), duration);
      }
}