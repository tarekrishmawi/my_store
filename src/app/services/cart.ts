import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: Product[] = [];

  add(product: Product) {
    this.items.push(product);
  }

  getItems() {
    return this.items;
  }

  remove(index: number) {
    this.items.splice(index, 1);
  }

  clear() {
    this.items = [];
  }

  total() {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }
}
