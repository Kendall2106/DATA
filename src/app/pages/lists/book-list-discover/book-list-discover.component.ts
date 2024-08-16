import { Component, OnInit } from '@angular/core';
import { ApiBookService } from 'src/app/core/service/apiBook.service';

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
 
   constructor(private apiBookService: ApiBookService){}

   ngOnInit(): void {
    this.getBooks();   
    this.getBooksByNew();
  }

  async getBooks() {
   // this.loading = true;
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

}
