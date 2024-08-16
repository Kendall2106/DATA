import { Component } from '@angular/core';
import { ApiGamesService } from 'src/app/core/service/apiGames.service';

@Component({
  selector: 'app-game-list-discover',
  templateUrl: './game-list-discover.component.html',
  styleUrls: ['./game-list-discover.component.css']
})
export class GameListDiscoverComponent {

  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
  animesAiring: any[] =[];
  startIndex: number = 0;
  maxResults: number = 24;
  numPage = 1;
 
   constructor(private apiGamesServive: ApiGamesService){}

   ngOnInit(): void {
    this.getGames();   
    this.getGamesByPc(); 
  }


  async getGames() {
    this.message = "Games";
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
          releaseDate: 'NC',
          randomData: item.platform_name
        });
      });
    });
  }

  async getGamesByPc() {
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
  }


}
