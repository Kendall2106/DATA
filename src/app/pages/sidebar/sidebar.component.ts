import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/core/service/data.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProfileService } from 'src/app/core/service/profile.service';
import { ModalCreateItemComponent } from '../component/modal-create-item/modal-create-item.component';
import { ModalAlbumsComponent } from '../component/modal-albums/modal-albums.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  anioActual: string = "";
  colorSeleccionado: string = ''; // Color inicial
  username: string = '';
  photo: string = '';
  private profileSubscription?: Subscription;


  constructor(private router: Router, private dataService: DataService, public modalService: NgbModal, private authService: AuthService, private profileService: ProfileService) {
  }


  
  ngOnInit(): void {
    this.anioActual = new Date().getFullYear() + "";

    this.profileSubscription = this.profileService.profile$.subscribe(profile => {
      this.username = profile.username;
      this.photo = profile.photo;
      if (profile.color) {
        this.colorSeleccionado = profile.color;
      }
    });
    this.profileService.loadProfile().catch(() => { });
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
  }


  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }


  navegarCreate() {
    this.router.navigate(['/Settings']);
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

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/Login']);
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
    this.profileService.saveColor(this.colorSeleccionado);
  }


}
