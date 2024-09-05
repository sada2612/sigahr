import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  @Input() navCollapsed: boolean;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();
  windowWidth = window.innerWidth;

  constructor() {
    this.windowWidth = window.innerWidth;
  }
  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }

  navCollapse() {
    this.windowWidth = window.innerWidth;
    this.NavCollapse.emit();
  }
}
