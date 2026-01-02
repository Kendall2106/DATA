import { Component } from '@angular/core';
import { ApiGamesService } from 'src/app/core/service/apiGames.service';
import { ModalComponent } from '../../component/modal/modal.components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game-list-discover',
  templateUrl: './game-list-discover.component.html',
  styleUrls: ['./game-list-discover.component.css']
})
export class GameListDiscoverComponent {

  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: number, randomData: string }[] = [];
  animesAiring: any[] = [];
  startIndex: number = 0;
  maxResults: number = 24;
  numPage = 1;
  search: string = "";
  plataform: { id: number, name: string }[] = [];
  currentSearchType: 'all' | 'genre' | 'search' = 'all';
  currentGenre: string = '';  // Para almacenar el género seleccionado

  constructor(private apiGamesServive: ApiGamesService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.getGames();
    // this.getGamesByPc(); 
    this.getPlataform();
  }

  async getPlataform() {
    await this.apiGamesServive.getAllPlataform().subscribe((response: any) => {
      /*this.plataform = [];
      console.log(response);
      this.plataform = response.map((p: any) => ({
       id:p.id,
       name: p.platform_name,
     }));
     console.log(response);*/
      this.plataform = [];
      response.forEach((item: any) => {
        this.plataform.push({
          id: item.id,
          name: item.name ?? 'Sin nombre',
        });
      });




    });
  }


  async getGames() {
    this.message = "Games";
    this.currentSearchType = 'all';
    // this.dataAiring();
    this.apiGamesServive.getGames(this.startIndex, this.maxResults).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      response.forEach((item: any) => {
        this.data.push({
          name: item.name ?? 'Sin nombre',
          image: this.getCoverUrl(item),
          info: item.summary ?? 'Sin descripción',
          releaseDate: item.created_at
            ? new Date(item.created_at * 1000).getFullYear()
            : 0,
          randomData: item.platforms[0].abbreviation ?? 'Sin nombre'
        });
      });
    });



  }

  getCoverUrl(item: any): string {
    if (!item.cover?.url) {
      return 'assets/no-image.png';
    }

    return `https:${item.cover.url.replace(/t_[^/]+/, 't_1080p')}`;
  }

  /* async getGamesByPc() {
     await this.apiGamesServive.getGamesByPC(1).subscribe((response: any) => {
       this.animesAiring = [];
       response.forEach((item: any) => {
         this.animesAiring.push({
           name: item.title,
           image: item.image_url,
           info: item.overview
         });
       });
     });
   }*/

  async seachGamesByName() {
    this.currentSearchType = 'search';

    console.log("Searching for: " + this.search);

    await this.apiGamesServive.searchGames(this.search, this.startIndex, this.maxResults).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      response.forEach((item: any) => {
        this.data.push({
          name: item.name ?? 'Sin nombre',
          image: this.getCoverUrl(item),
          info: item.summary ?? 'Sin descripción',
          releaseDate: item.created_at
            ? new Date(item.created_at * 1000).getFullYear()
            : 0,
          randomData: item.platforms[0].abbreviation ?? 'Sin nombre'
        });
      });
    });
  }


  async getGamesByPlataform(plataform: any) {
    this.currentSearchType = 'genre';
    this.currentGenre = plataform;
    console.log("Genre ID: " + plataform);
    this.data = [];
    await this.apiGamesServive.getGamesByGenre(plataform, this.startIndex, this.maxResults).subscribe((response: any) => {
      console.log(response);
      response.forEach((item: any) => {
        this.data.push({
          name: item.name ?? 'Sin nombre',
          image: this.getCoverUrl(item),
          info: item.summary ?? 'Sin descripción',
          releaseDate: item.created_at
            ? new Date(item.created_at * 1000).getFullYear()
            : 0,
          randomData: item.platforms[0].abbreviation ?? 'Sin nombre'
        });
      });
    });

  }

  onOptionSelected(event: any): void {
    const selectedValue = event;
    this.startIndex = 0;
    console.log(selectedValue);
    this.getGamesByPlataform(selectedValue);
  }

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Games";
  }

  searchData() {
    this.startIndex = 0;
    this.seachGamesByName();
  }


  aumentarNumero() {
    this.startIndex += this.maxResults;
    this.loadBasedOnContext();

  }


  restNumber() {
    if (this.startIndex > 0) {
      this.startIndex -= this.maxResults;
      this.loadBasedOnContext();  // Llamamos a la misma función
    }
  }

  // Esta función decide qué método usar según el contexto actual
  loadBasedOnContext() {
    if (this.currentSearchType === 'all') {
      this.getGames();
    } else if (this.currentSearchType === 'genre') {
      this.getGamesByPlataform(this.currentGenre);
    } else if (this.currentSearchType === 'search') {
      this.seachGamesByName();
    }
  }


}
