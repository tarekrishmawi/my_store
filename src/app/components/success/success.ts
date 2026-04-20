import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [CommonModule, RouterLink],
  templateUrl: './success.html',
})
export class Success implements OnInit {
  name = '';
  total = 0;

  ngOnInit(): void {
    const stateData = history.state;

    if (stateData) {
      this.name = stateData.name;
      this.total = stateData.total;
    }
  }
}
