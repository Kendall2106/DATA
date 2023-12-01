import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Anime } from 'src/app/core/model/anime.model';

import { Movie } from 'src/app/core/model/movie.model';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
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
  constructor(private movieService: MovieService, private seriesService: SeriesService, private animeService: AnimeService,private router: Router, public dataService: DataService) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White"] // Colores correspondientes
    ];
      this.opAnios= ["2023","2022","2021","2020"];
      this.opCalificacion = ["0","1","2","3","4","5"];
  }

  ngOnInit() {
  

    if (!this.dataService.typeData) {
      this.router.navigate(['/']);
    }

    this.router.events.subscribe(event => {
      
        this.message = this.dataService.typeData;
        this.loadData();
   
    });
  }

  loadData() {
    if (this.message === 'Peliculas') {
      this.movieService.getMovies().subscribe(movies => {
        this.data = movies.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
      });
    } else if (this.message === 'Animes') {
      this.animeService.getAnimes().subscribe(animes => {
        this.data = animes.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
      });
    } else if (this.message === 'Series') {
      this.seriesService.getSeries().subscribe(series => {
        this.data = series.sort((a, b) => b.id - a.id);
        this.resultFilter=this.data;
      });
    }

    //this.resultFilter=this.data;
    // Añade lógica para otros casos si es necesario
  }

  getColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }

  filterScore(query: any): void {
    this.resultFilter=[];

    this.resultFilter = this.data.filter((d) => {
      const scoreAsString = d.score.toString().toLowerCase();
      const queryValue = query.target.value.toString().toLowerCase();
      return scoreAsString === queryValue;
    });

  }

  filterYear(query: any): void {
    this.resultFilter=[];

    this.resultFilter = this.data.filter((d) => {
      const date = d.date.toString().toLowerCase();
      var parts = date.split("/");
      const year = parseInt(parts[2], 10);
      
      const queryValue = query.target.value.toString().toLowerCase();
      return (year+"") === queryValue;
    });

  }

  filterType(query: any): void {
    this.resultFilter=[];

    this.resultFilter = this.data.filter((d) => {
      const typeString = d.type.toString().toLowerCase();
      const queryValue = query.target.value.toString().toLowerCase();
      return typeString === queryValue;
    });

  }


}
