import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  login() {
    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/pages/home']);
          this.toast.show(`Login successful, welcome ${this.username}!`, {
            classname: 'bg-success text-white',
            delay: 3000,
          });
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        },
      });
  }
}
