import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Anime } from 'src/app/core/model/anime.model';

import { Movie } from 'src/app/core/model/movie.model';
import { AlertService } from 'src/app/core/service/alert.service';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.css'],
})
export class WorkplaceComponent implements OnInit {
  data: any[] = [];
  resultFilter: any[] = [];
  movies: Movie[] = [];
  animes: Anime[] = [];
  message: string = '';
  opTipos: string[][] = [];
  opAnios: any[] = [];
  opCalificacion: string[] = [];
  calificacionSelec: any;
  resultCount: any = 0;
  color: any = "";
  type: string = "";
  loading: boolean = false;
  isInfoVisible = false;
  selectedCategory: string = 'Todos';
  selectedYear: string = this.opAnios[0];
  selectedScore: string = 'Todos';
  currentSortOrder: 'asc' | 'desc' = 'desc';
  selectedCardIndex: number | null = null;
  stars: boolean[] = Array(5).fill(false);
  selectedItem: string ='';
  isDateView = false;
  isActualRelease = false;

  tier: any = [12, 11, 10, 9, 8,7,6,5,4,3,2,1];

  constructor(private alertService: AlertService, private musicService: MusicService, private movieService: MovieService, private libroService: LibrosService, private gameService: GameService, private seriesService: SeriesService, private animeService: AnimeService, private router: Router, public dataService: DataService) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "lightblue", "lightGreen", "yellow", "Pink", "White", "lightYellow", "green", "Purple"] // Colores correspondientes
    ];
   // this.opAnios = ["All", "2024", "2023", "2022", "+"];
    this.opCalificacion = ["0", "1", "2", "3", "4", "5"];
  }

  ngOnInit() {

    if (!this.dataService.typeData) {
      this.router.navigate(['/']);
    }
    this.router.events.subscribe(event => {

      this.message = this.dataService.typeData;
      this.loadData('Animes');

    });

    this.updateYearOptions();
    this.selectedYear = this.opAnios[1];
  }

  updateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    this.opAnios = [
      'All',
      currentYear.toString(),
      (currentYear - 1).toString(),
      (currentYear - 2).toString(),
      (currentYear - 3).toString(),
      (currentYear - 4).toString(),
      (currentYear - 5).toString(),
    ];
  }


  async loadData(message: any) {
    try {
      this.selectedItem = message;
      this.loading = true;
      if (message === 'Movies') {
        this.color = 'linear-gradient(to bottom, #00913f3b, 20%, #121212)';
        this.data = await this.loadDataForType(this.movieService.getMovies());
      } else if (message === 'Series') {
        this.color = 'linear-gradient(to bottom, #c3e91a33, 20%, #121212)';
        this.data = await this.loadDataForType(this.seriesService.getSeries());
      } else if (message === 'Animes') {
        this.color = 'linear-gradient(to bottom, #4e239481, 20%, #121212)';
        this.data = await this.loadDataForType(this.animeService.getAnimes());
      } else if (message === 'Games') {
        this.color = 'linear-gradient(to bottom, #f8798e3a, 20%, #121212)';
        this.data = await this.loadDataForType(this.gameService.getGames());
      } else if (message === 'Books') {
        this.color = 'linear-gradient(to bottom, #8040003a, 20%, #121212)';
        this.data = await this.loadDataForType(this.libroService.getBook());
      } else if (message === 'Music') {
        this.color = 'linear-gradient(to bottom, #0000ff3f, 20%, #121212)';
        this.data = await this.loadDataForType(this.musicService.getMusic());
      }


      this.message = message;
      this.resultFilter = this.sortData(this.data);

      this.resultFilter.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });


      this.resultCount = this.resultFilter.length;
      this.applyFilters();

      this.loadAllMonth();

      console.log(this.data);
      if (this.data.length == 0) {

        this.showAlert("Error al solicitar los datos", "error", 3000);
      }

    } catch (error) {
      console.error("Error:", error);

    } finally {
      this.loading = false;
      this.type = message;
    }
  }



  async loadDataForType(service: Promise<any>) {
    const typeData = await service;
    return typeData.map((item: { date: string }) => {
      item.date = this.convertDate(item.date);
      return item;
    });
  }

  convertDate(date: any): string {
    const dateTemp = date.toString().toLowerCase();
    var parts = dateTemp.split("-");
    const year = parseInt(parts[2], 10);
    return parts[2] + "-" + parts[1] + "-" + parts[0];

  }

  sortData(data: any[]) {
    return data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('-').map(Number);
      const [dayB, monthB, yearB] = b.date.split('-').map(Number);

      if (yearB !== yearA) {
        return yearB - yearA;
      }
      if (monthB !== monthA) {
        return monthB - monthA;
      }
      return dayB - dayA;
    });
  }

  getColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow';
  }

  convert(date: any): number {
    const dateTemp = date.toString().toLowerCase();
    var parts = dateTemp.split("/");
    const year = parseInt(parts[2], 10);
    return year;

  }


  applyFilters() {
    console.log(this.resultFilter);
    this.resultFilter = this.data
      .filter(item => this.selectedCategory === 'Todos' || item.type === this.selectedCategory)
      .filter(item => this.convertYear(item))
      .filter(item => this.selectedScore === 'Todos' || item.score === this.selectedScore)
      .filter(item => this.isActualRelease === false || item.releaseDate === Number(this.selectedYear));

    this.resultCount = this.resultFilter.length;
    this.loadAllMonth();
  }


  convertYear(item: any): boolean {
    const date = item.date.toString().toLowerCase();
    const parts = date.split("-");
    const year = parseInt(parts[2], 10);
  
    if (this.selectedYear === 'All') {
      return true;
    } else if (this.selectedYear === '+') {
      return year < this.opAnios[3];
    } else {
      return (year + "") === this.selectedYear;
    }
  }


  filterType(event: any) {
    this.selectedCategory = event.target.value;
    this.applyFilters();
  }


  filterYear(event: any) {
    this.selectedYear = event.target.value;
    /*console.log(this.selectedYear);*/
    this.applyFilters();
  }

  /*filterYear(event: any) {
    this.selectedYear = event.target.value;
    this.applyFilters();
  }*/


  filterScore(event: any) {
    this.selectedScore = event.target.value;
    this.applyFilters();
  }

 
  sortDataByScore() {
    this.resultFilter = this.resultFilter.sort((a, b) => {
      const scoreA = a.score;
      const scoreB = b.score;

      if (this.currentSortOrder === 'asc') {
        return scoreA - scoreB;
      } else {
        return scoreB - scoreA;
      }
    });

    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
  }


  getColor(score: any) {
    if (score == 5) {
      return 'gold';
    }
    return '';
  }


  toggleInfo(index: number): void {
    if (this.selectedCardIndex === index) {
      this.selectedCardIndex = null;
    } else {
      this.selectedCardIndex = index;
    }
  }


  async deleteData(recoTemp: any) {

    try {
      this.loading = true;
      if (this.type === 'Movies') {
        await this.movieService.deleteMovie(recoTemp.id);
      } else if (this.type === 'Series') {
        await this.seriesService.deleteSerie(recoTemp.id);

      } else if (this.type === 'Animes') {
        await this.animeService.deleteAnime(recoTemp.id);

      } else if (this.type === 'Games') {
        await this.gameService.deleteGames(recoTemp.id);

      } else if (this.type === 'Books') {
        await this.libroService.deleteBook(recoTemp.id);

      } else if (this.type === 'Music') {
        await this.musicService.deleteMusic(recoTemp.id);

      }

    } catch (error) {
      this.showAlert("Error al eliminar", "error", 3000);

    } finally {
      this.loading = false; 

      this.loadData(this.type);
      this.showAlert("Dato Eliminado", "success", 2000);
    }
  }

 
  async rate(recoTemp: any, score: number) {
    recoTemp.score = score;
    try {
      this.loading = true;
      if (this.type === 'Movies') {
        await this.movieService.updateMovie(recoTemp.id, recoTemp.score);
      } else if (this.type === 'Series') {
        await this.seriesService.updateSerie(recoTemp.id, recoTemp.score);

      } else if (this.type === 'Animes') {
        await this.animeService.updateAnime(recoTemp.id, recoTemp.score);

      } else if (this.type === 'Games') {
        await this.gameService.updateGames(recoTemp.id, recoTemp.score);

      } else if (this.type === 'Books') {
        await this.libroService.updateBook(recoTemp.id, recoTemp.score);

      } else if (this.type === 'Music') {
        await this.musicService.updateMusic(recoTemp.id, recoTemp.score);

      }

    } catch (error) {
      this.showAlert("Error al actualizar el score", "error", 3000);

    } finally {
      this.loading = false; 
      this.loadData(this.type);
      this.showAlert("Dato Actualizado", "success", 2000);
    }
  }


  showAlert(messageAlert: string, tipoMessage: any, duration: number) {
    this.alertService.showAlert(messageAlert, tipoMessage, duration);
  }


  comparatedMonth(itemTemp: any) {
     const [day, month, year] = itemTemp.date.split('-');
      const date = new Date(`${year}-${month}-${day}`);
      const monthYear = `${date.getMonth() + 1}`;
      return monthYear;
  }


  dataFilterByDate(da: any, dateTemp: any) {
    return da.filter((d: { date: string; }) => this.comparatedMonth(d) == dateTemp);
  }

  months: { number: number, name: string }[] = [];


  loadAllMonth(){
    this.months = [];
    
    const monthNames = [
      "", "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];


    this.resultFilter.forEach(rf => {
      const monthName = monthNames[Number(this.comparatedMonth(rf))];

      // Agrega el mes a la matriz, si no está ya
      if (!this.months.some(month => month.name === monthName)) {
        this.months.push({ number: Number(this.comparatedMonth(rf)), name: monthName });
      }
    });
    console.log(this.months);

  }

  dateView() {

    this.isDateView = !this.isDateView;
  }

  // Método para convertir un objeto en un iterable de claves y valores
  objectEntries(obj: any): [string, any][] {
    return Object.entries(obj);
  }

  watchActualRelease() {
    this.isActualRelease = !this.isActualRelease;
    this.applyFilters();
  }

/*
  loadAchievements() {
    this.resultFilter = this.data
    .filter(item => item.achievements === true);

  this.resultCount = this.resultFilter.length;
  this.loadAllMonth();
  }
*/


}
