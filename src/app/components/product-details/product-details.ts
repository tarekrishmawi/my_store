import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  // Using Angular's new inject function to get the ActivatedRoute and ProductService instances
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  // using Angular's signal to hold the product data, reactive updates , initial value = null
  product = signal<Product | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      console.log('Fetching product with id:', id);

      this.productService.getProduct(id).subscribe((product) => {
        // tell the user interface the product data is ready to be displayed when the service returns the data
        this.product.set(product ?? null);
      });
    });
  }
}
