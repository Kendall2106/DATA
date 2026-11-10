// data.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc, where, query } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    typeData: any;

    firestore: Firestore = inject(Firestore);
    private authService = inject(AuthService);

    constructor(private http: HttpClient) { }

    async getSettings(): Promise<any> {
        const acollection = collection(this.firestore, 'settings');
        const uid = await this.authService.getUid();
        const querySnapshot = await getDocs(query(acollection, where('userId', '==', uid)));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async updateSettings(documentId: string, data: any): Promise<void> {
        const documentRef = doc(this.firestore, `settings/${documentId}`);
        await updateDoc(documentRef, data);
    }


}