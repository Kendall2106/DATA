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
  animesAiring: any[] =[];
  startIndex: number = 0;
  maxResults: number = 24;
  numPage = 0;
  search: string = "";
  plataform: {id: number, name: string }[] = [];
  currentSearchType: 'all' | 'genre' | 'search' = 'all';
  currentGenre: string = '';  // Para almacenar el género seleccionado
 
   constructor(private apiGamesServive: ApiGamesService,  public modalService: NgbModal){}

   ngOnInit(): void {
    this.getGames();   
   // this.getGamesByPc(); 
    this.getPlataform();
  }

  async getPlataform() {
    await this.apiGamesServive.getAllPlataform().subscribe((response: any) => { 
      this.plataform = [];
      console.log(response);
      this.plataform = response.map((p: any) => ({
       id:p.id,
       name: p.platform_name,
     }));
     console.log(response);
    });
  }


  async getGames() {
    this.message = "Games";
    this.currentSearchType = 'all'; 
   // this.dataAiring();
    await this.apiGamesServive.getGames(this.numPage).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      console.log(response);
      response.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.image_url,
          info: item.overview,
          releaseDate: 0,
          randomData: item.platform_name
        });
      });
    });
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
    await this.apiGamesServive.seachGames(this.search, this.numPage).subscribe((response: any) => {
      this.data = [];
      response.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.image_url,
          info: item.overview,
          releaseDate: 0,
          randomData: item.platform_name
        });
      });
    });
  }

  async getGamesByPlataform(plataform: any) {
    this.currentSearchType = 'genre'; 
    this.currentGenre = plataform;
    this.data = [];
    await this.apiGamesServive.getGamesByPlataform(plataform, this.numPage).subscribe((response: any) => {
      console.log(response);
      response.forEach((item: any) => {
        this.data.push({
          name: item.title,
          image: item.image_url,
          info: item.overview,
          releaseDate: 0,
          randomData: item.platform_name
        });
      });
    });

  }

  onOptionSelected(event: any): void {
    const selectedValue = event;
    this.numPage = 0;
    console.log(selectedValue);
    this.getGamesByPlataform(selectedValue);
  }

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Games";
  }

  searchData(){
    this.numPage = 0;
    this.seachGamesByName();
  }


  aumentarNumero() {
    this.numPage++;
    this.loadBasedOnContext();
  
  }


  restNumber() {
    if (this.numPage > 0) {
      this.numPage--;
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
