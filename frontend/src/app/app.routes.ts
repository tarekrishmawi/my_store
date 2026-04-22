import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { ProductCreate } from './components/product-create/product-create';
import { ProductEdit } from './components/product-edit/product-edit';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Success } from './components/success/success';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pages/home', pathMatch: 'full' },
  { path: 'pages/home', component: Home, pathMatch: 'full' },
  { path: 'pages/products', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
  { path: 'pages/products/create', component: ProductCreate, canActivate: [authGuard] },
  { path: 'pages/products/edit/:id', component: ProductEdit, canActivate: [authGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'success', component: Success, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
];
