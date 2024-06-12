import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Anime } from 'src/app/core/model/anime.model';

import { Movie } from 'src/app/core/model/movie.model';
import { AlertService } from 'src/app/core/service/alert.service';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.css'],
})
export class WorkplaceComponent implements OnInit {
  data: any[] = [];
  resultFilter: any[]=[];

  movies: Movie[] = [];
  animes: Anime[] = [];
  message: string = '';
  opTipos: string[][] = [];
  opAnios: string[] = [];
  opCalificacion: string[] = [];
  calificacionSelec: any;
  resultCount: any = 0;
  color: any ="";
  type: string ="";

  loading: boolean = false;
  isInfoVisible = false;

  constructor(private alertService: AlertService, private musicService: MusicService, private movieService: MovieService, private libroService: LibrosService, private gameService: GameService,private seriesService: SeriesService, private animeService: AnimeService,private router: Router, public dataService: DataService) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "lightblue", "lightGreen", "yellow", "Pink", "White", "lightYellow", "green", "Purple"] // Colores correspondientes
    ];
      this.opAnios= ["2024","2023","2022","2021","2020","2019"];
      this.opCalificacion = ["0","1","2","3","4","5"];
  }

  ngOnInit() {

    if (!this.dataService.typeData) {
      this.router.navigate(['/']);
    }
    //const selectElement = document.getElementById('opAnios');
    //this.filterYear(document.getElementById('opAnios'));
    this.router.events.subscribe(event => {
      
        this.message = this.dataService.typeData;
        this.loadData('Animes');
   
    });

    this.selectedYear = this.opAnios[0];
   // this.applyFilters();
  }




  async loadData(message: any){
    
try {
  this.loading = true;
  if (message === 'Movies') {
    this.color = 'linear-gradient(to bottom, #00913f3b, 20%, #121212)';
    this.data = await this.loadDataForType(this.movieService.getMovies());
  } else if (message === 'Series') {
    this.color = 'linear-gradient(to bottom, #c3e91a33, 20%, #121212)';
    this.data = await this.loadDataForType(this.seriesService.getSeries());
  } else if (message === 'Animes') {
    this.color = 'linear-gradient(to bottom, #4e239481, 20%, #121212)';
    this.data = await this.loadDataForType(this.animeService.getAnimes());
  }else if (message === 'Games') {
    this.color = 'linear-gradient(to bottom, #f8798e3a, 20%, #121212)';
    this.data = await this.loadDataForType(this.gameService.getGames());
  }else if (message === 'Books') {
    this.color = 'linear-gradient(to bottom, #8040003a, 20%, #121212)';
    this.data = await this.loadDataForType(this.libroService.getBook());
  }else if (message === 'Music') {
    this.color = 'linear-gradient(to bottom, #0000ff3f, 20%, #121212)';
    this.data = await this.loadDataForType(this.musicService.getMusic());
  }

  this.message = message;
  this.resultFilter=this.sortData(this.data);
  
  this.resultFilter.forEach((element: any)=>{
      element.image ='data:image/jpg;base64,' + element.image;
  });


  this.resultCount=this.resultFilter.length;
  this.applyFilters();

  console.log(this.data);
  if(this.data.length==0){
   
    this.showAlert("Error al solicitar los datos", "error",3000);
  }

} catch (error) {
  console.error("Error:", error);
  
}finally {
  this.loading = false; // Ocultar animación de carga
  this.type = message;
}



   
  }

  async loadDataForType(service: Promise<any>) {
    const typeData = await service;
    return typeData.map((item: { date: string }) => {
      item.date = this.convertDate(item.date);
      return item;
    });
  }

  convertDate(date: any): string {
    const dateTemp = date.toString().toLowerCase();
    var parts = dateTemp.split("-");
    const year = parseInt(parts[2], 10);
    return parts[2]+"-"+parts[1]+"-"+parts[0];

}

  sortData(data: any[]){  
    return data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('-').map(Number);
      const [dayB, monthB, yearB] = b.date.split('-').map(Number);

      // Compara primero por año, luego por mes y finalmente por día, en orden descendente
      if (yearB !== yearA) {
        return yearB - yearA;
      }
      if (monthB !== monthA) {
        return monthB - monthA;
      }
      return dayB - dayA;
    });
  }

  getColorByType(type: string): string {
    const index = this.opTipos[0].indexOf(type);
    return index !== -1 ? this.opTipos[1][index] : 'greenyellow'; // Color por defecto para tipos desconocidos
  }



  convert(date: any): number {
       const dateTemp = date.toString().toLowerCase();
       var parts = dateTemp.split("/");
       const year = parseInt(parts[2], 10);
       return year;

   }

  
  selectedCategory: string = 'Todos';
  selectedYear: string = this.opAnios[0];
  selectedScore: string = 'Todos';


applyFilters() {
  this.resultFilter = this.data
    .filter(item => this.selectedCategory === 'Todos' || item.type === this.selectedCategory)
    .filter(item => this.convertYear(item) )
    .filter(item => this.selectedScore === 'Todos' || item.score === this.selectedScore);

    this.resultCount=this.resultFilter.length;

}

