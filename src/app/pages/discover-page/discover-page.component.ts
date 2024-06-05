import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';
import { ModalComponent } from '../component/modal/modal.components';
import { ApiBookService } from 'src/app/core/service/apiBook.service';
import { Observable, filter } from 'rxjs';
import { DataService } from 'src/app/core/service/data.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SpotifyService } from 'src/app/core/service/spotify.service';
import { ApiSerieService } from 'src/app/core/service/apiSerie.service copy';
import { ApiMoviesService } from 'src/app/core/service/apiMovies.service';
import { ApiGamesService } from 'src/app/core/service/apiGames.service';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.css']
})
export class DiscoverPageComponent {


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

  constructor(private spotify: SpotifyService, private apiGamesServive: ApiGamesService, private apiMoviesService: ApiMoviesService, private apiSerieService: ApiSerieService, private apiAnimeService: ApiAnimeService, public modalService: NgbModal, private apiBookService: ApiBookService, public dataService: DataService, private router: Router) {

  }



  opcionSeleccionada: string = "";

  async ngOnInit() {
    //this.getAnime();


    this.numVisible = window.innerWidth <= 768 ? 1 : 6;

    window.addEventListener('resize', () => {
      this.numVisible = window.innerWidth <= 768 ? 1 : 6;
    });

  }



 


