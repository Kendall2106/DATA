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
  colorSeleccionado: string = ''; // Color inicial


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

  navegarProfilePage() {
    this.router.navigate(['/Profile']);
  }

  navegarGraphicsPage() {
    this.router.navigate(['/Graphics']);
  }


  toggleMobileMenu(): void {
    const menu = document.getElementById('menu')!;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }

  cambiarColor() {
    localStorage.setItem('colorLocal', this.colorSeleccionado );
    document.documentElement.style.setProperty('--color-2', this.colorSeleccionado);
  }


}
