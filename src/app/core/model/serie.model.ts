export interface Serie {
    id: number;
    name: string;
    date: Date;
    score: number;
    type: string;
    image: string;
    releaseDate: number;
    visible: boolean;
    review: string;
  }
  
  export class Serie implements Serie {
  
    constructor( ) {
  
    };
  
  
  }