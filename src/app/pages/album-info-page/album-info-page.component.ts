import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumInfoService } from 'src/app/core/service/allbum-info.service';
import { DataService } from 'src/app/core/service/data.service';

@Component({
  selector: 'app-album-info-page',
  templateUrl: './album-info-page.component.html',
  styleUrls: ['./album-info-page.component.css']
})
export class AlbumInfoPageComponent {
  dataOriginal: any[] = [];
   data: any[] = [];
   loading: boolean = false;
   resultFilter: any[] = [];

  totalAlbums = 0;
watchedCount = 0;

  constructor(private albumInfoService: AlbumInfoService,public dataService: DataService,private route: ActivatedRoute
  
  ) {
    
  }


ngOnInit(): void {

  this.route.params.subscribe(params => {

    const idAlbum = params['idAlbum'];

    this.getReco(idAlbum);

  });
   }

    async getReco(typeData: any) {
    try {
      this.loading = true;
      this.dataOriginal = await this.albumInfoService.getInfoAlbums(typeData);
      this.dataOriginal.forEach((element: any) => {
        element.image = 'data:image/jpg;base64,' + element.image;
      });

      this.totalAlbums = this.dataOriginal.length;
    this.watchedCount = this.dataOriginal.filter((item: any) => item.watched).length;

      this.resultFilter = this.dataOriginal;
     // this.viewDataList(this.dataOriginal);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }

    async watch(id: any) {
    try {
      this.loading = true;
      await this.albumInfoService.watch(id, {
  watched: true
});

  
    this.route.params.subscribe(params => {

    const idAlbum = params['idAlbum'];

    this.getReco(idAlbum);

  });


     // this.viewDataList(this.dataOriginal);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }


}
