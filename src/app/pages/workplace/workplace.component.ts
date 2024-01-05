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
      ["lightcoral", "gray", "lightblue", "lightGreen", "yellow", "Pink", "White", "lightYellow", "green", "Purple"] // Colores correspondientes
    ];
      this.opAnios= ["2024","2023","2022","2021","2020","2019"];
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
      this.data = await this.loadDataForType(this.movieService.getMovies());
    } else if (this.message === 'Series') {
      this.data = await this.loadDataForType(this.seriesService.getSeries());
    } else if (this.message === 'Animes') {
      this.data = await this.loadDataForType(this.animeService.getAnimes());
    }else if (this.message === 'Juegos') {
      this.data = await this.loadDataForType(this.gameService.getGames());
    }else if (this.message === 'Libros') {
      this.data = await this.loadDataForType(this.libroService.getBook());
    }


    this.resultFilter=this.sortData(this.data);
    console.log(this.resultFilter[0].date);
    this.resultFilter.forEach((element: any)=>{
        element.image ='data:image/jpg;base64,' + element.image;
    });
    this.applyFilters();
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
    return parts[2]+"-"+parts[1]+"-"+parts[0];

}

  sortData(data: any[]){  
    return data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('-').map(Number);
      const [dayB, monthB, yearB] = b.date.split('-').map(Number);

      // Compara primero por año, luego por mes y finalmente por día, en orden descendente
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
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }


  convert(date: any): number {
       const dateTemp = date.toString().toLowerCase();
       var parts = dateTemp.split("/");
       const year = parseInt(parts[2], 10);
       return year;

   }

  
  selectedCategory: string = 'Todos';
  selectedYear: string = this.opAnios[0];
  selectedScore: string = 'Todos';


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

getColor(score: any){
  if(score==5){
    return 'gold'; 
  }
  return '#ded8cf';
}
 


}
