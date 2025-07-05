import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape'; // Para la curva

@Component({
  selector: 'app-graphics-byyear',
  templateUrl: './graphics-byyear.component.html',
  styleUrls: ['./graphics-byyear.component.css']
})
export class GraphicsByyearComponent implements OnChanges, OnInit {
  @Input() data: any[] = [];
  colorfromCss: any;
  colorScheme: any;
  observer!: MutationObserver;


  ngOnInit(): void {
    this.changeColor();
  }





  /*data = [
    { name: '2020', value: 10 },
    { name: '2021', value: 25 },
    { name: '2022', value: 40 },
    { name: '2023', value: 30 },
    { name: '2024', value: 50 },
  ];*/

  // puedes probar también: 'vivid', 'natural', 'fire'

  //view: [number, number] = [350, 200];




  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Año';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad de Juegos';


  changeColor(){
     const colorFromCss = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-2')
        .trim();

      this.colorScheme = {
        domain: [colorFromCss]
      };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.data = this.getYearDistribution(this.data);
    }

    this.observer = new MutationObserver(() => {
      this.changeColor();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });


  }

  getYearDistribution(datatemp: any): { name: string; series: { name: string; value: number }[] }[] {
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

    const series = lastFiveYears
      .reverse()
      .filter(year => distribution[year]) // Opcional: solo los años con datos
      .map(year => ({
        name: `${year}`,
        value: distribution[year] || 0
      }));

    return [
      {
        name: 'Elementos', // Nombre de la línea
        series
      }
    ];
  }

  curve: any = shape.curveLinear;


}
