import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';
import { ModalComponent } from '../component/modal/modal.components';
import { ApiBookService } from 'src/app/core/service/apiBook.service';
import { DataService } from 'src/app/core/service/data.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/core/service/spotify.service';
import { ApiSerieService } from 'src/app/core/service/apiSerie.service';
import { ApiMoviesService } from 'src/app/core/service/apiMovies.service';
import { ApiGamesService } from 'src/app/core/service/apiGames.service';
import { AlertService } from 'src/app/core/service/alert.service';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.css']

})
export class DiscoverPageComponent {
  data2: { name: string, image: string}[] = [];
  recomendaciones: any[] = [];
  animes: any[] = [];
  animesRange: any[] = [];
  opTipos: string[][] = [];
  numPage: number = 1;
  numPageMovie: number = 1;
  numPageSeries: number = 1;
  numPageGames: number = 1;
  startIndexMusic: number = 0;
  maxResultsMusic: number = 24;
  search: string = "";
  numVisible: number = 0;
  animeSelected: any;
  isModalOpen: boolean = false;
  books: any[] = [];
  startIndex: number = 0;
  maxResults: number = 24;
  message: string = "";
  alert: string = '';
  data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
  animesAiring: { name: string, image: string, info: string }[] = [];
  loading: boolean = false;
  opcionSeleccionada: string = "";


  showAnimeList: boolean = false;
  showMovieList: boolean = false;
  showSeriesList: boolean = false;
  showGameList: boolean = false;
  showBookList: boolean = false;
  showMusicList:boolean = false;
  introVisible: boolean= true;

  selectedItem: string = '';

  actualYear: number = 0;

  constructor( private spotify: SpotifyService, private alertService: AlertService, private apiGamesServive: ApiGamesService, private apiMoviesService: ApiMoviesService, private apiSerieService: ApiSerieService, private apiAnimeService: ApiAnimeService, public modalService: NgbModal, private apiBookService: ApiBookService, public dataService: DataService, private router: Router) {
  }


  async ngOnInit() {
   this.actualYear = new Date().getFullYear();

    this.numVisible = window.innerWidth <= 768 ? 1 : 6;

    window.addEventListener('resize', () => {
      this.numVisible = window.innerWidth <= 768 ? 1 : 6;
    });
  }

  loadData(type: string){
      this.introVisible = false;
      this.selectedItem = type;

      if (type == "Animes"){
        this.showAnimeList = true;
        this.showMovieList = false;
        this.showSeriesList  = false;
        this.showGameList  = false;
        this.showBookList  = false;
        this.showMusicList =false;
      } else if (type == "Books"){
        this.showAnimeList = false;
        this.showMovieList = false;
        this.showSeriesList  = false;
        this.showGameList  = false;
        this.showBookList  = true;
        this.showMusicList =false;
      }else if (type == "Games"){
        this.showAnimeList = false;
        this.showMovieList = false;
        this.showSeriesList  = false;
        this.showGameList  = true;
        this.showBookList  = false;
        this.showMusicList =false;
      }else if (type == "Movies"){
        this.showAnimeList = false;
        this.showMovieList = true;
        this.showSeriesList  = false;
        this.showGameList  = false;
        this.showBookList  = false;
        this.showMusicList =false;
      }else if (type == "Series"){
        this.showAnimeList = false;
        this.showMovieList = false;
        this.showSeriesList  = true;
        this.showGameList  = false;
        this.showBookList  = false;
        this.showMusicList =false;
      }else if (type == "Music"){
        this.showAnimeList = false;
        this.showMovieList = false;
        this.showSeriesList  = false;
        this.showGameList  = false;
        this.showBookList  = false;
        this.showMusicList = true;
      }

  }

    navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  closeNavbar() {
    this.navbarOpen = false;
  }
}