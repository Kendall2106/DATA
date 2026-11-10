import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, limit, query, setDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  private friendCache: { uid: string, username: string, photo: string } | null | undefined = undefined;
  private friendCacheUid: string = '';

  private collections: any = {
    Animes: 'animes',
    Movies: 'movies',
    Series: 'series',
    Books: 'books',
    Games: 'games',
    Music: 'music'
  };

  // Devuelve el amigo vinculado en tu perfil (o null si no hay)
  async getFriend(force: boolean = false): Promise<{ uid: string, username: string, photo: string } | null> {
    const uid = await this.authService.getUid();

    // La cache pertenece a un usuario: si cambias de cuenta no se reutiliza
    if (!force && this.friendCache !== undefined && this.friendCacheUid === uid) {
      return this.friendCache;
    }
    this.friendCacheUid = uid;

    try {
      const mine = await getDoc(doc(this.firestore, `profiles/${uid}`));
      const friendUid = mine.exists() ? (mine.data()['friendUid'] ?? '') : '';

      if (!friendUid || friendUid === uid) {
        this.friendCache = null;
        this.saveLocal(uid, null);
        return null;
      }

      const friend = await getDoc(doc(this.firestore, `profiles/${friendUid}`));
      const data: any = friend.exists() ? friend.data() : {};
      this.friendCache = {
        uid: friendUid,
        username: data['username'] ?? 'Amigo',
        photo: data['photo'] ?? ''
      };
      this.saveLocal(uid, this.friendCache);
      return this.friendCache;
    } catch (error) {
      // Sin conexion o con error: se usa el amigo guardado en este navegador
      console.error("Error al cargar el amigo:", error);
      this.friendCache = this.readLocal(uid);
      return this.friendCache;
    }
  }

  // El amigo vinculado se recuerda en el navegador hasta que lo quites
  private saveLocal(uid: string, friend: { uid: string, username: string, photo: string } | null) {
    try {
      if (friend) {
        localStorage.setItem('hobbies-friend', JSON.stringify({ owner: uid, friend }));
      } else {
        localStorage.removeItem('hobbies-friend');
      }
    } catch { }
  }

  private readLocal(uid: string): { uid: string, username: string, photo: string } | null {
    try {
      const stored = JSON.parse(localStorage.getItem('hobbies-friend') ?? 'null');
      return stored && stored.owner === uid ? stored.friend : null;
    } catch {
      return null;
    }
  }

  // Busca un perfil por usuario y lo guarda como tu amigo
  async linkByUsername(username: string): Promise<void> {
    const uid = await this.authService.getUid();
    const lower = username.trim().toLowerCase();
    if (!lower) {
      throw new Error('Escribe un usuario');
    }

    const snapshot = await getDocs(query(collection(this.firestore, 'profiles'), where('usernameLower', '==', lower), limit(1)));
    if (snapshot.empty) {
      throw new Error('No existe ese usuario. Debe haber entrado a la pagina al menos una vez.');
    }

    const friendUid = snapshot.docs[0].id;
    if (friendUid === uid) {
      throw new Error('No puedes vincularte contigo mismo');
    }

    await setDoc(doc(this.firestore, `profiles/${uid}`), { userId: uid, friendUid: friendUid }, { merge: true });
    this.friendCache = undefined;
  }

  async unlink(): Promise<void> {
    const uid = await this.authService.getUid();
    await setDoc(doc(this.firestore, `profiles/${uid}`), { userId: uid, friendUid: '' }, { merge: true });
    this.friendCache = null;
    this.saveLocal(uid, null);
  }

  // Obras de una categoria de un usuario (por su id)
  async getItemsOf(type: string, userId: string): Promise<any[]> {
    const col = this.collections[type];
    if (!col) {
      return [];
    }
    const snapshot = await getDocs(query(collection(this.firestore, col), where('userId', '==', userId)));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Todas las obras de una categoria de tu amigo
  async getFriendItems(type: string): Promise<any[]> {
    const friend = await this.getFriend();
    const col = this.collections[type];
    if (!friend || !col) {
      return [];
    }

    const snapshot = await getDocs(query(collection(this.firestore, col), where('userId', '==', friend.uid)));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Busca la misma obra (por nombre) en la coleccion de tu amigo
  async getFriendEntry(type: string, name: string): Promise<any | null> {
    const friend = await this.getFriend();
    const col = this.collections[type];
    if (!friend || !col || !name) {
      return null;
    }

    const snapshot = await getDocs(query(collection(this.firestore, col),
      where('userId', '==', friend.uid), where('name', '==', name), limit(1)));

    if (snapshot.empty) {
      return null;
    }
    const data: any = snapshot.docs[0].data();
    return { score: data['score'], date: data['date'] };
  }
}
