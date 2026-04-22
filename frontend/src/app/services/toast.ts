import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  classname?: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  show(message: string, options: Partial<Toast> = {}) {
    this.toasts.push({
      message,
      classname: options.classname || 'bg-success text-white',
      delay: options.delay || 3000,
    });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
