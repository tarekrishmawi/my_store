/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { App } from './app/app';
import { appConfig } from './app/app.config'; // Import your config

bootstrapApplication(App, appConfig) // Use the config here
  .catch((err) => console.error(err));
