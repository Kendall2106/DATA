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

    private apiUrl = 'https://api.igdb.com/v4/games';

  private clientId = 'qt08e4erh16td3zsj2jqmdfwk3desf';
  private accessToken = 'uref3vgg1g1nobwwqpc34em0ok6izr';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json'
    });
  }

  // 🔹 Obtener juegos (listado)
  getGames(limit: number = 20, offset: number = 0): Observable<any[]> {
    const body = `
      fields id, name, summary, rating, first_release_date, cover.url;
      limit ${limit};
      offset ${offset};
    `;

    return this.http.post<any[]>(this.apiUrl, body, {
      headers: this.getHeaders()
    });
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