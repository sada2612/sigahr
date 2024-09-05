/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@angular/localize/init';
import { AppModule } from './app/app.module';
import { environment } from './app/common/environments/environment.prod';

if (environment.production) {
  enableProdMode();
}


platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
