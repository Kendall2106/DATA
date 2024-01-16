import { Component, OnInit } from '@angular/core';
import { RecoService } from 'src/app/core/service/recomendacion.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-next',
  templateUrl: './list-next.component.html',
  styleUrls: ['./list-next.component.css']
})
export class ListNextComponent implements OnInit{

  recomendaciones: any[] = [];
  opTipos: string[][] = [];

  constructor(private recoService: RecoService) {
    //this.setViewSize(); // Establecer el tamaño inicial
    this.opTipos = [
      ["Peliculas", "Series", "Anime", "Juegos", "Libros"],
      ["lightcoral", "lightblue", "lightGreen",  "lightYellow", "Gray"] // Colores correspondientes
    ];
  }
  ngOnInit(): void {
    this.readReco();
    
  }

  /*tableData = [
    { cell1: 'Row 1, Cell 1', cell2: 'Row 1, Cell 2', cell3: 'Row 1, Cell 3' },
    { cell1: 'Row 2, Cell 1', cell2: 'Row 2, Cell 2', cell3: 'Row 2, Cell 3' },
    { cell1: 'Row 3, Cell 1', cell2: 'Row 3, Cell 2', cell3: 'Row 3, Cell 3' },
  ];*/

  async readReco(){
    this.recomendaciones = await this.recoService.getReco();
    console.log(this.recomendaciones);
  }

  getColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }

  cards = [
    { id: 1, title: 'Nombre 1', icon: 'drag_handle' },
    { id: 2, title: 'Nombre 2', icon: 'drag_handle' },
    { id: 3, title: 'Nombre 3', icon: 'drag_handle' },
    { id: 4, title: 'Nombre 4', icon: 'drag_handle' }
  ];

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.recomendaciones, event.previousIndex, event.currentIndex);
  }


}
