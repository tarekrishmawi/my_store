import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
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

  //  add ngform to enforce type safety and navigate to success page with state data
  submit(form: NgForm) {
    if (form.valid) {
      const total = this.cart.total();

      this.router.navigate(['/success'], {
        state: {
          name: this.name,
          total: total,
        },
      });

      this.cart.clear();

      form.reset();
    }
  }
}
