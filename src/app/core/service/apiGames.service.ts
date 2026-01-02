import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiGamesService {
  /*private apiUrl = 'https://video-games-api2.p.rapidapi.com/games';
  private apiKey = '1b43d6d217msh5679d2090715dc5p1ade91jsn74e967e5c2a7';
  private host = 'video-games-api2.p.rapidapi.com';*/

  private apiUrl = 'https://igdb-proxy.data-igdb.workers.dev';

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'text/plain'
  });

  // 🔹 Obtener juegos (listado)
  getGames(offset: number, limit: number): Observable<any[]> {
    const body = `
      fields id, name, summary, rating, first_release_date, cover.url,platforms.abbreviation,created_at;
      sort rating_count desc;
      where rating_count > 50;
      limit ${limit};
      offset ${offset};
    `;

    // 🔹 Si tu proxy requiere headers, los puedes poner así
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    //return this.http.post<any[]>(this.apiUrl, body, { headers });
    return this.http.post<any[]>(
      `${this.apiUrl}?endpoint=games`,
      body
    );
  }



  /*
    getGames(page: number): Observable<any> {
      const url = `${this.apiUrl}`;
      const headers = new HttpHeaders({
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host
        });
  
      return this.http.get(url, { headers});
    }*/

  searchGames(term: string, offset: number, limit: number): Observable<any[]> {
    const body = `
      fields id, name, summary, rating, first_release_date, cover.url,platforms.abbreviation,created_at;
      search "${term}";
      limit ${limit};
      offset ${offset};
    `;

    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    //return this.http.post<any[]>(this.apiUrl, body, { headers });
    return this.http.post<any[]>(
      `${this.apiUrl}?endpoint=games`,
      body
    );
  }

  getAllPlataform(): Observable<any> {
    const body = `
      fields id, name;
      limit 500;
    `;

    return this.http.post<any[]>(
      `${this.apiUrl}?endpoint=genres`,
      body
    );
  }

  getGamesByGenre(genreId: number, offset: number, limit: number): Observable<any[]> {
  const body = `
    fields id, name, summary, rating, first_release_date, cover.url,platforms.abbreviation,created_at;
    where genres = ${genreId};
    sort rating_count desc;
    limit ${limit};
    offset ${offset};
  `;

  return this.http.post<any[]>(
    `${this.apiUrl}?endpoint=games`,
    body
  );
}

  /*
    seachGames(title: string, page: number): Observable<any> {
      const url = `${this.apiUrl}/title-search?title=${title}&page=${page}`;
      const headers = new HttpHeaders({
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': this.host
        });
  
      return this.http.get(url, { headers});
    }
  
  
  
    getGamesByPlataform(plataformName: string, page: number): Observable<any> {
      const url = `${this.apiUrl}/by-platform/${plataformName}?page=${page}`;
      const headers = new HttpHeaders({
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host
        });
  
      return this.http.get(url, { headers});
    }
  
    getAllPlataform(): Observable<any> {
      const url = `https://video-games-api2.p.rapidapi.com/platform/all`;
      const headers = new HttpHeaders({
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host
        });
  
      return this.http.get(url, { headers});
    }
  */
}