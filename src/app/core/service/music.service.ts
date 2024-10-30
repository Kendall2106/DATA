import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Anime } from '../model/anime.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getMusic(): Promise<any> {
    const acollection = collection(this.firestore,'music');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createMusic(movie: Anime){
    const acollection = collection(this.firestore,'music');
    addDoc(acollection,{
        'name' : movie.name,
        'date' : movie.date,
        'score' : movie.score,
        'image' : movie.image,
        'visible' : true
    });
  }

  async loadNumMusic(): Promise<Number>{
    const acollection = collection(this.firestore,'music');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.length;
  }

  async deleteMusic(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `music/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateMusic(documentId: string, score: number): Promise<void> {
    const documentRef = doc(this.firestore, `music/${documentId}`);
    await updateDoc(documentRef, { score: score });
  }

  
}