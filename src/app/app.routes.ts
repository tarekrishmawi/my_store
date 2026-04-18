import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
];
