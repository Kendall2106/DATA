import { Component, OnInit } from '@angular/core';
import { AnimeService } from 'src/app/core/service/anime.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  loading: boolean = false;

  numMovies: any = 0;
  numSeries: any = 0;
  numAnimes: any = 0;
  numGames: any = 0;
  numBooks: any = 0;
  numMusic: any = 0;

  actualYear: number = 0;

  constructor(private musicService: MusicService, private movieService: MovieService, private libroService: LibrosService, private gameService: GameService, private seriesService: SeriesService, private animeService: AnimeService) {
  }

  ngOnInit(): void {
    this.actualYear = new Date().getFullYear();
    this.loadNumTotal();
  }


  async loadNumTotal() {
    try {
      this.loading = true;
  
      const [numAnimes,numMovies,numSeries,numGames,numBooks,numMusic] = await Promise.all([
        this.animeService.loadNumAnimes(),
        this.movieService.loadNumMovies(),
        this.seriesService.loadNumSeries(),
        this.gameService.loadNumGames(),
        this.libroService.loadNumBooks(),
        this.musicService.loadNumMusic(),
      ]);
  
      this.numAnimes = numAnimes;
      this.numMovies = numMovies;
      this.numSeries = numSeries;
      this.numGames = numGames;
      this.numBooks = numBooks;
      this.numMusic = numMusic;
  
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }



}
