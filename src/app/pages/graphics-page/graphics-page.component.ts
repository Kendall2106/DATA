import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/service/game.service';
import { ImagesService } from 'src/app/core/service/images.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-graphics-page',
  templateUrl: './graphics-page.component.html',
  styleUrls: ['./graphics-page.component.css']
})
export class GraphicsPageComponent implements OnInit {
  data: any[] = [];
  categories: any[] = [];
  platinumData: any[] = [];


  constructor(private gameService: GameService, private imagesService: ImagesService) {

  }
  ngOnInit(): void {
    this.loadData();
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


  /*onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imgUrl = e.target.result;
          this.images.push(imgUrl);
          if (!this.selectedImage) {
            this.selectedImage = imgUrl;
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }*/

    
  /*obtenerImagen(event: any) {
    const file = event.target.files[0];
    var promiseResult = Utils.imageToByte(file);
    promiseResult.then((value: any) => {
      this.selectedImage = value;
    });
  }*/

  




  async onSubmit(event: any) {
    const file = event.target.files[0];

  // Convertir imagen a byte
  const imageBytes = await Utils.imageToByte(file);

  // Guardar la imagen en Firebase
  this.imagesService.addImages(imageBytes, 'games');
  this.loadImages();
  }
  }
