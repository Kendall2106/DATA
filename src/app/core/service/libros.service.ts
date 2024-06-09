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

  async deleteBook(documentId: string): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await deleteDoc(documentRef);
  }

  async updateBook(documentId: string, score: number): Promise<void> {
    const documentRef = doc(this.firestore, `books/${documentId}`);
    await updateDoc(documentRef, { score: score });
  }

 /* getLibros(): Observable<any[]> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map((xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const object = xmlDoc.querySelectorAll('libro');

        return Array.from(object).map(obj => {
          const id = obj.querySelector('id');
          const name = obj.querySelector('name');
          const date = obj.querySelector('date');
          const score = obj.querySelector('score');
          const type = obj.querySelector('type');
          const numTemp = obj.querySelector('numTemp');
          const image = obj.querySelector('image');
          const visible = obj.querySelector('visible');
        
          return {
            id: id ? id.textContent : '',
            name: name ? name.textContent : '',
            date: date ? date.textContent : '',
            score: score ? score.textContent : '',
            type: type ? type.textContent : '',
            numTemp: numTemp ? numTemp.textContent : '',
            image: image ? image.textContent : '',
            visible: visible ? visible.textContent : ''
          };
        });
      })
    );
  }*/
}