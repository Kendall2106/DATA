import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/core/service/data.service';
import { ModalCreateItemComponent } from '../component/modal-create-item/modal-create-item.component';
import { ModalAlbumsComponent } from '../component/modal-albums/modal-albums.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  anioActual: string = "";
  colorSeleccionado: string = ''; // Color inicial


  constructor(private router: Router, private dataService: DataService, public modalService: NgbModal) {
  }


  
  ngOnInit(): void {
    this.anioActual = new Date().getFullYear() + "";
  }


  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }


  navegarCreate() {
    this.router.navigate(['/Create']);
  }


  navegarTier() {
    this.router.navigate(['/Tier']);
  }


  navegarLibrary() {
    this.router.navigate(['/library']);
  }


  navegarPendingList() {
    this.router.navigate(['/PendingList']);
  }


  navegarDiscoverPage() {
    this.router.navigate(['/']);
  }

  navegarProfilePage() {
    this.router.navigate(['/Profile']);
  }

  navegarGraphicsPage() {
    this.router.navigate(['/Graphics']);
  }

  navegarCollection() {
    this.router.navigate(['/AlbumInfo']);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  openModalAlbums() {
    
         const modalRef =  this.modalService.open(ModalAlbumsComponent, { centered: true });
         modalRef.componentInstance.sentence = 'open';

     }

     

   openModal() {
      const modalRef = this.modalService.open(ModalCreateItemComponent, { centered: true });
    }



  toggleMobileMenu(): void {
    const menu = document.getElementById('menu')!;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }

  cambiarColor() {
    localStorage.setItem('colorLocal', this.colorSeleccionado );
    document.documentElement.style.setProperty('--color-2', this.colorSeleccionado);
  }


}
