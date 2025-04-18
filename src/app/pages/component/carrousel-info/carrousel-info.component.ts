import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.components';


@Component({
  selector: 'app-carrousel-info',
  templateUrl: './carrousel-info.component.html',
  styleUrls: ['./carrousel-info.component.css']
})
export class CarrouselInfoComponent  {

  @Input() data: any[] = [];
  @Input() type: any;


  message: string = "";
  images: string[] = [
    'https://via.placeholder.com/600x300?text=Image+1',
    'https://via.placeholder.com/600x300?text=Image+2',
    'https://via.placeholder.com/600x300?text=Image+3',
  ];

  constructor(public modalService: NgbModal){

  }



  openModal(infoData: any) {
    console.log(infoData);
    console.log(this.type);
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = this.type;
  }
}

