import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  anioActual: string = "";


  constructor(private router: Router, private dataService: DataService) {
  }


  ngOnInit(): void {
    this.anioActual = new Date().getFullYear() + "";
  }


  navegarAComponenteDestino(data: String) {
    this.dataService.typeData = data;
    this.router.navigate(['/Workplace']);
  }


  navegarCreate() {
    this.router.navigate(['/Create']);
  }


  navegarTier() {
    this.router.navigate(['/Tier']);
  }


  navegarLibrary() {
    this.router.navigate(['/library']);
  }


  navegarPendingList() {
    this.router.navigate(['/PendingList']);
  }


  navegarDiscoverPage() {
    this.router.navigate(['/']);
  }


  toggleMobileMenu(): void {
    const menu = document.getElementById('menu')!;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }


}
