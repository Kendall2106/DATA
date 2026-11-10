import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './core/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DATA';
  isMenuCollapsed = true;
  isHandset: boolean = false;
  isLogin: boolean = window.location.hash.startsWith('#/Login');

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService, modalConfig: NgbModalConfig) {
    // Sin animacion: con ella el modal aparece angosto un instante y luego se redimensiona
    modalConfig.animation = false;

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isHandset = result.matches;
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLogin = event.urlAfterRedirects.startsWith('/Login');
      });

    // Si no hay sesion (o caduco), manda al login
    this.authService.user$.subscribe(user => {
      this.authService.setSessionHint(!!user);
      if (!user && !this.router.url.startsWith('/Login')) {
        this.router.navigate(['/Login']);
      }
    });
  }

  ngOnInit() {
    // Color de la ultima sesion mientras carga el del perfil (cada usuario tiene el suyo)
    const savedColor = localStorage.getItem('hobbies-color') ?? localStorage.getItem('colorLocal');
    if (savedColor) {
      document.documentElement.style.setProperty('--color-2', savedColor);
    }
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

}

