import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, addDoc, collection, getDocs } from '@angular/fire/firestore';
import { Game } from '../model/game.model';

@Injectable({
  providedIn: 'root'
})
export class RecoService {
  private xmlUrl = 'assets/data/games.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas

  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getReco(): Promise<any> {
    const acollection = collection(this.firestore,'recomendacion');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async createReco(nameReco: any, tipo:any){
    const acollection = collection(this.firestore,'recomendacion');
    addDoc(acollection,{
        'name' : nameReco,
        'type' : tipo,
    });
  }
}