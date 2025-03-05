import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service'; import { MusicService } from 'src/app/core/service/music.service';
import { RecoService } from 'src/app/core/service/recomendacion.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.css']
})
export class PendingListComponent implements OnInit {
  dataOriginal: any[] = [];

  data: any[] = [];
  categories: any[] = [];
  type: string = "";
  loading: boolean = false;
  opTipos: string[][] = [];
  opKind: string[] = [];
  stars: boolean[] = Array(5).fill(false);
  resultCount: any = 0;
  isListView = true;
  introVisible: boolean= true;
  actualYear: number = 0;
  viewData: any[] = [];
  selectedItem: string = '';
  selectedData: any = []; 

  constructor(private recoService: RecoService,
    private router: Router,
    private dataService: DataService,
    private musicService: MusicService, private libroService: LibrosService, private juegosService: GameService, private animeService: AnimeService, private movieService: MovieService, private serieServicio: SeriesService
  ) {
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
    ];
    this.opKind =["Novel", "Short story", "Light novel", "Anthology", "Graphic novel", "Manga", "Comic"];
  }


  ngOnInit(): void {
    this.actualYear = new Date().getFullYear();
    this.getReco();
    this.goHome('Home');
    
  }

  toggleView() {
    this.isListView = !this.isListView;
  }

  goHome(message: any){
    this.selectedItem = message;
    this.introVisible=true;
    this.isListView=true;

    this.viewDataList(this.dataOriginal);
  }

  async loadData(message: any) {
    this.introVisible=false;
    this.type = message;
    this.selectedItem = message;

    if (message === 'Animes') {
      this.data = [];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if (this.dataOriginal[index].type == "Animes") {
          this.data.push(this.dataOriginal[index]);
        }
      }
    }

    if (message === 'Movies') {
      this.data = [];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if (this.dataOriginal[index].type == "Movies") {
          this.data.push(this.dataOriginal[index]);
        }
      }
    }
    if (message === 'Games') {
      this.data = [];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if (this.dataOriginal[index].type == "Games") {
          this.data.push(this.dataOriginal[index]);
        }
      }
    }

    if (message === 'Series') {
      this.data = [];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if (this.dataOriginal[index].type == "Series") {
          this.data.push(this.dataOriginal[index]);
        }
      }
    }

    if (message === 'Books') {
      this.data = [];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if (this.dataOriginal[index].type == "Books") {
          this.data.push(this.dataOriginal[index]);
        }
      }
    }

    if (message === 'Music') {
      this.data = [];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if (this.dataOriginal[index].type == "Music") {
          this.data.push(this.dataOriginal[index]);
        }
      }
    }

    this.loadCategories(message);
    this.orderData();
    this.resultCount = this.data.length;

   
  }


  async loadCategories(message: any) {
    var categoriesTemp: any[] = [];
    if (message === 'Series' || message === 'Movies') { 
      this.categories = await this.serieServicio.getCategoriesShow();
    } else if (message === 'Animes') {     
      this.categories = await this.animeService.getCategoriesAnime();
    } else if (message === 'Games') {
      this.categories = await this.juegosService.getCategoriesGame();
    } else if (message === 'Books') {    
      this.categories = await this.libroService.getCategoriesBook();
    } else if (message === 'Music') {
    //  this.data = await this.loadDataForType(this.musicService.getMusic());
    }


}

  viewDataList(dataTotal: any){
    this.viewData = [];

    for (let index = 0; index < dataTotal.length; index++) {
      if(dataTotal[index].liked == true){
        this.viewData.push(dataTotal[index]);
        console.log(this.viewData);
      }
    }
    this.resultCount = this.viewData.length;
  }


  orderData() {
    this.data.sort((a: any, b: any) => {
      if (a.liked && !b.liked) {
        return -1;
      } else if (!a.liked && b.liked) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  async getReco() {
    try {
      this.loading = true;
      this.dataOriginal = await this.recoService.getReco();
      this.dataOriginal.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });
      this.viewDataList(this.dataOriginal);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }


  async toggleLike(dataLiked: any, dataTemp: any) {

    for (let index = 0; index < this.data.length; index++) {

      if(this.data[index].liked == true){
        this.data[index].liked = false;
        await this.recoService.updateReco(this.data[index].id, this.data[index].liked);
       // break;
      }

    }

    if (dataLiked.liked == false) {
      dataLiked.liked = true;
    } else {
      dataLiked.liked = false;
    }
    await this.recoService.updateReco(dataLiked.id, dataLiked.liked);
  }


  async deleteReco(recoTemp: any) {

    await this.recoService.deleteReco(recoTemp.id);

    const indexToRemove = this.data.findIndex(item => item.id === recoTemp.id);

    if (indexToRemove !== -1) {
      this.data.splice(indexToRemove, 1);
    }

    this.getReco();
  }


  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }


  getFormattedDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  async save(data: any) {

    var dataTemp: any = { ...data };
    dataTemp.date = this.getFormattedDate(new Date);

    try {
      dataTemp.image = dataTemp.image.split('base64,')[1];
      if (this.type == "Animes") {
        await this.animeService.createAnimes(dataTemp);
      }
      if (this.type == "Movies") {
        await this.movieService.createMovies(dataTemp);
      }
      if (this.type == "Series") {
        await this.serieServicio.createSeries(dataTemp);
      }
      if (this.type == "Games") {
        await this.juegosService.createGames(dataTemp);
      }
      if (this.type == "Books") {
        console.log(dataTemp);
        await this.libroService.createBook(dataTemp);
      }
      if (this.type == "Music") {
        await this.musicService.createMusic(dataTemp);
      }
      this.deleteReco(data);
      this.navegarAComponenteDestino(this.type);

    } catch (error) {
      console.error("Error al guardar el libro:", error);
    }
  }


  rate(data: any, score: number) {
    data.score = score;
  }

  chooseData(dataTemp: any[]): Promise<number> {
    return new Promise<number>((resolve) => {
      let count = 0;
      let randomIndex = 0;
      const usedIndices: Set<number> = new Set();
      this.selectedData = [];

      const audio = new Audio('assets/music/8bit.mp3');
    
      // Reproducir la música al inicio
      audio.play();
  
      const interval = setInterval(() => {
        if (count >= 5 || usedIndices.size === dataTemp.length) {
          clearInterval(interval); 
          resolve(randomIndex); 
          audio.pause();
          return;
        }
  
        do {
          randomIndex = Math.floor(Math.random() * dataTemp.length);
        } while (usedIndices.has(randomIndex)); 
  
        usedIndices.add(randomIndex);
        this.selectedData = dataTemp[randomIndex];
        console.log('Índice generado:', randomIndex);
        count++;
      }, 500); 
    });
  }

  async getRandomItem(): Promise<void> {
   const randomIndex = await this.chooseData(this.data);
   this.toggleLike(this.data[randomIndex], this.data);
  }

  

}
