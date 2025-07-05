import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graphics-bytype2',
  templateUrl: './graphics-bytype2.component.html',
  styleUrls: ['./graphics-bytype2.component.css']
})
export class GraphicsBytype2Component implements OnChanges, OnInit, OnDestroy {
  @Input() data: any[] = [];

  view: [number, number] = [500, 300];
  colorScheme: Color = {
    name: 'retroScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFD6A5', '#B5838D', '#6D6875', '#1982C4', '#FF9B85']
  };

  legend = true;
  showLabels = true;
  isDoughnut = false;
  darkColor = "";
  observer!: MutationObserver;

  processedData: any = [];

  ngOnInit() {
    this.updateDarkColor();

    this.observer = new MutationObserver(() => {
      this.updateDarkColor();
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.processedData = this.getTopTypeDistribution(this.data);
      console.log(this.processedData);
    }

  }


  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  updateDarkColor() {
    const baseColor = this.getCssVariableValue('--color-2');
    this.darkColor = this.darkenColor(baseColor, 0.35);
  }

  getTopTypeDistribution(datatemp: any[]): { name: string; value: number }[] {
    const distribution: { [type: string]: number } = {};

    for (const d of datatemp) {
      const type = d.type;
      if (type) {
        distribution[type] = (distribution[type] || 0) + 1;
      }
    }

    const temp = Object.entries(distribution).map(([name, count]) => ({
     name: name,
     value: count
     }));

    return temp.sort((a, b) => b.value - a.value);;
  }




getScorePercentage(score: number): number {
  const total = this.data.length;
  return total > 0 ? (score / total) * 100 : 0;
}


darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.floor(r * (1 - percent));
  g = Math.floor(g * (1 - percent));
  b = Math.floor(b * (1 - percent));

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

getCssVariableValue(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

}