import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Game } from '../model/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private xmlUrl = 'assets/data/games.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas

  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getGames(): Promise<any> {
    const acollection = collection(this.firestore,'games');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createGames(data: Game){
    const acollection = collection(this.firestore,'games');
    addDoc(acollection,{
        'name' : data.name,
        'date' : data.date,
        'score' : data.score,
        'type' : null,
        'image' : data.image,
        'achievements': false,
        'visible' : true
    });
  }

  async loadNumGames(): Promise<Number>{
    const acollection = collection(this.firestore,'games');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.size;
  }

  async deleteGames(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `games/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateGames(documentId: string, rd: number): Promise<void> {
    const documentRef = doc(this.firestore, `games/${documentId}`);
    await updateDoc(documentRef, { releaseDate: rd });
  }



}