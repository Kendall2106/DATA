import { Component, OnInit } from '@angular/core';
import { RecoService } from 'src/app/core/service/recomendacion.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';

@Component({
  selector: 'app-list-next',
  templateUrl: './list-next.component.html',
  styleUrls: ['./list-next.component.css']
})
export class ListNextComponent implements OnInit{

  recomendaciones: any[] = [];
  animes: any[] = [];
  opTipos: string[][] = [];

  constructor(private recoService: RecoService, private apiAnimeService: ApiAnimeService) {
    //this.setViewSize(); // Establecer el tamaño inicial
    /*this.opTipos = [
      ["Peliculas", "Series", "Anime", "Juegos", "Libros"],
      ["lightcoral", "lightblue", "lightGreen",  "lightYellow", "Gray"] // Colores correspondientes
    ];*/
  }
  async ngOnInit() {
   // this.readReco();
   // await this.getAll();
  }

  

  /*async readReco(){
    this.recomendaciones = await this.recoService.getReco();
    console.log(this.recomendaciones);
  }*/

  /*etColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }
*/
  /*cards = [
    { id: 1, title: 'Nombre 1', icon: 'drag_handle' },
    { id: 2, title: 'Nombre 2', icon: 'drag_handle' },
    { id: 3, title: 'Nombre 3', icon: 'drag_handle' },
    { id: 4, title: 'Nombre 4', icon: 'drag_handle' }
  ];*/

  /*drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.recomendaciones, event.previousIndex, event.currentIndex);
  }*/


  async getAll(){
    await this.apiAnimeService.getAnimeByPage(10).subscribe((response: any) => {
       // console.log(response);
        this.animes = response.data;
    });
    
  }

   saveAnime(anime: any){
    this.recomendaciones.push(anime);

  }


}
