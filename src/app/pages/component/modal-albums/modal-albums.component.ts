import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/core/service/data.service';
import { Utils } from 'src/app/core/utilidades/util';

@Component({
  selector: 'app-modal-albums',
  templateUrl: './modal-albums.component.html',
  styleUrls: ['./modal-albums.component.css']
})
export class ModalAlbumsComponent {

  @Input() public name: any;
    @Input() public image: any;
     @Input() public type: any;
@Input() public sentence: any;
    
  loading: boolean = false;
  albums: any[] = [];
  albumInfoTemp: any = {};
  showForm: boolean = false;
  newAlbum: any = {};

  constructor(public modalService: NgbModal,public dataService: DataService,private router: Router) { }
  

  ngOnInit() {
    this.loadAlbums();
  }


  closeModal() {
    this.modalService.dismissAll();
  }

  async loadAlbums() {
    this.albums = await this.dataService.getAlbums();
     this.albums.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });

     // this.selectedAlbum = this.dataModal.album;
 
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.newAlbum = {};
  }

  obtenerImagenAlbum(event: any) {
    const file = event.target.files[0];
    Utils.imageToByte(file).then((value: any) => {
      this.newAlbum.image = value;
    });
  }

  async saveAlbum() {
    if (!this.newAlbum.name || !this.newAlbum.image) {
      return;
    }

    try {
      this.loading = true;
      await this.dataService.createAlbum(this.newAlbum);
      this.showForm = false;
      this.newAlbum = {};
      await this.loadAlbums();
    } catch (error) {
      console.error("Error al crear el album:", error);
    } finally {
      this.loading = false;
    }
  }

  async obtenerImagen(link: any, type: any) {
      try {
        this.loading = true;
        const value = await Utils.imageToByteFromUrl(link, type);
        this.image = value;
        console.log("convert: "+ value);
      } catch (error) {
       // this.showAlert("Error al obtener la imagen", "error");
      } finally {
        this.loading = false;
      }
    }

  async saveInfoAlbum(idAlbum: string) {
     await this.obtenerImagen(this.image, this.type);

        this.albumInfoTemp.id = idAlbum;
        this.albumInfoTemp.name = this.name;
        this.albumInfoTemp.image = this.image;

        await this.dataService.createinfoAlbums(this.albumInfoTemp);
      
        this.closeModal();
  }

   navegarCollection(idAlbum: string) {

  this.router.navigate(['/AlbumInfo', idAlbum]);

  this.closeModal();
}

 
}


