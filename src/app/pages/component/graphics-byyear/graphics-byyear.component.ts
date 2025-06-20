import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, ScaleType  } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graphics-byyear',
  templateUrl: './graphics-byyear.component.html',
  styleUrls: ['./graphics-byyear.component.css']
})
export class GraphicsByyearComponent implements OnChanges{
  @Input() data: any[] = [];


  /*data = [
    { name: '2020', value: 10 },
    { name: '2021', value: 25 },
    { name: '2022', value: 40 },
    { name: '2023', value: 30 },
    { name: '2024', value: 50 },
  ];*/

  // puedes probar también: 'vivid', 'natural', 'fire'
 

  colorScheme: Color = {
    name: 'retroScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#007C7C', // retro green
      '#FAE4A3', // retro yellow
      '#F0562D', // retro orange
      '#A26769', // vintage brick
      '#D4A373'  // vintage wood
    ]
  };

  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Año';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad de Juegos';

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['data'] && this.data) {
        this.data = this.getYearDistribution(this.data);
      }
    }
  
    getYearDistribution(datatemp: any): { name: string; value: number }[] {
      const currentYear = new Date().getFullYear();
      const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
    
      const distribution: { [year: number]: number } = {};
    
      for (const d of datatemp) {
        const date = new Date(d.date);
        const year = date.getFullYear();
    
        if (!isNaN(year) && lastFiveYears.includes(year)) {
          if (!distribution[year]) {
            distribution[year] = 0;
          }
          distribution[year]++;
        }
      }
    
      // Ordena los resultados cronológicamente de menor a mayor año
      return lastFiveYears
        .reverse()
        .filter(year => distribution[year]) // opcional: solo muestra años que tengan datos
        .map(year => ({
          name: `${year}`,
          value: distribution[year] || 0
        }));
    }

}
