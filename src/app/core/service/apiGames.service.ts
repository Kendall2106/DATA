import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiGamesService {

  private proxyUrl = 'https://igdb-proxy.data-igdb.workers.dev/';

  constructor(private http: HttpClient) {}

  private consultarIGDB(
    endpoint: string,
    body: string
  ): Observable<any[]> {

    const urlIGDB = `https://api.igdb.com/v4/${endpoint}`;

    const params = new URLSearchParams({
      url: urlIGDB
    });

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      'Accept': 'application/json'
    });

    return this.http.post<any[]>(
      `${this.proxyUrl}?${params.toString()}`,
      body,
      { headers }
    );
  }

  getGames(offset: number, limit: number): Observable<any[]> {
    const body = `
      fields id, name, summary, rating, first_release_date,
      cover.url, platforms.abbreviation, created_at;
      sort rating_count desc;
      where rating_count > 50;
      limit ${limit};
      offset ${offset};
    `;

    return this.consultarIGDB('games', body);
  }

  searchGames(
    term: string,
    offset: number,
    limit: number
  ): Observable<any[]> {

    const safeTerm = term
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"');

    const body = `
      fields id, name, summary, rating, first_release_date,
      cover.url, platforms.abbreviation, created_at;
      search "${safeTerm}";
      limit ${limit};
      offset ${offset};
    `;

    return this.consultarIGDB('games', body);
  }

  getAllPlataform(): Observable<any[]> {
    const body = `
      fields id, name;
      limit 500;
    `;

    return this.consultarIGDB('genres', body);
  }

  getGamesByGenre(
    genreId: number,
    offset: number,
    limit: number
  ): Observable<any[]> {

    const body = `
      fields id, name, summary, rating, first_release_date,
      cover.url, platforms.abbreviation, created_at;
      where genres = ${genreId};
      sort rating_count desc;
      limit ${limit};
      offset ${offset};
    `;

    return this.consultarIGDB('games', body);
  }
}
