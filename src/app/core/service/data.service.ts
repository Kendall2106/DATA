// data.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, where, query, writeBatch } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  typeData: any;

  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  
    constructor(private http: HttpClient) {}
  
    async getCollection(): Promise<any> {
      const acollection = collection(this.firestore,'colecciones');
      const uid = await this.authService.getUid();
      const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getAlbums(): Promise<any> {
      const acollection = collection(this.firestore,'albums');
      const uid = await this.authService.getUid();
      const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getAlbumById(albumId: string): Promise<any> {
    const snapshot = await getDoc(doc(this.firestore, `albums/${albumId}`));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  // Elimina el album y todas sus postales (infoAlbums)
  async deleteAlbum(albumId: string): Promise<void> {
    const uid = await this.authService.getUid();
    const postales = await getDocs(query(collection(this.firestore, 'infoAlbums'),
      where('userId', '==', uid), where('idAlbum', '==', albumId)));

    const docs = postales.docs;
    for (let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(this.firestore);
      docs.slice(i, i + 400).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }

    await deleteDoc(doc(this.firestore, `albums/${albumId}`));
  }

  async createAlbum(album: any){
    const acollection = collection(this.firestore,'albums');
    const uid = await this.authService.getUid();
    await addDoc(acollection,{
      'userId' : uid,
      'name' : album.name,
      'image' : album.image
    });
  }

  async createinfoAlbums(movie: any){
      const acollection = collection(this.firestore,'infoAlbums');
      const uid = await this.authService.getUid();
      addDoc(acollection,{
          'userId' : uid,
          'idAlbum' : movie.id,
          'name' : movie.name,
          'image' : movie.image,
          'watched' : false
      });
    }

  async getByMarca(coll: string) {
    const collections = ['animes', 'books', 'games', 'movies', 'music', 'series'];
    const results: any[] = [];
    const uid = await this.authService.getUid();

    for (const colName of collections) {
      const colRef = collection(this.firestore, colName);
      const q = query(colRef, where('userId', '==', uid), where('collection', '==', coll));
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