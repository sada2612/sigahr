import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../component/module/shared.module';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  constructor() {}

  ngOnInit() {
    localStorage.clear();
  }
}
