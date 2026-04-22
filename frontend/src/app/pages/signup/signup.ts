import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

// Define an interface for API error responses
interface ApiError {
  error?: {
    message?: string;
    code?: string;
    field?: string;
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.html',
  imports: [CommonModule, FormsModule],
})
export class Signup {
  user: User = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
  };

  errorMessage = '';
  successMessage = '';
  usernameError = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  onSubmit(form: NgForm): void {
    this.resetMessages();

    if (form.invalid) {
      this.errorMessage = 'Please fix the highlighted errors.';
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully!';
        this.isSubmitting = false;
        form.resetForm();
        // navigate to login page after successful registration
        this.router.navigate(['/login']);
        this.toast.show('Account created successfully!', {
          classname: 'bg-success text-white',
          delay: 3000,
        });
      },
      error: (err: { status: number; error: ApiError }) => {
        this.isSubmitting = false;
        this.handleError(err);
      },
    });
  }

  private handleError(err: { status: number; error: ApiError }): void {
    this.resetMessages();

    // Username exists (backend 409)
    if (err.status === 409 && err.error?.error?.code === 'USERNAME_EXISTS') {
      this.usernameError = err.error.error.message || 'Username already exists.';
      return;
    }

    // Validation / bad request
    if (err.status === 400) {
      this.errorMessage = err.error?.error?.message || 'Invalid input. Please check your data.';
      return;
    }

    // Fallback
    this.errorMessage = 'Something went wrong. Please try again.';
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.usernameError = '';
  }
}
