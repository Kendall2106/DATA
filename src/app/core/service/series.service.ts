import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Serie } from '../model/serie.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private xmlUrl = 'assets/data/series.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getCategoriesShow(): Promise<any> {
    const acollection = collection(this.firestore,'categoriesShow');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getSeries(): Promise<any> {
    const acollection = collection(this.firestore,'series');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createSeries(serie: Serie){
    const acollection = collection(this.firestore,'series');
    addDoc(acollection,{
        'name' : serie.name,
        'date' : serie.date,
        'score' : serie.score,
        'type' : serie.type,
        'image' : serie.image,
        'releaseDate' : serie.releaseDate,
        'visible' : true
    });
  }

  async loadNumSeries(): Promise<Number>{
    const acollection = collection(this.firestore,'series');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.size;
  }

  async deleteSerie(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `series/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateSerie(documentId: string, type: string): Promise<void> {
    const documentRef = doc(this.firestore, `series/${documentId}`);
    await updateDoc(documentRef, { type: type });
  }


}