import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiBookService {
  private API_URL = 'https://www.googleapis.com/books/v1/volumes';
private API_KEY = 'AIzaSyDroAOHJga-Luumr1O7RZjOdppHo9DS7Sk';

constructor(private http: HttpClient) {}

getBooks(startIndex: number, maxResults: number): Observable<any> {
  const url = `${this.API_URL}?q=subject:fantasy&startIndex=${startIndex}&maxResults=${maxResults}&printType=books&key=${this.API_KEY}`;
  return this.http.get(url);
}

getBooksByName(name: string, startIndex: number): Observable<any> {
  const url = `${this.API_URL}?q=${encodeURIComponent(name)}&startIndex=${startIndex}&maxResults=24&printType=books&key=${this.API_KEY}`;
  return this.http.get(url);
}

getBooksByNew(): Observable<any> {
  const url = `${this.API_URL}?q=subject:fantasy&maxResults=24&printType=books&orderBy=newest&key=${this.API_KEY}`;
  return this.http.get(url);
}
  



}