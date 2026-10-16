import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiBookService {

  private API_URL = 'https://openlibrary.org/search.json';
  private COVER_URL = 'https://covers.openlibrary.org/b/id/';

  constructor(private http: HttpClient) {}

  // Libros de fantasía para la pantalla inicial
  getBooks(startIndex: number, maxResults: number): Observable<any> {

    const params = new HttpParams()
      .set('q', 'subject:fantasy')
      .set('fields', 'key,title,author_name,first_publish_year,cover_i,edition_count,number_of_pages_median,isbn,subject')
      .set('offset', startIndex.toString())
      .set('limit', Math.min(maxResults, 100).toString());

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map(response => this.formatResponse(response))
    );
  }

  // Buscar por título o autor
  getBooksByName(name: string, startIndex: number): Observable<any> {

    const params = new HttpParams()
      .set('q', name.trim())
      .set('fields', 'key,title,author_name,first_publish_year,cover_i,edition_count,number_of_pages_median,isbn,subject')
      .set('offset', startIndex.toString())
      .set('limit', '24');

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map(response => this.formatResponse(response))
    );
  }

  // Libros publicados recientemente
  getBooksByNew(): Observable<any> {

    const params = new HttpParams()
      .set('q', 'subject:fantasy')
      .set('sort', 'new')
      .set('fields', 'key,title,author_name,first_publish_year,cover_i,edition_count,number_of_pages_median,isbn,subject')
      .set('limit', '24');

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map(response => this.formatResponse(response))
    );
  }

  // Adaptar la respuesta al formato esperado por los componentes
  private formatResponse(response: any): any {

    const books = (response.docs || []).map((book: any) => {

      const cover = book.cover_i
        ? `${this.COVER_URL}${book.cover_i}-L.jpg`
        : '';

      return {
        id: book.key || '',
        key: book.key || '',

        // Formato compatible con componentes que usan volumeInfo
        volumeInfo: {
          title: book.title || 'Título desconocido',
          authors: book.author_name || [],
          publishedDate: book.first_publish_year
            ? String(book.first_publish_year)
            : '',
          description: '',
          pageCount: book.number_of_pages_median || 0,
          categories: book.subject || [],
          imageLinks: cover
            ? { thumbnail: cover }
            : {},
          industryIdentifiers: book.isbn?.[0]
            ? [{
                type: 'ISBN',
                identifier: book.isbn[0]
              }]
            : []
        },

        // Campos directos para otros componentes
        title: book.title || 'Título desconocido',
        name: book.title || 'Título desconocido',
        authors: book.author_name || [],
        author: (book.author_name || []).join(', '),
        image: cover,
        releaseDate: book.first_publish_year || 0,
        pages: book.number_of_pages_median || 0,
        isbn: book.isbn?.[0] || '',
        categories: book.subject || [],
        editions: book.edition_count || 0,
        openLibraryUrl: book.key
          ? `https://openlibrary.org${book.key}`
          : ''
      };
    });

    return {
      ...response,
      totalItems: response.numFound || 0,
      items: books
    };
  }
}
