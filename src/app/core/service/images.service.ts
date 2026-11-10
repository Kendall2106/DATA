import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, addDoc, collection, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
 
  firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {}



  async getImages(family: string): Promise<any> {
    const acollection = collection(this.firestore, 'images');
    const uid = await this.authService.getUid();
    const q = query(
      acollection,
      where('userId', '==', uid),
      where('family', '==', family),
      orderBy('date', 'desc') 
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }



  async addImages(image: any, family: string){
    const acollection = collection(this.firestore,'images');
    const uid = await this.authService.getUid();
    addDoc(acollection,{
        'userId' : uid,
        'image' : image,
        'family' : family,
        'date' : new Date()
    });
  }


}