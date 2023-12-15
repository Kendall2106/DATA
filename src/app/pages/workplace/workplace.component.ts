import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Anime } from 'src/app/core/model/anime.model';

import { Movie } from 'src/app/core/model/movie.model';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.css'],
})
export class WorkplaceComponent implements OnInit {
  data: any[] = [];
  resultFilter: any[]=[];

  movies: Movie[] = [];
  animes: Anime[] = [];
  message: string = '';
  opTipos: string[][] = [];
  opAnios: string[] = [];
  opCalificacion: string[] = [];
  calificacionSelec: any;
  constructor(private movieService: MovieService, private libroService: LibrosService, private gameService: GameService,private seriesService: SeriesService, private animeService: AnimeService,private router: Router, public dataService: DataService) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
    ];
      this.opAnios= ["2023","2022","2021","2020"];
      this.opCalificacion = ["0","1","2","3","4","5"];
  }

  ngOnInit() {

    if (!this.dataService.typeData) {
      this.router.navigate(['/']);
    }
    //const selectElement = document.getElementById('opAnios');
    //this.filterYear(document.getElementById('opAnios'));
    this.router.events.subscribe(event => {
      
        this.message = this.dataService.typeData;
        this.loadData();
   
    });

    this.selectedYear = this.opAnios[0];
   // this.applyFilters();
  }

  async loadData(){
    if (this.message === 'Peliculas') {
      this.data = (await this.movieService.getMovies()).map((movie: { date: string; }) => {
        movie.date = this.convertDate(movie.date);
        return movie;
      });
      this.resultFilter=this.data;
      this.resultFilter.forEach((element: any)=>{
        element.image ='data:image/jpg;base64,' + element.image;
      });
      this.applyFilters();
    }else if (this.message === 'Series') {
      this.data = (await this.seriesService.getSeries()).map((serie: { date: string; }) => {
        serie.date = this.convertDate(serie.date);
        return serie;
      });
      this.resultFilter=this.data;
      this.resultFilter.forEach((element: any)=>{
        element.image ='data:image/jpg;base64,' + element.image;
      });
      this.applyFilters();
    }
  }

  convertDate(date: any): string {
    const dateTemp = date.toString().toLowerCase();
    var parts = dateTemp.split("-");
    const year = parseInt(parts[2], 10);
    return parts[2]+"-"+parts[1]+"-"+parts[0];

}

  /*loadData() {
    if (this.message === 'Peliculas') {
      this.movieService.getMovies().subscribe(movies => {
        this.data = movies.sort((a, b) => b.id - a.id);
       // this.resultFilter=this.data.filter((d) => {  return d.date>="01/01/2023"; });
       this.resultFilter=this.data;
       this.applyFilters();
      });
    } else if (this.message === 'Animes') {
      this.animeService.getAnimes().subscribe(animes => {
        this.data = animes.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
        this.applyFilters();
      });
    } else if (this.message === 'Series') {
      this.seriesService.getSeries().subscribe(series => {
        this.data = series.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
        this.applyFilters();
      });
    } else if (this.message === 'Juegos') {
      this.gameService.getGames().subscribe(games => {
        this.data = games.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
        this.applyFilters();
      });
    } else if (this.message === 'Libros') {
      this.libroService.getLibros().subscribe(libros => {
        this.data = libros.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
        this.applyFilters();
      });
    }

    
    //this.resultFilter=this.data;
    // Añade lógica para otros casos si es necesario
  }*/

  getColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }



  convert(date: any): number {
       const dateTemp = date.toString().toLowerCase();
       var parts = dateTemp.split("/");
       const year = parseInt(parts[2], 10);
       return year;

   }

   /*convertirTimestampAFecha(timestamp: any): string {
    const fecha = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
  
    const formatoFecha = `${dia}/${mes}/${anio}`;
  
    return formatoFecha;
  }*/



  selectedCategory: string = 'Todos';
  selectedYear: string = this.opAnios[0];
  selectedScore: string = 'Todos';

// Agrega un método para aplicar los filtros


applyFilters() {
  this.resultFilter = this.data
    .filter(item => this.selectedCategory === 'Todos' || item.type === this.selectedCategory)
    .filter(item => this.convertYear(item))
    .filter(item => this.selectedScore === 'Todos' || item.score === this.selectedScore);

}

convertYear(item: any): boolean {
  const date = item.date.toString().toLowerCase();
  const parts = date.split("-");
  const year = parseInt(parts[2], 10);
  return (year+"") === this.selectedYear;
}




  filterType(event: any) {
    this.selectedCategory = event.target.value;
    this.applyFilters();
  }
  
  filterYear(event: any) {
    this.selectedYear = event.target.value;
    this.applyFilters();
  }

  filterScore(event: any) {
    this.selectedScore = event.target.value;
    this.applyFilters();
  }




  


  currentSortOrder: 'asc' | 'desc' = 'desc';

// Método para cambiar el orden de acuerdo al score
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

  // Cambia el orden actual para la próxima vez
  this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
}
 


}
