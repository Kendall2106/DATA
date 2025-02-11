export interface Book {
    id: number;
    name: string;
    date: Date;
    score: number;
    type: string;
    image: string;
    visible: boolean;
    author: string;
    kind: string;
  }
  
  export class Book implements Book {
  
    constructor( ) {
  
    };
  
  
  }