import { Component } from '@angular/core';
import { MantisConfig } from 'src/app/app-config';
import { CamelCasePipe } from 'src/app/common/pipes/CamelCasePipe';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers:[CamelCasePipe]
})
export class AdminComponent {
  navCollapsed;
  navCollapsedMob: boolean;
  windowWidth: number;

  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1024 ? MantisConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
  }
  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }
  navMobClick() {
    this.windowWidth = window.innerWidth;
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
