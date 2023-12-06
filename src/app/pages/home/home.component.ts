import { Component, Input, OnChanges, OnInit, AfterViewInit, SimpleChanges, ChangeDetectorRef, HostListener } from '@angular/core';
import { MovieService } from 'src/app/core/service/movie.service';
import { Observable, forkJoin, map } from 'rxjs';
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






  single: any[] = [];
  single2: any[] = [];
  valor: number = 0;
  dataMovie: any[] = [];

/*
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setViewSize();
  }*/

  constructor(private movieService: MovieService, private libroService: LibrosService, private gameService: GameService,private seriesService: SeriesService, private animeService: AnimeService,) {
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

  ngOnInit(): void {
    this.loadData(2023).subscribe((data: any[]) => {
      this.single = data;
    });
    this.loadData(2022).subscribe((data: any[]) => {
      this.single2 = data;
    });
  }


  
  loadData(year: number): Observable<any[]> {
    return forkJoin([
      this.movieService.getMovies(),
      this.seriesService.getSeries(),
      this.animeService.getAnimes(),
      this.gameService.getGames(),
      this.libroService.getLibros()
    ]).pipe(
      map(([movies, series, animes, games, libros]: [any[], any[], any[], any[], any[]]) => {
        const movieValue = this.cantidadPorAnio(movies, year);
        const seriesValue = this.cantidadPorAnio(series, year);
        const animeValue = this.cantidadPorAnio(animes, year);
        const gameValue = this.cantidadPorAnio(games, year);
        const libroValue = this.cantidadPorAnio(libros, year);
  
        return [
          { name: 'Peliculas', value: movieValue },
          { name: 'Series', value: seriesValue },
          { name: 'Animes', value: animeValue },
          { name: 'Juegos', value: gameValue },
          { name: 'Libros', value: libroValue }
        ];
      })
    );
  }

  /*ngOnInit(): void {
    //this.clear();

    this.single = this.loadData(2023);

  }
  
  loadData(year: number): any[] {
    // Use forkJoin to combine data from multiple observables
    var datosTemp:any[] = [];

    forkJoin([
      this.movieService.getMovies(),
      this.seriesService.getSeries(),
      this.animeService.getAnimes(),
      this.gameService.getGames(),
      this.libroService.getLibros()
    ]).subscribe(([movies, series, animes, games, libros]) => {
    
      const movieValue = this.cantidadPorAnio(movies, year);
      const seriesValue = this.cantidadPorAnio(series, year);
      const animeValue = this.cantidadPorAnio(animes, year);
      const gameValue = this.cantidadPorAnio(games,year);
      const libroValue = this.cantidadPorAnio(libros, year);

      // Combine data from all services
      datosTemp = [
        { name: 'Peliculas', value: movieValue },
        { name: 'Series', value: seriesValue },
        { name: 'Animes', value: animeValue },
        { name: 'Juegos', value: gameValue },
        { name: 'Libros', value: libroValue }
      ];
    });
    return datosTemp;
  }*/

  cantidadPorAnio(param: any, year: number){
    const filtered = param.filter((p: { date: any; }) => {
      return this.convert(p.date) === year;
    });

    return filtered.length;
  }

  convert(date: any): number {
    const dateTemp = date.toString().toLowerCase();
    var parts = dateTemp.split("/");
    const year = parseInt(parts[2], 10);
    return year;

}

 /*onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }*/


/*clear(){
  this.valor =this.dataMovie.length;
}*/




 
}
