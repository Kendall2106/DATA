import { Component } from '@angular/core';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.css']
})
export class DiscoverPageComponent {
  recomendaciones: any[] = [];
  animes: any[] = [];
  animesAiring: any[] =[];
  animesRange: any[] =[];
  opTipos: string[][] = [];
  numPage: number = 1;
  search: string = "";


  constructor( private apiAnimeService: ApiAnimeService) {

  }
  async ngOnInit() {
    await this.getAll();
    await this.getAnimeAiring();
    await this.getAnimeByRange();
    
  }

  
  /*async getAll(){
    await this.apiAnimeService.getAnimeUpComing(1).subscribe((response: any) => {
        console.log(response);
        this.animes = response.data;
    });
    
  }*/

  async getAll(){
    await this.apiAnimeService.getAnimeByPage(this.numPage).subscribe((response: any) => {
       // console.log(response);
        this.animes = response.data;
    });
  }

  async searchAnimesByName(){
    await this.apiAnimeService.searchAnimesByName(this.search,this.numPage).subscribe((response: any) => {
       // console.log(response);
        this.animes = response.data;
    });
  }

  

  async getAnimeAiring(){
    await this.apiAnimeService.getAnimeAiring().subscribe((response: any) => {
        console.log(response);
        this.animesAiring = response.data;
    });
  }

  async getAnimeByRange(){
    await this.apiAnimeService.getAnimeByRange().subscribe((response: any) => {
        console.log(response);
        this.animesRange = response.data;
    });
  }

   saveAnime(anime: any){
    this.recomendaciones.push(anime);

  }

  aumentarNumero() {
    this.numPage++; // Incrementamos el número
    this.getAll();
  }

  restNumber(){
    this.numPage--; // Incrementamos el número
    this.getAll();
  }

   /*saveAnime(anime: any){
    this.recomendaciones.push(anime);

  }*/



  
}