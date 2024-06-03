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

@Component({
  selector: 'app-modal',
  templateUrl: './modal.components.html',
  styleUrls: ['./modal.components.css']
})
export class ModalComponent implements OnInit {
  @Input() public data: any;
  @Input() public type: any;
  //@Output() passEntry: EventEmitter<any> = new EventEmitter();

  opTipos: string[][] = [];
  opCalificacion: string[] = [];
  loading: boolean = false;
  open:boolean = false;
  
  dataModal: any;

  constructor(
    private router: Router, 
    private dataService: DataService,
    public modalService: NgbModal,
    private recoService: RecoService,
    private musicService: MusicService ,private libroService: LibrosService,private juegosService: GameService, private animeService: AnimeService, private movieService: MovieService, private serieServicio: SeriesService
  ) {

    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
      ];
    this.opCalificacion = ["0","1","2","3","4","5"];
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
    const month = date.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

  async obtenerImagen(link: any, type: any) {   
    try {
        this.loading = true; // Mostrar animación de carga
        const value = await Utils.imageToByteFromUrl(link, type);
        this.dataModal.image = value;
    } catch (error) {
        console.error("Error al obtener la imagen:", error);
    } finally {
        this.loading = false; // Ocultar animación de carga
    }
}



async save() {

    try {
      await this.obtenerImagen(this.data.image, this.type);
      this.dataModal.date = this.getFormattedDate(new Date);
      //console.log(this.convertImage());
      if(this.type=="Animes"){
        await this.animeService.createAnimes(this.dataModal);
      }
      if(this.type=="Movies"){
        await this.movieService.createMovies(this.dataModal);
      }
      if(this.type=="Series"){
        await this.serieServicio.createSeries(this.dataModal);
      }
      if(this.type=="Games"){
        await this.juegosService.createGames(this.dataModal);
      }
      if(this.type=="Books"){
        await this.libroService.createBook(this.dataModal);
      }
      if(this.type=="Music"){
        await this.musicService.createMusic(this.dataModal);
      }
     
       this.navegarAComponenteDestino(this.type);
       this.closeModal();

    } catch (error) {
        console.error("Error al guardar el libro:", error);
    }
}

async saveReco() {

  try {
    await this.obtenerImagen(this.data.image, this.type);
    this.dataModal.date = this.getFormattedDate(new Date);
   

    await this.recoService.createReco(this.dataModal, this.type);
    
   
     this.closeModal();

  } catch (error) {
      console.error("Error al guardar el libro:", error);
  }
}



stars: boolean[] = Array(5).fill(false);

  rate(score: number) {
    this.dataModal.score = score;
  }

}