import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.authService.login(this.username, this.password);
      this.router.navigate(['/']);
    } catch (e) {
      this.error = 'Usuario o contraseña incorrectos';
    } finally {
      this.loading = false;
    }
  }
}
