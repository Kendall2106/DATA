import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, getDocs } from '@angular/fire/firestore';
import { Anime } from '../model/anime.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private xmlUrl = 'assets/data/animes.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getAnimes(): Promise<any> {
    const acollection = collection(this.firestore,'animes');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async createAnimes(movie: Anime){
    const acollection = collection(this.firestore,'animes');
    addDoc(acollection,{
        'name' : movie.name,
        'date' : movie.date,
        'score' : movie.score,
        'type' : movie.type,
        'image' : movie.image,
        'visible' : true
    });
  }

  /*getAnimes(): Observable<any[]> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map((xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const object = xmlDoc.querySelectorAll('anime');

        return Array.from(object).map(obj => {
          const id = obj.querySelector('id');
          const name = obj.querySelector('name');
          const date = obj.querySelector('date');
          const score = obj.querySelector('score');
          const type = obj.querySelector('type');
          const numTemp = obj.querySelector('numTemp');
          const image = obj.querySelector('image');
          const visible = obj.querySelector('visible');
        
          return {
            id: id ? id.textContent : '',
            name: name ? name.textContent : '',
            date: date ? date.textContent : '',
            score: score ? score.textContent : '',
            type: type ? type.textContent : '',
            numTemp: numTemp ? numTemp.textContent : '',
            image: image ? image.textContent : '',
            visible: visible ? visible.textContent : ''
          };
        });
      })
    );
  }*/
}