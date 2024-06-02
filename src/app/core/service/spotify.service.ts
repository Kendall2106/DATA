// spotify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = "9998ee121c5f4a079c5ff6deb08d173b";
  private clientSecret = "594499dbcc5e4ee7b446e9171ac8536e";

  constructor(private http: HttpClient) { }


  private apiUrl = 'https://api.spotify.com/v1/search?';
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  
  getToken(): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
    });

    const body = 'grant_type=client_credentials';

    return this.http.post<any>(this.tokenUrl, body, { headers: headers }).pipe(
      switchMap(response => {
        return response.access_token ? of(response.access_token) : throwError('No se recibió un token de acceso.');
      })
    );
  }
  

  getAlbums(offset: number, limit: number): Observable<any> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        });

        const genre = "pop";

        const params = {
            query: 'genre%reggaeton',
            type: 'album',
            limit: limit,
            offset: offset
          };
         // const url = "https://api.spotify.com/v1/search?q=genre%reggaeton&type=album";
          return this.http.get(this.apiUrl, { headers, params});

      })
    );
  }


  getAlbumsByName(title: string, limit: number): Observable<any> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        });
        const params = {
            query: title,
            type: 'album',
            limit: limit,
            offset: 0
          };
          return this.http.get(this.apiUrl, { headers, params});

      })
    );
  }

  getAlbumsAiring(){
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        });
        const params = {
            query: 'genre%reggaeton',
            type: 'artist',
            limit: 24,
            offset: 0
          };
          return this.http.get(this.apiUrl, { headers, params});

      })
    );
  }
  

}