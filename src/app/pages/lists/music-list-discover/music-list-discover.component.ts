import { Component } from '@angular/core';
import { SpotifyService } from 'src/app/core/service/spotify.service';
import { ModalComponent } from '../../component/modal/modal.components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-music-list-discover',
  templateUrl: './music-list-discover.component.html',
  styleUrls: ['./music-list-discover.component.css']
})
export class MusicListDiscoverComponent {
  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: number, randomData: string, artist: string }[] = [];
  animesAiring: any[] =[];
  startIndex: number = 0;
  maxResults: number = 24;
  numPage: number = 1;
  search: string = "";
 type: string = "";
 currentSearchType: 'all' | 'genre' | 'search' = 'all';
 
   constructor(private spotify: SpotifyService, public modalService: NgbModal){}

   ngOnInit(): void {
    this.getMusic();    
   // this.getMusicAiring();
    //this.getData();
  }

  /*getData(){
    this.spotify.getData(this.startIndex, this.maxResults).subscribe((response: any) => {
     console.log(response);
    });
  }*/


  getMusic() {
    this.currentSearchType = 'all'; 
    this.message = "Music";
   // this.dataAiring();
    this.spotify.getAlbums(this.startIndex, this.maxResults).subscribe((response: any) => {
      this.data = [];
      response.albums.items.forEach((item: any) => {

          this.data.push({
            name: item.name,
            image: item.images[0].url,
            info: "Artist: " + item.artists[0].name + ", Fecha Salida: " + item.release_date,
            releaseDate: this.getYear(item),
            randomData: item.total_tracks,
            artist: item.artists[0].name
          });
     
          console.log(this.data);
      });
    });
   
  }

  async getMusicAiring() {
    await this.spotify.getAlbumsAiring().subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      response.albums.items.forEach((item: any) => {
        this.animesAiring.push({
          name: item.name,
          image: item.images[0].url,
          info: "Artist: " + item.artists[0].name,
          releaseDate: this.getYear(item),
          randomData: item.total_tracks,
          artist: item.artists[0].name
        });
      });
    });
  }

  async seachMusicByName() {
    this.currentSearchType = 'search'; 
    this.data = [];
    await this.spotify.getAlbumsByName(this.search, this.startIndex, this.maxResults).subscribe((response: any) => {
      response.albums.items.forEach((item: any) => {
        this.data.push({
          name: item.name,
          image: item.images[0].url,
          info: "Artist: " + item.artists[0].name,
          releaseDate: this.getYear(item),
          randomData: item.total_tracks,
          artist: item.artists[0].name
        });
      });
    });
  }

  /*onOptionSelected(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.numPage = 1;
    this.getAnimeByGenre(selectedValue);
    // Aquí puedes ejecutar cualquier lógica que desees al seleccionar una opción
  }*/

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Music";
  }

  searchData(){
    this.startIndex = 0;
    this.seachMusicByName();
  }


  aumentarNumero() {
   // this.numPage++;
    this.startIndex += this.maxResults;
    this.loadAnimeBasedOnContext();
  
  }


  restNumber() {
    if (this.startIndex > 0) {
      this.startIndex -= this.maxResults;
      this.loadAnimeBasedOnContext();  // Llamamos a la misma función
    }
  }

 // Esta función decide qué método usar según el contexto actual
 loadAnimeBasedOnContext() {
  if (this.currentSearchType === 'all') {
    this.getMusic();
  } else if (this.currentSearchType === 'genre') {
   // this.getAnimeByGenre(this.currentGenre);
  } else if (this.currentSearchType === 'search') {
    this.seachMusicByName();
  }
}

getYear(itemTemp:any){
  const [year, month, day] = itemTemp.release_date.split('-');
   return Number(year);
}

}
