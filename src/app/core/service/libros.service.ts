import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Book } from '../model/book.model';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private xmlUrl = 'assets/data/libros.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas

  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  async getBook(): Promise<any> {
    const acollection = collection(this.firestore,'books');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createBook(data: Book){
    const acollection = collection(this.firestore,'books');
    addDoc(acollection,{
        'name' : data.name,
        'date' : data.date,
        'score' : data.score,
        'type' : data.type,
        'image' : data.image,
        'visible' : true
    });
  }

  async loadNumBooks(): Promise<Number>{
    const acollection = collection(this.firestore,'books');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.length;
  }

  async deleteBook(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateBook(documentId: string, score: number): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await updateDoc(documentRef, { score: score });
  }


}