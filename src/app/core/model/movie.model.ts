export interface Movie {
  id: number;
  name: string;
  date: Date;
  score: number;
  type: string;
  image: string;
  visible: boolean;
  releaseDate: number;
}

export class Movie implements Movie {

  constructor( ) {

  };


}