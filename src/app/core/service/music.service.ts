import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, getCountFromServer, updateDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Music } from '../model/music.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private cache: any[] | null = null;
  private cacheUid: string = '';

  constructor(private http: HttpClient) {}

  async getMusic(): Promise<any> {
    const acollection = collection(this.firestore,'music');
    const uid = await this.authService.getUid();
    if (this.cache && this.cacheUid === uid) {
      return this.cache.map(item => ({ ...item }));
    }
    const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
    this.cache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.cacheUid = uid;
    return this.cache.map(item => ({ ...item }));
  }

  async createMusic(music: Music){
    const acollection = collection(this.firestore,'music');
    const uid = await this.authService.getUid();
    this.cache = null;
    addDoc(acollection,{
        'userId' : uid,
        'name' : music.name,
        'date' : music.date,
        'score' : music.score,
        'image' : music.image,
        'releaseDate' : music.releaseDate,
        'artist': music.artist,
        'visible' : true,
        'review' : music.review ?? '',
    }).then(() => { this.cache = null; });
  }

  async loadNumMusic(): Promise<Number>{
    const acollection = collection(this.firestore,'music');
    const uid = await this.authService.getUid();
    const snapshot = await getCountFromServer(query(acollection, where('userId', '==', uid)));
    return snapshot.data().count;
  }

  async deleteMusic(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `music/${documentId}`);
    await deleteDoc(documentRef);
    this.cache = null;
  }

  async updateMusic(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `music/${documentId}`);
    await updateDoc(documentRef, data);
    this.cache = null;
  }

   
}