import { Injectable, inject } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Firestore, getDocs } from '@angular/fire/firestore';
import { addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class Servicios {
  firestore: Firestore = inject(Firestore);
  saveData():void{
    const acollection = collection(this.firestore,'students');
    addDoc(acollection,{
        'name' : 'Maria'
    });
}


async daata(): Promise<any> {
  const acollection = collection(this.firestore,'students');
  const querySnapshot = await getDocs(acollection);
  return querySnapshot.docs.map(doc => doc.data());
}



}