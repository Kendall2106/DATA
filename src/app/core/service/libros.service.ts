import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, addDoc, collection, deleteDoc, deleteField, doc, getDocs, getCountFromServer, updateDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Book } from '../model/book.model';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private xmlUrl = 'assets/data/libros.xml'; // Ruta al archivo XML, ajusta según tu estructura de carpetas

  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private cache: any[] | null = null;
  private cacheUid: string = '';

  constructor(private http: HttpClient) {}

  async getCategoriesBook(): Promise<any> {
    const acollection = collection(this.firestore,'categoriesBook');
    const querySnapshot = await getDocs(acollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getBook(): Promise<any> {
    const acollection = collection(this.firestore,'books');
    const uid = await this.authService.getUid();
    if (this.cache && this.cacheUid === uid) {
      return this.cache.map(item => ({ ...item }));
    }
    const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
    this.cache = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.cacheUid = uid;
    return this.cache.map(item => ({ ...item }));
  }

  async createBook(data: any){
    const acollection = collection(this.firestore,'books');
    const uid = await this.authService.getUid();
    this.cache = null;
    addDoc(acollection,{
        'userId' : uid,
        'name' : data.name,
        'date' : data.date,
        'score' : data.score,
        'type' : data.type,
        'image' : data.image,
        'visible' : true,
        'author': data.author ?? '',
        'kind' : data.kind ?? '',
        'review' : data.review ?? '',
    }).then(() => { this.cache = null; });
  }

  async loadNumBooks(): Promise<Number>{
    const acollection = collection(this.firestore,'books');
    const uid = await this.authService.getUid();
    const snapshot = await getCountFromServer(query(acollection, where('userId', '==', uid)));
    return snapshot.data().count;
  }

  async deleteBook(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await deleteDoc(documentRef);
    this.cache = null;
  }

  async updateBook(documentId: string, data: any): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await updateDoc(documentRef, data);
    this.cache = null;
  }




}