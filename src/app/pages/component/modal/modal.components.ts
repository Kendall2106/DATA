import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.components.html',
  styleUrls: ['./modal.components.css']
})
export class ModalComponent implements OnInit {
  @Input() public data: any;
  //@Output() passEntry: EventEmitter<any> = new EventEmitter();


  
  animeModal: any;

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.animeModal = this.data;
    console.log(this.data);

  }

  closeModal() {
    this.modalService.dismissAll();
  }

}