import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiAnimeService {
  private apiUrl = 'https://api.jikan.moe/v4/anime'; 

  constructor(private http: HttpClient) {}

  getGenres(){
    const url = `https://api.jikan.moe/v4/genres/anime`;
    return this.http.get(url); 
  }

  getAnimeByPage(page:number){
    const url = `${this.apiUrl}?page=${page}&order_by=score&sort=desc&limit=24`;
    return this.http.get(url);  
  }

  getAnimeAiring(){
    const url = `${this.apiUrl}?status=airing&order_by=popularity&limit=24`;
    return this.http.get(url);  
  }
  
  searchAnimesByName(name: string, page: number) {
    const url = `${this.apiUrl}?q=${name}&page=${page}&limit=24`;
    return this.http.get(url);
  }

 /* getAnimeByRange(){
    const url = `${this.apiUrl}?min_score=9`;
    return this.http.get(url);  
  }*/

  getAnimeByGenre(genre: number, page:number){
    const url = `${this.apiUrl}?genres=${genre}&page=${page}&order_by=score&sort=desc&limit=24`;
    return this.http.get(url); 
  }




}