export interface Music {
    id: number;
    name: string;
    date: Date;
    score: number;
    type: string;
    image: string;
    releaseDate: number;
    artist: string;
    visible: boolean;
    review: string;
  }
  
  export class Music implements Music {
  
    constructor( ) {
  
    };
  
  
  }