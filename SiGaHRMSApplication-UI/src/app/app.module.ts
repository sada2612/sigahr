import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { SharedModule } from './common/component/module/shared.module';
import { AdminComponent } from './common/component/layouts/admin/admin.component';
import { GuestComponent } from './common/component/layouts/guest/guest.component';
import { NavigationComponent } from './common/component/layouts/admin/navigation/navigation.component';
import { NavBarComponent } from './common/component/layouts/admin/nav-bar/nav-bar.component';
import { NavRightComponent } from './common/component/layouts/admin/nav-bar/nav-right/nav-right.component';
import { NavLeftComponent } from './common/component/layouts/admin/nav-bar/nav-left/nav-left.component';
import { HrComponent } from './common/component/layouts/hr/hr.component';
import { NavItemComponent } from './common/component/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavGroupComponent } from './common/component/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './common/component/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavContentComponent } from './common/component/layouts/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from './common/component/layouts/admin/navigation/navigation';
import { SwalPortalTargets, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CamelCasePipe } from './common/pipes/CamelCasePipe';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    NavigationComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    HrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DatePipe,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    NavigationItem,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    SwalPortalTargets,
    CamelCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
