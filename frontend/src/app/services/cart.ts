import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = []; // Change to CartItem
  private itemsCount = new BehaviorSubject<number>(0);
  itemsCount$ = this.itemsCount.asObservable();

  add(product: Product) {
    const existingItem = this.items.find((i) => i.id === product.id);

    // if product is already added , just increase it's quantity
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.updateCount();
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeById(id);
      }
    }
    this.updateCount();
  }

  getItems() {
    return this.items;
  }

  remove(index: number) {
    this.items.splice(index, 1);
    this.itemsCount.next(this.items.length);
  }

  private removeById(id: number) {
    this.items = this.items.filter((i) => i.id !== id);
  }

  clear() {
    this.items = [];
    this.itemsCount.next(0);
  }

  total() {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }

  private updateCount() {
    const totalQuantity = this.items.reduce((sum, i) => sum + i.quantity, 0);
    this.itemsCount.next(totalQuantity);
  }
}
