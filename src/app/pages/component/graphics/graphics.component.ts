import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent {
  @Input() datos: any[] | undefined;
  view: [number,number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setViewSize();
  }

  constructor(){
    this.setViewSize(); // Establecer el tamaño inicial
  }

  setViewSize() {
    // Ajustar el tamaño del gráfico según el ancho de la pantalla
    if (window.innerWidth <= 767) {
      this.view = [window.innerWidth - 20, 200]; // Ajusta estos valores según tus necesidades
    } else {
      this.view = [700, 300]; // Tamaño predeterminado para pantallas más grandes
    }
  }

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
