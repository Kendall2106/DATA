export interface Book {
    id: number;
    name: string;
    date: Date;
    score: number;
    type: string;
    image: string;
    visible: boolean;
  }
  
  export class Book implements Book {
  
    constructor( ) {
  
    };
  
  
  }