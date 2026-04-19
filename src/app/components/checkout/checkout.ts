import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  name: string = '';
  address: string = '';
  creditCard: string = '';

  constructor(
    private cart: CartService,
    private router: Router,
  ) {}

  submit(form: any) {
    if (form.valid) {
      this.cart.clear();
      this.router.navigate(['/success']);
    }
  }
}
