import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';
import { ModalComponent } from '../component/modal/modal.components';
import { ApiBookService } from 'src/app/core/service/apiBook.service';
import { DataService } from 'src/app/core/service/data.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/core/service/spotify.service';
import { ApiSerieService } from 'src/app/core/service/apiSerie.service copy';
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

/*
  async loadData(message: any) {
    try {
      this.loading = true;
      if (message === 'Movies') {
        this.getMovies();
      } else if (message === 'Series') {
        this.getSeries();
      } else if (message === 'Animes') {
        this.getAnime();
      } else if (message === 'Games') {
        this.getGames();
      } else if (message === 'Books') {
        this.getBooks();
      } else if (message === 'Music') {
        this.getMusic();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
      this.closeNavbar();
    }
  }


  

  




  

  


 




  





  




  




  


 

  async getBooksByName() {
    this.data = [];
    await this.apiBookService.getBooksByName(this.search).subscribe((response: any) => {
      if (response.items) {
        const booksWithImages = response.items.filter((book: any) => book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail);
        booksWithImages.forEach((item: any) => {
          this.data.push({
            name: item.volumeInfo.title,
            image: item.volumeInfo.imageLinks.thumbnail,
            info: item.volumeInfo.description,
            releaseDate: item.volumeInfo.publishedDate,
            randomData: item.volumeInfo.pageCount
          });
        });
      }
    });
  }


  


  async searchSeriesByName() {
    await this.apiSerieService.seachSeries(this.search).subscribe((response: any) => {
      const seriesWithImages = response.results.filter((m: any) => m.poster_path);
      this.data = [];
      seriesWithImages.forEach((item: any) => {
        this.data.push({
          name: item.name,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview,
          releaseDate: item.first_air_date,
          randomData: item.vote_average
        });
      });
    });
  }


  async seachGamesByName() {
    await this.apiGamesServive.seachGames(this.search).subscribe((response: any) => {
      this.data = [];
      response.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.image_url,
          info: item.overview,
          releaseDate: 'NC',
          randomData: item.platform_name
        });
      });
    });
  }


  async seachMusicByName() {
    await this.spotify.getAlbumsByName(this.search, this.maxResultsMusic).subscribe((response: any) => {
      this.data = [];
      response.albums.items.forEach((item: any) => {
        this.data.push({
          name: item.name,
          image: item.images[0].url,
          info: "Artist: " + item.artists[0].name,
          releaseDate: item.release_date,
          randomData: item.total_tracks
        });
      });
    });
  }


  

  searchData() {

    if (this.message == "Books") {
      this.getBooksByName();
    }

    if (this.message == "Movies") {
      this.searchMoviesByName();
    }

    if (this.message == "Series") {
      this.searchSeriesByName();
    }

    if (this.message == "Games") {
      this.seachGamesByName();
    }

    if (this.message == "Music") {
      this.seachMusicByName();
    }
  }


  aumentarNumero() {

    if (this.message == "Movies") {
      this.numPageMovie++;
      this.getMovies();
    }

    if (this.message == "Series") {
      this.numPageSeries++;
      this.getSeries();
    }

    if (this.message == "Books") {
      this.startIndex += this.maxResults;
      this.getBooks();
    }

    if (this.message == "Games") {
      this.numPageGames++;
      this.getGames();
    }

    if (this.message == "Music") {
      this.startIndexMusic += this.maxResultsMusic;
      this.getMusic();
    }
  }


  restNumber() {

    if (this.message == "Movies") {
      this.numPageMovie--;
      this.getMovies();
    }

    if (this.message == "Series") {
      this.numPageSeries--;
      this.getSeries();
    }

    if (this.message == "Games") {
      this.numPageGames--;
      this.getGames();
    }

    if (this.message == "Books") {
      this.startIndex -= this.maxResults;
      this.getBooks();
    }

    if (this.message == "Music") {
      this.startIndexMusic -= this.maxResultsMusic;
      this.getMusic();
    }
  }


  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = this.message;
  }

  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  closeNavbar() {
    this.navbarOpen = false;
  }*/

    navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  closeNavbar() {
    this.navbarOpen = false;
  }
}