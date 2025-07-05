import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-anime-graphics',
  templateUrl: './anime-graphics.component.html',
  styleUrls: ['./anime-graphics.component.css']
})
export class AnimeGraphicsComponent implements OnInit {
  @Input() type: string = "";
  data: any[] = [];
  categories: any[] = [];
  masterpieceData: any[] = [];

  constructor(private animeService: AnimeService, private movieService: MovieService, private showSeries: SeriesService, private dataService: DataService, private router: Router) {

  }

  ngOnInit(): void {
    this.loadData();
  }

   navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }

  async loadData() {
    console.log(this.type);
    if (this.type == "Animes") {
      // Cargar primero las categorías
      this.categories = await this.animeService.getCategoriesAnime();

      // Luego cargar los juegos
      this.data = await this.animeService.getAnimes();
    }

     if (this.type == "Movies") {
      // Cargar primero las categorías
      this.categories = await this.showSeries.getCategoriesShow();

      // Luego cargar los juegos
      this.data = await this.movieService.getMovies();
    }

    if (this.type == "Series") {
      // Cargar primero las categorías
      this.categories = await this.showSeries.getCategoriesShow();

      // Luego cargar los juegos
      this.data = await this.showSeries.getSeries();
    }


    // Agregar imagen base64 y categoría por nombre
    this.data.forEach((element: any) => {
      element.image = 'data:image/jpg;base64,' + element.image;

      // Buscar la categoría correspondiente por ID
      const category = this.categories.find((cat: any) => cat.id === element.type);
      element.type = category ? category.name : 'Desconocido'; // typeName es una propiedad adicional que podés usar en el HTML
    });

    this.loadMasterpieces();
  }

  loadMasterpieces() {
    for (let index = 0; index < this.data.length; index++) {
      if (this.data[index].score == 5) {
        this.masterpieceData.push(this.data[index]);
      }

    }
  }

}
