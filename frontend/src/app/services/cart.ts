import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: Product[] = [];
  private itemsCount = new BehaviorSubject<number>(0);
  itemsCount$ = this.itemsCount.asObservable();

  add(product: Product) {
    this.items.push(product);
    this.itemsCount.next(this.items.length);
  }

  getItems() {
    return this.items;
  }

  remove(index: number) {
    this.items.splice(index, 1);
    this.itemsCount.next(this.items.length);
  }

  clear() {
    this.items = [];
    this.itemsCount.next(0);
  }

  total() {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }
}
