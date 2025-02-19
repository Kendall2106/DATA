export interface Game {
    id: number;
    name: string;
    date: Date;
    score: number;
    type: string;
    image: string;
    visible: boolean;
    releaseDate: number
  }
  
  export class Game implements Game {
  
    constructor( ) {
  
    };
  
  
  }