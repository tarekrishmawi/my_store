import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  isLoggedIn = false;

  // Using Angular's new inject function to get the ActivatedRoute and ProductService , CartService instances
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private auth = inject(AuthService);

  // using Angular's signal to hold the product data, reactive updates , initial value = null
  product = signal<Product | null>(null);

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      this.productService.getProduct(id).subscribe((product) => {
        // tell the user interface the product data is ready to be displayed when the service returns the data
        this.product.set(product ?? null);
      });
    });
  }

  addToCart() {
    const p = this.product();

    if (!p) return;

    this.cart.add(p);
  }
}
