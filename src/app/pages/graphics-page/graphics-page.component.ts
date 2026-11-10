import { Component, OnInit } from '@angular/core';
import { AnimeService } from 'src/app/core/service/anime.service';
import { GameService } from 'src/app/core/service/game.service';
import { LibrosService } from 'src/app/core/service/libros.service';
import { MovieService } from 'src/app/core/service/movie.service';
import { MusicService } from 'src/app/core/service/music.service';
import { ProfileService } from 'src/app/core/service/profile.service';
import { SeriesService } from 'src/app/core/service/series.service';

@Component({
  selector: 'app-graphics-page',
  templateUrl: './graphics-page.component.html',
  styleUrls: ['./graphics-page.component.css']
})
export class GraphicsPageComponent implements OnInit {

  selectedItem: string = 'Home';
  loading: boolean = false;
  error: string = '';

  stats: any = null;   // resumen general (Home)
  cat: any = null;     // graficas de la categoria elegida

  tabs = [
    { key: 'Animes', label: 'Animes', icon: 'anime.png' },
    { key: 'Movies', label: 'Movies', icon: 'movie.png' },
    { key: 'Series', label: 'Shows', icon: 'show.png' },
    { key: 'Books', label: 'Books', icon: 'book.png' },
    { key: 'Games', label: 'Games', icon: 'game.png' },
    { key: 'Music', label: 'Music', icon: 'music.png' }
  ];

  private labels: any = { Animes: 'Animes', Movies: 'Películas', Series: 'Series', Books: 'Libros', Games: 'Juegos', Music: 'Música' };
  private icons: any = { Animes: 'uil-play-circle', Movies: 'uil-film', Series: 'uil-tv-retro', Books: 'uil-book-open', Games: 'uil-dice-five', Music: 'uil-music' };

  constructor(private profileService: ProfileService, private animeService: AnimeService, private movieService: MovieService, private seriesService: SeriesService, private libroService: LibrosService, private gameService: GameService, private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.loadOverview();
  }

  loadData(type: string) {
    this.selectedItem = type;
    this.error = '';
    if (type !== 'Home') {
      this.loadCategory(type);
    }
  }

  get catLabel(): string {
    return this.labels[this.selectedItem] ?? '';
  }

  // ---------- Resumen general: solo conteos, carga rapido ----------
  async loadOverview() {
    try {
      this.loading = true;
      const result = await this.profileService.getOverviewStats();

      const cats = result.cats.map((c: any) => {
        const rated = c.stars.reduce((a: number, b: number) => a + b, 0);
        const sum = c.stars.reduce((acc: number, n: number, i: number) => acc + n * (i + 1), 0);
        return {
          key: c.key,
          label: this.labels[c.key],
          icon: this.icons[c.key],
          total: c.total,
          avg: rated ? sum / rated : 0
        };
      });

      const total = cats.reduce((a: number, c: any) => a + c.total, 0);
      const ratedTotal = result.stars.reduce((a: number, b: number) => a + b, 0);
      const sumStars = result.stars.reduce((acc: number, n: number, i: number) => acc + n * (i + 1), 0);
      const maxStar = Math.max(...result.stars, 1);
      const maxCat = Math.max(...cats.map((c: any) => c.total), 1);
      const gamesTotal = cats.find((c: any) => c.key === 'Games')?.total ?? 0;

      this.stats = {
        total,
        avg: ratedTotal ? sumStars / ratedTotal : 0,
        masterpieces: result.stars[4],
        platinum: result.platinum,
        cats: cats.map((c: any) => ({ ...c, pct: (c.total / maxCat) * 100 })),
        stars: result.stars.map((count: number, i: number) => ({ value: i + 1, count, pct: (count / maxStar) * 100 })).reverse(),
        ratedTotal,
        unrated: Math.max(0, total - ratedTotal),
        donut: this.makeDonut(result.platinum, gamesTotal)
      };
    } catch (error) {
      console.error("Error al cargar el resumen:", error);
      this.error = 'No se pudo cargar el resumen.';
    } finally {
      this.loading = false;
    }
  }

  // ---------- Graficas de una categoria ----------
  async loadCategory(type: string) {
    try {
      this.loading = true;
      this.cat = null;

      let items: any[] = [];
      let categories: any[] = [];

      if (type === 'Animes') {
        [items, categories] = await Promise.all([this.animeService.getAnimes(), this.animeService.getCategoriesAnime()]);
      } else if (type === 'Movies') {
        [items, categories] = await Promise.all([this.movieService.getMovies(), this.seriesService.getCategoriesShow()]);
      } else if (type === 'Series') {
        [items, categories] = await Promise.all([this.seriesService.getSeries(), this.seriesService.getCategoriesShow()]);
      } else if (type === 'Games') {
        [items, categories] = await Promise.all([this.gameService.getGames(), this.gameService.getCategoriesGame()]);
      } else if (type === 'Books') {
        [items, categories] = await Promise.all([this.libroService.getBook(), this.libroService.getCategoriesBook()]);
      } else if (type === 'Music') {
        items = await this.musicService.getMusic();
      }

      // Solo se muestra si el usuario no cambio de pestaña mientras cargaba
      if (this.selectedItem === type) {
        this.cat = this.buildStats(type, items, categories);
      }
    } catch (error) {
      console.error("Error al cargar las graficas:", error);
      this.error = 'No se pudieron cargar las gráficas.';
    } finally {
      this.loading = false;
    }
  }

