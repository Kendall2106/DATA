import { Component } from '@angular/core';
import { Movie } from 'src/app/core/model/movie.model';
import { MovieService } from 'src/app/core/service/movie.service';
import { SeriesService } from 'src/app/core/service/series.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  constructor(private movieService: MovieService, private serieServicio: SeriesService){}

 // data: any; 
  //data: Movie = new Movie();
  tipo: any;
  data: any = {}

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

  onSubmit() {
    // Aquí puedes manejar la lógica cuando se envía el formulario
    console.log("EXIT ");
    if(this.tipo=="Peliculas"){
      this.movieService.createMovies(this.data);
    }
    
    if(this.tipo=="Series"){
      this.serieServicio.createSeries(this.data);
    }
    
  }


}
