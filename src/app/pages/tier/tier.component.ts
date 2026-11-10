import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendService } from 'src/app/core/service/friend.service';
import { ProfileService } from 'src/app/core/service/profile.service';
import { AnimeService } from 'src/app/core/service/anime.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.css']
})
export class TierComponent implements OnInit, OnDestroy {
  categorias: any[] = ["Masterpiece", "Re-watch", "Meh", "Forgettable", "trash"];
  data: any[] = [];
  anioActual: string = "";
  opAnios: any[] = [];
  selectedYear: string = this.opAnios[0];
  resultFilter: any[] = [];
  resultCount: any = 0;
  tier: any[] = [
    [0, 1, 2, 3, 4],
    ["#FF7F7F", "#FFBF7F", "#FFDF7F", "#FFFF7F", "#BFFF7F"]
  ];
  loading: boolean = false;
  opTipos: any = [];
  hobbyType: any = [];
  selectedCategory: string = 'Todos';
  selectedItem: string = '';
  categories: any[] = [];
  SK: boolean = false;
  friend: any = null;        // tu amigo vinculado (para el boton de tu propia tier)
  friendInfo: any = null;    // perfil del usuario cuya tier list estas viendo
  viewUid: string | null = null;
  viewFriend: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private friendService: FriendService, private profileService: ProfileService, private musicService: MusicService, private animeService: AnimeService, private movieService: MovieService, private seriesService: SeriesService, private gameService: GameService, private libroService: LibrosService) {
    this.opTipos =["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"];
    this.hobbyType =["Animes", "Movies", "Series", "Books", "Games", "Music"];
  }


  ngOnInit(): void {
    
    this.updateYearOptions();
    this.selectedYear = this.opAnios[0];
    this.initFriend();
  }

  // Con /Tier/:uid se muestra la tier list de tu amigo; sin parametro, la tuya
  async initFriend() {
    this.viewUid = this.route.snapshot.paramMap.get('uid');
    this.viewFriend = !!this.viewUid;

    try {
      if (this.viewUid) {
        this.friendInfo = await this.profileService.loadProfileOf(this.viewUid);
        this.profileService.previewColor(this.friendInfo.color);
      } else {
        this.friend = await this.friendService.getFriend();
      }
    } catch (error) {
      console.error("Error al cargar el amigo:", error);
    }
    this.loadData(this.hobbyType[0]);
  }

  ngOnDestroy(): void {
    if (this.viewFriend) {
      this.profileService.restoreColor();
    }
  }

  goMyTier() {
    this.router.navigate(['/Tier']);
  }

  goFriendTier() {
    if (this.friend) {
      this.router.navigate(['/Tier', this.friend.uid]);
    }
  }

  goFriendProfile() {
    if (this.viewUid) {
      this.router.navigate(['/Profile', this.viewUid]);
    }
  }

  updateYearOptions(): void {
    const currentYear = new Date().getFullYear();
  
    for (let year = currentYear; year >= 2019; year--) {
      this.opAnios.push(year.toString());
    }

    this.opAnios.push('Todos');
  }


  async loadData(message: any) {
   // console.log(message);
    //const message = event.target.value;
    this.selectedItem = message;
    try {
      this.loading = true;
      if (this.viewFriend) {
        this.data = await this.friendService.getItemsOf(message, this.viewUid as string);
      } else if (message === 'Movies') {
        this.data = await this.loadDataForType(this.movieService.getMovies());
      } else if (message === 'Series') {
        this.data = await this.loadDataForType(this.seriesService.getSeries());
      } else if (message === 'Animes') {
        this.data = await this.loadDataForType(this.animeService.getAnimes());
      } else if (message === 'Games') {
        this.data = await this.loadDataForType(this.gameService.getGames());
      } else if (message === 'Books') {
        this.data = await this.loadDataForType(this.libroService.getBook());
      } else if (message === 'Music') {
        this.data = await this.loadDataForType(this.musicService.getMusic());
      }

      this.loadCategories(message);
      console.log("first "+this.selectedYear);
      this.applyFilters();


      this.data.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });

      //this.resultFilter = this.data;
      this.resultCount = this.resultFilter.length;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }

  async loadCategories(message: any) {
    if (message === 'Series' || message === 'Movies') { 
      this.categories = await this.seriesService.getCategoriesShow();
    } else if (message === 'Animes') {     
      this.categories = await this.animeService.getCategoriesAnime();
    } else if (message === 'Games') {
      this.categories = await this.gameService.getCategoriesGame();
    } else if (message === 'Books') {    
      this.categories = await this.libroService.getCategoriesBook();
    } else if (message === 'Music') {
    //  this.data = await this.loadDataForType(this.musicService.getMusic());
    }


}

  async loadDataForType(service: Promise<any>) {
    const typeData = await service;
    return typeData.map((item: { date: string }) => {
      return item;
    });
  }


  convertYear(item: any) {
    const date = item.date.toString().toLowerCase();
    const parts = date.split("-");
    const year = parseInt(parts[0], 10);

    console.log("inYEAR "+ year)
  
    if (this.selectedYear === 'Todos') {
      return true;
    } else {
      return (year + "") === this.selectedYear;
    }

  }


  dataScore(da: any, num: number) {
    return da.filter((d: { score: number; }) => d.score == num);
  }


  filterYear(event: any) {
    this.selectedYear = event.target.value;
    this.applyFilters();
  }

  
  filterType(event: any) {
    this.selectedCategory = event.target.value;
    this.applyFilters();
  }

  FilterSK() {
    this.SK = !this.SK;
    this.applyFilters();
  }

  applyFilters() {
   /* if (this.selectedYear === "Todos") {
      this.resultFilter = this.data;
      console.log(1);
    } else {
      this.data = this.data.filter((d: { date: string; }) => this.convertYear(d.date) == this.selectedYear);
      console.log(2);
    }*/
    console.log("Hola "+this.selectedYear);
      this.resultFilter = this.data
      .filter(item => this.selectedCategory === 'Todos' || item.type === this.selectedCategory)
      .filter(item => this.SK === false || item.author.toLowerCase() === "stephen king")
      .filter(item => this.convertYear(item))
      
      this.resultCount = this.resultFilter.length;

      console.log(this.resultFilter);
  }


  navegarHome() {
    this.router.navigate(['./']);
  }


}
