import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiBookService {
  private API_URL = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  getBooks(startIndex: number, maxResults: number): Observable<any> {
    return this.http.get(`${this.API_URL}?q=""+subject:fantasy&startIndex=${startIndex}&maxResults=24&printType=books`);
  }

  getBooksByName(name: string) {
    const url = `${this.API_URL}?q=${name}&maxResults=24&printType=books`;
    return this.http.get(url);
  }

  getBooksByNew() {
    const url = `${this.API_URL}?q=""+subject:fantasy&maxResults=24&printType=books&orderBy=newest`;
    return this.http.get(url);
  }

  



}