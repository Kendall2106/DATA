import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  collections: any[] = [];
  data: any[] = [];
  loading: boolean = false;

  constructor(private dataService: DataService) { }

  async ngOnInit() {
    this.getCollection();
  
  }

  async getCollection() {

    this.collections = await this.dataService.getCollection();
    this.collections.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });
  }

  async selectCollection(id: string) {
    this.data = await this.dataService.getByMarca(id);
    this.data.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });

  }


}
