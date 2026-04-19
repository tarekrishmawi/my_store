import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Success } from './components/success/success';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'success', component: Success },
];
