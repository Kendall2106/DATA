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

  constructor(public modalService: NgbModal){

  }



  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = this.message;
  }
}

