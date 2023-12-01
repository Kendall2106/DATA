import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Anime } from 'src/app/core/model/anime.model';

import { Movie } from 'src/app/core/model/movie.model';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { MovieService } from 'src/app/core/service/movie.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.css'],
})
export class WorkplaceComponent implements OnInit {
  data: any[] = [];
  movies: Movie[] = [];
  animes: Anime[] = [];
  message: string = '';
  opTipos: string[][] = [];
  opAnios: string[] = [];
  opCalificacion: string[] = [];
  calificacionSelec: any;
  constructor(private movieService: MovieService, private animeService: AnimeService,private router: Router, public dataService: DataService) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White"] // Colores correspondientes
    ];
      this.opAnios= ["2020","2021","2022"];
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
      });
    } else if (this.message === 'Animes') {
      this.animeService.getAnimes().subscribe(animes => {
        this.data = animes.sort((a, b) => b.id - a.id);
      });
    }
    // Añade lógica para otros casos si es necesario
  }

  getColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }





}
