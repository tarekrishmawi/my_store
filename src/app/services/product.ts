import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// This service is responsible for fetching product data from a JSON file for now
export class ProductService {
  // hold the products in memory to avoid unnecessary HTTP requests
  private products: Product[] = [];
  private jsonPath = 'data.json';

  constructor(private http: HttpClient) {}
  getProducts(): Observable<Product[]> {
    // hold the products in memory
    if (this.products.length) {
      return of(this.products);
    }
    return this.http.get<Product[]>(this.jsonPath).pipe(
      map((data) => {
        this.products = data;
        return this.products;
      }),
    );
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(map((products) => products.find((p) => p.id === id)));
  }
}
