import { Component, Input, OnChanges, OnInit, AfterViewInit, SimpleChanges, ChangeDetectorRef, HostListener } from '@angular/core';
import { MovieService } from 'src/app/core/service/movie.service';
import { Observable, forkJoin, map } from 'rxjs';
import { AnimeService } from 'src/app/core/service/anime.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { GameService } from 'src/app/core/service/game.service';
import { SeriesService } from 'src/app/core/service/series.service';
import { Servicios } from 'src/app/core/service/servicios.service';
import { RecoService } from 'src/app/core/service/recomendacion.service';
import { DataService } from 'src/app/core/service/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{


  nameReco: any;
  tipo:any;

  nombres$: Observable<{ tipo: string; nombre: string; }[]> | undefined;
  tipos = ['Peliculas', 'Series', 'Animes', 'Juegos', 'Libros'];

  recomendaciones: any[] = [];
  single: any[] = [];
  single2: any[] = [];
  valor: number = 0;
  dataMovie: any[] = [];
  students: any;


/*
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setViewSize();
  }*/

  constructor(private router: Router, private dataService: DataService,private recoService: RecoService, private movieService: MovieService, private libroService: LibrosService, private gameService: GameService,private seriesService: SeriesService, private animeService: AnimeService,) {
    //this.setViewSize(); // Establecer el tamaño inicial
    
  }

  /*setViewSize() {
    // Ajustar el tamaño del gráfico según el ancho de la pantalla
    if (window.innerWidth <= 767) {
      this.view = [window.innerWidth - 20, 300]; // Ajusta estos valores según tus necesidades
    } else {
      this.view = [700, 400]; // Tamaño predeterminado para pantallas más grandes
    }
  }*/

  years: number[] = [2023, 2022];

  // Puedes ajustar estos valores según tus necesidades
  progress: { [key: number]: number } = {
    2023: 30, // Porcentaje de progreso para el año 2023
    2022: 70 // Porcentaje de progreso para el año 2022
  };

  getProgressWidth(year: number): string {
    const percentage = this.progress[year] || 0;
    return percentage + '%';
  }

  async ngOnInit(): Promise<void> {


    /*this.loadData(2023).subscribe((data: any[]) => {
      this.single = data;
    });*/
    /*this.loadData(2022).subscribe((data: any[]) => {
      this.single2 = data;
    });*/
    this.single2 = await this.loadData(2022);
    this.single = await this.loadData(2023);

    await this.readReco();
  }


  
   async loadData(year: number) {
    var movies = await this.movieService.getMovies();
    var series = await this.seriesService.getSeries();
    var animes = await this.animeService.getAnimes();
    var games = await this.gameService.getGames();
    var books = await this.libroService.getBook();

    return [
      { name: 'Peliculas', value: this.cantidadPorAnio(movies, year) },
      { name: 'Series', value: this.cantidadPorAnio(series, year) },
      { name: 'Animes', value: this.cantidadPorAnio(animes, year) },
      { name: 'Juegos', value: this.cantidadPorAnio(games, year) },
      { name: 'Libros', value: this.cantidadPorAnio(books, year) }    ];
  }

  cantidadPorAnio(param: any, year: number){
    //console.log(param);
    const filtered = param.filter((p: { date: any; }) => {
      return this.convert(p.date) === year;
    });

    return filtered.length;
  }

  convert(date: any): number {
    const dateTemp = date.toString().toLowerCase();
    var parts = dateTemp.split("-");
    const year = parseInt(parts[0], 10);
    return year;

}

/*d(): Observable<any[]> {
  return forkJoin([
    this.movieService.getMovies(),
    this.seriesService.getSeries(),
    this.animeService.getAnimes(),
    this.gameService.getGames(),
    this.libroService.getLibros()
  ]).pipe(
    map(([movies, series, animes, games, libros]: [any[], any[], any[], any[], any[]]) => {
      const moviesWithScore5 = this.filterByScore(movies);
      const seriesWithScore5 = this.filterByScore(series);
      const animesWithScore5 = this.filterByScore(animes);
      const gamesWithScore5 = this.filterByScore(games);
      const librosWithScore5 = this.filterByScore(libros);

      const datos: any[] = [];
      // Mapear para obtener solo el nombre de cada registro
      moviesWithScore5.forEach(movie => datos.push(movie.name));
      seriesWithScore5.forEach(serie => datos.push(serie.name));
      animesWithScore5.forEach(anime => datos.push(anime.name));
      gamesWithScore5.forEach(game => datos.push(game.name));
      librosWithScore5.forEach(libro => datos.push(libro.name));

      console.log(datos);
      return datos;
    })
  );
}*/

/*d(): Observable<{ tipo: string, nombre: string }[]> {
  return forkJoin([
    this.movieService.getMovies(),
    this.seriesService.getSeries(),
    this.animeService.getAnimes(),
    this.gameService.getGames(),
    this.libroService.getBook()
  ]).pipe(
    map(([movies, series, animes, games, libros]: [any[], any[], any[], any[], any[]]) => {
      const moviesWithScore5 = this.filterByScore(movies).map(movie => ({ tipo: 'peliculas', nombre: movie.name }));
      const seriesWithScore5 = this.filterByScore(series).map(serie => ({ tipo: 'series', nombre: serie.name }));
      const animesWithScore5 = this.filterByScore(animes).map(anime => ({ tipo: 'animes', nombre: anime.name }));
      const gamesWithScore5 = this.filterByScore(games).map(game => ({ tipo: 'juegos', nombre: game.name }));
      const librosWithScore5 = this.filterByScore(libros).map(libro => ({ tipo: 'libros', nombre: libro.name }));

      const datos: { tipo: string, nombre: string }[] = [];

      // Concatenar los datos de cada tipo
      datos.push(...moviesWithScore5, ...seriesWithScore5, ...animesWithScore5, ...gamesWithScore5, ...librosWithScore5);

      return datos;
    })
  );
}*/

// Suponiendo que esta función filtra objetos con una propiedad 'score' mayor o igual a 5
filterByScore(items: any[]): any[] {
  const añoActual = new Date().getFullYear();
  return items.filter(item => item.score >= 5 && this.convert(item.date)==añoActual);
}


filterByTipo(items: any[], tipo: string): any[] {
  return items.filter(item => item.type === tipo);
}

saveReco(){
  this.recoService.createReco(this.nameReco, this.tipo);
  this.readReco();
}

async readReco(){
  this.recomendaciones = await this.recoService.getReco();
}






navegarAComponenteDestino(data: String) {
  this.dataService.typeData = data;
  this.router.navigate(['/Workplace']);
}

 
}
