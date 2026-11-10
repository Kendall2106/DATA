import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumInfoService } from 'src/app/core/service/allbum-info.service';
import { DataService } from 'src/app/core/service/data.service';

@Component({
  selector: 'app-album-info-page',
  templateUrl: './album-info-page.component.html',
  styleUrls: ['./album-info-page.component.css']
})
export class AlbumInfoPageComponent implements OnInit {
  dataOriginal: any[] = [];
  data: any[] = [];
  loading: boolean = false;
  resultFilter: any[] = [];

  album: any = null;
  idAlbum: string = '';

  totalAlbums = 0;
  watchedCount = 0;

  constructor(private albumInfoService: AlbumInfoService, public dataService: DataService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idAlbum = params['idAlbum'];
      this.loadAlbum();
      this.getReco(this.idAlbum);
    });
  }

  get progress(): number {
    return this.totalAlbums ? Math.round((this.watchedCount / this.totalAlbums) * 100) : 0;
  }

  async loadAlbum() {
    try {
      this.album = await this.dataService.getAlbumById(this.idAlbum);
    } catch (error) {
      console.error("Error al cargar el album:", error);
    }
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
      await this.getReco(this.idAlbum);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }

  // Elimina el album completo junto con todas sus postales
  async deleteAlbum() {
    const name = this.album?.name ?? 'este álbum';
    const ok = confirm('¿Eliminar "' + name + '" con sus ' + this.totalAlbums + ' postales? Esta acción no se puede deshacer.');
    if (!ok) {
      return;
    }

    try {
      this.loading = true;
      await this.dataService.deleteAlbum(this.idAlbum);
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Error al eliminar el album:", error);
      this.loading = false;
    }
  }

}
