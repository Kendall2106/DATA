import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Movie } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private xmlUrl = 'assets/data/movies.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getMovies(): Promise<any> {
    const acollection = collection(this.firestore,'movies');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  async loadNumMovies(): Promise<Number>{
    const acollection = collection(this.firestore,'movies');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.size;
  }

  async deleteMovie(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `movies/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateMovie(documentId: string, score: number): Promise<void> {
    const documentRef = doc(this.firestore, `movies/${documentId}`);
    await updateDoc(documentRef, { score: score });
  }



  
}