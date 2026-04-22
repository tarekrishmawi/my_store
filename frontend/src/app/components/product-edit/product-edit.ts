import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-edit.html',
})
export class ProductEdit implements OnInit {
  product!: Product;
  urlInput: string = '';
  errorMessage: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProduct(id).subscribe({
      next: (p) => {
        if (!p) {
          this.errorMessage = 'Product not found';
          return;
        }

        this.product = p;
        this.urlInput = p.imageUrl;
      },
      error: () => {
        this.errorMessage = 'Failed to load product';
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    this.productService.updateProduct(this.product.id, this.product).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.show(`${this.product.name} updated successfully!`, {
          classname: 'bg-success text-white',
          delay: 3000,
        });

        this.router.navigate(['/pages/products']);
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'You must be an admin.';
        } else if (err.status === 0) {
          this.errorMessage = 'Server unreachable.';
        } else {
          this.errorMessage = 'Failed to update product.';
        }
      },
    });
  }
}
