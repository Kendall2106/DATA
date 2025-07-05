import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data.service';
import { ImagesService } from 'src/app/core/service/images.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-books-graphics',
  templateUrl: './books-graphics.component.html',
  styleUrls: ['./books-graphics.component.css']
})
export class BooksGraphicsComponent implements OnInit {
  data: any[] = [];
  categories: any[] = [];
  platinumData: any[] = [];


  constructor(private libroService: LibrosService, private imagesService: ImagesService, private dataService: DataService, private router: Router) {

  }
  ngOnInit(): void {
    this.loadData();
  }

   navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }

  async loadData() {
    // Cargar primero las categorías
    this.categories = await this.libroService.getCategoriesBook();

    // Luego cargar los juegos
    this.data = await this.libroService.getBook();

    // Agregar imagen base64 y categoría por nombre
    this.data.forEach((element: any) => {
      element.image = 'data:image/jpg;base64,' + element.image;

      // Buscar la categoría correspondiente por ID
      const category = this.categories.find((cat: any) => cat.id === element.type);
      element.type = category ? category.name : 'Desconocido'; // typeName es una propiedad adicional que podés usar en el HTML
    });


  }

  async loadCategories() {
    this.categories = await this.libroService.getCategoriesBook();
   
  }

  

}
