import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';
import { ProductItem } from '../product-item/product-item';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductItem, CommonModule],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  // changed to observable to use async pipe in the template to fix rendering issues
  products$!: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private cart: CartService,
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  addToCart(product: Product) {
    this.cart.add(product);
    alert('Added to cart!');
  }
}
