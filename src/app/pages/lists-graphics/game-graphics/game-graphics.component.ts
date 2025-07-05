import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data.service';
import { GameService } from 'src/app/core/service/game.service';
import { ImagesService } from 'src/app/core/service/images.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-game-graphics',
  templateUrl: './game-graphics.component.html',
  styleUrls: ['./game-graphics.component.css']
})
export class GameGraphicsComponent implements OnInit {
  data: any[] = [];
  categories: any[] = [];
  platinumData: any[] = [];


  constructor(private gameService: GameService, private imagesService: ImagesService, private dataService: DataService, private router: Router) {

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
    this.categories = await this.gameService.getCategoriesGame();

    // Luego cargar los juegos
    this.data = await this.gameService.getGames();

    // Agregar imagen base64 y categoría por nombre
    this.data.forEach((element: any) => {
      element.image = 'data:image/jpg;base64,' + element.image;

      // Buscar la categoría correspondiente por ID
      const category = this.categories.find((cat: any) => cat.id === element.type);
      element.type = category ? category.name : 'Desconocido'; // typeName es una propiedad adicional que podés usar en el HTML
    });

    this.loadGamesPltinum();
    this.loadImages();
  
  }

  async loadCategories() {
    this.categories = await this.gameService.getCategoriesGame();
   
  }

  loadGamesPltinum() {
    for (let index = 0; index < this.data.length; index++) {
      if (this.data[index].achievements == true) {
        this.platinumData.push(this.data[index]);
      }

    }
    console.log(this.platinumData)
  }





  images: any[] = [];
  selectedImage: string | null = null;

  async loadImages(){
    this.images = await this.imagesService.getImages('games');
    this.images.forEach((element: any) => {
      element.image = 'data:image/jpg;base64,' + element.image;
    });
    //console.log(this.images[0].image)
    this.selectedImage = this.images[0].image;
  }

  selectImage(images: any) {
    this.selectedImage = images.image;
  }


  async onSubmit(event: any) {
    const file = event.target.files[0];

  // Convertir imagen a byte
  const imageBytes = await Utils.imageToByte(file);

  // Guardar la imagen en Firebase
  this.imagesService.addImages(imageBytes, 'games');
  this.loadImages();
  }


}
