import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, addDoc, collection, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
 
  firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {}



  async getImages(family: string): Promise<any> {
    const acollection = collection(this.firestore, 'images');
    const q = query(
      acollection,
      where('family', '==', family),
      orderBy('date', 'desc') 
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }



  async addImages(image: any, family: string){
    const acollection = collection(this.firestore,'images');
    addDoc(acollection,{
        'image' : image,
        'family' : family,
        'date' : new Date()
    });
  }


}