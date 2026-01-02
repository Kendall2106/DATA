export interface Game {
    id: number;
    name: string;
    date: Date;
    score: number;
    type: string;
    image: string;
    visible: boolean;
    releaseDate: number
    review: string;
  }
  
  export class Game implements Game {
  
    constructor( ) {
  
    };
  
  
  }