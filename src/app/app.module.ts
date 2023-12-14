import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkplaceComponent } from './pages/workplace/workplace.component';

import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { DataService } from './core/service/data.service';
import { HomeComponent } from './pages/home/home.component';

import {initializeApp,provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getFirestore,provideFirestore} from '@angular/fire/firestore';


import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphicsComponent } from './pages/component/graphics/graphics.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    WorkplaceComponent,
    SidebarComponent,
    HomeComponent,
    GraphicsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgbModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(()=> getFirestore())
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
