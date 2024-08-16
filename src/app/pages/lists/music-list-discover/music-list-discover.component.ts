import { Component } from '@angular/core';
import { SpotifyService } from 'src/app/core/service/spotify.service';

@Component({
  selector: 'app-music-list-discover',
  templateUrl: './music-list-discover.component.html',
  styleUrls: ['./music-list-discover.component.css']
})
export class MusicListDiscoverComponent {
  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
  animesAiring: any[] =[];
  startIndex: number = 0;
  maxResults: number = 24;
 
   constructor(private spotify: SpotifyService){}

   ngOnInit(): void {
    this.getMusic();    
    this.getMusicAiring();
  }

  getMusic() {
    this.message = "Music";
   // this.dataAiring();
    this.spotify.getAlbums(this.startIndex, this.maxResults).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      response.albums.items.forEach((item: any) => {
        this.data.push({
          name: item.name,
          image: item.images[0].url,
          info: "Artist: " + item.artists[0].name + ", Fecha Salida: " + item.release_date,
          releaseDate: item.release_date,
          randomData: item.total_tracks
        });
      });
    });
  }

  async getMusicAiring() {
    await this.spotify.getAlbumsAiring().subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      response.artists.items.forEach((item: any) => {
        this.animesAiring.push({
          name: item.name,
          image: item.images[0].url,
          info: " "
        });
      });
    });
  }

}
