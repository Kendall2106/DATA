export interface Anime {
  id: number;
  name: string;
  date: Date;
  score: number;
  type: string;
  numTemp: number;
  image: string;
  releaseDate: number;
  visible: boolean;
}

export class Anime implements Anime {

  constructor(public name: string) {

  };


}