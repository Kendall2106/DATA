import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, getCountFromServer, updateDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Game } from '../model/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private xmlUrl = 'assets/data/games.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas

  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private cache: any[] | null = null;
  private cacheUid: string = '';

  constructor(private http: HttpClient) {}

  async getCategoriesGame(): Promise<any> {
    const acollection = collection(this.firestore,'categoriesGame');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getGames(): Promise<any> {
    const acollection = collection(this.firestore,'games');
    const uid = await this.authService.getUid();
    if (this.cache && this.cacheUid === uid) {
      return this.cache.map(item => ({ ...item }));
    }
    const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
    this.cache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.cacheUid = uid;
    return this.cache.map(item => ({ ...item }));
  }


  async createGames(data: Game){
    console.log(data);
    const acollection = collection(this.firestore,'games');
    const uid = await this.authService.getUid();
    this.cache = null;
    addDoc(acollection,{
        'userId' : uid,
        'name' : data.name,
        'date' : data.date,
        'score' : data.score,
        'type' : data.type,
        'image' : data.image,
        'achievements': (data as any).achievements ?? false,
        'visible' : true,
        'releaseDate': data.releaseDate,
        'review' : data.review ?? '',
    }).then(() => { this.cache = null; });
  }

  async loadNumGames(): Promise<Number>{
    const acollection = collection(this.firestore,'games');
    const uid = await this.authService.getUid();
    const snapshot = await getCountFromServer(query(acollection, where('userId', '==', uid)));
    return snapshot.data().count;
  }

  async deleteGames(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `games/${documentId}`);
    await deleteDoc(documentRef);
    this.cache = null;
  }

  async updateGames(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `games/${documentId}`);
    await updateDoc(documentRef, data);
    this.cache = null;
  }

 



}