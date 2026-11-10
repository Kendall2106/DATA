import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/core/service/spotify.service';
import { ModalComponent } from '../../component/modal/modal.components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-music-list-discover',
  templateUrl: './music-list-discover.component.html',
  styleUrls: ['./music-list-discover.component.css']
})
export class MusicListDiscoverComponent implements OnInit {
  loading: boolean = false;
  message: string = 'Music';

  data: {
    name: string;
    image: string;
    info: string;
    releaseDate: number;
    randomData: string | number;
    artist: string;
  }[] = [];

  animesAiring: any[] = [];

  startIndex: number = 0;
  maxResults: number = 24;
  numPage: number = 1;
  search: string = '';
  type: string = '';

  currentSearchType: 'all' | 'genre' | 'search' = 'all';

  constructor(
    private spotify: SpotifyService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getMusic();
  }

  // Cargar el catálogo inicial
  getMusic(): void {

    this.currentSearchType = 'all';
    this.message = 'Music';

    this.loading = true;
    this.spotify.getAlbums(
      this.startIndex,
      this.maxResults
    ).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.loadAlbums(response);
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error al cargar álbumes:', error);
        this.data = [];
        this.message = 'Error al cargar los álbumes.';
      }
    });
  }

  // Cargar novedades
  getMusicAiring(): void {

    this.spotify.getAlbumsAiring().subscribe({
      next: (response: any) => {

        this.animesAiring = [];

        const albums = response?.albums?.items || [];

        this.animesAiring = albums.map((item: any) => ({
          name: item.name,
          image: item.images?.[0]?.url || '',
          info: 'Artist: ' + (item.artists?.[0]?.name || ''),
          releaseDate: this.getYear(item),
          randomData: item.total_tracks || 0,
          artist: item.artists?.[0]?.name || ''
        }));

        console.log('Novedades musicales:', this.animesAiring);
      },
      error: (error: any) => {
        console.error('Error al cargar novedades:', error);
      }
    });
  }

  // Buscar por nombre de álbum o artista
  seachMusicByName(): void {

    const query = this.search.trim();

    if (!query) {
      this.startIndex = 0;
      this.getMusic();
      return;
    }

    this.currentSearchType = 'search';
    this.message = 'Resultados de búsqueda';

    this.loading = true;
    this.spotify.getAlbumsByName(
      query,
      this.startIndex,
      this.maxResults
    ).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.loadAlbums(response);
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error al buscar álbumes:', error);
        this.data = [];
        this.message = 'Error al buscar álbumes.';
      }
    });
  }

  // Preparar los álbumes para mostrarlos en el HTML
  private loadAlbums(response: any): void {

    const albums = response?.albums?.items || [];

    this.data = albums.map((item: any) => ({
      name: item.name || 'Álbum sin nombre',
      image: item.images?.[0]?.url || '',
      info:
        'Artist: ' +
        (item.artists?.[0]?.name || 'Desconocido') +
        ', Fecha salida: ' +
        (item.release_date || 'Desconocida'),
      releaseDate: this.getYear(item),
      randomData: item.total_tracks || 0,
      artist: item.artists?.[0]?.name || ''
    }));

    console.log('Álbumes para mostrar:', this.data);

    if (this.data.length === 0) {
      this.message = 'No se encontraron álbumes.';
    } else if (this.currentSearchType === 'all') {
      this.message = 'Music';
    }
  }

  // Ejecutar la búsqueda desde el HTML
  searchData(): void {
    this.startIndex = 0;
    this.seachMusicByName();
  }

  // Abrir modal
  openModal(infoData: any): void {

    const modalRef = this.modalService.open(
      ModalComponent,
      { centered: true }
    );

    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = 'Music';
  }

  // Página siguiente
  aumentarNumero(): void {
    this.startIndex += this.maxResults;
    this.loadAlbumsBasedOnContext();
  }

  // Página anterior
  restNumber(): void {
    if (this.startIndex > 0) {
      this.startIndex -= this.maxResults;
      this.loadAlbumsBasedOnContext();
    }
  }

  // Recargar según el contexto
  loadAlbumsBasedOnContext(): void {

    if (this.currentSearchType === 'all') {
      this.getMusic();
    } else if (this.currentSearchType === 'search') {
      this.seachMusicByName();
    }
  }

  // Obtener año de lanzamiento
  getYear(itemTemp: any): number {

    if (!itemTemp.release_date) {
      return 0;
    }

    return Number(itemTemp.release_date.substring(0, 4));
  }
}