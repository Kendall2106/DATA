import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkplaceComponent } from './pages/workplace/workplace.component';

import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { DataService } from './core/service/data.service';
import { LibraryComponent } from './pages/library/library.component';

import {initializeApp,provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getFirestore,provideFirestore} from '@angular/fire/firestore';


import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphicsComponent } from './pages/component/graphics/graphics.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './pages/create/create.component';
import { FormsModule } from '@angular/forms';
import { TierComponent } from './pages/tier/tier.component';
import { ListNextComponent } from './pages/list-next/list-next.component'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeComponent } from './pages/home/home.component';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';

import { CarouselModule } from 'primeng/carousel';
//import { MatTooltipModule } from '@angular/material/tooltip';





@NgModule({
  declarations: [
    AppComponent,
    WorkplaceComponent,
    SidebarComponent,
    LibraryComponent,
    GraphicsComponent,
    CreateComponent,
    TierComponent,
    ListNextComponent,
    HomeComponent,
    DiscoverPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    DragDropModule,
    CarouselModule,
   // MatTooltipModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(()=> getFirestore())
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
