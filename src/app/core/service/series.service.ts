import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, getCountFromServer, updateDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Serie } from '../model/serie.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private xmlUrl = 'assets/data/series.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas
  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private cache: any[] | null = null;
  private cacheUid: string = '';

  constructor(private http: HttpClient) {}

  async getCategoriesShow(): Promise<any> {
    const acollection = collection(this.firestore,'categoriesShow');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getSeries(): Promise<any> {
    const acollection = collection(this.firestore,'series');
    const uid = await this.authService.getUid();
    if (this.cache && this.cacheUid === uid) {
      return this.cache.map(item => ({ ...item }));
    }
    const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
    this.cache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.cacheUid = uid;
    return this.cache.map(item => ({ ...item }));
  }

  async createSeries(serie: Serie){
    const acollection = collection(this.firestore,'series');
    const uid = await this.authService.getUid();
    this.cache = null;
    addDoc(acollection,{
        'userId' : uid,
        'name' : serie.name,
        'date' : serie.date,
        'score' : serie.score,
        'type' : serie.type,
        'image' : serie.image,
        'releaseDate' : serie.releaseDate,
        'visible' : true,
        'review' : serie.review ?? '',
    }).then(() => { this.cache = null; });
  }

  async loadNumSeries(): Promise<Number>{
    const acollection = collection(this.firestore,'series');
    const uid = await this.authService.getUid();
    const snapshot = await getCountFromServer(query(acollection, where('userId', '==', uid)));
    return snapshot.data().count;
  }

  async deleteSerie(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `series/${documentId}`);
    await deleteDoc(documentRef);
    this.cache = null;
  }

  async updateSerie(documentId: string, data: any): Promise<void> {
  const documentRef = doc(this.firestore, `series/${documentId}`);
  await updateDoc(documentRef, data);
  this.cache = null;
}

  


}