  private buildStats(type: string, items: any[], categories: any[]): any {
    const now = new Date().getFullYear();
    const total = items.length;
    const rated = items.filter(i => Number(i.score) > 0);
    const avg = rated.length ? rated.reduce((sum, i) => sum + Number(i.score), 0) / rated.length : 0;
    const parsed = items.map(item => ({ item, d: this.parseDate(item.date) }));

    // Por año (ultimos 7)
    const yearCounts: any[] = [];
    for (let y = now - 6; y <= now; y++) {
      yearCounts.push({ label: String(y), count: parsed.filter(p => p.d && p.d.year === y).length });
    }
    const maxYear = Math.max(...yearCounts.map(y => y.count), 1);
    const years = yearCounts.map(y => ({ ...y, pct: (y.count / maxYear) * 100 }));

    // Calificaciones
    const rawStars = [5, 4, 3, 2, 1].map(v => ({ value: v, count: items.filter(i => Number(i.score) === v).length }));
    const maxStar = Math.max(...rawStars.map(s => s.count), 1);
    const stars = rawStars.map(s => ({ ...s, pct: (s.count / maxStar) * 100 }));

    // Obras maestras mas recientes
    const order = (p: any) => p.d ? p.d.year * 100 + p.d.month : 0;
    const top = parsed
      .filter(p => Number(p.item.score) === 5)
      .sort((a, b) => order(b) - order(a))
      .slice(0, 14)
      .map(p => ({ name: p.item.name, image: 'data:image/jpg;base64,' + p.item.image }));

    // Paneles propios de cada categoria
    const names = new Map<string, string>(categories.map((c: any) => [String(c.id), c.name]));
    const genreOf = (i: any) => {
      if (!i.type) { return 'Sin género'; }
      return names.get(String(i.type)) ?? String(i.type);
    };

    const panels: any[] = [];
    if (type === 'Animes' || type === 'Movies' || type === 'Series') {
      panels.push({ title: 'Géneros', kind: 'bars', rows: this.topList(items.map(genreOf), 8) });
    } else if (type === 'Games') {
      const platinum = items.filter(i => i.achievements === true).length;
      panels.push({ title: 'Platinos', kind: 'donut', donut: this.makeDonut(platinum, total) });
      panels.push({ title: 'Géneros', kind: 'bars', rows: this.topList(items.map(genreOf), 4) });
    } else if (type === 'Books') {
      panels.push({ title: 'Autores', kind: 'bars', rows: this.topList(items.map(i => i.author).filter(a => !!a), 5) });
      panels.push({ title: 'Formatos', kind: 'bars', rows: this.topList(items.map(i => i.kind).filter(k => !!k), 4) });
    } else if (type === 'Music') {
      panels.push({ title: 'Artistas', kind: 'bars', rows: this.topList(items.map(i => i.artist).filter(a => !!a), 8) });
    }

    return {
      total,
      avg,
      masterpieces: top.length > 0 ? items.filter(i => Number(i.score) === 5).length : 0,
      thisYear: parsed.filter(p => p.d && p.d.year === now).length,
      years,
      stars,
      ratedTotal: rated.length,
      top,
      panels
    };
  }

  // Los mas repetidos de una lista, con su porcentaje para la barra
  private topList(values: string[], max: number): any[] {
    const counts = new Map<string, number>();
    values.forEach(v => counts.set(v, (counts.get(v) ?? 0) + 1));
    const rows = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([label, count]) => ({ label, count, pct: 0 }));
    const top = Math.max(...rows.map(r => r.count), 1);
    rows.forEach(r => r.pct = (r.count / top) * 100);
    return rows;
  }

  private makeDonut(part: number, total: number): any {
    const percent = total ? Math.round((part / total) * 100) : 0;
    return {
      percent,
      part,
      rest: Math.max(0, total - part),
      bg: `conic-gradient(#6fe6ff 0 ${percent}%, #262626 ${percent}% 100%)`
    };
  }

  // Acepta "2026-09-27" y "27-09-2026"
  private parseDate(value: any): { year: number, month: number } | null {
    if (!value) { return null; }
    const text = String(value);

    let m = text.match(/^(\d{4})-(\d{1,2})/);
    if (m) { return { year: +m[1], month: +m[2] }; }

    m = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (m) { return { year: +m[3], month: +m[2] }; }

    const date = new Date(text);
    return isNaN(date.getTime()) ? null : { year: date.getFullYear(), month: date.getMonth() + 1 };
  }

}
