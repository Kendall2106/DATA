import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
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
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createReco(reco: any, tipo:any){
    const acollection = collection(this.firestore,'recomendacion');
    if(tipo == 'Books'){
      addDoc(acollection,{
        'name' : reco.name,
        'date' : reco.date,
        'image' : reco.image,
        'visible' : true,
        'liked' : false,
        'type' : tipo,
        'releaseDate' : reco.releaseDate,
        'randomData' : reco.randomData,
        'author': reco.author
    });
    }else{
      addDoc(acollection,{
        'name' : reco.name,
        'date' : reco.date,
        'image' : reco.image,
        'visible' : true,
        'liked' : false,
        'type' : tipo,
        'releaseDate' : reco.releaseDate,
        'randomData' : reco.randomData,
    });
    }

  }

  async updateReco(documentId: string, season: boolean): Promise<void> {
    const documentRef = doc(this.firestore, `recomendacion/${documentId}`);
    await updateDoc(documentRef, { season: season });
  }

  async deleteReco(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `recomendacion/${documentId}`);
    await deleteDoc(documentRef);
  }
}