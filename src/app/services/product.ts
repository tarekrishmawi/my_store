import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ApiProduct, mapProductToApiProduct } from './product.mapper';
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

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const body = mapProductToApiProduct(product);

    return this.http.post<ApiProduct>(this.apiUrl, body).pipe(
      map((apiProduct) => {
        const newProduct = mapApiProductToProduct(apiProduct);

        // sync the in-memory products array with the newly created product
        this.products.push(newProduct);

        return newProduct;
      }),
    );
  }

  // update an existing product and update it in the in-memory products array
  updateProduct(id: number, product: Product): Observable<Product> {
    const body = mapProductToApiProduct(product);

    return this.http.put<ApiProduct>(`${this.apiUrl}/${id}`, body).pipe(
      map((updatedApiProduct) => {
        const updatedProduct = mapApiProductToProduct(updatedApiProduct);

        // sync cache
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        return updatedProduct;
      }),
    );
  }
}
