import { Component, OnInit } from '@angular/core';
import { AnimeService } from 'src/app/core/service/anime.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.css']
})
export class TierComponent implements OnInit{
  categorias: any[] = ["Olvidables","Malas","Normal","Buenas","God"];
  data: any[]=[];
  anioActual: string ="";

  constructor(private animeService: AnimeService, private movieService: MovieService, private seriesService: SeriesService, private gameService: GameService, private libroService: LibrosService){}
  
  ngOnInit(): void {
    this.anioActual=new Date().getFullYear()+"";

  }

  async loadData(message: any){

      if (message === 'Peliculas') {
        this.data = await this.loadDataForType(this.movieService.getMovies());
      } else if (message === 'Series') {
        this.data = await this.loadDataForType(this.seriesService.getSeries());
      } else if (message === 'Animes') {
        this.data = await this.loadDataForType(this.animeService.getAnimes());
      }else if (message === 'Juegos') {
        this.data = await this.loadDataForType(this.gameService.getGames());
      }else if (message === 'Libros') {
        this.data = await this.loadDataForType(this.libroService.getBook());
      }

      this.data = this.data.filter((d: { date: string; }) => this.convertYear(d.date) == this.anioActual);

      this.data.forEach((element: any)=>{
        element.image ='data:image/jpg;base64,' + element.image;
    });

    

  }

  async loadDataForType(service: Promise<any>) {
    const typeData = await service;
    return typeData.map((item: { date: string }) => {
     // item.date = this.convertDate(item.date);
      return item;
    });
  }


  convertYear(item: any) {
    const parts = item.split("-");
    const year = parseInt(parts[0], 10);
    return year+"";
  }

  dataScore(da: any, num: number){
    return da.filter((d: { score: number; }) => d.score == num);
    
  }

}
