import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/service/alert.service';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';
import { ApiBookService } from 'src/app/core/service/apiBook.service';
import { ApiGamesService } from 'src/app/core/service/apiGames.service';
import { ApiMoviesService } from 'src/app/core/service/apiMovies.service';
import { ApiSerieService } from 'src/app/core/service/apiSerie.service';
import { GameService } from 'src/app/core/service/game.service';
import { ImagesService } from 'src/app/core/service/images.service';
import { SpotifyService } from 'src/app/core/service/spotify.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-graphics-page',
  templateUrl: './graphics-page.component.html',
  styleUrls: ['./graphics-page.component.css']
})
export class GraphicsPageComponent  {
  
  
    showAnimeList: boolean = false;
    showMovieList: boolean = false;
    showSeriesList: boolean = false;
    showGameList: boolean = false;
    showBookList: boolean = false;
    showMusicList:boolean = false;
    introVisible: boolean= true;
  
    selectedItem: string = '';
    numVisible: number = 0;
    actualYear: number = 0;
    message: string = "";
  
  
    constructor( private spotify: SpotifyService, private alertService: AlertService, private apiGamesServive: ApiGamesService, private apiMoviesService: ApiMoviesService, private apiSerieService: ApiSerieService, private apiAnimeService: ApiAnimeService, private apiBookService: ApiBookService) {
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
