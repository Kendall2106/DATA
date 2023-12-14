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
  /*querySnapshot.forEach((doc) => {
    const data = doc.data();
    //console.log('Nombre:', data);
    return data;
  });*/
 // console.log(querySnapshot.docs);
 // return acollection;
}



/*
  obtenerTarjetas(): Observable<any> {
    return this.firestore.collection('tarjetas', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }

  eliminarTarjeta(id: string): Promise<any> {
    return this.firestore.collection('tarjetas').doc(id).delete();
  }

  editarTarjeta(id: string, tarjeta: any): Promise<any> {
    return this.firestore.collection('tarjetas').doc(id).update(tarjeta);
  }

  addTarjetaEdit(tarjeta: TarjetaCredito) {
    this.tarjeta$.next(tarjeta);
  }

  getTarjetaEdit(): Observable<TarjetaCredito> {
    return this.tarjeta$.asObservable();
  }*/
}