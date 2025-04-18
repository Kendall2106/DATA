import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiMoviesService } from 'src/app/core/service/apiMovies.service';
import { ModalComponent } from '../../component/modal/modal.components';

@Component({
  selector: 'app-movie-list-discover',
  templateUrl: './movie-list-discover.component.html',
  styleUrls: ['./movie-list-discover.component.css']
})
export class MovieListDiscoverComponent {
  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: number, randomData: string }[] = [];
  animesAiring: any[] =[];
  numPage = 1;
  search: string = "";
  genres: {id: number, name: string }[] = [];
  currentSearchType: 'all' | 'genre' | 'search' = 'all';
  currentGenre: string = '';  // Para almacenar el género seleccionado
 
   constructor(private apiMoviesService: ApiMoviesService, public modalService: NgbModal){}

   ngOnInit(): void {
    this.getMovies();   
    this.getMoviesAiring(); 
    this.getGenres();
  }


  async getGenres() {
    await this.apiMoviesService.getGenres().subscribe((response: any) => { 
      this.genres = [];
      console.log(response);
      this.genres = response.genres.map((genres: any) => ({
       id:genres.id,
       name: genres.name,
     }));
     console.log(response);
    });
  }

  async getMovies() {
    this.message = "Movies";
    this.currentSearchType = 'all'; 
   // this.dataAiring();
    await this.apiMoviesService.getMovies(this.numPage).subscribe((response: any) => {
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      this.data = [];
      console.log(response);
      moviesWithImages.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/w500" + item.poster_path,
          info: item.overview,
          releaseDate: this.getYear(item),
          randomData: item.vote_average
        });
      });
    });
  }

  

  async getMoviesAiring() {
    await this.apiMoviesService.getMoviesAiring(this.getCurrentMonth(0), this.getCurrentMonth(1)).subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      moviesWithImages.forEach((item: any) => {
        this.animesAiring.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          releaseDate: this.getYear(item),
          info: item.overview,
          randomData: item.vote_average
        });
      });
    });
  }

  getYear(itemTemp:any){
    const [year, month, day] = itemTemp.release_date.split('-');
     return Number(year);
}

  getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  getCurrentMonth(month: number): string {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + month, 1);
    console.log(this.getFormattedDate(firstDayCurrentMonth));
    return this.getFormattedDate(firstDayCurrentMonth);
  }


  async searchMoviesByName() {
    this.currentSearchType = 'search';
    await this.apiMoviesService.seachMovies(this.search, this.numPage).subscribe((response: any) => {
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      this.data = [];
      moviesWithImages.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview,
          releaseDate: this.getYear(item),
          randomData: item.vote_average
        });
      });
    });
  }

 async getMovieByGenre(genre: any) {
    this.currentSearchType = 'genre'; 
    this.currentGenre = genre;
    this.data = [];
    await this.apiMoviesService.getMovieByGenre(genre, this.numPage).subscribe((response: any) => {
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      moviesWithImages.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview,
          releaseDate: this.getYear(item),
          randomData: item.vote_average
        });
        
      });
      console.log("Hola");
      console.log(response);
    });

  }



  onOptionSelected(event: any): void {

    const selectedValue = event;
    this.numPage = 1;
    console.log(selectedValue);
    this.getMovieByGenre(selectedValue);
    // Aquí puedes ejecutar cualquier lógica que desees al seleccionar una opción
  }

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Movies";
  }

  searchData(){
    this.numPage = 1;
    this.searchMoviesByName();
  }


  aumentarNumero() {
    this.numPage++;
    this.loadBasedOnContext();
  
  }


  restNumber() {
    if (this.numPage > 1) {
      this.numPage--;
      this.loadBasedOnContext();  // Llamamos a la misma función
    }
  }

  // Esta función decide qué método usar según el contexto actual
loadBasedOnContext() {
  if (this.currentSearchType === 'all') {
    this.getMovies();
  } else if (this.currentSearchType === 'genre') {
    this.getMovieByGenre(this.currentGenre);
  } else if (this.currentSearchType === 'search') {
    this.searchMoviesByName();
  }
}

}
