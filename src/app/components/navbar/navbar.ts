import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  isMenuCollapsed = true;
  constructor(
    public cart: CartService,
    public authService: AuthService,
  ) {}
  logout() {
    this.authService.logout();
  }
}
