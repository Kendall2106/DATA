import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiGamesService {
    private apiUrl = 'https://video-games-api2.p.rapidapi.com/games';
    private apiKey = '1b43d6d217msh5679d2090715dc5p1ade91jsn74e967e5c2a7';
    private host = 'video-games-api2.p.rapidapi.com';

  constructor(private http: HttpClient) {}

  getGames(page: number): Observable<any> {
    const url = `${this.apiUrl}/all?page=${page}`;
    const headers = new HttpHeaders({
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': this.host
      });

    return this.http.get(url, { headers});
  }

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

}