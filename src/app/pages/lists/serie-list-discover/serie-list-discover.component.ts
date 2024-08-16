import { Component } from '@angular/core';
import { ApiSerieService } from 'src/app/core/service/apiSerie.service copy';

@Component({
  selector: 'app-serie-list-discover',
  templateUrl: './serie-list-discover.component.html',
  styleUrls: ['./serie-list-discover.component.css']
})
export class SerieListDiscoverComponent {
  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
  animesAiring: any[] =[];
  numPage: number = 1;
 
   constructor(private apiSerieService: ApiSerieService){}

   ngOnInit(): void {
    this.getSeries();    
    this.getSeriesAiring();
  }


  async getSeries() {
    this.message = "Series";
   // this.dataAiring();
    await this.apiSerieService.getSeries(this.numPage).subscribe((response: any) => {
      this.data = [];
      console.log(response);
      response.results.forEach((item: any) => {
        this.data.push({
          name: item.name,
          image: "https://image.tmdb.org/t/p/w500" + item.poster_path,
          info: item.overview,
          releaseDate: item.first_air_date,
          randomData: item.vote_average
        });
      });
    });
  }

  async getSeriesAiring() {
    await this.apiSerieService.getSeriesAiring(this.getCurrentMonth(0), this.getCurrentMonth(1)).subscribe((response: any) => {
      this.animesAiring = [];
      console.log(response);
      const seriesWithImages = response.results.filter((m: any) => m.poster_path);
      seriesWithImages.forEach((item: any) => {
        this.animesAiring.push({
          name: item.name,
          image: "https://image.tmdb.org/t/p/original" + item.poster_path,
          info: item.overview
        });
      });
    });
  }

  getFormattedDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  getCurrentMonth(month: number): string {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + month, 1);
    console.log(this.getFormattedDate(firstDayCurrentMonth));
    return this.getFormattedDate(firstDayCurrentMonth);
  }

}
