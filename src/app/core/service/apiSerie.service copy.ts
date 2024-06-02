import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiSerieService {
    private apiUrl = 'https://api.themoviedb.org/3';
    private apiKey = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMWM2NjU1N2E4NjMwNDkyOTBmNmEwM2FmNWM3OTMxMCIsInN1YiI6IjY2NTdmOTcwNDNiNzk3M2U1YmE4ZGMzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xq7YDULdvUB62j3D7B25vmzEUCqkC8SMOCaeqQ2Dpx8';
   

  constructor(private http: HttpClient) {}

  getSeries(page:number): Observable<any> {
    const url = `${this.apiUrl}/discover/tv?page=${page}`;
    const headers = new HttpHeaders({
        'Content-Type': '"accept", "application/json"',
        'Authorization': this.apiKey
      });

    return this.http.get(url, { headers});
  }

  seachSeries(title: string): Observable<any> {
    const url = `${this.apiUrl}/search/tv?query=${title}`;
    const headers = new HttpHeaders({
        'Content-Type': '"accept", "application/json"',
        'Authorization': this.apiKey
      });

    return this.http.get(url, { headers});
  }

  getSeriesAiring(gte: string, lte: string){
    const url = `${this.apiUrl}/discover/tv?first_air_date.gte=${gte}&first_air_date.lte=${lte}&sort_by=popularity.desc`;
    const headers = new HttpHeaders({
      'Content-Type': '"accept", "application/json"',
      'Authorization': this.apiKey
    });
    return this.http.get(url, { headers});
  }


}