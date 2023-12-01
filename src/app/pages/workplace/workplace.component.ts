import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { Movie } from 'src/app/core/model/movie.model';
import { DataService } from 'src/app/core/service/data.service';
import { MovieService } from 'src/app/core/service/movie.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.css'],
})
export class WorkplaceComponent implements OnInit {
  movies: Movie[] = [];
  message: string = '';
  opTipos: string[] = [];
  opAnios: string[] = [];
  opCalificacion: string[] = [];
  calificacionSelec: any;
  constructor(private movieService: MovieService, private router: Router, public dataService: DataService) {
      this.opTipos= ["Accion","Terror","Comedia"];
      this.opAnios= ["2020","2021","2022"];
      this.opCalificacion = ["0","1","2","3","4","5"];
  }

  ngOnInit() {
    if (!this.dataService.typeData) {
      this.router.navigate(['/']);
    }

    this.message = this.dataService.typeData;

    if(this.message=="Peliculas"){
      this.movieService.getMovies().subscribe(movies => {
        this.movies = movies.sort((a, b) => b.id - a.id); //Orden Desc
      });
    }
    
  }





}
