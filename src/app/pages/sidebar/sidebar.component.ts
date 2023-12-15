import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  constructor(private router: Router, private dataService: DataService){

  }


  ngOnInit(): void {
    
  }

  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }

  navegarCreate(){
    this.router.navigate(['/Create']);
  }

  toggleMobileMenu(): void {
    /*const btn = document.getElementById('btnMenu')!;
    if(btn.style.display == 'none'){
      
    }*/
    
    const menu = document.getElementById('menu')!;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    
  }



}
