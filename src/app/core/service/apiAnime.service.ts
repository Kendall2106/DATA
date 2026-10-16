import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiAnimeService {
  
  private apiUrl = 'https://graphql.anilist.co';

  constructor(private http: HttpClient) {}

  // Géneros compatibles con los IDs que utilizaba Jikan
  private genres = [
    { mal_id: 1, name: 'Action' },
    { mal_id: 2, name: 'Adventure' },
    { mal_id: 4, name: 'Comedy' },
    { mal_id: 8, name: 'Drama' },
    { mal_id: 10, name: 'Fantasy' },
    { mal_id: 14, name: 'Horror' },
    { mal_id: 7, name: 'Mystery' },
    { mal_id: 22, name: 'Romance' },
    { mal_id: 24, name: 'Sci-Fi' },
    { mal_id: 36, name: 'Slice of Life' },
    { mal_id: 30, name: 'Sports' },
    { mal_id: 37, name: 'Supernatural' },
    { mal_id: 41, name: 'Thriller' },
    { mal_id: 13, name: 'Historical' },
    { mal_id: 18, name: 'Mecha' },
    { mal_id: 19, name: 'Music' },
    { mal_id: 23, name: 'School' },
    { mal_id: 27, name: 'Shounen' },
    { mal_id: 35, name: 'Harem' },
    { mal_id: 40, name: 'Psychological' },
    { mal_id: 42, name: 'Seinen' },
    { mal_id: 43, name: 'Josei' }
  ];

  private camposAnime = `
    id
    idMal
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      medium
    }
    description(asHtml: false)
    episodes
    genres
    averageScore
    popularity
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    status
    format
    siteUrl
  `;

  private consultar(query: string, variables: any = {}): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      query: query,
      variables: variables
    });
  }

  private transformar(anime: any): any {
    const titulo = anime.title?.english ||
                   anime.title?.romaji ||
                   anime.title?.native ||
                   'Sin título';

    const fecha = anime.startDate;

    const fechaInicio = fecha?.year
      ? `${fecha.year}-${String(fecha.month || 1).padStart(2, '0')}-${String(fecha.day || 1).padStart(2, '0')}`
      : '';

    const fechaFin = anime.endDate?.year
      ? `${anime.endDate.year}-${String(anime.endDate.month || 1).padStart(2, '0')}-${String(anime.endDate.day || 1).padStart(2, '0')}`
      : '';

    const estados: any = {
      FINISHED: 'Finished Airing',
      RELEASING: 'Currently Airing',
      NOT_YET_RELEASED: 'Not yet aired',
      CANCELLED: 'Cancelled',
      HIATUS: 'On Hiatus'
    };

    return {
      mal_id: anime.idMal || anime.id,
      id: anime.id,
      title: titulo,
      title_english: anime.title?.english || '',
      title_japanese: anime.title?.native || '',
      images: {
        jpg: {
          image_url: anime.coverImage?.large || ''
        },
        webp: {
          image_url: anime.coverImage?.extraLarge ||
                     anime.coverImage?.large ||
                     anime.coverImage?.medium || ''
        }
      },
      synopsis: anime.description || '',
      score: anime.averageScore
        ? anime.averageScore / 10
        : null,
      episodes: anime.episodes,
      status: estados[anime.status] || anime.status,
      aired: {
        from: fechaInicio,
        to: fechaFin
      },
      genres: (anime.genres || []).map((nombre: string) => ({
        name: nombre,
        mal_id: this.genres.find(
          genero => genero.name.toLowerCase() === nombre.toLowerCase()
        )?.mal_id || 0
      })),
      popularity: anime.popularity || 0,
      type: anime.format || '',
      url: anime.siteUrl || '',
      source: 'AniList'
    };
  }

  private consultarLista(
    page: number,
    filtros: string,
    variables: any = {},
    orden: string = 'POPULARITY_DESC'
  ): Observable<any> {

    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            currentPage
            hasNextPage
            total
          }
          media(
            type: ANIME
            isAdult: false
            sort: [${orden}]
            ${filtros}
          ) {
            ${this.camposAnime}
          }
        }
      }
    `;

    return this.consultar(query, {
      page: page,
      perPage: 24,
      ...variables
    }).pipe(
      map(response => {
        const resultado = response.data?.Page;

        return {
          data: (resultado?.media || []).map(
            (anime: any) => this.transformar(anime)
          ),
          pagination: resultado?.pageInfo || {}
        };
      })
    );
  }

  getGenres(): Observable<any> {
    return new Observable(observer => {
      observer.next({ data: this.genres });
      observer.complete();
    });
  }

  getAnimeByPage(page: number): Observable<any> {
    return this.consultarLista(
      page,
      '',
      {},
      'SCORE_DESC'
    );
  }

  getAnimeAiring(): Observable<any> {
    return this.consultarLista(
      1,
      'status: RELEASING',
      {},
      'POPULARITY_DESC'
    );
  }

  searchAnimesByName(name: string, page: number): Observable<any> {
    const query = `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            currentPage
            hasNextPage
            total
          }
          media(
            search: $search
            type: ANIME
            isAdult: false
            sort: [SEARCH_MATCH]
          ) {
            ${this.camposAnime}
          }
        }
      }
    `;

    return this.consultar(query, {
      search: name,
      page: page,
      perPage: 24
    }).pipe(
      map(response => {
        const resultado = response.data?.Page;

        return {
          data: (resultado?.media || []).map(
            (anime: any) => this.transformar(anime)
          ),
          pagination: resultado?.pageInfo || {}
        };
      })
    );
  }

  getAnimeByGenre(genre: number, page: number): Observable<any> {
    const seleccionado = this.genres.find(
      item => item.mal_id === Number(genre)
    );

    if (!seleccionado) {
      return this.consultarLista(page, '', {}, 'SCORE_DESC');
    }

    return this.consultarLista(
      page,
      'genre_in: $genres',
      { genres: [seleccionado.name] },
      'SCORE_DESC'
    );
  }

}