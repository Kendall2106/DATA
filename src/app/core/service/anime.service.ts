import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, getCountFromServer, updateDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Anime } from '../model/anime.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private xmlUrl = 'assets/data/animes.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private cache: any[] | null = null;
  private cacheUid: string = '';

  constructor(private http: HttpClient) {}

  async getCategoriesAnime(): Promise<any> {
    const acollection = collection(this.firestore,'categoriesAnime');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getAnimes(): Promise<any> {
    const acollection = collection(this.firestore,'animes');
    const uid = await this.authService.getUid();
    if (this.cache && this.cacheUid === uid) {
      return this.cache.map(item => ({ ...item }));
    }
    const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
    this.cache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.cacheUid = uid;
    return this.cache.map(item => ({ ...item }));
  }


  async createAnimes(movie: Anime){
    const acollection = collection(this.firestore,'animes');
    const uid = await this.authService.getUid();
    this.cache = null;
    addDoc(acollection,{
        'userId' : uid,
        'name' : movie.name,
        'date' : movie.date,
        'score' : movie.score,
        'type' : movie.type ?? '',
        'image' : movie.image,
        'releaseDate' : movie.releaseDate ?? '',
        'visible' : true,
        'review' : movie.review ?? '',
    }).then(() => { this.cache = null; });
  }

  async loadNumAnimes(): Promise<Number>{
    const acollection = collection(this.firestore,'animes');
    const uid = await this.authService.getUid();
    const snapshot = await getCountFromServer(query(acollection, where('userId', '==', uid)));
    return snapshot.data().count;
  }

  async deleteAnime(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `animes/${documentId}`);
    await deleteDoc(documentRef);
    this.cache = null;
  }

  async updateSeasonAnime(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `animes/${documentId}`);
    await updateDoc(documentRef, data);
    this.cache = null;
  }

 
 
}