import { Component, Input, OnChanges, OnInit, AfterViewInit, SimpleChanges, ChangeDetectorRef, HostListener } from '@angular/core';
import { MovieService } from 'src/app/core/service/movie.service';
import { Observable, forkJoin } from 'rxjs';
import { AnimeService } from 'src/app/core/service/anime.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { GameService } from 'src/app/core/service/game.service';
import { SeriesService } from 'src/app/core/service/series.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

 /* 
  dataMovie: any[] = [];
  view: [number,number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;


  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
      this.loadData();
  }


  loadData() {
    this.movieService.getMovies().subscribe((movies: any[]) => {
      // Mapea tus datos a la estructura esperada por ngx-charts
      this.dataMovie = movies.map(movie => ({
        name: movie.name,
        value: movie.score
      }));
    });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }*/


  //view: any[] = [700, 400];
  view: [number,number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';



  single: any[] = [];
  valor: number = 0;
  dataMovie: any[] = [];


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setViewSize();
  }

  constructor(private movieService: MovieService, private libroService: LibrosService, private gameService: GameService,private seriesService: SeriesService, private animeService: AnimeService,) {
    this.setViewSize(); // Establecer el tamaño inicial
  }

  setViewSize() {
    // Ajustar el tamaño del gráfico según el ancho de la pantalla
    if (window.innerWidth <= 767) {
      this.view = [window.innerWidth - 20, 300]; // Ajusta estos valores según tus necesidades
    } else {
      this.view = [700, 400]; // Tamaño predeterminado para pantallas más grandes
    }
  }

  ngOnInit(): void {
    this.clear();

    this.loadData();
    this.acti();
  }
  
  loadData() {
    // Use forkJoin to combine data from multiple observables
    forkJoin([
      this.movieService.getMovies(),
      this.seriesService.getSeries(),
      this.animeService.getAnimes(),
      this.gameService.getGames(),
      this.libroService.getLibros()
    ]).subscribe(([movies, series, animes, games, libros]) => {
      const movieValue = movies.length;
      const seriesValue = series.length;
      const animeValue = animes.length;
      const gameValue = games.length;
      const libroValue = libros.length;

      // Combine data from all services
      this.single = [
        { name: 'Peliculas', value: movieValue },
        { name: 'Series', value: seriesValue },
        { name: 'Animes', value: animeValue },
        { name: 'Juegos', value: gameValue },
        { name: 'Libros', value: libroValue }
      ];
    });
  }


 onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


clear(){
  this.valor =this.dataMovie.length;
}

acti(){
 // this.single.push({"name": "Peliculas","value": this.dataMovie.length});
 /*this.single = [
  {
    "name": "Germany",
    "value": this.dataMovie.length
  }];*/
}


 
}
