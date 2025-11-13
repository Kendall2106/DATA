import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkplaceComponent } from './pages/workplace/workplace.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { DataService } from './core/service/data.service';
import {initializeApp,provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getFirestore,provideFirestore} from '@angular/fire/firestore';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './pages/create/create.component';
import { FormsModule } from '@angular/forms';
import { TierComponent } from './pages/tier/tier.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalComponent } from './pages/component/modal/modal.components';
import { PendingListComponent } from './pages/pending-list/pending-list.component';
import { AlertComponent } from './pages/component/alert/alert.component';
import { CarrouselInfoComponent } from './pages/component/carrousel-info/carrousel-info.component';
import { AnimeListDiscoverComponent } from './pages/lists/anime-list-discover/anime-list-discover.component';
import { MovieListDiscoverComponent } from './pages/lists/movie-list-discover/movie-list-discover.component';
import { SerieListDiscoverComponent } from './pages/lists/serie-list-discover/serie-list-discover.component';
import { BookListDiscoverComponent } from './pages/lists/book-list-discover/book-list-discover.component';
import { GameListDiscoverComponent } from './pages/lists/game-list-discover/game-list-discover.component';
import { MusicListDiscoverComponent } from './pages/lists/music-list-discover/music-list-discover.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { GraphicsPageComponent } from './pages/graphics-page/graphics-page.component';
import { GraphicsByscoreComponent } from './pages/component/graphics-byscore/graphics-byscore.component';
import { GraphicsByyearComponent } from './pages/component/graphics-byyear/graphics-byyear.component';
import { GraphicsBytypeComponent } from './pages/component/graphics-bytype/graphics-bytype.component';
import { GameGraphicsComponent } from './pages/lists-graphics/game-graphics/game-graphics.component';
import { AnimeGraphicsComponent } from './pages/lists-graphics/anime-graphics/anime-graphics.component';
import { GraphicsBytype2Component } from './pages/component/graphics-bytype2/graphics-bytype2.component';
import { BooksGraphicsComponent } from './pages/lists-graphics/books-graphics/books-graphics.component';
import { ModalDetallesComponent } from './pages/component/modal-detalles/modal-detalles.component';







@NgModule({
  declarations: [
    AppComponent,
    WorkplaceComponent,
    SidebarComponent,
    CreateComponent,
    TierComponent,
    DiscoverPageComponent,
    ModalComponent,
    PendingListComponent,
    AlertComponent,
    CarrouselInfoComponent,
    AnimeListDiscoverComponent,
    MovieListDiscoverComponent,
    SerieListDiscoverComponent,
    BookListDiscoverComponent,
    GameListDiscoverComponent,
    MusicListDiscoverComponent,
    ProfilePageComponent,
    GraphicsPageComponent,
    GraphicsByscoreComponent,
    GraphicsByyearComponent,
    GraphicsBytypeComponent,
    GameGraphicsComponent,
    AnimeGraphicsComponent,
    GraphicsBytype2Component,
    BooksGraphicsComponent,
    ModalDetallesComponent
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
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(()=> getFirestore())
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
