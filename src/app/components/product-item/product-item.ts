import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-item.html',
})
export class ProductItem {
  @Input() product!: Product;
  @Input() isLoggedIn = false;
  @Output() add = new EventEmitter<Product>();
}
