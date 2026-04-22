import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgFor],
  templateUrl: './toast.html',
})
export class Toast {
  constructor(public toastService: ToastService) {}
}
