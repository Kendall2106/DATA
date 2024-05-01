import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiAnimeService {
  private apiUrl = 'https://api.jikan.moe/v4/anime'; 

  constructor(private http: HttpClient) {}

  getAnimeByPage(page:number){
    const url = `${this.apiUrl}?page=${page}&limit=24`;
    return this.http.get(url);  
  }

  getAnimeAiring(){
    const url = `${this.apiUrl}?status=airing&order_by=popularity`;
    return this.http.get(url);  
  }
  
  searchAnimesByName(name: string, page: number) {
    const url = `${this.apiUrl}?q=${name}&page=${page}`;
    return this.http.get(url);
  }

  getAnimeByRange(){
    const url = `${this.apiUrl}?min_score=4`;
    return this.http.get(url);  
  }



}