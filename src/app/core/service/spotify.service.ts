// spotify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})

 
export class SpotifyService {
  private apiUrl = 'https://itunes.apple.com/search';
  private lookupUrl = 'https://itunes.apple.com/lookup';

  constructor(private http: HttpClient) {}

  // Catálogo inicial de Feid para comprobar la conexión
  getAlbums(offset: number, limit: number): Observable<any> {
    return this.getAlbumsByArtist(194502100, offset, limit);
  }

  // Buscar álbumes por nombre de álbum o artista
  getAlbumsByName(
    title: string,
    offset: number,
    limit: number
  ): Observable<any> {

    const params = new HttpParams()
      .set('term', title.trim())
      .set('media', 'music')
      .set('entity', 'album')
      .set('country', 'US')
      .set('limit', '200');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        const albums = (response.results || [])
          .filter((item: any) =>
            item.wrapperType === 'collection' &&
            item.collectionType === 'Album' &&
            item.collectionId &&
            item.collectionName
          )
          .map((item: any) => this.formatAlbum(item));

        return {
          albums: {
            items: albums.slice(offset, offset + limit),
            total: albums.length,
            offset,
            limit
          }
        };
      })
    );
  }

  // Obtener álbumes de un artista por su ID
  getAlbumsByArtist(
    artistId: number,
    offset: number,
    limit: number
  ): Observable<any> {

    const params = new HttpParams()
      .set('id', artistId.toString())
      .set('entity', 'album')
      .set('country', 'US')
      .set('limit', '200');

    return this.http.get<any>(this.lookupUrl, { params }).pipe(
      map(response => {
        const albums = (response.results || [])
          .filter((item: any) =>
            item.wrapperType === 'collection' &&
            item.collectionType === 'Album' &&
            item.collectionId &&
            item.collectionName &&
            item.trackCount > 1
          )
          .map((item: any) => this.formatAlbum(item));

        return {
          albums: {
            items: albums.slice(offset, offset + limit),
            total: albums.length,
            offset,
            limit
          }
        };
      })
    );
  }

  // Obtener novedades musicales
  getAlbumsAiring(): Observable<any> {
    return this.getAlbumsByName('new music', 0, 24);
  }

  // Obtener un álbum específico por ID
  getAlbumById(id: number): Observable<any> {

    const params = new HttpParams()
      .set('id', id.toString())
      .set('entity', 'song')
      .set('country', 'US');

    return this.http.get<any>(this.lookupUrl, { params }).pipe(
      map(response => {
        const album = (response.results || []).find(
          (item: any) =>
            item.wrapperType === 'collection' &&
            item.collectionType === 'Album'
        );

        return album ? this.formatAlbum(album) : null;
      })
    );
  }

  // Adaptar el formato de Apple al que utiliza tu componente
  private formatAlbum(item: any): any {

    let image = item.artworkUrl100 || '';

    if (image) {
      image = image.replace('100x100bb', '600x600bb');
    }

    return {
      id: item.collectionId,
      name: item.collectionName || '',
      artists: [
        {
          name: item.artistName || 'Artista desconocido'
        }
      ],
      images: [
        {
          url: image
        }
      ],
      release_date: item.releaseDate
        ? item.releaseDate.substring(0, 10)
        : null,
      album_type: 'album',
      total_tracks: item.trackCount || 0,
      genres: item.primaryGenreName
        ? [item.primaryGenreName]
        : [],
      external_urls: {
        itunes: item.collectionViewUrl || ''
      }
    };
  }
}