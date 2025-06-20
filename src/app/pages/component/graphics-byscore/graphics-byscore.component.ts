import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graphics-byscore',
  templateUrl: './graphics-byscore.component.html',
  styleUrls: ['./graphics-byscore.component.css']
})
export class GraphicsByscoreComponent implements OnChanges, OnInit, OnDestroy  {
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

  processedData: { score: number; value: number }[] = [];

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
      this.processedData = this.getScoreDistribution(this.data);
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

  getScoreDistribution(datatemp: any): { score: number; value: number }[] {
    const distribution: { [key: number]: number } = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    for (const d of datatemp) {
      const score = d.score;
      if (score >= 0 && score <= 5) {
        distribution[score]++;
      }
    }

    return Object.entries(distribution).map(([score, count]) => ({
      score: Number(score),
      value: count
    }));
  }

  getScoreValue(score: number): number {
    const item = this.processedData.find(d => d.score === score);
    return item ? item.value : 0;
  }

  get totalCount(): number {
    return this.data?.length || 0;
  }

  getScorePercentage(score: number): number {
    const total = this.totalCount;
    const scoreValue = this.getScoreValue(score);
    return total > 0 ? (scoreValue / total) * 100 : 0;
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