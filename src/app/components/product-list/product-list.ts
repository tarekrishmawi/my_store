import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';
import { ProductItem } from '../product-item/product-item';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductItem, CommonModule, RouterLink],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  // changed to observable to use async pipe in the template to fix rendering issues
  products$!: Observable<Product[]>;
  isLoggedIn = false;

  constructor(
    private productService: ProductService,
    private cart: CartService,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  addToCart(product: Product) {
    this.cart.add(product);

    this.toast.show(`${product.name} added to cart`, {
      classname: 'bg-success text-white',
      delay: 3000,
    });
  }
}
