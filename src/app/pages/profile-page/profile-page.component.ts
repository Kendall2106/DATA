import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnimeService } from 'src/app/core/service/anime.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { FriendService } from 'src/app/core/service/friend.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { ProfileService } from 'src/app/core/service/profile.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  loading: boolean = false;

  numMovies: number = 0;
  numSeries: number = 0;
  numAnimes: number = 0;
  numGames: number = 0;
  numBooks: number = 0;
  numMusic: number = 0;
  numPlatinum: number = 0;

  username: string = '';
  photo: string = '';
  bio: string = '';
  memberSince: string = '';
  profileError: string = '';
  editingBio: boolean = false;
  bioDraft: string = '';

  favorites: any = {};
  platinumGames: any[] = [];
  favCounts: any = {};
  favTab: string = 'Animes';
  favTabs = [
    { key: 'Animes', label: 'Animes' },
    { key: 'Movies', label: 'Películas' },
    { key: 'Series', label: 'Series' },
    { key: 'Books', label: 'Libros' },
    { key: 'Games', label: 'Juegos' },
    { key: 'Music', label: 'Música' }
  ];

  // Perfil de un amigo (solo lectura)
  isOwn: boolean = true;
  viewUid: string | null = null;
  visitorError: string = '';

  // Ventana con todos los favoritos de una categoria (o los platinos)
  showAllTitle: string = '';
  showAllOpen: boolean = false;
  showAllLoading: boolean = false;
  showAllItems: any[] = [];

  // Ventana de ayuda
  helpOpen: boolean = false;

  // Editor de la vitrina (elegir y ordenar)
  readonly showcaseMax = 6;
  slotNumbers = [0, 1, 2, 3, 4, 5];
  editorOpen: boolean = false;
  editorLoading: boolean = false;
  editorSaving: boolean = false;
  editorPool: any[] = [];
  editorSel: any[] = [];
  dragIndex: number = -1;
  dragOver: number = -1;

  // Niveles de insignia: Blanco, Cobre, Plata, Oro y Platino
  tiers = [
    { name: 'Blanco', color: '#f2f2f2' },
    { name: 'Cobre', color: '#d9824f' },
    { name: 'Plata', color: '#aab6c4' },
    { name: 'Oro', color: '#ffd24a' },
    { name: 'Platino', color: '#6fe6ff' }
  ];

  // Metas acumuladas para llegar a cada nivel (basadas en promedios de comunidades; ver ayuda)
  badgeDefs = [
    { icon: 'uil-play-circle', name: 'Otaku', desc: 'Animes vistos', field: 'numAnimes', goals: [10, 50, 150, 400, 1000] },
    { icon: 'uil-film', name: 'Cinéfilo', desc: 'Películas vistas', field: 'numMovies', goals: [25, 100, 250, 600, 1000] },
    { icon: 'uil-tv-retro', name: 'Maratonista', desc: 'Series vistas', field: 'numSeries', goals: [5, 25, 75, 150, 300] },
    { icon: 'uil-book-open', name: 'Lector', desc: 'Libros leídos', field: 'numBooks', goals: [10, 50, 150, 400, 1000] },
    { icon: 'uil-dice-five', name: 'Gamer', desc: 'Juegos jugados', field: 'numGames', goals: [5, 25, 75, 200, 500] },
    { icon: 'uil-music', name: 'Melómano', desc: 'Álbumes escuchados', field: 'numMusic', goals: [10, 50, 150, 400, 1000] },
    { icon: 'uil-trophy', name: 'Platinador', desc: 'Juegos platinados', field: 'numPlatinum', goals: [1, 5, 15, 30, 100] }
  ];
  badges: any[] = [];

  friend: any = null;

  readonly defaultBio = '"I want to be free, but I dont know who I am without the walls around me." - Evangelion';

  private profileSubscription?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private musicService: MusicService, private movieService: MovieService, private libroService: LibrosService, private gameService: GameService, private seriesService: SeriesService, private animeService: AnimeService, private profileService: ProfileService, private friendService: FriendService, private authService: AuthService) {
  }

  ngOnInit(): void {
    // Con /Profile/:uid se muestra el perfil de tu amigo
    const uid = this.route.snapshot.paramMap.get('uid');
    this.buildBadges();
    if (uid) {
      this.isOwn = false;
      this.viewUid = uid;
      this.updateStats();
      this.loadVisitor(uid);
      return;
    }

    this.profileSubscription = this.profileService.profile$.subscribe(profile => {
      this.username = profile.username;
      this.photo = profile.photo;
      this.bio = profile.bio;
    });
    this.profileService.loadProfile().catch(error => console.error("Error:", error));
    this.authService.getMemberSince().then(value => this.memberSince = value).catch(() => { });

    this.updateStats();
    this.loadNumTotal().then(() => {
      this.loadFavorites();
      this.loadPlatinum();
    });
    this.loadFriend();
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
    if (!this.isOwn) {
      this.profileService.restoreColor();
    }
  }

  @HostListener('document:keydown.escape')
  closeOverlays() {
    this.showAllOpen = false;
    this.helpOpen = false;
    this.editorOpen = false;
  }

  // ---------- Nivel del perfil (raiz cuadrada del total de obras) ----------
  get total(): number {
    return this.numAnimes + this.numMovies + this.numSeries + this.numBooks + this.numGames + this.numMusic;
  }

  get level(): number {
    return Math.max(1, Math.floor(Math.sqrt(this.total)));
  }

  get nextLevelAt(): number {
    return (this.level + 1) * (this.level + 1);
  }

  get levelProgress(): number {
    const prev = this.level * this.level;
    const progress = (this.total - prev) / (this.nextLevelAt - prev);
    return Math.max(0, Math.min(100, Math.round(progress * 100)));
  }

  // Estadisticas por categoria (se recalculan solo cuando cambian los conteos)
  stats: any[] = [];
  private statsMax: number = 1;

  updateStats() {
    this.stats = [
      { label: 'Animes', icon: 'uil-play-circle', value: this.numAnimes },
      { label: 'Películas', icon: 'uil-film', value: this.numMovies },
      { label: 'Series', icon: 'uil-tv-retro', value: this.numSeries },
      { label: 'Libros', icon: 'uil-book-open', value: this.numBooks },
      { label: 'Juegos', icon: 'uil-dice-five', value: this.numGames },
      { label: 'Música', icon: 'uil-music', value: this.numMusic }
    ];
    this.statsMax = Math.max(...this.stats.map(s => s.value), 1);
  }

  pct(value: number): number {
    return Math.round((value / this.statsMax) * 100);
  }

  // Evita que la pagina se quede cargando para siempre si una consulta no responde
  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Tiempo de espera agotado')), ms);
      promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
    });
  }

  get platPct(): number {
    return this.numGames ? Math.round((this.numPlatinum / this.numGames) * 100) : 0;
  }

  get favTabLabel(): string {
    return this.favTabs.find(t => t.key === this.favTab)?.label ?? '';
  }

  // ---------- Foto y descripcion ----------
  async onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.profileError = '';
    try {
      this.loading = true;
      const photo = await this.resizeImage(file, 256);
      await this.profileService.savePhoto(photo);
    } catch (error) {
      console.error("Error al guardar la foto:", error);
      this.profileError = 'No se pudo guardar la foto. Revisa las reglas de Firestore para la colección profiles.';
    } finally {
      this.loading = false;
      event.target.value = '';
    }
  }

  // Recorta la foto a un cuadrado de 256px para que pese poco
  private resizeImage(file: File, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Imagen no valida'));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const side = Math.min(img.width, img.height);
          const sx = (img.width - side) / 2;
          const sy = (img.height - side) / 2;
          canvas.getContext('2d')!.drawImage(img, sx, sy, side, side, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  startEditBio() {
    this.bioDraft = this.bio;
    this.editingBio = true;
  }

  async saveBio() {
    this.profileError = '';
    try {
      await this.profileService.saveBio(this.bioDraft.trim());
      this.editingBio = false;
    } catch (error) {
      console.error("Error al guardar la descripcion:", error);
      this.profileError = 'No se pudo guardar la descripción. Revisa las reglas de Firestore para la colección profiles.';
    }
  }

  // ---------- Datos ----------
  async loadNumTotal() {
    try {
      this.loading = true;

      const [numAnimes, numMovies, numSeries, numGames, numBooks, numMusic, numPlatinum] = await this.withTimeout(Promise.all([
        this.animeService.loadNumAnimes(),
        this.movieService.loadNumMovies(),
        this.seriesService.loadNumSeries(),
        this.gameService.loadNumGames(),
        this.libroService.loadNumBooks(),
        this.musicService.loadNumMusic(),
        this.profileService.countPlatinum().catch(() => 0),
      ]), 15000);

      this.numAnimes = Number(numAnimes);
      this.numMovies = Number(numMovies);
      this.numSeries = Number(numSeries);
      this.numGames = Number(numGames);
      this.numBooks = Number(numBooks);
      this.numMusic = Number(numMusic);
      this.numPlatinum = numPlatinum;

      this.updateStats();
      this.buildBadges();

    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }

  async loadVisitor(uid: string) {
    try {
      this.loading = true;
      const profile = await this.profileService.loadProfileOf(uid);
      this.username = profile.username;
      this.photo = profile.photo;
      this.bio = profile.bio;
      this.profileService.previewColor(profile.color);

      const counts = await this.profileService.getCountsOf(uid);
      this.numAnimes = counts['Animes'];
      this.numMovies = counts['Movies'];
      this.numSeries = counts['Series'];
      this.numBooks = counts['Books'];
      this.numGames = counts['Games'];
      this.numMusic = counts['Music'];
      this.numPlatinum = counts['Platinum'];
      this.updateStats();
      this.buildBadges();

      await this.loadFavorites(uid);
      await this.loadPlatinum(uid);
    } catch (error) {
      console.error("Error al cargar el perfil del amigo:", error);
      this.visitorError = 'No tienes acceso a sus obras. Tu amigo debe vincularte desde sus ajustes.';
    } finally {
      this.loading = false;
    }
  }

  async loadFavorites(userId?: string) {
    try {
      const result = await this.profileService.getFavorites(6, userId);
      this.favorites = result.items;
      this.favCounts = result.counts;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async openAllFavorites() {
    this.showAllTitle = '5 estrellas · ' + this.favTabLabel;
    this.showAllOpen = true;
    this.showAllItems = [];
    this.showAllLoading = true;
    try {
      this.showAllItems = await this.profileService.getAllFavorites(this.favTab, this.viewUid ?? undefined);
    } catch (error) {
      console.error("Error al cargar todos los favoritos:", error);
    } finally {
      this.showAllLoading = false;
    }
  }

  // ---------- Editor de la vitrina ----------
  async openEditor() {
    this.editorOpen = true;
    this.editorPool = [];
    this.editorSel = [];
    this.editorLoading = true;
    try {
      // Se toman en cuenta todas las obras de 5 estrellas de la categoria
      this.editorPool = await this.profileService.getAllFavorites(this.favTab);
      this.editorSel = (this.favorites[this.favTab] ?? [])
        .map((fav: any) => this.editorPool.find(p => p.id === fav.id))
        .filter((item: any) => !!item);
    } catch (error) {
      console.error("Error al cargar las obras de 5 estrellas:", error);
    } finally {
      this.editorLoading = false;
    }
  }

  isPicked(item: any): boolean {
    return this.editorSel.some(s => s.id === item.id);
  }

  togglePick(item: any) {
    const index = this.editorSel.findIndex(s => s.id === item.id);
    if (index >= 0) {
      this.editorSel.splice(index, 1);
    } else if (this.editorSel.length < this.showcaseMax) {
      this.editorSel.push(item);
    }
  }

  moveSlot(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= this.editorSel.length) {
      return;
    }
    const [item] = this.editorSel.splice(index, 1);
    this.editorSel.splice(target, 0, item);
  }

  removeSlot(index: number) {
    this.editorSel.splice(index, 1);
  }

  onDragStart(index: number) {
    this.dragIndex = index;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.dragOver = index;
  }

  onDrop(index: number) {
    if (this.dragIndex >= 0 && this.editorSel[index] && this.dragIndex !== index) {
      const [item] = this.editorSel.splice(this.dragIndex, 1);
      this.editorSel.splice(index, 0, item);
    }
    this.dragIndex = -1;
    this.dragOver = -1;
  }

  async saveEditor(reset: boolean = false) {
    try {
      this.editorSaving = true;
      await this.profileService.saveShowcase(this.favTab, reset ? [] : this.editorSel.map(s => s.id));
      await this.loadFavorites();
      this.editorOpen = false;
    } catch (error) {
      console.error("Error al guardar la vitrina:", error);
      this.profileError = 'No se pudo guardar la vitrina. Revisa las reglas de Firestore para la colección profiles.';
      this.editorOpen = false;
    } finally {
      this.editorSaving = false;
    }
  }

  // Lista de juegos platinados (para la seccion de platinos)
  async loadPlatinum(userId?: string) {
    try {
      this.platinumGames = await this.profileService.getPlatinumGames(userId);
    } catch (error) {
      console.error("Error al cargar los platinos:", error);
    }
  }

  openPlatinum() {
    this.showAllTitle = 'Platinos';
    this.showAllItems = this.platinumGames;
    this.showAllLoading = false;
    this.showAllOpen = true;
  }

  // Calcula el nivel (0 a 5) de cada insignia segun sus metas
  buildBadges() {
    this.badges = this.badgeDefs.map(def => {
      const have: number = (this as any)[def.field];
      const reached = def.goals.filter(goal => have >= goal).length;
      const nextGoal = reached < def.goals.length ? def.goals[reached] : null;
      const prevGoal = reached > 0 ? def.goals[reached - 1] : 0;
      const progress = nextGoal ? Math.round(((have - prevGoal) / (nextGoal - prevGoal)) * 100) : 100;

      return {
        icon: def.icon,
        name: def.name,
        desc: def.desc,
        have,
        reached,
        tier: reached > 0 ? this.tiers[reached - 1] : null,
        nextGoal,
        progress: Math.max(0, Math.min(100, progress)),
        pips: [0, 1, 2, 3, 4].map(i => i < reached)
      };
    });
  }

  // ---------- Amigo (se configura en Ajustes) ----------
  async loadFriend() {
    try {
      this.friend = await this.friendService.getFriend(true);
    } catch (error) {
      console.error("Error al cargar el amigo:", error);
    }
  }

  viewFriend() {
    if (this.friend) {
      this.router.navigate(['/Profile', this.friend.uid]);
    }
  }

  viewTier() {
    if (this.viewUid) {
      this.router.navigate(['/Tier', this.viewUid]);
    }
  }

  backToMine() {
    this.router.navigate(['/Profile']);
  }

  goSettings() {
    this.router.navigate(['/Settings']);
  }

}
