import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, getCountFromServer, updateDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Movie } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private xmlUrl = 'assets/data/movies.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private cache: any[] | null = null;
  private cacheUid: string = '';

  constructor(private http: HttpClient) {}

  async getMovies(): Promise<any> {
    const acollection = collection(this.firestore,'movies');
    const uid = await this.authService.getUid();
    if (this.cache && this.cacheUid === uid) {
      return this.cache.map(item => ({ ...item }));
    }
    const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
    this.cache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.cacheUid = uid;
    return this.cache.map(item => ({ ...item }));
  }

  async createMovies(movie: Movie){
    const acollection = collection(this.firestore,'movies');
    const uid = await this.authService.getUid();
    this.cache = null;
    addDoc(acollection,{
        'userId' : uid,
        'name' : movie.name,
        'date' : movie.date,
        'score' : movie.score,
        'type' : movie.type,
        'image' : movie.image,
        'visible' : true,
        'releaseDate': movie.releaseDate,
        'review' : movie.review ?? '',
    }).then(() => { this.cache = null; });
  }

  async loadNumMovies(): Promise<Number>{
    const acollection = collection(this.firestore,'movies');
    const uid = await this.authService.getUid();
    const snapshot = await getCountFromServer(query(acollection, where('userId', '==', uid)));
    return snapshot.data().count;
  }

  async deleteMovie(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `movies/${documentId}`);
    await deleteDoc(documentRef);
    this.cache = null;
  }

  async updateMovie(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `movies/${documentId}`);
    await updateDoc(documentRef, data);
    this.cache = null;
  }

   

  
}