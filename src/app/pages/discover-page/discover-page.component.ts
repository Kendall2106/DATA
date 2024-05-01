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
  opTipos: string[][] = [];

  constructor( private apiAnimeService: ApiAnimeService) {

  }
  async ngOnInit() {
   // this.readReco();
    await this.getAll();
  }

  
  async getAll(){
    await this.apiAnimeService.getAnimeByPage(10).subscribe((response: any) => {
       // console.log(response);
        this.animes = response.data;
    });
    
  }

   /*saveAnime(anime: any){
    this.recomendaciones.push(anime);

  }*/

}