  async loadData(message: any) {
    try {
      this.loading = true; // Mostrar animación de carga
      if (message === 'Movies') {
        await this.getMovies();
      } else if (message === 'Series') {
         await this.getSeries();
      } else if (message === 'Animes') {
        await this.getAnime();
      } else if (message === 'Games') {
        await this.getGames();
      } else if (message === 'Books') {
        await this.getBooks();
      } else if (message === 'Music') {
        await this.getMusic();
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false; // Ocultar animación de carga
    }

  }


















  getMusic() {

    this.message = "Music";
    this.dataAiring();
    this.spotify.getAlbums(this.startIndexMusic, this.maxResultsMusic).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      response.albums.items.forEach((item: any) => {

        /*  if(item.album_type == 'album'){*/
        this.data.push({
          name: item.name,
          image: item.images[0].url,
          info: "Artist: " + item.artists[0].name + ", Fecha Salida: " + item.release_date,
          releaseDate: item.release_date,
          randomData: item.total_tracks
        });
        /* }*/
      });
    });

  }

  async getAnime() {

     this.message = "Animes";
      this.dataAiring();
      try {
        this.loading = true;
      await this.apiAnimeService.getAnimeByPage(this.numPage).subscribe((response: any) => {
        this.data = [];
        console.log(response);
        response.data.forEach((item: any) => {
          this.data.push({
            name: item.title,
            image: item.images.jpg.image_url,
            info: item.synopsis,
            releaseDate: item.year,
            randomData: item.score
          });
        });
      });
    } catch (error) {
      console.error("Error getAnime:", error);
    } finally {
      this.loading = false; // Ocultar animación de carga
    }


  }

  async getBooks() {


      this.loading = true;
      this.message = "Books";
      this.dataAiring();
      await this.apiBookService.getBooks(this.startIndex, this.maxResults).subscribe((response: any) => {
        const booksWithImages = response.items.filter((book: any) => book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail);
        this.data = [];
        console.log(response);
        booksWithImages.forEach((item: any) => {
          this.data.push({
            name: item.volumeInfo.title,
            image: item.volumeInfo.imageLinks.thumbnail,
            info: item.volumeInfo.description,
            releaseDate: item.volumeInfo.publishedDate,
            randomData: item.volumeInfo.pageCount
          });
        });
      });


  }

  async getMovies() {
    this.message = "Movies";
    this.dataAiring();
    await this.apiMoviesService.getMovies(this.numPageMovie).subscribe((response: any) => {
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      this.data = [];
      console.log(response);
      moviesWithImages.forEach((item: any) => {

        this.data.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/w500" + item.poster_path,
          info: item.overview,
          releaseDate: item.release_date,
          randomData: item.vote_average
        });
        //console.log(this.data);

      });
    });
  }

  async getSeries() {
    this.message = "Series";
    this.dataAiring();
    await this.apiSerieService.getSeries(this.numPageSeries).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      response.results.forEach((item: any) => {
        this.data.push({
          name: item.name,
          image: "https://image.tmdb.org/t/p/w500" + item.poster_path,
          info: item.overview,
          releaseDate: item.first_air_date,
          randomData: item.vote_average
        });
        //console.log(this.data);
      });
    });
  }

  async getGames() {
    this.message = "Games";
    this.dataAiring();
    await this.apiGamesServive.getGames(this.numPageGames).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      console.log(response);
      response.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.image_url,
          info: item.overview,
          releaseDate: 'NC',
          randomData: item.platform_name

        });
        //console.log(this.data);
      });
    });
  }











  async getAnimeAiring() {
    await this.apiAnimeService.getAnimeAiring().subscribe((response: any) => {
      this.animesAiring = [];
      response.data.forEach((item: any) => {
        this.animesAiring.push({
          name: item.title,
          image: item.images.jpg.image_url,
          info: item.synopsis
        });
      });
    });
  }

  async getBooksByNew() {
    await this.apiBookService.getBooksByNew().subscribe((response: any) => {
      const booksWithImages = response.items.filter((book: any) => book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail);
      this.animesAiring = [];
      booksWithImages.forEach((item: any) => {
        this.animesAiring.push({
          name: item.volumeInfo.title,
          image: item.volumeInfo.imageLinks.thumbnail,
          info: item.volumeInfo.description
        });
      });
    });
  }


  /**/

  getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  getCurrentMonth(month: number): string {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + month, 1);
    console.log(this.getFormattedDate(firstDayCurrentMonth));
    return this.getFormattedDate(firstDayCurrentMonth);

  }


  /**/



  async getMoviesAiring() {
    await this.apiMoviesService.getMoviesAiring(this.getCurrentMonth(0), this.getCurrentMonth(1)).subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      moviesWithImages.forEach((item: any) => {
        this.animesAiring.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview
        });
        //console.log(this.data);
      });
    });
  }

  async getSeriesAiring() {
    await this.apiSerieService.getSeriesAiring(this.getCurrentMonth(0), this.getCurrentMonth(1)).subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      const seriesWithImages = response.results.filter((m: any) => m.poster_path);
      seriesWithImages.forEach((item: any) => {
        this.animesAiring.push({
          name: item.name,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview
        });
        //console.log(this.data);
      });
    });
  }

  async getGamesByPc() {
    await this.apiGamesServive.getGamesByPC(1).subscribe((response: any) => {
      this.animesAiring = [];
      response.forEach((item: any) => {
        this.animesAiring.push({
          name: item.title,
          image: item.image_url,
          info: item.overview
        });
        //console.log(this.data);
      });
    });
  }

  async getMusicAiring() {
    await this.spotify.getAlbumsAiring().subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      response.artists.items.forEach((item: any) => {
        this.animesAiring.push({
          name: item.name,
          image: item.images[0].url,
          info: " "
        });
        //console.log(this.data);
      });
    });
  }











  async searchAnimesByName() {
    this.data = [];
    await this.apiAnimeService.searchAnimesByName(this.search, this.numPage).subscribe((response: any) => {
      response.data.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.images.jpg.image_url,
          info: item.synopsis,
          releaseDate: item.year,
          randomData: item.score
        });
      });
    });
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


  async searchMoviesByName() {
    await this.apiMoviesService.seachMovies(this.search).subscribe((response: any) => {
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      this.data = [];
      moviesWithImages.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview,
          releaseDate: item.release_date,
          randomData: item.vote_average
        });
      });
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









  dataAiring() {
    console.log("wait" + this.message);
    if (this.message == "Animes") {
      this.getAnimeAiring();
    }

    if (this.message == "Books") {

      this.getBooksByNew();
    }

    if (this.message == "Movies") {
      this.getMoviesAiring();
    }

    if (this.message == "Series") {
      this.getSeriesAiring();
    }

    if (this.message == "Games") {
      this.getGamesByPc();
    }

    if (this.message == "Music") {
      this.getMusicAiring();
    }


  }

  searchData() {
    if (this.message == "Animes") {
      this.searchAnimesByName();
    }

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
    if (this.message == "Animes") {
      this.numPage++;
      this.getAnime();
    }

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
    if (this.message == "Animes") {
      this.numPage--;
      this.getAnime();
    }

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
    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   console.log(receivedEntry);
    // })
  }





}