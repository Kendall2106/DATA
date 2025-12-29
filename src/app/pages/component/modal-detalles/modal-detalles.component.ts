import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-modal-detalles',
  templateUrl: './modal-detalles.component.html',
  styleUrls: ['./modal-detalles.component.css']
})
export class ModalDetallesComponent implements OnInit {

  @Input() public data: any;
  @Input() public type: any;

  @Output() peliculaEliminada = new EventEmitter<void>();

  opTipos: string[][] = [];
  opKind: string[] = [];
  opCalificacion: string[] = [];
  categories: any[] = [];
  collections: any[] = [];
  loading: boolean = false;
  open: boolean = false;
  dataModal: any;
  stars: boolean[] = Array(5).fill(false);
  fechaTemp: any;
  selectedCollection: string = 'Todos';


  constructor(
    private router: Router,
    public modalService: NgbModal, public dataService: DataService,
    private musicService: MusicService, private movieService: MovieService, private libroService: LibrosService, private gameService: GameService, private seriesService: SeriesService, private animeService: AnimeService
  ) {

    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
    ];
    this.opKind = ["Novel", "Short story", "Light novel", "Anthology", "Graphic novel", "Manga", "Comic"];
    this.opCalificacion = ["0", "1", "2", "3", "4", "5"];
  }


  ngOnInit() {
    this.dataModal = { ...this.data };
    this.open = true;
    this.dataModal.date = this.convertirFecha(this.dataModal.date);
    console.log(this.type);


    this.loadCategories(this.type);
    this.fechaTemp = this.dataModal.date;

    this.loadCollection();


  }


  closeModal() {
    this.modalService.dismissAll();
  }

  rate(score: number) {
    this.dataModal.score = score;
    console.log(this.dataModal.score);
  }

  convertirFecha(fechaStr: string): string {
    const [dia, mes, anio] = fechaStr.split('-');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }



  async loadCategories(message: any) {
    var categoriesTemp: any[] = [];
    if (message === 'Series' || message === 'Movies') {
      this.categories = await this.seriesService.getCategoriesShow();
    } else if (message === 'Animes') {
      this.categories = await this.animeService.getCategoriesAnime();
    } else if (message === 'Games') {
      this.categories = await this.gameService.getCategoriesGame();
    } else if (message === 'Books') {
      this.categories = await this.libroService.getCategoriesBook();
    } else if (message === 'Music') {
      //  this.data = await this.loadDataForType(this.musicService.getMusic());
    }


  }



  abrirCalendario() {
    const input = document.getElementById('dateInput') as HTMLInputElement;
    input.showPicker(); // método moderno que abre el selector de fecha
  }



  async updateData(message: any) {
    console.log(this.dataModal.date);
    this.dataModal.image = this.dataModal.image.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    if (message === 'Movies') {
      await this.movieService.updateMovie(this.dataModal.id, this.dataModal);
    } else if (message === 'Series') {
      await this.seriesService.updateSerie(this.dataModal.id, this.dataModal);
    } else if (message === 'Animes') {
      await this.animeService.updateSeasonAnime(this.dataModal.id, this.dataModal);
    } else if (message === 'Games') {
      await this.gameService.updateGames(this.dataModal.id, this.dataModal);
    } else if (message === 'Books') {
      await this.libroService.updateBook(this.dataModal.id, this.dataModal);
    } else if (message === 'Music') {
      await this.musicService.updateMusic(this.dataModal.id, this.dataModal);
    }

  }


  async saveChanges() {



    try {
      this.loading = true;

      if (this.selectedCollection !== 'Todos') {
        this.dataModal.collection = this.selectedCollection;
      } else {
        this.dataModal.collection = "";
      }

      await this.updateData(this.type);
      this.peliculaEliminada.emit();
      //this.closeModal();



    } catch (error) {
      console.error("Error:", error);

    } finally {
      this.loading = false;
    }






  }

  async deleteData() {
    if (this.type === 'Movies') {
      await this.movieService.deleteMovie(this.dataModal.id);
    } else if (this.type === 'Series') {
      await this.seriesService.deleteSerie(this.dataModal.id);

    } else if (this.type === 'Animes') {
      await this.animeService.deleteAnime(this.dataModal.id);

    } else if (this.type === 'Games') {
      await this.gameService.deleteGames(this.dataModal.id);

    } else if (this.type === 'Books') {
      await this.libroService.deleteBook(this.dataModal.id);

    } else if (this.type === 'Music') {
      await this.musicService.deleteMusic(this.dataModal.id);

    }

    this.peliculaEliminada.emit();

    this.closeModal();
  }



  async loadCollection() {
    this.collections = await this.dataService.getCollection();

    if (this.dataModal.collection) {
      this.selectedCollection = this.dataModal.collection;
    } else {
      this.selectedCollection = 'Todos';
    }
  }



}
