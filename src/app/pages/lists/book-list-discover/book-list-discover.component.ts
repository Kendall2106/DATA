import { Component, OnInit } from '@angular/core';
import { ApiBookService } from 'src/app/core/service/apiBook.service';
import { ModalComponent } from '../../component/modal/modal.components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book-list-discover',
  templateUrl: './book-list-discover.component.html',
  styleUrls: ['./book-list-discover.component.css']
})
export class BookListDiscoverComponent implements OnInit {
  message: string = "";
  data: { name: string, image: string, info: string, releaseDate: string, randomData: string }[] = [];
  animesAiring: any[] =[];
  startIndex: number = 0;
  maxResults: number = 24;
  search: string = "";
  currentSearchType: 'all' | 'genre' | 'search' = 'all';
 
   constructor(private apiBookService: ApiBookService, public modalService: NgbModal){}

   ngOnInit(): void {
    this.getBooks();   
    this.getBooksByNew();
  }

  async getBooks() {
   // this.loading = true;
   this.currentSearchType = 'all'; 
    this.message = "Books";
    //this.dataAiring();
    await this.apiBookService.getBooks(this.startIndex, this.maxResults).subscribe((response: any) => {
      const booksWithImages = response.items.filter((book: any) => book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail);
      this.data = [];
      console.log(response);
      booksWithImages.forEach((item: any) => {
        this.data.push({
          name: item.volumeInfo.title,
          image: item.volumeInfo.imageLinks.thumbnail,
          info: item.volumeInfo.description,
          releaseDate: item.volumeInfo.publishedDate,
          randomData: item.volumeInfo.pageCount
        });
      });
    });
  }

  async getBooksByNew() {
    await this.apiBookService.getBooksByNew().subscribe((response: any) => {
      const booksWithImages = response.items.filter((book: any) => book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail);
      this.animesAiring = [];
      booksWithImages.forEach((item: any) => {
        this.animesAiring.push({
          name: item.volumeInfo.title,
          image: item.volumeInfo.imageLinks.thumbnail,
          info: item.volumeInfo.description
        });
      });
    });
  }

  async getBooksByName() {
    this.data = [];
    this.currentSearchType = 'search'; 
    await this.apiBookService.getBooksByName(this.search,this.startIndex).subscribe((response: any) => {
      if (response.items) {
        const booksWithImages = response.items.filter((book: any) => book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail);
        booksWithImages.forEach((item: any) => {
          this.data.push({
            name: item.volumeInfo.title,
            image: item.volumeInfo.imageLinks.thumbnail,
            info: item.volumeInfo.description,
            releaseDate: item.volumeInfo.publishedDate,
            randomData: item.volumeInfo.pageCount
          });
        });
      }
    });
  }

  openModal(infoData: any) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.data = infoData;
    modalRef.componentInstance.type = "Books";
  }

  searchData(){
    this.startIndex = 0;
    this.getBooksByName();
  }


  aumentarNumero() {
   // this.numPage++;
    this.startIndex += this.maxResults;
    this.loadAnimeBasedOnContext();
    console.log(this.startIndex);
  
  }


  restNumber() {
    if (this.startIndex > 0) {
      this.startIndex -= this.maxResults;
      this.loadAnimeBasedOnContext();  // Llamamos a la misma función
    }
  }

 // Esta función decide qué método usar según el contexto actual
 loadAnimeBasedOnContext() {
  if (this.currentSearchType === 'all') {
    this.getBooks();
  } else if (this.currentSearchType === 'genre') {
   // this.getAnimeByGenre(this.currentGenre);
  } else if (this.currentSearchType === 'search') {
    this.getBooksByName();
  }
}
}
