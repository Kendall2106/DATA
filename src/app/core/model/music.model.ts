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
  }
  
  export class Music implements Music {
  
    constructor( ) {
  
    };
  
  
  }