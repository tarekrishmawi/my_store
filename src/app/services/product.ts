import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ApiProduct } from './product.mapper';
import { map, Observable, of } from 'rxjs';
import { mapApiProductToProduct } from './product.mapper';

@Injectable({
  providedIn: 'root',
})
// This service is responsible for fetching product data from the API and mapping it to the Product model
export class ProductService {
  // hold the products in memory to avoid unnecessary HTTP requests
  private products: Product[] = [];
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}
  getProducts(): Observable<Product[]> {
    // hold the products in memory
    if (this.products.length) {
      return of(this.products);
    }
    return this.http.get<ApiProduct[]>(this.apiUrl).pipe(
      map((data) => {
        this.products = data.map(mapApiProductToProduct);
        return this.products;
      }),
    );
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(map((products) => products.find((p) => p.id === id)));
  }
}
