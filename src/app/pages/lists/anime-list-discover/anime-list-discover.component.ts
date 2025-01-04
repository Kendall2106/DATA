import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';
import { ModalComponent } from '../../component/modal/modal.components';

@Component({
  selector: 'app-anime-list-discover',
  templateUrl: './anime-list-discover.component.html',
  styleUrls: ['./anime-list-discover.component.css']
})
export class AnimeListDiscoverComponent implements OnInit {

 message: string = "";
 genres: {id: number, name: string }[] = [];
 data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
 animesAiring: any[] =[];
 animesHorror:any[]=[];
 animesRomance:any[]=[];
 animesFantasy: any[]=[];
 animesRange: any[]=[];
 search: string = "";
 type: string = "";
 numPage:number = 1;
 currentSearchType: 'all' | 'genre' | 'search' = 'all';
currentGenre: string = '';  // Para almacenar el género seleccionado

  constructor(private apiAnimeService: ApiAnimeService, public modalService: NgbModal){}

   ngOnInit() {
    this.getGenres();
    this.getAllAnime();
    // this.getAnimeByRange();    
     this.getAnimeAiring();
    /* this.getAnimeHorror();
     this.getAnimeRomance();
     this.getAnimeFantasy();*/
    
  }


  async getGenres() {
    await this.apiAnimeService.getGenres().subscribe((response: any) => { 
      this.genres = [];
      
      this.genres = response.data.map((data: any) => ({
       id:data.mal_id,
       name: data.name,
     }));
     console.log(response);
    });
  }

  async getAllAnime() {
    this.currentSearchType = 'all'; 
    await this.apiAnimeService.getAnimeByPage(this.numPage).subscribe((response: any) => { 
      this.data = [];
      this.data = response.data.map((item: any) => ({
       name: item.title,
       image: item.images.jpg.image_url,
       info: item.synopsis,
       releaseDate: item.year,
       randomData: item.score
     }));

     console.log(this.data);
     
    });
  }


  async getAnimeAiring() {
    await this.apiAnimeService.getAnimeAiring().subscribe((response: any) => {
      this.animesAiring = [];
      response.data.forEach((item: any) => {
        this.animesAiring.push({
          name: item.title,
          image: item.images.jpg.image_url,
          info: item.synopsis,
          releaseDate: item.year,
          randomData: item.score
        });
      });
      
    });
  }


  async searchAnimesByName() {
    this.currentSearchType = 'search';
    this.data = [];
    await this.apiAnimeService.searchAnimesByName(this.search, this.numPage).subscribe((response: any) => {
      response.data.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.images.jpg.image_url,
          info: item.synopsis,
          releaseDate: item.year,
          randomData: item.score
        });
      });
    });
  }


  async getAnimeByGenre(genre: any) {
    this.currentSearchType = 'genre'; 
    this.currentGenre = genre;
    this.data = [];
    await this.apiAnimeService.getAnimeByGenre(genre, this.numPage).subscribe((response: any) => {
      response.data.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.images.jpg.image_url,
          info: item.synopsis,
          releaseDate: item.year,
          randomData: item.score
        });
      });
    });
  }


  onOptionSelected(event: any): void {
    const selectedValue = event;
    this.numPage = 1;
    this.getAnimeByGenre(selectedValue);
    // Aquí puedes ejecutar cualquier lógica que desees al seleccionar una opción
  }

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Animes";
  }

  searchData(){
    this.numPage = 1;
    this.searchAnimesByName();
  }


  aumentarNumero() {
    this.numPage++;
    this.loadAnimeBasedOnContext();
  
  }


  restNumber() {
    if (this.numPage > 1) {
      this.numPage--;
      this.loadAnimeBasedOnContext();  // Llamamos a la misma función
    }
  }

  // Esta función decide qué método usar según el contexto actual
loadAnimeBasedOnContext() {
  if (this.currentSearchType === 'all') {
    this.getAllAnime();
  } else if (this.currentSearchType === 'genre') {
    this.getAnimeByGenre(this.currentGenre);
  } else if (this.currentSearchType === 'search') {
    this.searchAnimesByName();
  }
}
}
