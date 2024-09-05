import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { NavigationItem } from '../navigation';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { environment } from 'src/app/common/environments/environment.prod';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  @Output() NavCollapsedMob: EventEmitter<string> = new EventEmitter();

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigation;
  windowWidth = window.innerWidth;

  constructor(
    public nav: NavigationItem,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private AuthService: AuthService
  ) {
    this.windowWidth = window.innerWidth;
    this.jwtDecode();
    this.windowWidth;
  }
  async jwtDecode() {
    this.navigation = await this.nav.get(this.AuthService.loginRole());
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
  }

  fireOutClick() {
    this.windowWidth = window.innerWidth;
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }
}
