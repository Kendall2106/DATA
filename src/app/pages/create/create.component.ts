import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/core/model/movie.model';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';
import { SettingsService } from 'src/app/core/service/settings.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  tipo: any;
  data: any = {}
  opTipos: string[][] = [];
  opCalificacion: string[] = [];
  stars: boolean[] = Array(5).fill(false);
  settings: any[] = [];


  constructor(private router: Router, private dataService: DataService, private musicService: MusicService, private libroService: LibrosService, private juegosService: GameService, private animeService: AnimeService, private movieService: MovieService, private serieServicio: SeriesService, public settingsService: SettingsService) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
    ];
    this.opCalificacion = ["0", "1", "2", "3", "4", "5"];
  }
  ngOnInit(): void {
    this.loadSettings();
  }


  obtenerImagen(event: any) {
    const file = event.target.files[0];
    var promiseResult = Utils.imageToByte(file);
    promiseResult.then((value: any) => {
      this.data.image = value;
    });
  }

  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }

  onSubmit() {
    console.log(this.data.image);
    if (this.tipo == "Peliculas") {
      this.movieService.createMovies(this.data);
    }

    if (this.tipo == "Series") {
      this.serieServicio.createSeries(this.data);
    }

    if (this.tipo == "Animes") {
      this.animeService.createAnimes(this.data);
    }

    if (this.tipo == "Juegos") {
      this.data.type = "01";
      this.data.date = "2025-03-04";
      this.data.releaseDate = 2024;
      this.juegosService.createGames(this.data);
    }

    if (this.tipo == "Libros") {
      this.libroService.createBook(this.data);
    }

    if (this.tipo == "Musica") {
      this.musicService.createMusic(this.data);
    }

    this.navegarAComponenteDestino(this.tipo);
  }


  rate(data: any, score: number) {
    data.score = score;
  }


  async loadSettings() {

    this.settings = await this.settingsService.getSettings();

  }

   async saveSetting(setting: any) {
    try {
      await this.settingsService.updateSettings(setting.id, {
        value: setting.value
      });
    } catch (error) {
      console.error('Error actualizando setting', error);
    }
  }

  async saveAll() {
    for (const setting of this.settings) {
      await this.saveSetting(setting);
    }
  }


}
