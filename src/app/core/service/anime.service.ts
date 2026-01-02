import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Anime } from '../model/anime.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private xmlUrl = 'assets/data/animes.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getCategoriesAnime(): Promise<any> {
    const acollection = collection(this.firestore,'categoriesAnime');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getAnimes(): Promise<any> {
    const acollection = collection(this.firestore,'animes');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }


  async createAnimes(movie: Anime){
    const acollection = collection(this.firestore,'animes');
    addDoc(acollection,{
        'name' : movie.name,
        'date' : movie.date,
        'score' : movie.score,
        'type' : movie.type,
        'image' : movie.image,
        'releaseDate' : movie.releaseDate,
        'visible' : true,
        'review' : movie.review ?? '',
    });
  }

  async loadNumAnimes(): Promise<Number>{
    const acollection = collection(this.firestore,'animes');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.size;
  }

  async deleteAnime(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `animes/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateSeasonAnime(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `animes/${documentId}`);
    await updateDoc(documentRef, data);
  }

 
 
}