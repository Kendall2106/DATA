import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, getDocs } from '@angular/fire/firestore';
import { Movie } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private xmlUrl = 'assets/data/movies.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  /*getMovies(): Observable<any[]> {
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
  }*/

  async getMovies(): Promise<any> {
    const acollection = collection(this.firestore,'movies');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async createMovies(movie: Movie){
    const acollection = collection(this.firestore,'movies');
    addDoc(acollection,{
        'name' : movie.name,
        'date' : movie.date,
        'score' : movie.score,
        'type' : movie.type,
        'image' : movie.image,
        'visible' : true
    });
  }



 /* async  getMovies(): Promise<any> {
    const acollection = collection(this.firestore, 'movies');
    const querySnapshot = await getDocs(acollection);
  
    const movies: Movie[] = querySnapshot.docs.map((doc) => {
      const movieData: Movie = doc.data() as Movie;
  
      // Verificar si el campo 'date' está presente y es una fecha válida
     /* if (movieData.date instanceof Date && !isNaN(movieData.date.getTime())) {
        // Formatear la fecha como día/mes/año
        const formattedDate = `${movieData.date.getDate()}/${movieData.date.getMonth() + 1}/${movieData.date.getFullYear()}`;
  
        // Devolver los datos con la fecha formateada
        return { ...movieData, formattedDate };
      }

      /*movieData.date = `${movieData.date.getDate()}/${movieData.date.getMonth() + 1}/${movieData.date.getFullYear()}`;
      
     
      // Si no hay un campo 'date' o no es una fecha válida, devolver los datos sin cambios
      return movieData;
    });
  
    return movies;
  }*/
  
  
}