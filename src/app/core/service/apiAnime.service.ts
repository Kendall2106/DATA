import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiAnimeService {

  // Tenrai: API gratuita y sin llave con los datos de MyAnimeList. Es el sucesor de Jikan (que cerro el 1 de octubre de 2026)
  // y usa el mismo formato de respuesta, por eso solo cambia la direccion base
  private apiUrl = 'https://api.tenrai.org/v1';

  // Generos (IDs de MyAnimeList)
  private genres = [
    { mal_id: 1, name: 'Action' },
    { mal_id: 2, name: 'Adventure' },
    { mal_id: 4, name: 'Comedy' },
    { mal_id: 8, name: 'Drama' },
    { mal_id: 10, name: 'Fantasy' },
    { mal_id: 14, name: 'Horror' },
    { mal_id: 7, name: 'Mystery' },
    { mal_id: 22, name: 'Romance' },
    { mal_id: 24, name: 'Sci-Fi' },
    { mal_id: 36, name: 'Slice of Life' },
    { mal_id: 30, name: 'Sports' },
    { mal_id: 37, name: 'Supernatural' },
    { mal_id: 41, name: 'Suspense' },
    { mal_id: 13, name: 'Historical' },
    { mal_id: 18, name: 'Mecha' },
    { mal_id: 19, name: 'Music' },
    { mal_id: 23, name: 'School' },
    { mal_id: 27, name: 'Shounen' },
    { mal_id: 35, name: 'Harem' },
    { mal_id: 40, name: 'Psychological' },
    { mal_id: 42, name: 'Seinen' },
    { mal_id: 43, name: 'Josei' }
  ];

  constructor(private http: HttpClient) {}

  // Si la API responde 429 (demasiadas peticiones) o falla, reintenta hasta 2 veces
  private consultar(path: string, params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${path}`, {
      params: new HttpParams({ fromObject: params })
    }).pipe(
      retry({ count: 2, delay: 1200 })
    );
  }

  getGenres(): Observable<any> {
    return of({ data: this.genres });
  }

  getAnimeByPage(page: number): Observable<any> {
    return this.consultar('/top/anime', { page: page, limit: 24, sfw: true });
  }

  getAnimeAiring(): Observable<any> {
    return this.consultar('/top/anime', { filter: 'airing', limit: 24, sfw: true });
  }

  searchAnimesByName(name: string, page: number): Observable<any> {
    return this.consultar('/anime', { q: name, page: page, limit: 24, sfw: true });
  }

  getAnimeByGenre(genre: number, page: number): Observable<any> {
    return this.consultar('/anime', {
      genres: genre,
      order_by: 'score',
      sort: 'desc',
      page: page,
      limit: 24,
      sfw: true
    });
  }

}
