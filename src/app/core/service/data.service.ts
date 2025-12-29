// data.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc, where, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  typeData: any;

  firestore: Firestore = inject(Firestore);
  
    constructor(private http: HttpClient) {}
  
    async getCollection(): Promise<any> {
      const acollection = collection(this.firestore,'colecciones');
      const querySnapshot = await getDocs(acollection);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getByMarca(coll: string) {
    const collections = ['animes', 'books', 'games', 'movies', 'music', 'series'];
    const results: any[] = [];

    for (const colName of collections) {
      const colRef = collection(this.firestore, colName);
      const q = query(colRef, where('collection', '==', coll));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data(),
          collection: colName // 🔹 Para saber de dónde vino
        });
      });
    }

    return results;
  }

  
}