convertYear(item: any): boolean {
  if(this.selectedYear != 'All'){
    const date = item.date.toString().toLowerCase();
    const parts = date.split("-");
    const year = parseInt(parts[2], 10);
    return (year+"") === this.selectedYear;
  }else{
    return true;
  }
   
 
    

}


  filterType(event: any) {
    this.selectedCategory = event.target.value;
    this.applyFilters();
  }
  
  filterYear(event: any) {
    this.selectedYear = event.target.value;
    this.applyFilters();
  }

  filterScore(event: any) {
    this.selectedScore = event.target.value;
    this.applyFilters();
  }



  currentSortOrder: 'asc' | 'desc' = 'desc';

sortDataByScore() {
  this.resultFilter = this.resultFilter.sort((a, b) => {
    const scoreA = a.score;
    const scoreB = b.score;

    if (this.currentSortOrder === 'asc') {
      return scoreA - scoreB;
    } else {
      return scoreB - scoreA;
    }
  });

  this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
}

getColor(score: any){
  if(score==5){
    return 'gold'; 
  }
  return '';
}
 


selectedCardIndex: number | null = null;


  toggleInfo(index: number): void {
    if (this.selectedCardIndex === index) {
      this.selectedCardIndex = null;
    } else {
      this.selectedCardIndex = index;
    }
  }


 /* async updateData(recoTemp: any) {

    try {
      this.loading = true;
      if (this.type === 'Movies') {
        await this.movieService.updateMovie(recoTemp.id, recoTemp.score);
      } else if (this.type === 'Series') {
        await this.seriesService.updateSerie(recoTemp.id, recoTemp.score);
        
      } else if (this.type === 'Animes') {
        await this.animeService.updateAnime(recoTemp.id, recoTemp.score);
        
      }else if (this.type === 'Games') {
        await this.gameService.updateGames(recoTemp.id, recoTemp.score);
        
      }else if (this.type === 'Books') {
        await this.libroService.updateBook(recoTemp.id, recoTemp.score);
        
      }else if (this.type === 'Music') {
        await this.musicService.updateMusic(recoTemp.id, recoTemp.score);
        
      }
  
    } catch (error) {
      console.error("Error:", error);
      
    }finally {
      this.loading = false; // Ocultar animación de carga
      this.loadData(this.type);
    }
  }*/

  
async deleteData(recoTemp: any) {

  try {
    this.loading = true;
    if (this.type === 'Movies') {
      await this.movieService.deleteMovie(recoTemp.id);
    } else if (this.type === 'Series') {
      await this.seriesService.deleteSerie(recoTemp.id);
      
    } else if (this.type === 'Animes') {
      await this.animeService.deleteAnime(recoTemp.id);
      
    }else if (this.type === 'Games') {
      await this.gameService.deleteGames(recoTemp.id);
      
    }else if (this.type === 'Books') {
      await this.libroService.deleteBook(recoTemp.id);
      
    }else if (this.type === 'Music') {
      await this.musicService.deleteMusic(recoTemp.id);
      
    }

  } catch (error) {
    //console.error("Error:", error);
    this.showAlert("Error al eliminar", "error", 3000);
    
  }finally {
    this.loading = false; // Ocultar animación de carga
    
    this.loadData(this.type);
    this.showAlert("Dato Eliminado", "success",2000);

  }



   
  
 
  /*const indexToRemove = this.data.findIndex(item => item.id === recoTemp.id);

  if (indexToRemove !== -1) {
    this.data.splice(indexToRemove, 1);
  }

  this.getReco();*/
}

stars: boolean[] = Array(5).fill(false);

async rate(recoTemp:any, score: number) {
  recoTemp.score = score;  


  try {
    this.loading = true;
    if (this.type === 'Movies') {
      await this.movieService.updateMovie(recoTemp.id, recoTemp.score);
    } else if (this.type === 'Series') {
      await this.seriesService.updateSerie(recoTemp.id, recoTemp.score);
      
    } else if (this.type === 'Animes') {
      await this.animeService.updateAnime(recoTemp.id, recoTemp.score);
      
    }else if (this.type === 'Games') {
      await this.gameService.updateGames(recoTemp.id, recoTemp.score);
      
    }else if (this.type === 'Books') {
      await this.libroService.updateBook(recoTemp.id, recoTemp.score);
      
    }else if (this.type === 'Music') {
      await this.musicService.updateMusic(recoTemp.id, recoTemp.score);
      
    }

  } catch (error) {
    this.showAlert("Error al actualizar el score", "error", 3000);
    
  }finally {
    this.loading = false; // Ocultar animación de carga
    this.loadData(this.type);
    this.showAlert("Dato Actualizado", "success", 2000);
  }





}


showAlert(messageAlert: string, tipoMessage: any, duration: number) {
  this.alertService.showAlert(messageAlert, tipoMessage, duration);
}

}

