import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Si ya habia una sesion en este navegador, la pagina aparece de inmediato (AppComponent vigila si caduco)
  if (authService.hasSessionHint()) {
    return true;
  }

  return authService.user$.pipe(
    take(1),
    map(user => user ? true : router.parseUrl('/Login'))
  );
};
