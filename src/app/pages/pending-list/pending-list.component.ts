import { Component, OnInit } from '@angular/core';
import { RecoService } from 'src/app/core/service/recomendacion.service';

@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.css']
})
export class PendingListComponent  implements OnInit{

  dataOriginal: any[] =[];
  data: any[] =[];
  //liked: boolean = false;

  constructor(private recoService: RecoService){

  }
  ngOnInit(): void {
    this.getReco();
  }


  async loadData(message: any) {
    if (message === 'Animes') {
      this.data=[];
      for (let index = 0; index < this.dataOriginal.length; index++) {
        if(this.dataOriginal[index].type=="Animes"){
          this.data.push(this.dataOriginal[index]);
        }
      }
    }
  
      if (message === 'Movies') {
        this.data=[];
        for (let index = 0; index < this.dataOriginal.length; index++) {
          if(this.dataOriginal[index].type=="Movies"){
            this.data.push(this.dataOriginal[index]);
          }
        }
      }
      if (message === 'Games') {
        this.data=[];
        for (let index = 0; index < this.dataOriginal.length; index++) {
          if(this.dataOriginal[index].type=="Games"){
            this.data.push(this.dataOriginal[index]);
          }
        }
      }

      if (message === 'Series') {
        this.data=[];
        for (let index = 0; index < this.dataOriginal.length; index++) {
          if(this.dataOriginal[index].type=="Series"){
            this.data.push(this.dataOriginal[index]);
          }
        }
      }

      if (message === 'Books') {
        this.data=[];
        for (let index = 0; index < this.dataOriginal.length; index++) {
          if(this.dataOriginal[index].type=="Books"){
            this.data.push(this.dataOriginal[index]);
          }
        }
      }

      if (message === 'Music') {
        this.data=[];
        for (let index = 0; index < this.dataOriginal.length; index++) {
          if(this.dataOriginal[index].type=="Music"){
            this.data.push(this.dataOriginal[index]);
          }
        }
      }

      this.orderData();
      
 
}

  orderData(){
    this.data.sort((a: any, b: any) => {
      if (a.liked && !b.liked) {
          return -1; // a debe ir antes que b
      } else if (!a.liked && b.liked) {
          return 1; // b debe ir antes que a
      } else {
          return 0; // No hay diferencia en la clasificación
      }
  });
  }

  async getReco(){  
    this.dataOriginal = await this.recoService.getReco();
    this.dataOriginal.forEach((element: any)=>{
      element.image ='data:image/jpg;base64,' + element.image;
  });


   
  }


  async toggleLike(dataLiked: any) {
    if(dataLiked.liked == false){
      dataLiked.liked = true;
    }else{
      dataLiked.liked = false;
    }
    await this.recoService.updateReco(dataLiked.id, dataLiked.liked);
  }


}
