import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiAnimeService } from 'src/app/core/service/apiAnime.service';
import { ModalComponent } from '../component/modal/modal.components';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.css']
})
export class DiscoverPageComponent {


  recomendaciones: any[] = [];
  animes: any[] = [];
  animesAiring: any[] = [];
  animesRange: any[] = [];
  opTipos: string[][] = [];
  numPage: number = 1;
  search: string = "";
  numVisible: number = 0;
  animeSelected: any;
  isModalOpen: boolean = false;

  constructor(private apiAnimeService: ApiAnimeService, public modalService: NgbModal) {}

  async ngOnInit() {
    await this.getAll();
    await this.getAnimeAiring();
    await this.getAnimeByRange();

    this.numVisible = window.innerWidth <= 768 ? 1 : 6;

    window.addEventListener('resize', () => {
      this.numVisible = window.innerWidth <= 768 ? 1 : 6;
    });
  }


  async getAll() {
    await this.apiAnimeService.getAnimeByPage(this.numPage).subscribe((response: any) => {
      console.log(response);
      this.animes = response.data;
    });
  }

  async searchAnimesByName() {
    await this.apiAnimeService.searchAnimesByName(this.search, this.numPage).subscribe((response: any) => {
      this.animes = response.data;
    });
  }

  async getAnimeAiring() {
    await this.apiAnimeService.getAnimeAiring().subscribe((response: any) => {
      console.log(response);
      this.animesAiring = response.data;
    });
  }

  async getAnimeByRange() {
    await this.apiAnimeService.getAnimeByRange().subscribe((response: any) => {
      console.log(response);
      this.animesRange = response.data;
    });
  }

  saveAnime(anime: any) {
    this.recomendaciones.push(anime);
  }

  aumentarNumero() {
    this.numPage++;
    this.getAll();
  }

  restNumber() {
    this.numPage--;
    this.getAll();
  }






  public user = {
    name: 'Izzat Nadiri',
    age: 26
  }

 


  openModal(anime: any) {

    const modalRef = this.modalService.open(ModalComponent, { centered: true });

    modalRef.componentInstance.data = anime;
    console.log(anime);
    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   console.log(receivedEntry);
    // })
  }



  

}