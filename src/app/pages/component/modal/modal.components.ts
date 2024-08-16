import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/core/utilidades/util';
import { LibrosService } from 'src/app/core/service/libros.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data.service';
import { AnimeService } from 'src/app/core/service/anime.service';
import { SeriesService } from 'src/app/core/service/series.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { GameService } from 'src/app/core/service/game.service';
import { MusicService } from 'src/app/core/service/music.service';
import { RecoService } from 'src/app/core/service/recomendacion.service';
import { AlertService } from 'src/app/core/service/alert.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.components.html',
  styleUrls: ['./modal.components.css']
})
export class ModalComponent implements OnInit {
  @Input() public data: any;
  @Input() public type: any;

  opTipos: string[][] = [];
  opCalificacion: string[] = [];
  loading: boolean = false;
  open: boolean = false;
  dataModal: any;
  stars: boolean[] = Array(5).fill(false);

  constructor(
    private router: Router,
    private dataService: DataService,
    public modalService: NgbModal,
    private recoService: RecoService,
    private alertService: AlertService,
    private musicService: MusicService, private libroService: LibrosService, private juegosService: GameService, private animeService: AnimeService, private movieService: MovieService, private serieServicio: SeriesService
  ) {

    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
    ];
    this.opCalificacion = ["0", "1", "2", "3", "4", "5"];
  }


  ngOnInit() {
    this.dataModal = { ...this.data };
    this.open = true;
  }


  closeModal() {
    this.modalService.dismissAll();
  }


  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }


  getFormattedDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  async obtenerImagen(link: any, type: any) {
    try {
      this.loading = true;
      const value = await Utils.imageToByteFromUrl(link, type);
      this.dataModal.image = value;
    } catch (error) {
      this.showAlert("Error al obtener la imagen", "error");
    } finally {
      this.loading = false;
    }
  }

  async save() {
    try {
      await this.obtenerImagen(this.data.image, this.type);
      this.dataModal.date = this.data.date;
      if (this.type == "Animes") {
        await this.animeService.createAnimes(this.dataModal);
      }
      if (this.type == "Movies") {
        await this.movieService.createMovies(this.dataModal);
      }
      if (this.type == "Series") {
        await this.serieServicio.createSeries(this.dataModal);
      }
      if (this.type == "Games") {
        await this.juegosService.createGames(this.dataModal);
      }
      if (this.type == "Books") {
        await this.libroService.createBook(this.dataModal);
      }
      if (this.type == "Music") {
        await this.musicService.createMusic(this.dataModal);
      }
      this.closeModal();
      this.showAlert("Guardado exitosamente", "success");

    } catch (error) {
      this.showAlert("Error al guardar", "error");
    }
  }


  async saveReco() {
    console.log("tipe"+this.type);
    try {
      await this.obtenerImagen(this.data.image, this.type);
      this.dataModal.date = this.getFormattedDate(new Date);

      console.log("imaReco " + this.dataModal.image);
      await this.recoService.createReco(this.dataModal, this.type);
      this.closeModal();
      this.showAlert("Guardado exitosamente", "success");

    } catch (error) {
      this.showAlert("Error al guardar", "error");
    }
  }


  rate(score: number) {
    this.dataModal.score = score;
  }


  showAlert(messageAlert: string, tipoMessage: any) {
    this.alertService.showAlert(messageAlert, tipoMessage);
  }


}