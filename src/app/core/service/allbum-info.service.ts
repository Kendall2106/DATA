import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Book } from '../model/book.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumInfoService {

  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getInfoAlbums(idAlbum: any): Promise<any> {
  const acollection = collection(this.firestore, 'infoAlbums');

  const q = query(acollection, where('idAlbum', '==', idAlbum));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async watch(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `infoAlbums/${documentId}`);
    await updateDoc(documentRef, data);
  }
/*
  async createBook(data: Book){
    const acollection = collection(this.firestore,'books');
    addDoc(acollection,{
        'name' : data.name,
        'date' : data.date,
        'score' : data.score,
        'type' : data.type,
        'image' : data.image,
        'visible' : true,
        'author': data.author,
        'kind' : data.kind,
        'review' : data.review ?? '',
    });
  }

  async loadNumBooks(): Promise<Number>{
    const acollection = collection(this.firestore,'books');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.size;
  }

  async deleteBook(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateBook(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await updateDoc(documentRef, data);
  }
*/



}