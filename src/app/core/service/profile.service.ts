import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getCountFromServer, getDoc, getDocs, limit, query, setDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  private profileSubject = new BehaviorSubject<{ username: string, photo: string, bio: string, color: string }>({ username: '', photo: '', bio: '', color: '' });
  private colorTimer: any;
  private previewActive: boolean = false;   // true mientras ves los colores de otro usuario
  profile$ = this.profileSubject.asObservable();

  private categorias = [
    { key: 'Animes', collection: 'animes' },
    { key: 'Movies', collection: 'movies' },
    { key: 'Series', collection: 'series' },
    { key: 'Books', collection: 'books' },
    { key: 'Games', collection: 'games' },
    { key: 'Music', collection: 'music' }
  ];

  async loadProfile(): Promise<void> {
    this.previewActive = false;
    const uid = await this.authService.getUid();
    const username = await this.authService.getUsername();
    let photo = '';
    let bio = '';
    let color = '';
    try {
      const ref = doc(this.firestore, `profiles/${uid}`);
      const snapshot = await getDoc(ref);
      const data: any = snapshot.exists() ? snapshot.data() : {};
      photo = data['photo'] ?? '';
      bio = data['bio'] ?? '';
      color = data['color'] ?? '';

      // Color elegido antes de que existiera el tema por usuario: lo adopta el primero que entra
      const legacy = localStorage.getItem('colorLocal');
      if (!color && legacy) {
        color = legacy;
        await setDoc(ref, { userId: uid, color }, { merge: true });
      }
      localStorage.removeItem('colorLocal');

      // Guarda el usuario en el perfil para que tu hermano pueda encontrarte al vincularse
      if (data['usernameLower'] !== username.toLowerCase()) {
        await setDoc(ref, { userId: uid, username: username, usernameLower: username.toLowerCase() }, { merge: true });
      }
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    }
    this.applyColor(color);
    this.profileSubject.next({ username, photo, bio, color });
  }

  // Aplica el color principal a la pagina (cada usuario tiene el suyo)
  applyColor(color: string) {
    // Mientras ves el perfil de otro usuario no se pisan sus colores
    if (this.previewActive) {
      return;
    }
    if (color) {
      document.documentElement.style.setProperty('--color-2', color);
      try { localStorage.setItem('hobbies-color', color); } catch { }
    } else {
      document.documentElement.style.removeProperty('--color-2');
      try { localStorage.removeItem('hobbies-color'); } catch { }
    }
  }

  // Muestra temporalmente los colores de otro usuario (no se guardan)
  previewColor(color: string) {
    this.previewActive = true;
    if (color) {
      document.documentElement.style.setProperty('--color-2', color);
    } else {
      document.documentElement.style.removeProperty('--color-2');
    }
  }

  // Vuelve a tus colores al salir del perfil de otro usuario
  restoreColor() {
    this.previewActive = false;
    const own = this.profileSubject.value.color;
    if (own) {
      document.documentElement.style.setProperty('--color-2', own);
    } else {
      document.documentElement.style.removeProperty('--color-2');
    }
  }

  // Cambia el color al instante y lo guarda en tu perfil (con una pequeña espera por si arrastras el selector)
  saveColor(color: string) {
    this.previewActive = false;
    this.applyColor(color);
    this.profileSubject.next({ ...this.profileSubject.value, color });

    clearTimeout(this.colorTimer);
    this.colorTimer = setTimeout(async () => {
      try {
        const uid = await this.authService.getUid();
        await setDoc(doc(this.firestore, `profiles/${uid}`), { userId: uid, color: color }, { merge: true });
      } catch (error) {
        console.error("Error al guardar el color:", error);
      }
    }, 600);
  }

  async savePhoto(photo: string): Promise<void> {
    const uid = await this.authService.getUid();
    await setDoc(doc(this.firestore, `profiles/${uid}`), { userId: uid, photo: photo }, { merge: true });
    this.profileSubject.next({ ...this.profileSubject.value, photo });
  }

  async saveBio(bio: string): Promise<void> {
    const uid = await this.authService.getUid();
    await setDoc(doc(this.firestore, `profiles/${uid}`), { userId: uid, bio: bio }, { merge: true });
    this.profileSubject.next({ ...this.profileSubject.value, bio });
  }

  // Obras con 5 estrellas de cada categoria para la vitrina: las que elegiste (en tu orden) o, si no
  // elegiste, las primeras; ademas el total de cada categoria
  async getFavorites(max: number = 6, userId?: string): Promise<{ items: any, counts: any }> {
    const uid = userId ?? await this.authService.getUid();

    // Orden elegido por el usuario: { Animes: [id, id, ...], ... }
    let showcase: any = {};
    try {
      const profile = await getDoc(doc(this.firestore, `profiles/${uid}`));
      showcase = profile.exists() ? (profile.data()['showcase'] ?? {}) : {};
    } catch (error) {
      console.error("Error al cargar la vitrina:", error);
    }

    const items: any = {};
    const counts: any = {};
    await Promise.all(this.categorias.map(async cat => {
      try {
        const base = query(collection(this.firestore, cat.collection), where('userId', '==', uid), where('score', '==', 5));
        const ids: string[] = Array.isArray(showcase[cat.key]) ? showcase[cat.key].slice(0, max) : [];

        const defaults = async () => {
          const snapshot = await getDocs(query(base, limit(max)));
          return snapshot.docs.map(d => ({ id: d.id, name: d.data()['name'], image: d.data()['image'] }));
        };

        const chosen = async () => {
          const docs = await Promise.all(ids.map(id => getDoc(doc(this.firestore, `${cat.collection}/${id}`))));
          // Se descartan las obras que ya no existen o que dejaron de tener 5 estrellas
          return docs
            .filter(d => d.exists() && d.data()['userId'] === uid && d.data()['score'] === 5)
            .map(d => ({ id: d.id, name: d.data()?.['name'], image: d.data()?.['image'] }));
        };

        const [list, total] = await Promise.all([
          ids.length > 0 ? chosen() : defaults(),
          getCountFromServer(base)
        ]);

        items[cat.key] = (ids.length > 0 && list.length === 0) ? await defaults() : list;
        counts[cat.key] = total.data().count;
      } catch (error) {
        console.error("Error al cargar favoritos de " + cat.key + ":", error);
        items[cat.key] = [];
        counts[cat.key] = 0;
      }
    }));
    return { items, counts };
  }

  // Guarda el orden de la vitrina de una categoria (lista vacia = orden por defecto)
  async saveShowcase(key: string, ids: string[]): Promise<void> {
    const uid = await this.authService.getUid();
    await setDoc(doc(this.firestore, `profiles/${uid}`), { userId: uid, showcase: { [key]: ids } }, { merge: true });
  }

  // Todas las obras con 5 estrellas de una categoria
  async getAllFavorites(key: string, userId?: string): Promise<any[]> {
    const uid = userId ?? await this.authService.getUid();
    const cat = this.categorias.find(c => c.key === key);
    if (!cat) {
      return [];
    }
    const snapshot = await getDocs(query(collection(this.firestore, cat.collection),
      where('userId', '==', uid), where('score', '==', 5)));
    return snapshot.docs.map(d => ({ id: d.id, name: d.data()['name'], image: d.data()['image'] }));
  }

  // Juegos platinados (campo 'achievements')
  async countPlatinum(userId?: string): Promise<number> {
    const uid = userId ?? await this.authService.getUid();
    const snapshot = await getCountFromServer(query(collection(this.firestore, 'games'),
      where('userId', '==', uid), where('achievements', '==', true)));
    return snapshot.data().count;
  }

  // Lista de juegos platinados
  async getPlatinumGames(userId?: string): Promise<any[]> {
    const uid = userId ?? await this.authService.getUid();
    const snapshot = await getDocs(query(collection(this.firestore, 'games'),
      where('userId', '==', uid), where('achievements', '==', true)));
    return snapshot.docs.map(d => ({ id: d.id, name: d.data()['name'], image: d.data()['image'] }));
  }

  // ---------- Perfil de otro usuario (tu amigo) ----------
  async loadProfileOf(userId: string): Promise<{ username: string, photo: string, bio: string, color: string }> {
    const snapshot = await getDoc(doc(this.firestore, `profiles/${userId}`));
    const data: any = snapshot.exists() ? snapshot.data() : {};
    return { username: data['username'] ?? 'Amigo', photo: data['photo'] ?? '', bio: data['bio'] ?? '', color: data['color'] ?? '' };
  }

  async getCountsOf(userId: string): Promise<any> {
    const counts: any = {};
    await Promise.all(this.categorias.map(async cat => {
      const snapshot = await getCountFromServer(query(collection(this.firestore, cat.collection), where('userId', '==', userId)));
      counts[cat.key] = snapshot.data().count;
    }));
    counts['Platinum'] = await this.countPlatinum(userId);
    return counts;
  }

  // ---------- Resumen para la pagina de graficos (solo conteos, sin descargar obras) ----------
  async getOverviewStats(): Promise<{ cats: any[], stars: number[], platinum: number }> {
    const uid = await this.authService.getUid();
    const cats = await Promise.all(this.categorias.map(async cat => {
      const col = collection(this.firestore, cat.collection);
      const count = async (extra?: any) => {
        const q = extra
          ? query(col, where('userId', '==', uid), where('score', '==', extra))
          : query(col, where('userId', '==', uid));
        return (await getCountFromServer(q)).data().count;
      };
      const [total, s1, s2, s3, s4, s5] = await Promise.all([count(), count(1), count(2), count(3), count(4), count(5)]);
      return { key: cat.key, total, stars: [s1, s2, s3, s4, s5] };
    }));

    const stars = [0, 1, 2, 3, 4].map(i => cats.reduce((sum, c) => sum + c.stars[i], 0));
    const platinum = await this.countPlatinum();
    return { cats, stars, platinum };
  }
}
