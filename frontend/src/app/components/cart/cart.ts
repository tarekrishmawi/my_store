import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';
import { CartItem } from '../../models/cart-item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
})
export class Cart {
  items: CartItem[] = []; // Use CartItem
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.total();
  }

  onQuantityChange(id: number, event: any): void {
    const qty = Number(event.target.value);

    // Safety check for invalid input
    if (qty < 1) {
      alert('Quantity must be at least 1');
      this.loadCart(); // Reset view
      return;
    }

    this.cartService.updateQuantity(id, qty);
    this.total = this.cartService.total();
  }

  calculateTotal(): void {
    this.total = this.cartService.total();
  }

  remove(index: number): void {
    this.cartService.remove(index);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clear();
    this.loadCart();
  }
}
