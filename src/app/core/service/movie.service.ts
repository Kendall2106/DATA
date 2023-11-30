import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private xmlUrl = 'assets/data/movies.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas

  constructor(private http: HttpClient) {}

  getMovies(): Observable<any[]> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map((xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const object = xmlDoc.querySelectorAll('movie');

        return Array.from(object).map(obj => {
          const id = obj.querySelector('id');
          const name = obj.querySelector('name');
          const date = obj.querySelector('date');
          const score = obj.querySelector('score');
          const type = obj.querySelector('type');
          const image = obj.querySelector('image');
          const visible = obj.querySelector('visible');
        
          return {
            id: id ? id.textContent : '',
            name: name ? name.textContent : '',
            date: date ? date.textContent : '',
            score: score ? score.textContent : '',
            type: type ? type.textContent : '',
            image: image ? image.textContent : '',
            visible: visible ? visible.textContent : ''
          };
        });
      })
    );
  }
}