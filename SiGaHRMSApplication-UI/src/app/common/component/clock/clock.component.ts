import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SharedModule } from '../module/shared.module';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  time: Date = new Date();
  private timeSubscription: Subscription;

  ngOnInit() {
    this.timeSubscription = interval(1000).subscribe(() => (this.time = new Date()));
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
