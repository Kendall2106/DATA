import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiSerieService } from 'src/app/core/service/apiSerie.service';
import { ModalComponent } from '../../component/modal/modal.components';

@Component({
  selector: 'app-serie-list-discover',
  templateUrl: './serie-list-discover.component.html',
  styleUrls: ['./serie-list-discover.component.css']
})
export class SerieListDiscoverComponent {
  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
  animesAiring: any[] =[];
  numPage: number = 1;
  search: string = "";
  genres: {id: number, name: string }[] = [];
  currentSearchType: 'all' | 'genre' | 'search' = 'all';
  currentGenre: string = '';  // Para almacenar el género seleccionado
 
   constructor(private apiSerieService: ApiSerieService,  public modalService: NgbModal){}

   ngOnInit(): void {
    this.getSeries();    
    this.getSeriesAiring();
    this.getGenres();
  }

  async getGenres() {
    await this.apiSerieService.getGenres().subscribe((response: any) => { 
      this.genres = [];
      console.log(response);
      this.genres = response.genres.map((genres: any) => ({
       id:genres.id,
       name: genres.name,
     }));
     console.log(response);
    });
  }


  async getSeries() {
    this.message = "Series";
    this.currentSearchType = 'all'; 
   // this.dataAiring();
    await this.apiSerieService.getSeries(this.numPage).subscribe((response: any) => {
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
      });
    });
  }

  async searchSeriesByName() {
    this.currentSearchType = 'search';
    await this.apiSerieService.seachSeries(this.search, this.numPage).subscribe((response: any) => {
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

  async getSerieByGenre(genre: any) {
    this.currentSearchType = 'genre'; 
    this.currentGenre = genre;
    this.data = [];
    await this.apiSerieService.getSerieByGenre(genre, this.numPage).subscribe((response: any) => {
      const moviesWithImages = response.results.filter((m: any) => m.poster_path);
      moviesWithImages.forEach((item: any) => {
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

  onOptionSelected(event: any): void {
    const selectedValue = event;
    this.numPage = 1;
    console.log(selectedValue);
    this.getSerieByGenre(selectedValue);
  }

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Series";
  }

  searchData(){
    this.numPage = 1;
    this.searchSeriesByName();
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
    this.getSeries();
  } else if (this.currentSearchType === 'genre') {
    this.getSerieByGenre(this.currentGenre);
  } else if (this.currentSearchType === 'search') {
    this.searchSeriesByName();
  }
}

}
