import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-graphics-bytype',
  templateUrl: './graphics-bytype.component.html',
  styleUrls: ['./graphics-bytype.component.css']
})
export class GraphicsBytypeComponent implements OnChanges, AfterViewInit, OnDestroy  {
  @Input() data: any[] = [];

  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;
  private viewInitialized = false;
  observer!: MutationObserver;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.data && this.data.length > 0) {
     this.renderChart();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.viewInitialized) {
       this.renderChart();

    this.observer = new MutationObserver(() => {
      this.renderChart();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    }
  }

  /*ngOnInit() {
    this.updateDarkColor();

    this.observer = new MutationObserver(() => {
      this.updateDarkColor();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
  }*/

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  renderChart(): void {
    const canvas = this.radarCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const color2 = getComputedStyle(document.documentElement).getPropertyValue('--color-2').trim();
    const distribution = this.getTopTypeDistribution(this.data, 5);
  
    const labels = Object.keys(distribution);
    const values = Object.values(distribution);
  
    // Etiquetas con salto de línea para mostrar tipo + cantidad
    const pointLabels = labels.map((label, i) => `${label}\n${values[i]}`);
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: 'transparent',
          borderColor: color2 || '#AE9CFD',
          pointBackgroundColor: color2 || '#AE9CFD',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              display: false
            },
            pointLabels: {
              color: 'white',
              font: {
                size: 11
              },
              callback: function(label, index) {
                return pointLabels[index];
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  getTopTypeDistribution(datatemp: any[], topN: number = 5): { [type: string]: number } {
    const distribution: { [type: string]: number } = {};
  
    for (const d of datatemp) {
      const type = d.type;
      if (type) {
        distribution[type] = (distribution[type] || 0) + 1;
      }
    }
  
    // Ordenar por cantidad descendente y tomar los primeros 5
    const sortedEntries = Object.entries(distribution)
      .sort(([, a], [, b]) => b - a) // b - a para descendente
      .slice(0, topN);
  
    // Reconstruir objeto con solo los top N
    const topDistribution: { [type: string]: number } = {};
    for (const [type, count] of sortedEntries) {
      topDistribution[type] = count;
    }
  
    return topDistribution;
  }
}
