import { Component, Output, EventEmitter } from '@angular/core';
import { MantisConfig } from 'src/app/app-config';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();

  navCollapsed;
  windowWidth: number;

  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1920 ? MantisConfig.isCollapseMenu : false;
  }

  navCollapse() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1025) {
      this.NavCollapse.emit();
    }
  }

  navCollapseMob() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 1920) {
      this.NavCollapsedMob.emit();
    }
  }
}
