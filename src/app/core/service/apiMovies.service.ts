import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiMoviesService {
    private apiUrl = 'https://api.themoviedb.org/3';
    private apiKey = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMWM2NjU1N2E4NjMwNDkyOTBmNmEwM2FmNWM3OTMxMCIsInN1YiI6IjY2NTdmOTcwNDNiNzk3M2U1YmE4ZGMzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xq7YDULdvUB62j3D7B25vmzEUCqkC8SMOCaeqQ2Dpx8';
   




  constructor(private http: HttpClient) {}

  getMovies(page:number): Observable<any> {
    const url = `${this.apiUrl}/discover/movie?page=${page}`;
    const headers = new HttpHeaders({
        'Content-Type': '"accept", "application/json"',
        'Authorization': this.apiKey
      });

    return this.http.get(url, { headers});
  }

  seachMovies(title: string): Observable<any> {
    const url = `${this.apiUrl}/search/movie?query=${title}`;
    const headers = new HttpHeaders({
        'Content-Type': '"accept", "application/json"',
        'Authorization': this.apiKey
      });

    return this.http.get(url, { headers});
  }

  getMoviesAiring(gte: string, lte: string){
    const url = `${this.apiUrl}/discover/movie?primary_release_date.gte=${gte}&primary_release_date.lte=${lte}`;
    const headers = new HttpHeaders({
      'Content-Type': '"accept", "application/json"',
      'Authorization': this.apiKey
    });
    return this.http.get(url, { headers});
  }




}