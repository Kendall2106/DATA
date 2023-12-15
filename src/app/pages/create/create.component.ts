import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/core/model/movie.model';
import { AnimeService } from 'src/app/core/service/anime.service';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { SeriesService } from 'src/app/core/service/series.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  tipo: any;
  data: any = {}
  opTipos: string[][] = [];
  opCalificacion: string[] = [];

  constructor(private router: Router, private dataService: DataService, private libroService: LibrosService,private juegosService: GameService, private animeService: AnimeService, private movieService: MovieService, private serieServicio: SeriesService){
    this.opTipos = [
      ["Accion", "Terror", "Comedia", "Animacion", "Musical", "Romance", "Triller", "Fantasia", "No Ficcion", "Ficcion"],
      ["lightcoral", "gray", "blue", "green", "yellow", "Pink", "White", "lightYellow", "lightblue", "Purple"] // Colores correspondientes
      ];
    this.opCalificacion = ["0","1","2","3","4","5"];
  }

 // data: any; 
  //data: Movie = new Movie();
  


  registrarFacilidad() {
    //this.dataFacilidad.imagen = this.dataFacilidad.imagen;
    //this.dataFacilidad.id_tipo_pagina = this.dataPaginas[0].id_tipo_pagina;
   /* return this.paginaService.crearPagina(this.dataFacilidad).subscribe((data: any) => {
      this.respuesta = data;
      console.log(data);
      console.log(this.dataFacilidad);
      this.mostrarPagina("Facilidades");
    });*/
  }

  obtenerImagen(event: any) {   
    const file = event.target.files[0];
    var promiseResult = Utils.imageToByte(file);
    promiseResult.then((value: any) => {
      this.data.image = value;
      //let image = document.getElementById("preview") as HTMLImageElement;
      //image.src = 'data:image/jpg;base64,' + value;
    });
  }

  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }

  onSubmit() {
    // Aquí puedes manejar la lógica cuando se envía el formulario
    console.log("EXIT ");
    if(this.tipo=="Peliculas"){
      this.movieService.createMovies(this.data);
    }
    
    if(this.tipo=="Series"){
      this.serieServicio.createSeries(this.data);
    }

    if(this.tipo=="Animes"){
      this.animeService.createAnimes(this.data);
    }

    if(this.tipo=="Juegos"){
      this.juegosService.createGames(this.data);
    }

    if(this.tipo=="Libros"){
      this.libroService.createBook(this.data);
    }

    this.navegarAComponenteDestino(this.tipo);
    
  }


}
