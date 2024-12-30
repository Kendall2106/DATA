import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from 'src/app/core/service/anime.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.css']
})
export class TierComponent implements OnInit {
  categorias: any[] = ["Masterpiece", "Re-watch", "Meh", "Forgettable", "trash"];
  data: any[] = [];
  anioActual: string = "";
  opAnios: any[] = ["2024", "2023", "2022", "2021", "2020", "2019", "Todos"];
  selectedYear: string = this.opAnios[0];
  resultFilter: any[] = [];
  resultCount: any = 0;
  tier: any[] = [
    [0, 1, 2, 3, 4],
    ["#FF7F7F", "#FFBF7F", "#FFDF7F", "#FFFF7F", "#BFFF7F"]
  ];
  loading: boolean = false;
  opTipos: any = [];
  hobbyType: any = [];
  selectedCategory: string = 'Todos';
  selectedItem: string = '';


  constructor(private router: Router, private musicService: MusicService, private animeService: AnimeService, private movieService: MovieService, private seriesService: SeriesService, private gameService: GameService, private libroService: LibrosService) {
    this.opTipos =["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"];
    this.hobbyType =["Animes", "Movies", "Series", "Books", "Games", "Music"];
  }


  ngOnInit(): void {
    this.loadData(this.hobbyType[0]);
  }


  async loadData(message: any) {
   // console.log(message);
    //const message = event.target.value;
    this.selectedItem = message;
    try {
      this.loading = true;
      if (message === 'Movies') {
        this.data = await this.loadDataForType(this.movieService.getMovies());
      } else if (message === 'Series') {
        this.data = await this.loadDataForType(this.seriesService.getSeries());
      } else if (message === 'Animes') {
        this.data = await this.loadDataForType(this.animeService.getAnimes());
      } else if (message === 'Games') {
        this.data = await this.loadDataForType(this.gameService.getGames());
      } else if (message === 'Books') {
        this.data = await this.loadDataForType(this.libroService.getBook());
      } else if (message === 'Music') {
        this.data = await this.loadDataForType(this.musicService.getMusic());
      }
      console.log("first "+this.selectedYear);
      this.applyFilters();


      this.data.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });

      //this.resultFilter = this.data;
      this.resultCount = this.resultFilter.length;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }

  async loadDataForType(service: Promise<any>) {
    const typeData = await service;
    return typeData.map((item: { date: string }) => {
      return item;
    });
  }


  convertYear(item: any) {
    const date = item.date.toString().toLowerCase();
    const parts = date.split("-");
    const year = parseInt(parts[0], 10);

    console.log("inYEAR "+ year)
  
    if (this.selectedYear === 'Todos') {
      return true;
    } else {
      return (year + "") === this.selectedYear;
    }

  }


  dataScore(da: any, num: number) {
    return da.filter((d: { score: number; }) => d.score == num);
  }


  filterYear(event: any) {
    this.selectedYear = event.target.value;
    this.applyFilters();
  }

  
  filterType(event: any) {
    this.selectedCategory = event.target.value;
    this.applyFilters();
  }

  applyFilters() {
   /* if (this.selectedYear === "Todos") {
      this.resultFilter = this.data;
      console.log(1);
    } else {
      this.data = this.data.filter((d: { date: string; }) => this.convertYear(d.date) == this.selectedYear);
      console.log(2);
    }*/
    console.log("Hola "+this.selectedYear);
      this.resultFilter = this.data
      .filter(item => this.selectedCategory === 'Todos' || item.type === this.selectedCategory)
      .filter(item => this.convertYear(item))

      this.resultCount = this.resultFilter.length;
  }


  navegarHome() {
    this.router.navigate(['./']);
  }


}
